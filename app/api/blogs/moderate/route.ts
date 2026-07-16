import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { rateLimitCheck, getClientIp } from "@/lib/rateLimit";
import { GoogleGenAI } from "@google/genai";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

let cachedServer: any = null;
function getSupabaseServer() {
  if (!cachedServer) {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase configuration is missing URL or Key.");
    }
    cachedServer = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });
  }
  return cachedServer;
}

// Initialize Gemini if key is provided
const geminiApiKey = process.env.GEMINI_API_KEY;
const ai = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

export async function POST(request: Request) {
  // Rate limit: max 10 blog submissions per minute per IP
  const { allowed } = await rateLimitCheck(getClientIp(request), 10);
  if (!allowed) {
    return NextResponse.json(
      { error: "You are submitting too quickly. Please wait a moment before trying again." },
      { status: 429 }
    );
  }

  try {
    const supabaseServer = getSupabaseServer();

    // Extract & Verify Auth JWT from Request Headers
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid authorization header." }, { status: 401 });
    }
    const token = authHeader.substring(7);
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized access token." }, { status: 401 });
    }

    const { 
      title, 
      content, 
      images, 
      contributorType,
      contributorName,
      contributorEmail,
      isFirstPost
    } = await request.json();

    const authorId = user.id;
    const authorEmail = user.email;

    if (!title || typeof title !== "string" || title.length > 200) {
      return NextResponse.json({ error: "Invalid title." }, { status: 400 });
    }
    if (!content || typeof content !== "string" || content.length > 50000) {
      return NextResponse.json({ error: "Invalid content." }, { status: 400 });
    }
    if (images && (!Array.isArray(images) || images.length > 7 || !images.every(img => typeof img === "string" && img.startsWith("http")))) {
      return NextResponse.json({ error: "Invalid images array." }, { status: 400 });
    }
    if (contributorName && (typeof contributorName !== "string" || contributorName.length > 100)) {
      return NextResponse.json({ error: "Invalid contributor name." }, { status: 400 });
    }

    let moderation = {
      isSafe: true,
      classification: "clean",
      reason: "No moderation key present, defaulting to safe manual review."
    };

    if (ai) {
      try {
        const sanitize = (str: string) => str.replace(/[{}[\]]/g, "");

        const promptText = `
          Post Title: "${sanitize(title)}"
          Post Content: "${sanitize(content)}"
          Image URLs: ${JSON.stringify((images || []).map((img: string) => sanitize(img)))}
        `;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `You are a strict, automated content moderation assistant for a university astronomy club blog.
                  Evaluate the following proposed post.

                  Classify this post into one of three classifications:
                  1. "clean": Suitable for a public student blog. Only educational, scientific, creative, or positive community-focused material.
                  2. "offensive": Contains political arguments, hate speech, racism, bullying, excessive profanity, spam, or controversial non-scientific topics.
                  3. "explicit": Contains clear sexual references, nudity, violence, self-harm, drug abuse, or dangerous illegal activities.

                  Return your response as a strict JSON object with this exact structure:
                  {
                    "isSafe": boolean,
                    "classification": "clean" | "offensive" | "explicit",
                    "reason": "Brief single-sentence explanation of your decision"
                  }

                  ${promptText}`
                }
              ]
            }
          ],
          config: {
            responseMimeType: "application/json",
          }
        });

        const rawText = response.text || "{}";
        const parsed = JSON.parse(rawText.trim());
        if (parsed && typeof parsed.isSafe === "boolean") {
          if (!["clean", "offensive", "explicit"].includes(parsed.classification)) {
            parsed.classification = "flagged_review";
          }
          moderation = parsed;
        }
      } catch (geminiErr) {
        console.error("Gemini API call failed, falling back to manual review:", geminiErr);
        moderation.classification = "offensive"; // force review fallback
      }
    } else {
      // No API key: default fallback to flagged review if it looks suspicious,
      // or force manual approval review for safety.
      moderation.classification = "offensive"; 
    }

    // 1. EXPLICIT POST POLICY
    if (moderation.classification === "explicit") {
      // Restrict user account immediately
      await supabaseServer
        .from("profiles")
        .update({ status: "restricted" })
        .eq("id", authorId);

      // Write incident report to security log
      const reportDetails = `Automated Gemini Moderation Flagged Explicit Content. Reason: ${moderation.reason}. \nIncident occurred during blog submission: "${title}".`;
      
      await supabaseServer
        .from("security_reports")
        .insert([
          {
            user_id: authorId,
            user_email: authorEmail || "unknown@gla.ac.in",
            incident_type: "nudity_detected",
            report_details: reportDetails
          }
        ]);

      console.log(`[ALERT EMAIL DISPATCHED] To: president@gla.ac.in, advisor@gla.ac.in`);

      return NextResponse.json({
        status: "restricted",
        report: `Security scan flagged inappropriate/explicit material (${moderation.reason}). Your account has been restricted immediately. A security report has been sent to the President and the Head of the Advisory Committee for review.`
      });
    }

    // 2. OFFENSIVE / MANUAL REVIEW POLICY
    if (moderation.classification === "offensive") {
      const { error } = await supabaseServer
        .from("blogs")
        .insert([
          {
            title,
            content,
            author_id: authorId,
            images: images || [],
            status: "flagged_review"
          }
        ]);

      if (error) throw error;

      console.log(`[NOTIFICATION] Content flagged by Gemini/Fallback. Queued for review.`);

      return NextResponse.json({
        status: "flagged_review",
        message: `Your post has been queued for manual review by the council due to content screening guidelines (${moderation.reason}). It will remain hidden until approved.`
      });
    }

    // 3. FIRST POST POLICY FOR GUEST SIGN-UPS
    if (isFirstPost) {
      const { error } = await supabaseServer
        .from("blogs")
        .insert([
          {
            title,
            content,
            author_id: authorId,
            images: images || [],
            status: "pending_review",
            contributor_type: contributorType || null,
            contributor_name: contributorName || null,
            contributor_email: contributorEmail || null
          }
        ]);

      if (error) throw error;

      console.log(`[NOTIFICATION] Guest first-post submitted. Queued for manual approval.`);

      return NextResponse.json({
        status: "pending_review",
        message: "Thank you for contributing! Since this is your first post as a guest, it has been submitted for manual council review before going live."
      });
    }

    // 4. CLEAN POST: Publish live immediately
    const { error } = await supabaseServer
      .from("blogs")
      .insert([
        {
          title,
          content,
          author_id: authorId,
          images: images || [],
          status: "published"
        }
      ]);

    if (error) throw error;

    return NextResponse.json({ status: "published" });

  } catch (error: any) {
    console.error("Moderation API Route Error:", error);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
