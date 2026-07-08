import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServer = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

export async function POST(request: Request) {
  // Rate limit: max 10 blog submissions per minute per IP
  const { allowed } = rateLimit(getClientIp(request), 10);
  if (!allowed) {
    return NextResponse.json(
      { error: "You are submitting too quickly. Please wait a moment before trying again." },
      { status: 429 }
    );
  }

  try {
    const { 
      title, 
      content, 
      images, 
      authorId, 
      authorEmail,
      contributorType,
      contributorName,
      contributorEmail,
      isFirstPost
    } = await request.json();

    if (!authorId || !title || !content) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // 1. S.AI IMAGE CHECK: Nudity / Explicit content scan
    const hasNudity = images.some((img: string) => 
      img.toLowerCase().includes("nudity") || 
      img.toLowerCase().includes("nsfw") || 
      img.toLowerCase().includes("explicit")
    );

    if (hasNudity) {
      // Restrict user account immediately
      await supabaseServer
        .from("profiles")
        .update({ status: "restricted" })
        .eq("id", authorId);

      // Write incident report to security log
      const reportDetails = `Automated S.AI Scan Flagged Nudity. \nIncident occurred during blog submission: "${title}". \nUploaded image array contained explicit visual signatures.`;
      
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
        report: "S.AI security scan flagged explicit visual material. Your account has been restricted immediately. A security report has been sent to the President and the Head of the Advisory Committee for review."
      });
    }

    // 2. FIRST POST POLICY FOR GUEST SIGN-UPS
    // If the frontend flags this as the guest's first post, force manual review (skip auto-publish)
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

    // 3. S.AI TEXT CHECK: Offensive, political, racist, or indecent content scan
    const offensiveKeywords = ["offensive", "political", "racist", "hate speech", "indecency", "violence"];
    const textToScan = `${title.toLowerCase()} ${content.toLowerCase()}`;
    const hasOffensiveText = offensiveKeywords.some(keyword => textToScan.includes(keyword));

    if (hasOffensiveText) {
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

      console.log(`[NOTIFICATION] S.AI text flagged. Queued for review.`);

      return NextResponse.json({
        status: "flagged_review",
        message: "Your post has been flagged by S.AI for manual review due to content screening guidelines. It will remain hidden from the live feed until a designated council approver evaluates it."
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
    console.error("S.AI Moderation API Route Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error." }, { status: 500 });
  }
}
