import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { rateLimitCheck, getClientIp } from "@/lib/rateLimit";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

let cachedServer: ReturnType<typeof createClient> | null = null;
function getSupabaseServer() {
  if (!cachedServer) {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase configuration is missing.");
    }
    cachedServer = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });
  }
  return cachedServer;
}

export async function POST(request: Request) {
  // Rate limit: max 5 session requests per minute per IP
  const { allowed } = await rateLimitCheck(getClientIp(request), 5);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait before submitting again." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();

    // Honeypot check
    if (body.website) {
      return NextResponse.json({ success: true }); // silently ignore bots
    }

    const { name, roll_no, phone, course_branch, academic_year, accommodation, preferred_date, group_size, purpose } = body;

    // --- Server-side validation ---
    if (!name || typeof name !== "string" || name.trim().length < 2 || name.length > 100) {
      return NextResponse.json({ error: "Invalid name." }, { status: 400 });
    }
    if (!roll_no || typeof roll_no !== "string" || roll_no.trim().length < 3 || roll_no.length > 30) {
      return NextResponse.json({ error: "Invalid roll number." }, { status: 400 });
    }
    if (!phone || typeof phone !== "string" || !/^[6-9]\d{9}$/.test(phone.replace(/\s+/g, ""))) {
      return NextResponse.json({ error: "Invalid mobile number." }, { status: 400 });
    }
    if (!course_branch || typeof course_branch !== "string" || course_branch.length > 100) {
      return NextResponse.json({ error: "Invalid course/branch." }, { status: 400 });
    }
    const yearInt = parseInt(academic_year, 10);
    if (isNaN(yearInt) || yearInt < 1 || yearInt > 5) {
      return NextResponse.json({ error: "Invalid academic year." }, { status: 400 });
    }
    if (!accommodation || !["hosteler", "day_scholar"].includes(accommodation)) {
      return NextResponse.json({ error: "Invalid accommodation type." }, { status: 400 });
    }
    if (purpose && (typeof purpose !== "string" || purpose.length > 1000)) {
      return NextResponse.json({ error: "Purpose text is too long." }, { status: 400 });
    }

    const supabase = getSupabaseServer();
    const { error } = await supabase.from("session_requests").insert([{
      name: name.trim(),
      roll_no: roll_no.trim(),
      phone: phone.replace(/\s+/g, ""),
      course_branch: course_branch.trim(),
      academic_year: yearInt,
      accommodation,
      preferred_date: preferred_date || null,
      group_size: group_size || null,
      purpose: purpose?.trim() || null,
    }] as any);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Session request error:", error);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
