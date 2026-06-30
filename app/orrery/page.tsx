"use client";

import { useEffect, useState } from "react";
import StarfieldCanvas from "@/components/StarfieldCanvas";

export default function OrreryPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <StarfieldCanvas />
      
      <div className="relative z-10 flex flex-col gap-10 pb-20">
        
        {/* Header Telemetry Branding */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-900 pb-8">
          <div>
            <span className="text-xs font-bold tracking-[0.25em] text-slate-500 uppercase">Interactive WebGL Simulator</span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mt-1">
              Orrery <span className="text-slate-500">3D</span>
            </h1>
            <p className="text-slate-400 mt-2 max-w-2xl leading-relaxed">
              Explore a fully-realized interactive virtual solar system. Zoom from the outer boundaries of the heliosphere down to planetary orbits, satellites, and structural configurations.
            </p>
          </div>
          
          {/* Active Terminal Telemetry Stats */}
          <div className="flex flex-wrap gap-4 text-[10px] tracking-widest font-mono text-slate-400 bg-slate-950/80 border border-slate-900 p-4 rounded-xl backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>CONSOLE: ONLINE</span>
            </div>
            <div className="text-slate-700">|</div>
            <div>SECTOR: HELIOSPHERE</div>
            <div className="text-slate-700">|</div>
            <div className="text-emerald-500">ACCEL: HARDWARE (60FPS)</div>
          </div>
        </div>

        {/* Dashboard Command Console Frame */}
        <div className="w-full rounded-2xl border border-slate-800/80 bg-slate-950/65 overflow-hidden shadow-2xl shadow-black/60 backdrop-blur-sm transition-all duration-300">
          
          {/* Top bezel of the cockpit cockpit interface */}
          <div className="flex items-center justify-between border-b border-slate-900 bg-slate-900/35 px-6 py-4 font-mono text-xs text-slate-400 select-none">
            <div className="flex items-center gap-2">
              <span className="text-slate-600">📡</span>
              <span>TELEMETRY ACQUISITION: ACTIVE FEED</span>
            </div>
            <div className="flex items-center gap-4 text-[10px]">
              <span className="hidden sm:inline text-slate-500">SOLAR_SYSTEM_SCOPE_v4</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded text-white border border-slate-700">WebGL 2.0</span>
            </div>
          </div>

          {/* WebGL Simulator Container */}
          <div className="relative w-full aspect-[16/9] min-h-[550px] md:min-h-[700px] lg:min-h-[750px] bg-slate-950">
            {mounted ? (
              <iframe
                src="https://www.solarsystemscope.com/iframe"
                width="100%"
                height="100%"
                className="absolute inset-0 w-full h-full border-none opacity-90 transition-opacity duration-700 hover:opacity-100"
                allow="fullscreen; autoplay"
                title="Solar System Scope 3D Orrery"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-slate-500 bg-slate-950">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
                <p className="font-mono text-xs tracking-widest uppercase">Initializing Telemetry Deck...</p>
              </div>
            )}
          </div>
          
          {/* Lower bezel telemetry / status info */}
          <div className="border-t border-slate-900 bg-slate-900/20 px-6 py-3 flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] font-mono text-slate-500 select-none">
            <div>TARGET COORD: HELIOCENTRIC ORBITS</div>
            <div className="flex gap-4">
              <span>FOV: VARIABLE</span>
              <span>STABILITY: 99.98%</span>
            </div>
          </div>
        </div>

        {/* Console Instruction & Quick Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
          
          {/* Instruction Card 1 */}
          <div className="group rounded-2xl border border-slate-900 bg-slate-950/45 p-6 hover:border-slate-800/80 transition-all duration-300 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl select-none group-hover:scale-110 transition-transform">🖱️</span>
              <h3 className="text-sm font-semibold text-white tracking-wide">Orbit Control</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hold the left mouse button (or tap and drag on touch devices) and swipe in any direction to orbit around the sun, target planets, or moons.
            </p>
          </div>

          {/* Instruction Card 2 */}
          <div className="group rounded-2xl border border-slate-900 bg-slate-950/45 p-6 hover:border-slate-800/80 transition-all duration-300 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl select-none group-hover:scale-110 transition-transform">🔍</span>
              <h3 className="text-sm font-semibold text-white tracking-wide">Sizing & Proximity</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Use your mouse scroll wheel (or pinch-to-zoom on touch screens) to fly through planetary ring systems, approach satellites, and zoom out of the solar system.
            </p>
          </div>

          {/* Instruction Card 3 */}
          <div className="group rounded-2xl border border-slate-900 bg-slate-950/45 p-6 hover:border-slate-800/80 transition-all duration-300 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl select-none group-hover:scale-110 transition-transform">👈</span>
              <h3 className="text-sm font-semibold text-white tracking-wide">Telemetry Inspector</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Click directly on any celestial object (the Sun, planets, moons) to bring up their details panel, orbital speeds, structures, and encyclopedic statistics.
            </p>
          </div>
          
        </div>

      </div>
    </>
  );
}
