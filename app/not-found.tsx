"use client";

import Link from "next/link";
import StarfieldCanvas from "@/components/StarfieldCanvas";

export default function NotFound() {
  return (
    <>
      <StarfieldCanvas />

      <div className="relative z-10 min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <div className="text-[10px] font-bold tracking-[0.3em] text-cyan-400 uppercase mb-4 animate-pulse">
          Telemetry Error Code: 404
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-none">
          Lost in Deep Space
        </h1>
        
        <p className="text-slate-400 text-sm md:text-base max-w-md leading-relaxed mb-10">
          The orbital coordinates you requested point to an uncharted sector. The page might have been decommissioned or relocated to another quadrant.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="rounded-lg bg-white px-6 py-3.5 text-xs font-bold text-slate-950 transition-all hover:bg-slate-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/5"
          >
            Navigate Back to Base
          </Link>
          <Link
            href="/blogs"
            className="rounded-lg border border-slate-900 bg-slate-950/50 px-6 py-3.5 text-xs font-bold text-slate-350 transition-all hover:border-slate-800 hover:text-white"
          >
            Read Orbit Logs (Blogs)
          </Link>
        </div>
      </div>
    </>
  );
}
