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
  // Rate limit admin actions
  const { allowed } = await rateLimitCheck(getClientIp(request), 20);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  if (!serviceRoleKey) {
    return NextResponse.json({ error: "Server configuration missing admin credentials." }, { status: 500 });
  }

  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid authorization header." }, { status: 401 });
    }
    const token = authHeader.substring(7);

    const adminClient = getSupabaseAdmin();
    const { data: { user }, error: authError } = await adminClient.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized access token." }, { status: 401 });
    }

    // Verify user is an admin by checking profile role
    const { data: profile, error: profileError } = await adminClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Could not verify user role." }, { status: 403 });
    }

    const adminRoles = ["president", "vp", "gs", "tech_head", "advisory_head", "admin"];
    if (!adminRoles.includes(profile.role)) {
      return NextResponse.json({ error: "Forbidden: Admins only." }, { status: 403 });
    }

    const payload = await request.json();
    const { action, ...data } = payload;

    if (!action) {
      return NextResponse.json({ error: "Action is required." }, { status: 400 });
    }

    switch (action) {
      case "approve_role": {
        const { appId, applicantUid, role } = data;
        await adminClient.from("role_applications").update({ status: "approved" }).eq("id", appId);
        await adminClient.from("profiles").update({ role, status: "approved" }).eq("id", applicantUid);
        break;
      }
      case "reject_role": {
        const { appId, applicantUid } = data;
        await adminClient.from("role_applications").update({ status: "rejected" }).eq("id", appId);
        await adminClient.from("profiles").update({ status: "approved" }).eq("id", applicantUid);
        break;
      }
      case "approve_blog": {
        const { blogId } = data;
        await adminClient.from("blogs").update({ status: "published", edit_allowed_until: null }).eq("id", blogId);
        break;
      }
      case "allow_edit": {
        const { blogId } = data;
        const editLimit = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
        await adminClient.from("blogs").update({ edit_allowed_until: editLimit }).eq("id", blogId);
        break;
      }
      case "reject_blog": {
        const { blogId } = data;
        await adminClient.from("blogs").delete().eq("id", blogId);
        break;
      }
      case "transfer_ownership": {
        const { targetEmail, currentRole } = data;
        if (currentRole !== profile.role) {
          return NextResponse.json({ error: "Cannot transfer a role you do not own." }, { status: 403 });
        }
        await adminClient.from("system_approvers").update({ designated_email: targetEmail }).eq("role", currentRole);
        await adminClient.from("profiles").update({ role: "member" }).eq("id", user.id);
        break;
      }
      default:
        return NextResponse.json({ error: "Unknown action." }, { status: 400 });
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Admin API Route Error:", error);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
