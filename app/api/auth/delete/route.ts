import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { rateLimitCheck, getClientIp } from "@/lib/rateLimit";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

let cachedAdmin: any = null;
function getSupabaseAdmin() {
  if (!cachedAdmin) {
    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Server configuration missing admin credentials.");
    }
    cachedAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false }
    });
  }
  return cachedAdmin;
}

export async function POST(request: Request) {
  // Rate limit: max 5 account deletion requests per minute per IP
  const { allowed } = await rateLimitCheck(getClientIp(request), 5);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  // Ensure service role key is set
  if (!serviceRoleKey) {
    return NextResponse.json(
      { error: "Server configuration missing admin credentials." },
      { status: 500 }
    );
  }

  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid authorization header." }, { status: 401 });
    }
    const token = authHeader.substring(7);

    const adminClient = getSupabaseAdmin();

    // Verify token and fetch the user info
    const { data: { user }, error: authError } = await adminClient.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized access token." }, { status: 401 });
    }

    const userId = user.id;

    // 1. Anonymize user's blog posts
    const { error: blogsErr } = await adminClient
      .from("blogs")
      .update({ author_id: null })
      .eq("author_id", userId);
    if (blogsErr) throw new Error(`Failed to anonymize blogs: ${blogsErr.message}`);

    // 2. Delete custom profile record
    const { error: profileErr } = await adminClient
      .from("profiles")
      .delete()
      .eq("id", userId);
    if (profileErr) throw new Error(`Failed to delete profile: ${profileErr.message}`);

    // 3. Delete user from auth.users
    const { error: deleteErr } = await adminClient.auth.admin.deleteUser(userId);
    if (deleteErr) throw new Error(`Failed to delete authentication user: ${deleteErr.message}`);

    return NextResponse.json({ success: true, message: "Account permanently deleted." });

  } catch (error: any) {
    console.error("Account Deletion API Route Error:", error);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
