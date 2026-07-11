"use client";

import Link from "next/link";
import { MILESTONES } from "../about/page";

export default function RoadmapPage() {
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
            ← Back to About
          </Link>
          
          <span className="text-[10px] font-extrabold tracking-[0.25em] text-slate-400 uppercase font-mono">
            AstroClub Archive
          </span>
        </div>

        {/* Header Block */}
        <div className="text-center mb-16 md:mb-20">
          <h1 className="text-5xl md:text-7xl font-extrabold font-syne text-slate-900 uppercase tracking-tight leading-none mb-4 select-none">
            Legacy <span className="bg-gradient-to-r from-indigo-600 via-cyan-500 to-fuchsia-500 bg-clip-text text-transparent">Roadmap</span>
          </h1>
          <p className="text-sm md:text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
            The full chronological log of our telescope building workshops, observational milestones, and administrative evolution.
          </p>
        </div>

        {/* Timeline Path Container */}
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

        {/* Footer info */}
        <div className="text-center mt-20 text-[10px] text-slate-400 font-mono tracking-widest uppercase">
          ✦ Clear Skies & Steady Mounts ✦
        </div>
      </div>
    </div>
  );
}
