import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent clickjacking — no one can embed your site in an iframe
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Stop browsers from guessing MIME types (prevents drive-by downloads)
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Force HTTPS for 2 years, include subdomains
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Control what info is sent in the Referer header
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable access to sensitive browser APIs you don't need
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  // Content Security Policy — only load scripts/styles from trusted sources
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js needs 'unsafe-inline' and 'unsafe-eval' for dev; Supabase + NASA for data
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      // Images: self, Supabase storage, NASA, Unsplash
      "img-src 'self' data: blob: https://*.supabase.co https://apod.nasa.gov https://images.unsplash.com https://*.nasa.gov",
      // Frames: only Solar System Scope (for the Orrery page) and YouTube (for APOD videos)
      "frame-src 'self' https://www.solarsystemscope.com https://www.youtube.com https://www.youtube-nocookie.com",
      // API connections: Supabase and NASA only
      "connect-src 'self' https://*.supabase.co https://api.nasa.gov wss://*.supabase.co",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'apod.nasa.gov' },
    ],
  },
  async headers() {
    return [
      {
        // Apply security headers to every route
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
