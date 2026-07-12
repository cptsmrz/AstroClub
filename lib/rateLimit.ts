/**
 * lib/rateLimit.ts
 * Hybrid serverless-safe rate limiter.
 * Try Option A (Upstash Redis) by default.
 * Fall back to Option B (Supabase DB-backed limits) if Redis is down, unconfigured, or fails.
 * Fall back to Option C (Temporary memory map) as a last resort.
 */

import { createClient } from "@supabase/supabase-js";

// Dynamic import helpers / Try-catch block for Upstash
let redisInstance: any = null;
let ratelimitInstance: any = null;

try {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (redisUrl && redisToken) {
    const { Redis } = require("@upstash/redis");
    const { Ratelimit } = require("@upstash/ratelimit");

    redisInstance = new Redis({
      url: redisUrl,
      token: redisToken,
    });

    // Default rate limiter: e.g., 30 requests per 60 seconds
    ratelimitInstance = new Ratelimit({
      redis: redisInstance,
      limiter: Ratelimit.slidingWindow(30, "60 s"),
      analytics: true,
      prefix: "@ratelimit",
    });
  }
} catch (e) {
  console.warn("Failed to initialize Upstash Redis rate limiter, using DB fallback:", e);
}

// Helper to lazy-initialize Supabase client for Option B
let cachedServer: any = null;
function getSupabaseServer() {
  if (!cachedServer) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase URL and Key are required for database-backed rate limiting.");
    }
    cachedServer = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });
  }
  return cachedServer;
}

// Temporary memory store for Option C (emergency fallback)
const memoryStore = new Map<string, { count: number; windowStart: number }>();

/**
 * Perform a hybrid rate limit check.
 * @param ip            The requester's IP address
 * @param maxRequests   Max allowed requests in the window (default: 30)
 * @param windowMs      Time window in milliseconds (default: 60s)
 * @returns { allowed: boolean; remaining: number }
 */
export async function rateLimitCheck(
  ip: string,
  maxRequests = 30,
  windowMs = 60_000
): Promise<{ allowed: boolean; remaining: number }> {
  // --- OPTION A: Upstash Redis ---
  if (ratelimitInstance) {
    try {
      const { success, limit, reset, remaining } = await ratelimitInstance.limit(ip);
      return { allowed: success, remaining };
    } catch (redisError) {
      console.warn("Upstash Redis rate limit check failed, falling back to database:", redisError);
    }
  }

  // --- OPTION B: Supabase DB-backed limit table ---
  try {
    const supabaseServer = getSupabaseServer();
    const now = Date.now();

    // 1. Clean up expired rows to keep DB clean
    const expiryTime = now - windowMs;
    await supabaseServer
      .from("rate_limits")
      .delete()
      .lt("window_start", expiryTime);

    // 2. Fetch the current limit row
    const { data, error } = await supabaseServer
      .from("rate_limits")
      .select("count, window_start")
      .eq("ip", ip)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      // Create new window
      const { error: insertErr } = await supabaseServer
        .from("rate_limits")
        .insert([{ ip, count: 1, window_start: now }]);
      
      if (insertErr) throw insertErr;
      return { allowed: true, remaining: maxRequests - 1 };
    }

    // Check if current count exceeds limit
    if (data.count >= maxRequests) {
      return { allowed: false, remaining: 0 };
    }

    // Increment count
    const { error: updateErr } = await supabaseServer
      .from("rate_limits")
      .update({ count: data.count + 1 })
      .eq("ip", ip);

    if (updateErr) throw updateErr;

    return { allowed: true, remaining: maxRequests - (data.count + 1) };

  } catch (dbError) {
    console.error("Database-backed rate limit failed, falling back to memory:", dbError);
  }

  // --- OPTION C: In-memory fallback (Emergency) ---
  const now = Date.now();
  const entry = memoryStore.get(ip);

  if (!entry || now - entry.windowStart > windowMs) {
    memoryStore.set(ip, { count: 1, windowStart: now });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: maxRequests - entry.count };
}

/**
 * Perform sync wrapper compatibility function (if routes need synchronous return).
 * Note: Real rate limiting in serverless environments is async.
 */
export function rateLimit(
  ip: string,
  maxRequests = 30,
  windowMs = 60_000
): { allowed: boolean; remaining: number } {
  // Check memory store synchronously as a simple legacy proxy
  const now = Date.now();
  const entry = memoryStore.get(ip);

  if (!entry || now - entry.windowStart > windowMs) {
    memoryStore.set(ip, { count: 1, windowStart: now });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: maxRequests - entry.count };
}

/**
 * Extract the real client IP from Next.js request headers.
 * Handles Vercel's x-forwarded-for proxy chain.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
