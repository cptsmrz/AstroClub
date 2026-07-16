"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { supabase } from "@/lib/supabase";
import StarfieldCanvas from "@/components/StarfieldCanvas";

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
function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateStr));
}

function getInitials(name: string | null, fallback: string): string {
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

// --- Skeleton ---
function DetailSkeleton() {
  return (
    <div className="max-w-3xl mx-auto animate-pulse">
      <div className="h-4 bg-slate-800 rounded w-24 mb-10" />
      <div className="h-10 bg-slate-800 rounded w-3/4 mb-3" />
      <div className="h-7 bg-slate-800 rounded w-1/2 mb-4" />
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 rounded-full bg-slate-800" />
        <div className="space-y-2">
          <div className="h-3 bg-slate-800 rounded w-28" />
          <div className="h-2.5 bg-slate-800 rounded w-20" />
        </div>
      </div>
      <div className="h-px bg-slate-800 mb-10" />
      <div className="space-y-3">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className={`h-3 bg-slate-800 rounded ${
              i % 4 === 3 ? "w-4/5" : i % 4 === 2 ? "w-11/12" : "w-full"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// --- Page ---
export default function BlogDetailPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const slug = params?.slug as string;
    if (!slug) return;

    const fetchPost = async () => {
      try {
        const { data, error } = await supabase
          .from("blogs")
          .select("id, title, content, created_at, author_id, profiles(full_name)")
          .eq("id", slug)
          .eq("status", "published")
          .single();

        if (error || !data) {
          setNotFound(true);
          return;
        }
        setPost(data as unknown as BlogPost);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params?.slug]);

  if (loading) return <DetailSkeleton />;

  if (notFound || !post) {
    return (
      <div className="flex flex-col items-center justify-center py-28 gap-4">
        <span className="text-6xl select-none">🔭</span>
        <h1 className="text-2xl font-bold text-white">Post Not Found</h1>
        <p className="text-slate-400 text-center max-w-sm">
          This blog post doesn&apos;t exist or hasn&apos;t been approved yet.
        </p>
        <Link
          href="/blogs"
          className="mt-2 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-slate-950 hover:bg-slate-200 transition-colors"
        >
          Back to Blogs
        </Link>
      </div>
    );
  }

  const authorName = post.profiles?.full_name ?? null;
  const initials = getInitials(authorName, post.author_id);

  return (
    <>
      <StarfieldCanvas />
      <article className="max-w-3xl mx-auto relative z-10">
      {/* Back Navigation */}
      <Link
        href="/blogs"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors mb-10"
      >
        <span aria-hidden>←</span> Back to Blogs
      </Link>

      {/* Post Header */}
      <header className="mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight mb-6">
          {post.title}
        </h1>
        <div className="flex items-center gap-3">
          <div className="shrink-0 w-10 h-10 rounded-full bg-slate-700 ring-1 ring-slate-600 flex items-center justify-center text-sm font-semibold text-slate-200 select-none">
            {initials}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-300">
              {authorName ?? "Club Member"}
            </p>
            <time className="text-xs text-slate-500" dateTime={post.created_at}>
              {formatDate(post.created_at)}
            </time>
          </div>
        </div>
      </header>

      {/* Divider */}
      <div className="h-px bg-slate-800 mb-10" />

      {/* Markdown Body */}
      <div className="space-y-0">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // Headings
            h1: ({ children }) => (
              <h1 className="text-3xl font-bold text-white mt-10 mb-4 first:mt-0 leading-tight">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-2xl font-semibold text-white mt-8 mb-3 leading-snug">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-xl font-semibold text-slate-100 mt-6 mb-2">
                {children}
              </h3>
            ),
            h4: ({ children }) => (
              <h4 className="text-lg font-semibold text-slate-200 mt-4 mb-2">
                {children}
              </h4>
            ),
            // Paragraph
            p: ({ children }) => (
              <p className="text-slate-300 leading-relaxed mb-5 text-[1.0625rem]">
                {children}
              </p>
            ),
            // Links
            a: ({ href, children }) => {
              const isValid = href && (href.startsWith("https://") || href.startsWith("/") || href.startsWith("#"));
              return isValid ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white underline underline-offset-2 decoration-slate-500 hover:decoration-white transition-colors"
                >
                  {children}
                </a>
              ) : (
                <span className="text-slate-500 line-through" title="Blocked link">{children}</span>
              );
            },
            // Lists
            ul: ({ children }) => (
              <ul className="list-disc list-outside pl-6 text-slate-300 mb-5 space-y-1.5">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-outside pl-6 text-slate-300 mb-5 space-y-1.5">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="leading-relaxed text-[1.0625rem]">{children}</li>
            ),
            // Blockquote
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-slate-600 pl-5 my-6 text-slate-400 italic">
                {children}
              </blockquote>
            ),
            // Code — pre handles block, code handles both inline and block interiors
            pre: ({ children }) => (
              <pre className="bg-slate-900 border border-slate-800 rounded-xl p-5 overflow-x-auto mb-5 text-sm font-mono">
                {children}
              </pre>
            ),
            code: ({ className, children }) => {
              const isBlock = !!className;
              if (isBlock) {
                return (
                  <code className={`${className} text-slate-200 leading-relaxed`}>
                    {children}
                  </code>
                );
              }
              return (
                <code className="bg-slate-800 text-slate-200 px-1.5 py-0.5 rounded text-sm font-mono">
                  {children}
                </code>
              );
            },
            // Divider
            hr: () => <hr className="border-slate-800 my-10" />,
            // Emphasis
            strong: ({ children }) => (
              <strong className="font-semibold text-white">{children}</strong>
            ),
            em: ({ children }) => (
              <em className="italic text-slate-300">{children}</em>
            ),
            // Tables (GFM)
            table: ({ children }) => (
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm border-collapse">{children}</table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="border-b border-slate-700">{children}</thead>
            ),
            th: ({ children }) => (
              <th className="text-left text-slate-300 font-semibold px-3 py-2.5">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="text-slate-400 border-b border-slate-800/60 px-3 py-2.5">
                {children}
              </td>
            ),
            // Images
            img: ({ src, alt }) => {
              const isValid = typeof src === 'string' && src.startsWith("https://");
              return isValid ? (
                <img
                  src={src as string}
                  alt={alt}
                  className="rounded-xl my-6 w-full object-cover border border-slate-800"
                />
              ) : (
                <div className="rounded-xl my-6 w-full p-4 border border-red-800 bg-red-900/20 text-red-400 text-sm flex items-center justify-center text-center">
                  Blocked insecure image
                </div>
              );
            },
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>

      {/* Footer nav */}
      <div className="mt-14 pt-8 border-t border-slate-800">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors"
        >
          <span aria-hidden>←</span> Back to all posts
        </Link>
      </div>
    </article>
    </>
  );
}
