"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import StarfieldCanvas from "@/components/StarfieldCanvas";

// --- Types ---
interface Profile {
  full_name: string | null;
  role: string;
  status: string;
  secondary_email: string | null;
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  created_at: string;
  author_id: string;
  status: string;
  images: string[];
  edit_allowed_until: string | null;
  profiles: Profile | null;
}

interface RoleApplication {
  id: string;
  user_id: string;
  user_email: string;
  requested_role: string;
  status: string;
  created_at: string;
}

export default function BlogsPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  // --- Blog Feed State ---
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);

  // --- Auth Modal & Flow State ---
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  // --- Onboarding (Secondary Email) ---
  const [secondaryEmail, setSecondaryEmail] = useState("");
  const [onboardingLoading, setOnboardingLoading] = useState(false);
  const [onboardingError, setOnboardingError] = useState<string | null>(null);

  // --- Write Blog Form State ---
  const [showWrite, setShowWrite] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const [postImages, setPostImages] = useState<string[]>([]);
  const [postSubmitting, setPostSubmitting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);
  const [postSuccess, setPostSuccess] = useState<string | null>(null);

  // --- Role Application State ---
  const [showApply, setShowApply] = useState(false);
  const [requestedRole, setRequestedRole] = useState("member");
  const [applyLoading, setApplyLoading] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  // --- Admin Dashboard State ---
  const [pendingApplications, setPendingApplications] = useState<RoleApplication[]>([]);
  const [flaggedPosts, setFlaggedPosts] = useState<BlogPost[]>([]);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [transferTargetEmail, setTransferTargetEmail] = useState("");
  const [transferConfirmText, setTransferConfirmText] = useState("");
  const [transferSuccess, setTransferSuccess] = useState<string | null>(null);
  const [transferError, setTransferError] = useState<string | null>(null);

  // --- Password Rules Checker ---
  const pwRules = {
    length: authPassword.length >= 10,
    upper: /[A-Z]/.test(authPassword),
    lower: /[a-z]/.test(authPassword),
    number: /[0-9]/.test(authPassword),
    special: /[@$!%*?&]/.test(authPassword),
  };
  const isPasswordValid = Object.values(pwRules).every(Boolean);

  // --- Fetch User Profile & Sync Roles ---
  const fetchUserProfile = async (uid: string, userEmail: string) => {
    try {
      // 1. Sync designated approver credentials
      const { data: approver } = await supabase
        .from("system_approvers")
        .select("role")
        .eq("designated_email", userEmail)
        .maybeSingle();

      if (approver) {
        // Automatically elevate role
        await supabase
          .from("profiles")
          .update({ role: approver.role, status: "approved" })
          .eq("id", uid);
      }

      // 2. Load profile row
      const { data: prof, error } = await supabase
        .from("profiles")
        .select("full_name, role, status, secondary_email")
        .eq("id", uid)
        .single();

      if (error) throw error;
      setProfile(prof);

      // 3. Load Admin Dashboard data if eligible
      const adminRoles = ["president", "vp", "gs", "tech_head", "advisory_head"];
      if (prof && adminRoles.includes(prof.role)) {
        fetchAdminDashboardData();
      }
    } catch (err) {
      console.error("Error loading user profile:", err);
    }
  };

  // --- Fetch Admin Dashboard Data ---
  const fetchAdminDashboardData = async () => {
    setDashboardLoading(true);
    try {
      // Fetch pending role applications
      const { data: apps } = await supabase
        .from("role_applications")
        .select("*")
        .eq("status", "pending");

      setPendingApplications(apps || []);

      // Fetch flagged posts
      const { data: blogs } = await supabase
        .from("blogs")
        .select("id, title, content, created_at, author_id, status, images, edit_allowed_until, profiles(full_name)")
        .eq("status", "flagged_review");

      setFlaggedPosts((blogs as unknown as BlogPost[]) || []);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setDashboardLoading(false);
    }
  };

  // --- Fetch Published Posts ---
  const fetchPosts = useCallback(async () => {
    setPostsLoading(true);
    try {
      // 1. Automatically delete flagged posts that have exceeded their 24h edit window
      await supabase
        .from("blogs")
        .delete()
        .eq("status", "flagged_review")
        .not("edit_allowed_until", "is", null)
        .lt("edit_allowed_until", new Date().toISOString());

      // 2. Fetch live published blogs
      const { data, error } = await supabase
        .from("blogs")
        .select("id, title, content, created_at, author_id, status, images, edit_allowed_until, profiles(full_name)")
        .eq("status", "published")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setPosts((data as unknown as BlogPost[]) || []);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    } finally {
      setPostsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id, session.user.email ?? "");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id, session.user.email ?? "");
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchPosts]);

  // --- Auth Actions (Sign In / Sign Up) ---
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    setAuthSuccess(null);
    try {
      let loginEmail = authEmail;

      // Enable secondary email translation (lookup primary login email)
      if (authMode === "signin" && !authEmail.endsWith("@gla.ac.in")) {
        const { data: linkedProfile } = await supabase
          .from("profiles")
          .select("email")
          .eq("secondary_email", authEmail)
          .maybeSingle();

        if (linkedProfile) {
          loginEmail = linkedProfile.email;
        }
      }

      if (authMode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email: loginEmail,
          password: authPassword,
        });
        if (error) throw error;
        setShowAuth(false);
      } else {
        if (!isPasswordValid) throw new Error("Password does not meet required strength rules.");
        
        const { error } = await supabase.auth.signUp({
          email: authEmail,
          password: authPassword,
        });
        if (error) throw error;
        setAuthSuccess("Account created! Check your email to confirm before signing in.");
      }
      setAuthEmail("");
      setAuthPassword("");
    } catch (err: any) {
      setAuthError(err.message || "Authentication failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setShowWrite(false);
    setShowApply(false);
  };

  // --- Link Secondary Email ---
  const handleLinkSecondaryEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setOnboardingLoading(true);
    setOnboardingError(null);
    try {
      const validDomain = secondaryEmail.endsWith("@gmail.com") || secondaryEmail.endsWith("@google.com");
      if (!validDomain) {
        throw new Error("Secondary email must end with @gmail.com or @google.com.");
      }

      const { error } = await supabase
        .from("profiles")
        .update({ secondary_email: secondaryEmail })
        .eq("id", user.id);

      if (error) throw error;
      setProfile(prev => prev ? { ...prev, secondary_email: secondaryEmail } : null);
    } catch (err: any) {
      setOnboardingError(err.message);
    } finally {
      setOnboardingLoading(false);
    }
  };

  // --- Role Application ---
  const handleRoleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplyLoading(true);
    try {
      // Insert application record
      await supabase.from("role_applications").insert([
        {
          user_id: user.id,
          user_email: user.email,
          requested_role: requestedRole,
          status: "pending"
        }
      ]);

      // Set profile status to pending_approval
      await supabase
        .from("profiles")
        .update({ status: "pending_approval" })
        .eq("id", user.id);

      setProfile(prev => prev ? { ...prev, status: "pending_approval" } : null);
      setApplySuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setApplyLoading(false);
    }
  };

  // --- Blog Image Handler (Compresses to WebP, max 7 images) ---
  const compressToWebP = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(e.target?.result as string); // fallback
            return;
          }

          // Rescale if larger than 1200px
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to webp with 0.8 quality
          const dataUrl = canvas.toDataURL("image/webp", 0.8);
          resolve(dataUrl);
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + postImages.length > 7) {
      alert("You can attach a maximum of 7 images.");
      return;
    }

    const promises = files.map(file => compressToWebP(file));

    Promise.all(promises).then(webpBase64s => {
      setPostImages(prev => [...prev, ...webpBase64s]);
    });
  };

  // --- Blog Submission (via S.AI Moderation Route) ---
  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setPostSubmitting(true);
    setPostError(null);
    setPostSuccess(null);

    try {
      // Route submission through S.AI moderation API endpoint
      const res = await fetch("/api/blogs/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: postTitle,
          content: postBody,
          images: postImages,
          authorId: user.id,
          authorEmail: user.email
        })
      });

      if (!res.ok) throw new Error("Moderation scan failed.");
      const data = await res.json();

      if (data.status === "restricted") {
        setProfile(prev => prev ? { ...prev, status: "restricted" } : null);
        setPostError(data.report);
      } else if (data.status === "flagged_review") {
        setPostSuccess(data.message);
        setPostTitle("");
        setPostBody("");
        setPostImages([]);
      } else {
        setPostSuccess("Your blog has been successfully published live!");
        setPostTitle("");
        setPostBody("");
        setPostImages([]);
        fetchPosts();
      }
    } catch (err: any) {
      setPostError(err.message || "Failed to submit post.");
    } finally {
      setPostSubmitting(false);
    }
  };

  // --- Dashboard: Approve Role ---
  const handleApproveRole = async (appId: string, applicantUid: string, role: string) => {
    try {
      // Update application
      await supabase
        .from("role_applications")
        .update({ status: "approved" })
        .eq("id", appId);

      // Upgrade profile
      await supabase
        .from("profiles")
        .update({ role, status: "approved" })
        .eq("id", applicantUid);

      fetchAdminDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  // --- Dashboard: Reject Role ---
  const handleRejectRole = async (appId: string, applicantUid: string) => {
    try {
      await supabase
        .from("role_applications")
        .update({ status: "rejected" })
        .eq("id", appId);

      await supabase
        .from("profiles")
        .update({ status: "approved" }) // return back to standard approved guest/member status
        .eq("id", applicantUid);

      fetchAdminDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  // --- Dashboard: Approve Flagged Blog ---
  const handleApproveBlog = async (blogId: string) => {
    try {
      await supabase
        .from("blogs")
        .update({ status: "published", edit_allowed_until: null })
        .eq("id", blogId);

      fetchAdminDashboardData();
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  // --- Dashboard: Allow 24h Edit ---
  const handleAllowEdit = async (blogId: string) => {
    const editLimit = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    try {
      await supabase
        .from("blogs")
        .update({ edit_allowed_until: editLimit })
        .eq("id", blogId);

      fetchAdminDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  // --- Dashboard: Discard/Reject Blog ---
  const handleRejectBlog = async (blogId: string) => {
    try {
      await supabase
        .from("blogs")
        .delete()
        .eq("id", blogId);

      fetchAdminDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  // --- Dashboard: Transfer Role Ownership ---
  const handleTransferOwnership = async (e: React.FormEvent) => {
    e.preventDefault();
    setTransferError(null);
    setTransferSuccess(null);

    if (transferConfirmText !== "TRANSFER") {
      setTransferError("Please type TRANSFER in all caps to confirm.");
      return;
    }

    if (!profile) return;

    try {
      // 1. Update the designated_email in system_approvers
      const { error: updateConfigError } = await supabase
        .from("system_approvers")
        .update({ designated_email: transferTargetEmail })
        .eq("role", profile.role);

      if (updateConfigError) throw updateConfigError;

      // 2. Downgrade current profile role back to member
      const { error: updateProfileError } = await supabase
        .from("profiles")
        .update({ role: "member" })
        .eq("id", user.id);

      if (updateProfileError) throw updateProfileError;

      setTransferSuccess(`Ownership of role '${profile.role}' successfully transferred to ${transferTargetEmail}.`);
      setTransferTargetEmail("");
      setTransferConfirmText("");
      
      // Auto signout to force credentials refresh
      setTimeout(() => {
        handleSignOut();
      }, 2000);

    } catch (err: any) {
      setTransferError(err.message || "Failed to transfer ownership.");
    }
  };

  // --- Helper formatting ---
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getExcerpt = (markdown: string) => {
    const plainText = markdown
      .replace(/[#*`~_\-]/g, "")
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
      .trim();
    return plainText || "Empty blog contents.";
  };

  const getInitials = (name: string | null, fallbackId: string) => {
    if (name) {
      const parts = name.split(" ");
      return parts.map((p) => p[0]).join("").toUpperCase().slice(0, 2);
    }
    return fallbackId.slice(0, 2).toUpperCase();
  };

  return (
    <div className="relative min-h-screen">
      <StarfieldCanvas />

      {/* HEADER SECTION */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-slate-900 pb-8 mt-6">
        <div>
          <span className="text-[10px] font-bold tracking-[0.3em] text-cyan-400 uppercase">AstroClub Chronicle</span>
          <h1 className="text-4xl font-bold tracking-tight text-white mt-1">Cosmic Logs & Research</h1>
        </div>

        <div className="flex flex-wrap gap-3">
          {user ? (
            <>
              {profile?.status === "restricted" ? (
                <span className="rounded-lg bg-red-950/60 border border-red-800/80 px-4 py-2 text-xs font-semibold text-red-400 flex items-center gap-1.5">
                  ⚠️ Account Restricted
                </span>
              ) : (
                <>
                  {profile && ["president", "vp", "gs", "tech_head", "advisory_head"].includes(profile.role) && (
                    <button
                      onClick={() => fetchAdminDashboardData()}
                      className="rounded-lg border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-slate-700 hover:text-white"
                    >
                      🛡️ Council Deck
                    </button>
                  )}
                  {profile?.role === "guest" && (
                    <button
                      onClick={() => setShowApply(true)}
                      className="rounded-lg border border-cyan-800/80 bg-cyan-950/20 px-4 py-2.5 text-xs font-semibold text-cyan-400 transition hover:border-cyan-700"
                    >
                      Apply for Role
                    </button>
                  )}
                  <button
                    onClick={() => setShowWrite(true)}
                    className="rounded-lg bg-white px-4 py-2.5 text-xs font-semibold text-slate-950 transition hover:bg-slate-200"
                  >
                    Write Post
                  </button>
                </>
              )}
              <button
                onClick={handleSignOut}
                className="rounded-lg border border-slate-800 bg-slate-950/20 px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white transition"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setAuthMode("signin");
                setShowAuth(true);
              }}
              className="rounded-lg bg-white px-5 py-2.5 text-xs font-semibold text-slate-950 transition hover:bg-slate-200"
            >
              Sign In to Contribute
            </button>
          )}
        </div>
      </div>

      {/* ONBOARDING: Link Secondary Email */}
      {user && profile && profile.role !== "guest" && !profile.secondary_email && (
        <div className="relative z-10 max-w-lg mx-auto mb-12 rounded-2xl border border-slate-800 bg-slate-950/80 p-6 md:p-8 backdrop-blur-md shadow-2xl shadow-black/80">
          <div className="flex items-center gap-2.5 mb-4 text-cyan-400">
            <span className="text-xl select-none">🛡️</span>
            <h2 className="text-lg font-bold tracking-wide uppercase">Onboarding: Council Verification</h2>
          </div>
          <p className="text-xs md:text-sm text-slate-400 leading-relaxed mb-6">
            Welcome to the leadership circle! To secure your administrative console, please link a secondary personal email address (must end with **@gmail.com** or **@google.com**). This allows you to verify your identity and access your dashboard.
          </p>

          {onboardingError && (
            <div className="mb-4 rounded-lg border border-red-800/50 bg-red-900/20 px-4 py-3 text-xs text-red-400">
              {onboardingError}
            </div>
          )}

          <form onSubmit={handleLinkSecondaryEmail} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="sec-email" className="text-xs font-semibold text-slate-400 uppercase">
                Secondary Email Address
              </label>
              <input
                id="sec-email"
                type="email"
                required
                value={secondaryEmail}
                onChange={(e) => setSecondaryEmail(e.target.value)}
                placeholder="personal@gmail.com"
                className="rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-white/20 transition"
              />
            </div>
            <button
              type="submit"
              disabled={onboardingLoading}
              className="rounded-lg bg-white py-3 text-xs font-semibold text-slate-950 hover:bg-slate-200 transition disabled:opacity-50"
            >
              {onboardingLoading ? "Linking..." : "Link Personal Account"}
            </button>
          </form>
        </div>
      )}

      {/* RESTRICTED LOCK PANEL */}
      {user && profile?.status === "restricted" && (
        <div className="relative z-10 rounded-2xl border border-red-900/60 bg-red-950/20 p-8 text-center max-w-2xl mx-auto mb-12 backdrop-blur-md">
          <span className="text-5xl select-none block mb-4">🚨</span>
          <h2 className="text-xl font-bold text-red-400 mb-2">Account Lock Imposed</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Your AstroClub account has been restricted by **S.AI (Stellar AI)** because explicit content signatures were detected in your media upload. A security review report containing incident proofs has been automatically forwarded to the President and the Head of the Advisory Committee.
          </p>
        </div>
      )}

      {/* SIGNUP/SIGNIN MODAL */}
      {showAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950/90 p-6 md:p-8 shadow-2xl">
            <button
              onClick={() => setShowAuth(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white text-lg"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-white mb-2">
              {authMode === "signin" ? "Council Portal" : "Join AstroClub"}
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              {authMode === "signin"
                ? "Access observations, logs, and telemetry dashboard."
                : "Create an account to start cataloguing observational reports."}
            </p>

            {authError && (
              <div className="mb-4 rounded-lg border border-red-800/50 bg-red-900/20 px-4 py-3 text-xs text-red-400">
                {authError}
              </div>
            )}
            {authSuccess && (
              <div className="mb-4 rounded-lg border border-emerald-800/50 bg-emerald-900/20 px-4 py-3 text-xs text-emerald-400">
                {authSuccess}
              </div>
            )}

            <form onSubmit={handleAuth} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase">Email</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="you@gla.ac.in"
                  className="rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-white/20 transition"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase">Password</label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-white/20 transition"
                />
              </div>

              {/* PASSWORD RULES CHECKER UI */}
              {authMode === "signup" && (
                <div className="rounded-lg border border-slate-900 bg-slate-900/25 p-3 text-[11px] text-slate-400 space-y-1">
                  <p className="font-semibold mb-2">Password Requirements Checklist:</p>
                  <div className="flex items-center gap-1.5">
                    <span>{pwRules.length ? "✅" : "❌"}</span>
                    <span className={pwRules.length ? "text-slate-300" : ""}>Min 10 characters</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>{pwRules.upper ? "✅" : "❌"}</span>
                    <span className={pwRules.upper ? "text-slate-300" : ""}>One uppercase letter (A-Z)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>{pwRules.lower ? "✅" : "❌"}</span>
                    <span className={pwRules.lower ? "text-slate-300" : ""}>One lowercase letter (a-z)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>{pwRules.number ? "✅" : "❌"}</span>
                    <span className={pwRules.number ? "text-slate-300" : ""}>One digit (0-9)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>{pwRules.special ? "✅" : "❌"}</span>
                    <span className={pwRules.special ? "text-slate-300" : ""}>One special character (@$!%*?&)</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading || (authMode === "signup" && !isPasswordValid)}
                className="w-full rounded-lg bg-white py-2.5 text-xs font-semibold text-slate-950 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                {authLoading ? "Synchronizing..." : authMode === "signin" ? "Sign In" : "Register"}
              </button>
            </form>

            <button
              onClick={() => {
                setAuthMode(authMode === "signin" ? "signup" : "signin");
                setAuthError(null);
                setAuthSuccess(null);
              }}
              className="text-xs text-slate-500 hover:text-white mt-4 text-center block w-full hover:underline"
            >
              {authMode === "signin" ? "Need an account? Sign up" : "Already registered? Sign in"}
            </button>
          </div>
        </div>
      )}

      {/* COUNCIL DASHBOARD DECK (Pending approvals & role updates) */}
      {user && profile && ["president", "vp", "gs", "tech_head", "advisory_head"].includes(profile.role) && (
        <div className="relative z-10 rounded-2xl border border-slate-900 bg-slate-950/45 p-6 mb-12 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-6">
            <div>
              <span className="text-[9px] font-bold tracking-[0.2em] text-cyan-400 uppercase">System Approvals Board</span>
              <h2 className="text-xl font-bold text-white capitalize">{profile.role} Console</h2>
            </div>
            <button
              onClick={() => fetchAdminDashboardData()}
              className="text-xs text-slate-500 hover:text-white transition"
            >
              Refresh Deck
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Pending Applicants List */}
            <div className="lg:col-span-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Pending Role Requests</h3>
              {pendingApplications.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-900 py-8 text-center text-xs text-slate-600">
                  No pending university role applications.
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingApplications.map((app) => (
                    <div key={app.id} className="rounded-lg border border-slate-900 bg-slate-900/20 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <p className="font-semibold text-slate-200">{app.user_email}</p>
                        <p className="text-slate-500 mt-0.5">Role Applied: <span className="text-cyan-400 capitalize">{app.requested_role}</span></p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApproveRole(app.id, app.user_id, app.requested_role)}
                          className="bg-white text-slate-950 px-3 py-1.5 rounded font-semibold hover:bg-slate-200"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectRole(app.id, app.user_id)}
                          className="border border-slate-800 text-slate-400 px-3 py-1.5 rounded hover:text-white"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* S.AI Flagged Blogs */}
            <div className="lg:col-span-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">S.AI Content Flags</h3>
              {flaggedPosts.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-900 py-8 text-center text-xs text-slate-600">
                  No posts flagged by S.AI.
                </div>
              ) : (
                <div className="space-y-3">
                  {flaggedPosts.map((post) => (
                    <div key={post.id} className="rounded-lg border border-slate-900 bg-slate-900/20 p-4 flex flex-col justify-between gap-3 text-xs">
                      <div>
                        <p className="font-semibold text-slate-200">"{post.title}"</p>
                        <p className="text-slate-500 mt-1">Author: {post.profiles?.full_name || "Member"} (Flagged by S.AI)</p>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-2">
                        <button
                          onClick={() => handleApproveBlog(post.id)}
                          className="bg-white text-slate-950 px-3 py-1.5 rounded font-semibold hover:bg-slate-200"
                        >
                          Publish Live
                        </button>
                        <button
                          onClick={() => handleAllowEdit(post.id)}
                          className="border border-slate-800 text-slate-300 px-3 py-1.5 rounded hover:text-white"
                        >
                          Allow 24h Edit
                        </button>
                        <button
                          onClick={() => handleRejectBlog(post.id)}
                          className="border border-red-950 text-red-400 px-3 py-1.5 rounded hover:bg-red-950/20"
                        >
                          Discard Post
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Role Ownership Transfer Console */}
            <div className="lg:col-span-12 border-t border-slate-900 pt-6 mt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Transfer Council Credentials</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4 max-w-2xl">
                Transfer the administrative status of your role (e.g. {profile.role}) to a new student. This action immediately rewires the system designated email records, sets the new email as primary holder, and downgrades your account to a standard member.
              </p>

              {transferError && (
                <div className="mb-4 rounded-lg border border-red-800/50 bg-red-900/20 px-4 py-2.5 text-xs text-red-400 max-w-md">
                  {transferError}
                </div>
              )}
              {transferSuccess && (
                <div className="mb-4 rounded-lg border border-emerald-800/50 bg-emerald-900/20 px-4 py-2.5 text-xs text-emerald-400 max-w-md">
                  {transferSuccess}
                </div>
              )}

              <form onSubmit={handleTransferOwnership} className="flex flex-wrap gap-4 max-w-3xl items-end text-xs">
                <div className="flex flex-col gap-1.5 w-full sm:w-64">
                  <label className="text-slate-500 font-semibold uppercase">New Owner Email (@gla.ac.in)</label>
                  <input
                    type="email"
                    required
                    value={transferTargetEmail}
                    onChange={(e) => setTransferTargetEmail(e.target.value)}
                    placeholder="new_president@gla.ac.in"
                    className="rounded border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200"
                  />
                </div>
                <div className="flex flex-col gap-1.5 w-full sm:w-64">
                  <label className="text-slate-500 font-semibold uppercase">Type TRANSFER to Confirm</label>
                  <input
                    type="text"
                    required
                    value={transferConfirmText}
                    onChange={(e) => setTransferConfirmText(e.target.value)}
                    placeholder="TRANSFER"
                    className="rounded border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-red-600 text-white font-semibold rounded px-5 py-2.5 hover:bg-red-700 transition"
                >
                  Confirm Transfer
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* APPLY FOR COUNCIL ROLE FORM */}
      {showApply && user && profile && (
        <div className="relative z-10 max-w-md mx-auto mb-12 rounded-2xl border border-slate-800 bg-slate-950/80 p-6 md:p-8 backdrop-blur-md">
          <h2 className="text-xl font-bold text-white mb-2">Apply for Role</h2>
          <p className="text-xs text-slate-500 mb-6">
            Submit a formal application to the administrative committee to request credentials.
          </p>

          {applySuccess ? (
            <div className="rounded-lg border border-emerald-800/50 bg-emerald-900/20 px-4 py-3 text-xs text-emerald-400">
              ✓ Application submitted! A council member will review and authorize your request.
            </div>
          ) : (
            <form onSubmit={handleRoleApplicationSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase">Select Role</label>
                <select
                  value={requestedRole}
                  onChange={(e) => setRequestedRole(e.target.value)}
                  className="rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-200 focus:outline-none"
                >
                  <option value="member">Core Member</option>
                  <option value="vp">Vice President (VP)</option>
                  <option value="gs">General Secretary (GS)</option>
                  <option value="tech_head">Technical Head</option>
                  <option value="advisory_head">Head of Advisory Committee</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={applyLoading}
                className="rounded-lg bg-white py-2.5 text-xs font-semibold text-slate-950 hover:bg-slate-200 transition"
              >
                {applyLoading ? "Submitting..." : "Submit Role Application"}
              </button>
            </form>
          )}
        </div>
      )}

      {/* WRITE BLOG POST PANEL */}
      {showWrite && user && profile && profile.status !== "restricted" && (
        <div className="relative z-10 rounded-2xl border border-slate-900 bg-slate-950/85 p-6 md:p-8 mb-12 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Stellar Log Draft</h2>
              <p className="text-xs text-slate-500 mt-1">Submit observations or articles (S.AI checked, Markdown fully supported).</p>
            </div>
            <button
              onClick={() => setShowWrite(false)}
              className="text-xs text-slate-500 hover:text-white"
            >
              Cancel Draft
            </button>
          </div>

          {postSuccess && (
            <div className="mb-5 rounded-lg border border-emerald-800/50 bg-emerald-900/20 px-4 py-3 text-xs text-emerald-400">
              🎉 {postSuccess}
            </div>
          )}
          {postError && (
            <div className="mb-5 rounded-lg border border-red-800/50 bg-red-900/20 px-4 py-3 text-xs text-red-400">
              {postError}
            </div>
          )}

          <form onSubmit={handlePostSubmit} className="flex flex-col gap-5 text-xs">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="post-title" className="font-semibold text-slate-400 uppercase">Post Title</label>
              <input
                id="post-title"
                type="text"
                required
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder="e.g., Tracking the accretion rings of Saturn"
                className="rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="post-body" className="font-semibold text-slate-400 uppercase">Article Content</label>
              <textarea
                id="post-body"
                required
                rows={12}
                value={postBody}
                onChange={(e) => setPostBody(e.target.value)}
                placeholder="# Accretion Rings Analysis\n\nWrite findings here..."
                className="rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none font-mono resize-y"
              />
            </div>

            {/* MULTI IMAGE ATTACHMENTS PANEL (Up to 7) */}
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-slate-400 uppercase">Image Attachments (Max 7)</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                disabled={postImages.length >= 7}
                className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-slate-300 hover:file:bg-slate-800 cursor-pointer"
              />
              {postImages.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-3">
                  {postImages.map((img, idx) => (
                    <div key={idx} className="relative w-16 h-16 rounded-md border border-slate-800 overflow-hidden bg-slate-900">
                      <img src={img} alt="preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setPostImages(prev => prev.filter((_, i) => i !== idx))}
                        className="absolute top-0 right-0 bg-red-600 text-white rounded-bl w-4 h-4 flex items-center justify-center text-[10px]"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={postSubmitting}
              className="w-full rounded-lg bg-white py-3.5 text-xs font-semibold text-slate-950 hover:bg-slate-200 disabled:opacity-50 transition"
            >
              {postSubmitting ? "S.AI screening in progress..." : "Submit Observation Log"}
            </button>
          </form>
        </div>
      )}

      {/* BLOG FEED LIST */}
      {postsLoading ? (
        <div className="flex flex-col gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-slate-900 bg-slate-900/30 p-6 h-40" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-900 bg-slate-900/10 py-24 gap-3">
          <span className="text-4xl select-none">🌌</span>
          <p className="text-slate-400 text-base font-semibold">No logs in orbit yet</p>
          <p className="text-slate-600 text-xs">Be the first to upload an observation.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {posts.map((post) => {
            const authorName = post.profiles?.full_name ?? null;
            const initials = getInitials(authorName, post.author_id);

            return (
              <article
                key={post.id}
                className="group rounded-xl border border-slate-900 bg-slate-950/20 p-6 transition duration-200 hover:border-slate-800 hover:bg-slate-900/20"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="shrink-0 w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                    {initials}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap text-xs text-slate-500">
                      <span className="font-semibold text-slate-300">{authorName ?? "Club Member"}</span>
                      <span>·</span>
                      <time>{formatDate(post.created_at)}</time>
                    </div>

                    <Link href={`/blogs/${post.id}`}>
                      <h2 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-cyan-400 transition">
                        {post.title}
                      </h2>
                    </Link>

                    <p className="text-xs md:text-sm text-slate-400 leading-relaxed line-clamp-3">
                      {getExcerpt(post.content)}
                    </p>

                    {/* Rendering images in the blog feed if they exist */}
                    {post.images && post.images.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {post.images.slice(0, 4).map((img, idx) => (
                          <div key={idx} className="w-16 h-16 rounded border border-slate-900 overflow-hidden bg-slate-950">
                            <img src={img} alt="attachment" className="w-full h-full object-cover" />
                          </div>
                        ))}
                        {post.images.length > 4 && (
                          <div className="w-16 h-16 rounded border border-slate-900 bg-slate-900/50 flex items-center justify-center text-xs text-slate-500 font-bold">
                            +{post.images.length - 4}
                          </div>
                        )}
                      </div>
                    )}

                    <Link
                      href={`/blogs/${post.id}`}
                      className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold text-white/70 group-hover:text-white transition"
                    >
                      Read log →
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
