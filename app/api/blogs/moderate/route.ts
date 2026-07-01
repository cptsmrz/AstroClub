import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize a server-side Supabase client with admin privileges if service role key is available,
// or fallback to the standard client for schema operations.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServer = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

export async function POST(request: Request) {
  try {
    const { title, content, images, authorId, authorEmail } = await request.json();

    if (!authorId || !title || !content) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // 1. S.AI IMAGE CHECK: Nudity / Explicit content scan
    // Scans image metadata or content for explicit flags (for testing/mock integration)
    const hasNudity = images.some((img: string) => 
      img.toLowerCase().includes("nudity") || 
      img.toLowerCase().includes("nsfw") || 
      img.toLowerCase().includes("explicit")
    );

    if (hasNudity) {
      // Step A: Restrict the user's account immediately
      await supabaseServer
        .from("profiles")
        .update({ status: "restricted" })
        .eq("id", authorId);

      // Step B: Write incident report to security log
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

      // Step C: Trigger notifications (Simulated console mail dispatcher to President + Advisory Head)
      console.log(`[ALERT EMAIL DISPATCHED] To: president@gla.ac.in, advisor@gla.ac.in`);
      console.log(`[ALERT EMAIL BODY] User ${authorEmail} has uploaded explicit material. Account restricted.`);

      return NextResponse.json({
        status: "restricted",
        report: "S.AI security scan flagged explicit visual material. Your account has been restricted immediately. A security report has been sent to the President and the Head of the Advisory Committee for review."
      });
    }

    // 2. S.AI TEXT CHECK: Offensive, political, racist, or indecent content scan
    // Checks text against standard offensive keywords
    const offensiveKeywords = ["offensive", "political", "racist", "hate speech", "indecency", "violence"];
    const textToScan = `${title.toLowerCase()} ${content.toLowerCase()}`;
    const hasOffensiveText = offensiveKeywords.some(keyword => textToScan.includes(keyword));

    if (hasOffensiveText) {
      // Post is accepted but flagged for manual review (not published live)
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

      // Trigger notification to approvers (Simulated dispatch)
      console.log(`[NOTIFICATION EMAIL DISPATCHED] To: Core Approvers. Action required: Flagged blog review.`);

      return NextResponse.json({
        status: "flagged_review",
        message: "Your post has been flagged by S.AI for manual review due to content screening guidelines. It will remain hidden from the live feed until a designated council approver evaluates it."
      });
    }

    // 3. CLEAN POST: Publish live immediately
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
