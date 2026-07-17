import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const capturesDir = path.join(process.cwd(), "public", "images", "our_captures");
    let files: string[] = [];
    if (fs.existsSync(capturesDir)) {
      files = fs.readdirSync(capturesDir).filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file));
    }
    
    // Map to the AstroCapture structure
    const captures = files.map(file => ({
      title: file.split(".")[0].replace(/[_-]/g, " "),
      instrument: "AstroClub Arsenal",
      credit: "AstroClub Member",
      date: "2025/2026",
      image_url: `/images/our_captures/${file}`
    }));
    
    // Shuffle or limit if needed, or return all
    return NextResponse.json(captures);
  } catch (error) {
    return NextResponse.json({ error: "Failed to load captures" }, { status: 500 });
  }
}

