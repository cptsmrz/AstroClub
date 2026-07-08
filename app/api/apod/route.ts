import { NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

// Simple in-memory server cache
let cachedApod: any = null;
let lastFetchedTime: number = 0;

export async function GET(request: Request) {
  // Rate limit: 60 requests/min per IP (APOD is cached, so this is very generous)
  const { allowed } = rateLimit(getClientIp(request), 60);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a minute." },
      { status: 429 }
    );
  }

  const currentTime = Date.now();
  const ONE_DAY_MS = 24 * 60 * 60 * 1000; // Cache duration: 24 hours

  // If cache is fresh, serve it immediately
  if (cachedApod && (currentTime - lastFetchedTime) < ONE_DAY_MS) {
    return NextResponse.json(cachedApod);
  }

  try {
    // Check both server-only key and public key as fallback
    const apiKey = process.env.NASA_API_KEY || process.env.NEXT_PUBLIC_NASA_API_KEY || "DEMO_KEY";
    
    const res = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`
    );
    
    if (!res.ok) throw new Error("NASA API response not OK");
    const data = await res.json();

    // Update Cache
    cachedApod = {
      title: data.title,
      url: data.hdurl || data.url,
      thumbnail_url: data.url,
      explanation: data.explanation,
      media_type: data.media_type || "image"
    };
    lastFetchedTime = currentTime;

    return NextResponse.json(cachedApod);
  } catch (error) {
    console.error("NASA Server APOD Error:", error);
    
    // Return a stable fallback payload if the API fails or rate-limit is exceeded
    return NextResponse.json({
      title: "Vistas of the Deep Cosmos",
      url: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1200&auto=format&fit=crop",
      explanation: "Exploring the cosmos from our own backyard. Our club connects stargazers and space enthusiasts to the beauty of the universe, bringing deep space closer through observations, discussions, and shared discovery."
    });
  }
}
