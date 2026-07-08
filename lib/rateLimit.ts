/**
 * lib/rateLimit.ts
 * Simple in-memory rate limiter for Next.js API routes.
 * Limits requests per IP within a sliding time window.
 * No external dependency needed — works on Vercel Edge/Node runtimes.
 */

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

// In-memory store: IP → { count, windowStart }
const store = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes to prevent memory bloat
setInterval(() => {
  const now = Date.now();
  store.forEach((entry, key) => {
    if (now - entry.windowStart > 60_000) store.delete(key);
  });
}, 5 * 60 * 1000);

/**
 * @param ip         The requester's IP address
 * @param maxRequests  Max allowed requests in the window (default: 30)
 * @param windowMs   Time window in milliseconds (default: 60s)
 * @returns { allowed: boolean, remaining: number }
 */
export function rateLimit(
  ip: string,
  maxRequests = 30,
  windowMs = 60_000
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now - entry.windowStart > windowMs) {
    // New window
    store.set(ip, { count: 1, windowStart: now });
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
