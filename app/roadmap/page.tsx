"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MILESTONES } from "../about/page";

function RoadmapContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"archive" | "roadmap">("archive");

  useEffect(() => {
    const src = searchParams.get("src");
    if (src === "about") {
      setActiveTab("roadmap");
    } else {
      setActiveTab("archive");
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-space text-slate-800 relative overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Navigation bar */}
        <div className="mb-10 flex items-center justify-between">
          <Link 
            href="/about"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border-2 border-slate-900 bg-white hover:bg-slate-100 text-xs font-extrabold text-slate-900 transition-all shadow-[2px_2px_0px_0px_#0f172a] hover:shadow-[3px_3px_0px_0px_#0f172a] hover:-translate-y-0.5 select-none"
          >
            ← Back to About Us
          </Link>
          
          <span className="text-[10px] font-extrabold tracking-[0.25em] text-slate-400 uppercase font-mono">
            AstroClub Archive
          </span>
        </div>

        {/* Dynamic Header Block */}
        <div className="text-center mb-8">
          {activeTab === "archive" ? (
            <>
              <h1 className="text-5xl md:text-7xl font-extrabold font-syne text-slate-900 uppercase tracking-tight leading-none mb-4 select-none">
                AstroClub <span className="bg-gradient-to-r from-indigo-600 via-cyan-500 to-fuchsia-500 bg-clip-text text-transparent">Archives</span>
              </h1>
              <p className="text-sm md:text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
                Unclassified logs, original lecture notes, and observations from GLA University CCASS & GLA AstroClub.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-5xl md:text-7xl font-extrabold font-syne text-slate-900 uppercase tracking-tight leading-none mb-4 select-none">
                Legacy <span className="bg-gradient-to-r from-indigo-600 via-cyan-500 to-fuchsia-500 bg-clip-text text-transparent">Roadmap</span>
              </h1>
              <p className="text-sm md:text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
                The full chronological log of our telescope building workshops, observational milestones, and administrative evolution.
              </p>
            </>
          )}
        </div>

        {/* View Toggle Badges */}
        <div className="flex justify-center gap-4 mb-16">
          <button
            onClick={() => setActiveTab("archive")}
            className={`px-5 py-2 rounded-xl border-2 border-slate-900 font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer select-none ${
              activeTab === "archive"
                ? "bg-slate-900 text-white shadow-[2px_2px_0px_0px_#000]"
                : "bg-white text-slate-800 hover:bg-slate-100 shadow-[4px_4px_0px_0px_#0f172a] hover:shadow-[2px_2px_0px_0px_#0f172a] hover:translate-y-[2px]"
            }`}
          >
            📁 Archived Logs
          </button>
          <button
            onClick={() => setActiveTab("roadmap")}
            className={`px-5 py-2 rounded-xl border-2 border-slate-900 font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer select-none ${
              activeTab === "roadmap"
                ? "bg-slate-900 text-white shadow-[2px_2px_0px_0px_#000]"
                : "bg-white text-slate-800 hover:bg-slate-100 shadow-[4px_4px_0px_0px_#0f172a] hover:shadow-[2px_2px_0px_0px_#0f172a] hover:translate-y-[2px]"
            }`}
          >
            🗺️ Legacy Roadmap
          </button>
        </div>

        {/* Content View */}
        {activeTab === "archive" ? (
          /* Archive Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1: ASTR 101 */}
            <div className="bg-white border-2 border-slate-900 p-6 rounded-2xl shadow-[4px_4px_0px_0px_#0f172a] hover:shadow-[6px_6px_0px_0px_#0f172a] transition-all hover:-translate-y-0.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] font-bold text-indigo-600 uppercase font-mono tracking-wider">
                    [FILE: ASTR-101-01]
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">OCT 2025</span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 font-syne mb-2">
                  ASTR 101: The Optical Bench
                </h3>
                <p className="text-xs text-slate-650 leading-relaxed mb-4">
                  Open classroom sessions conducted for the newly recruited student council. Covered primary mirror geometries, anti-reflective coatings, and chromatic aberrations.
                </p>
              </div>
              <div className="bg-slate-900 text-cyan-400 p-3 rounded-lg font-mono text-[10px] overflow-x-auto whitespace-nowrap">
                {`// Telescope Magnification Formula\n`}
                <span className="text-white">M = F_obj / F_eye</span>
                {`\n// Light Gathering Power\n`}
                <span className="text-white">LGP = (D_tele / D_eye)²</span>
              </div>
            </div>

            {/* Card 2: Observation Log */}
            <div className="bg-white border-2 border-slate-900 p-6 rounded-2xl shadow-[4px_4px_0px_0px_#0f172a] hover:shadow-[6px_6px_0px_0px_#0f172a] transition-all hover:-translate-y-0.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-bold text-emerald-600 uppercase font-mono tracking-wider">
                    [OBS: 2024-02-02]
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">FEB 2024</span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 font-syne mb-2">
                  First Light Observation Log
                </h3>
                <p className="text-xs text-slate-650 leading-relaxed mb-4">
                  First observation night using our newly built 3-inch Newtonian reflector. Target: Jupiter. Sky clarity rated 7/10. Resolved Jovian cloud bands and four Galilean satellites.
                </p>
              </div>
              <div className="border-t border-slate-100 pt-3 flex flex-wrap gap-2">
                <span className="px-2 py-0.5 rounded bg-slate-100 text-[9px] font-bold text-slate-600 font-mono">TARGET: JUPITER</span>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-[9px] font-bold text-slate-600 font-mono">MOONS: 4</span>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-[9px] font-bold text-slate-600 font-mono">SEEING: 7/10</span>
              </div>
            </div>

            {/* Card 3: Solar Spot PPT */}
            <div className="bg-white border-2 border-slate-900 p-6 rounded-2xl shadow-[4px_4px_0px_0px_#0f172a] hover:shadow-[6px_6px_0px_0px_#0f172a] transition-all hover:-translate-y-0.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-100 text-[10px] font-bold text-amber-600 uppercase font-mono tracking-wider">
                    [SOLAR: 2026-01]
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">JAN 2026</span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 font-syne mb-2">
                  Sunspot PPT Proofing
                </h3>
                <p className="text-xs text-slate-650 leading-relaxed mb-4">
                  The astrophotography team successfully captured and identified active solar spots. Slideshow compiled by Madhav Gupta, fact-checked and structured by the design team.
                </p>
              </div>
              <div className="border-t border-slate-100 pt-3 flex flex-wrap gap-2">
                <span className="px-2 py-0.5 rounded bg-slate-100 text-[9px] font-bold text-slate-600 font-mono">REGION: AR3590</span>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-[9px] font-bold text-slate-600 font-mono">VERIFIED: CCASS</span>
              </div>
            </div>

            {/* Card 4: Constitution Excerpt */}
            <div className="bg-white border-2 border-slate-900 p-6 rounded-2xl shadow-[4px_4px_0px_0px_#0f172a] hover:shadow-[6px_6px_0px_0px_#0f172a] transition-all hover:-translate-y-0.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-0.5 rounded-full bg-fuchsia-50 border border-fuchsia-100 text-[10px] font-bold text-fuchsia-600 uppercase font-mono tracking-wider">
                    [DOC: CONST-2026]
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">AUG 2026</span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 font-syne mb-2">
                  Constitution Article III
                </h3>
                <p className="text-xs text-slate-650 leading-relaxed mb-4">
                  Formalized elections and roles. Ensures structured knowledge handovers, safety parameters for public night sessions, and telescope inventory assignment controls.
                </p>
              </div>
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                <Link href="/constitution" className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-wider flex items-center gap-1 font-mono">
                  View Constitution →
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Roadmap View */
          <div className="relative">
            {/* Vertical Winding Centerline */}
            <div className="absolute left-6 md:left-1/2 top-2 bottom-2 w-[4px] bg-slate-900 transform -translate-x-1/2 z-0" />

            {/* Milestone Items */}
            <div className="flex flex-col gap-8 md:gap-12 relative z-10">
              {MILESTONES.map((m, idx) => {
                const isLeft = idx % 2 === 0;
                return (
                  <div 
                    key={idx} 
                    className="flex flex-col md:flex-row items-stretch md:items-center relative w-full group"
                  >
                    {/* Center/Left Node Dot */}
                    <div className="absolute left-6 md:left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 md:order-2">
                      <span className="h-10 w-10 rounded-full bg-white border-3 border-slate-900 flex items-center justify-center shadow-[2px_2px_0px_0px_#0f172a] text-lg select-none transition-transform group-hover:scale-110">
                        {m.icon}
                      </span>
                    </div>

                    {/* Card Column */}
                    <div 
                      className={`w-full md:w-[47%] pl-14 md:pl-0 flex ${
                        isLeft 
                          ? "md:pr-10 md:justify-end md:text-right md:order-1" 
                          : "md:pl-10 md:justify-start md:order-3"
                      }`}
                    >
                      <div className="bg-white border-2 border-slate-900 p-5 rounded-2xl shadow-[4px_4px_0px_0px_#0f172a] hover:shadow-[6px_6px_0px_0px_#0f172a] transition-all hover:-translate-y-0.5 max-w-md w-full text-left">
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[9px] font-extrabold text-slate-800 uppercase tracking-wider mb-2">
                          {m.date}
                        </span>
                        <h3 className="text-sm md:text-base font-extrabold text-slate-900 font-syne mb-2 tracking-tight uppercase">
                          {m.title}
                        </h3>
                        <p className="text-[11px] md:text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                          {m.desc}
                        </p>
                      </div>
                    </div>

                    {/* Spacer Column (Desktop) */}
                    <div className={`hidden md:block md:w-[47%] ${isLeft ? "md:order-3" : "md:order-1"}`} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="text-center mt-20 text-[10px] text-slate-400 font-mono tracking-widest uppercase">
          ✦ Clear Skies & Steady Mounts ✦
        </div>
      </div>
    </div>
  );
}

export default function RoadmapPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-space">
        <div className="text-slate-500 font-extrabold text-sm uppercase tracking-widest animate-pulse">
          Retrieving Archives...
        </div>
      </div>
    }>
      <RoadmapContent />
    </Suspense>
  );
}
