"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

// --- Type Definitions ---
interface Profile {
  full_name: string | null;
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  created_at: string;
  author_id: string;
  profiles: Profile | null;
}

// --- Helpers ---
function getInitials(name: string | null | undefined, fallback: string): string {
  if (name) {
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }
  return fallback.slice(0, 2).toUpperCase();
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateStr));
}

function getExcerpt(content: string): string {
  const plain = content
    .replace(/#{1,6}\s/g, "")
    .replace(/[*_`~>![\]()]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return plain.length > 200 ? plain.slice(0, 200) + "…" : plain;
}

// --- Sub-components ---
function PostSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-slate-800 shrink-0" />
        <div className="space-y-2">
          <div className="h-3 bg-slate-800 rounded w-28" />
          <div className="h-2.5 bg-slate-800 rounded w-20" />
        </div>
      </div>
      <div className="h-6 bg-slate-800 rounded w-3/4 mb-3" />
      <div className="space-y-2">
        <div className="h-3 bg-slate-800 rounded w-full" />
        <div className="h-3 bg-slate-800 rounded w-5/6" />
        <div className="h-3 bg-slate-800 rounded w-4/6" />
      </div>
    </div>
  );
}

// --- Page ---
export default function BlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Auth panel state
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  // Write post state
  const [showWrite, setShowWrite] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const [postSubmitting, setPostSubmitting] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setPostsLoading(true);
    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("id, title, content, created_at, author_id, profiles(full_name)")
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
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [fetchPosts]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    setAuthSuccess(null);
    try {
      if (authMode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword,
        });
        if (error) throw error;
        setShowAuth(false);
      } else {
        const { error } = await supabase.auth.signUp({
          email: authEmail,
          password: authPassword,
        });
        if (error) throw error;
        setAuthSuccess("Account created! Check your email to confirm before signing in.");
      }
      setAuthEmail("");
      setAuthPassword("");
    } catch (err: unknown) {
      setAuthError(
        err instanceof Error ? err.message : "Authentication failed. Please try again."
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setShowWrite(false);
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setPostSubmitting(true);
    setPostError(null);
    setPostSuccess(false);
    try {
      const { error } = await supabase.from("blogs").insert([
        {
          title: postTitle,
          content: postBody,
          author_id: user.id,
          status: "pending_review",
        },
      ]);
      if (error) throw error;
      setPostSuccess(true);
      setPostTitle("");
      setPostBody("");
      setTimeout(() => {
        setShowWrite(false);
        setPostSuccess(false);
      }, 3000);
    } catch (err: unknown) {
      setPostError(
        err instanceof Error ? err.message : "Failed to submit post. Please try again."
      );
    } finally {
      setPostSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
            Community Blogs
          </h1>
          <p className="text-slate-400 text-lg">
            Observations, astrophotography guides, and stories from the club.
          </p>
        </div>

        {/* Auth Controls */}
        <div className="shrink-0 flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden sm:block text-sm text-slate-500 truncate max-w-[180px]">
                {user.email}
              </span>
              <button
                id="toggle-write-panel"
                onClick={() => setShowWrite((v) => !v)}
                className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-950 hover:bg-slate-200 transition-colors"
              >
                {showWrite ? "✕ Cancel" : "✏️ Write Post"}
              </button>
              <button
                id="sign-out-btn"
                onClick={handleSignOut}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              id="sign-in-btn"
              onClick={() => setShowAuth((v) => !v)}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
            >
              {showAuth ? "✕ Close" : "Sign In to Write"}
            </button>
          )}
        </div>
      </div>

      {/* ── Auth Panel ── */}
      {showAuth && !user && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 max-w-md">
          <h2 className="text-xl font-semibold text-white mb-1">
            {authMode === "signin" ? "Welcome back" : "Join the club"}
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            {authMode === "signin"
              ? "Sign in to submit blog posts for review."
              : "Create an account to start contributing to the community."}
          </p>

          {authError && (
            <div className="mb-4 rounded-lg border border-red-800/50 bg-red-900/20 px-4 py-3 text-sm text-red-400">
              {authError}
            </div>
          )}
          {authSuccess && (
            <div className="mb-4 rounded-lg border border-emerald-800/50 bg-emerald-900/20 px-4 py-3 text-sm text-emerald-400">
              {authSuccess}
            </div>
          )}

          <form id="auth-form" onSubmit={handleAuth} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="auth-email" className="text-sm font-medium text-slate-300">
                Email
              </label>
              <input
                id="auth-email"
                type="email"
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="you@university.edu"
                className="rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="auth-password" className="text-sm font-medium text-slate-300">
                Password
              </label>
              <input
                id="auth-password"
                type="password"
                required
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="••••••••"
                className="rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition"
              />
            </div>
            <button
              type="submit"
              disabled={authLoading}
              className="w-full rounded-lg bg-white px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {authLoading
                ? "Please wait…"
                : authMode === "signin"
                ? "Sign In"
                : "Create Account"}
            </button>
          </form>

          <p className="text-sm text-slate-500 mt-5 text-center">
            {authMode === "signin" ? "No account? " : "Already have one? "}
            <button
              onClick={() => {
                setAuthMode(authMode === "signin" ? "signup" : "signin");
                setAuthError(null);
                setAuthSuccess(null);
              }}
              className="text-white hover:underline"
            >
              {authMode === "signin" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      )}

      {/* ── Write Post Panel ── */}
      {showWrite && user && (
        <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-8">
          <h2 className="text-xl font-semibold text-white mb-1">New Blog Post</h2>
          <p className="text-sm text-slate-500 mb-6">
            Your post will be submitted for admin review before it goes live.{" "}
            <span className="text-slate-600">Markdown is fully supported.</span>
          </p>

          {postSuccess && (
            <div className="mb-5 rounded-lg border border-emerald-800/50 bg-emerald-900/20 px-4 py-3 text-sm text-emerald-400">
              🎉 Post submitted for review! Our team will approve it shortly.
            </div>
          )}
          {postError && (
            <div className="mb-5 rounded-lg border border-red-800/50 bg-red-900/20 px-4 py-3 text-sm text-red-400">
              {postError}
            </div>
          )}

          <form id="write-post-form" onSubmit={handlePostSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="post-title" className="text-sm font-medium text-slate-300">
                Post Title
              </label>
              <input
                id="post-title"
                type="text"
                required
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder="e.g., Observing the Orion Nebula — A Beginner's Guide"
                className="rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="post-body" className="text-sm font-medium text-slate-300">
                  Content
                </label>
                <span className="text-xs text-slate-600 font-mono">Markdown</span>
              </div>
              <textarea
                id="post-body"
                required
                rows={14}
                value={postBody}
                onChange={(e) => setPostBody(e.target.value)}
                placeholder={"# Your Post Title\n\nWrite your content here using Markdown...\n\n## A Section Heading\n\nSupports **bold**, *italic*, `code`, and more."}
                className="rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition font-mono text-sm resize-y"
              />
            </div>
            <button
              type="submit"
              disabled={postSubmitting}
              className="w-full rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {postSubmitting ? "Submitting…" : "Submit for Review"}
            </button>
          </form>
        </div>
      )}

      {/* ── Blog Post List ── */}
      {postsLoading ? (
        <div className="flex flex-col gap-6">
          {[...Array(3)].map((_, i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/20 py-24 gap-3">
          <span className="text-5xl select-none">✍️</span>
          <p className="text-slate-400 text-lg font-medium">No posts published yet</p>
          <p className="text-slate-600 text-sm">
            {user
              ? "Be the first to write — click Write Post above."
              : "Sign in to contribute the first post."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {posts.map((post) => {
            const authorName = post.profiles?.full_name ?? null;
            const initials = getInitials(authorName, post.author_id);

            return (
              <article
                key={post.id}
                className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition-all duration-200 hover:border-slate-600 hover:bg-slate-900/80 hover:shadow-lg hover:shadow-black/10"
              >
                <div className="flex items-start gap-4">
                  {/* Author Avatar */}
                  <div className="shrink-0 w-10 h-10 rounded-full bg-slate-700 ring-1 ring-slate-600 flex items-center justify-center text-sm font-semibold text-slate-200 select-none">
                    {initials}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Author + Date */}
                    <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                      <span className="text-sm font-medium text-slate-300">
                        {authorName ?? "Club Member"}
                      </span>
                      <span className="text-slate-700" aria-hidden>·</span>
                      <time
                        className="text-xs text-slate-500"
                        dateTime={post.created_at}
                      >
                        {formatDate(post.created_at)}
                      </time>
                    </div>

                    {/* Title */}
                    <Link href={`/blogs/${post.id}`}>
                      <h2 className="text-xl font-semibold text-white mb-2 leading-snug line-clamp-2 group-hover:text-slate-100 transition-colors">
                        {post.title}
                      </h2>
                    </Link>

                    {/* Excerpt */}
                    <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">
                      {getExcerpt(post.content)}
                    </p>

                    {/* Read more link */}
                    <Link
                      href={`/blogs/${post.id}`}
                      className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-white opacity-70 group-hover:opacity-100 hover:gap-2.5 transition-all duration-150"
                    >
                      Read more <span aria-hidden>→</span>
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
