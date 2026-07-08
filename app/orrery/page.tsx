"use client";

import { useEffect, useState, useRef } from "react";
import StarfieldCanvas from "@/components/StarfieldCanvas";

export default function OrreryPage() {
  const [mounted, setMounted] = useState(false);
  const [isLoadingIframe, setIsLoadingIframe] = useState(true);
  const [iframeTimeout, setIframeTimeout] = useState(false);
  const [utcTime, setUtcTime] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    // Dynamic UTC telemetry clock
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().replace("GMT", "UTC"));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    // Timeout check: if iframe hasn't loaded in 8 seconds, flag it
    const timer = setTimeout(() => {
      if (isLoadingIframe) {
        setIframeTimeout(true);
      }
    }, 8000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [isLoadingIframe]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => console.error(err));
    } else {
      containerRef.current.requestFullscreen().catch(err => console.error(err));
    }
  };

  return (
    <>
      <StarfieldCanvas />
      
      <div className="relative z-10 flex flex-col gap-10 pb-20">
        
        {/* Header Telemetry Branding */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-900 pb-8">
          <div>
            <span className="text-xs font-bold tracking-[0.25em] text-cyan-400 uppercase">Interactive WebGL Simulator</span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mt-1">
              Orrery <span className="text-slate-500">3D</span>
            </h1>
            <p className="text-slate-400 mt-2 max-w-2xl leading-relaxed text-sm md:text-base">
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
            <div className="text-emerald-500">ACCEL: 60FPS</div>
          </div>
        </div>

        {/* Dashboard Command Console Frame */}
        <div 
          ref={containerRef}
          className="w-full rounded-2xl border border-slate-900 bg-slate-950/65 overflow-hidden shadow-2xl shadow-black/60 backdrop-blur-sm transition-all duration-300 flex flex-col justify-between"
        >
          
          {/* Top bezel of the cockpit cockpit interface */}
          <div className="flex items-center justify-between border-b border-slate-900 bg-slate-900/35 px-6 py-4 font-mono text-xs text-slate-400 select-none">
            <div className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-cyan-400 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
              </svg>
              <span>TELEMETRY ACQUISITION: ACTIVE FEED</span>
            </div>
            
            <div className="flex items-center gap-4 text-[10px]">
              <span className="hidden sm:inline text-slate-500">SOLAR_SYSTEM_SCOPE_v4</span>
              <button 
                onClick={toggleFullscreen}
                className="bg-slate-900 hover:bg-slate-800 text-slate-300 px-3 py-1 rounded border border-slate-800 transition-colors flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-wider cursor-pointer"
              >
                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75v4.5m0-4.5h-4.5m4.5 0L15 9m5.25 11.25v-4.5m0 4.5h-4.5m4.5 0L15 15" />
                </svg>
                <span>Fullscreen</span>
              </button>
              <span className="bg-slate-800 px-2 py-0.5 rounded text-white border border-slate-700 font-bold">WebGL 2.0</span>
            </div>
          </div>

          {/* WebGL Simulator Container */}
          <div className="relative w-full aspect-[16/9] min-h-[550px] md:min-h-[700px] lg:min-h-[750px] bg-slate-950 flex-grow">
            
            {/* Loading state indicator */}
            {mounted && isLoadingIframe && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-slate-500 bg-slate-950 z-30">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                <p className="font-mono text-xs tracking-widest uppercase text-slate-400">Initializing Telemetry Deck...</p>
              </div>
            )}

            {/* Error Timeout Fallback */}
            {iframeTimeout && isLoadingIframe && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center p-6 bg-slate-950/95 z-40 backdrop-blur-sm border border-slate-900 max-w-md mx-auto rounded-xl my-auto h-fit">
                <span className="text-3xl">📡</span>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">WebGL Load Timeout</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The interactive simulator is taking longer than expected to load. You can try accessing the engine directly in a new window.
                </p>
                <a
                  href="https://www.solarsystemscope.com/iframe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-white px-5 py-2 text-xs font-semibold text-slate-950 hover:bg-slate-200 transition-colors"
                >
                  Open Sandbox Directly
                </a>
              </div>
            )}

            {mounted && (
              <iframe
                src="https://www.solarsystemscope.com/iframe"
                width="100%"
                height="100%"
                className={`absolute inset-0 w-full h-full border-none opacity-90 transition-all duration-700 hover:opacity-100 ${
                  isLoadingIframe ? "invisible" : "visible"
                }`}
                allow="fullscreen; autoplay"
                title="Solar System Scope 3D Orrery"
                onLoad={() => setIsLoadingIframe(false)}
              />
            )}
          </div>
          
          {/* Lower bezel telemetry / status info */}
          <div className="border-t border-slate-900 bg-slate-905 px-6 py-3 flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] font-mono text-slate-500 select-none">
            <div>TARGET COORD: HELIOCENTRIC ORBITS</div>
            <div className="flex gap-6 flex-wrap justify-center">
              <span>FOV: VARIABLE</span>
              <span>STABILITY: NOMINAL</span>
              <span className="text-cyan-400/80 font-bold">{utcTime || "SYNCING TELEMETRY..."}</span>
            </div>
          </div>
        </div>

        {/* Console Instruction & Quick Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
          
          {/* Instruction Card 1 */}
          <div className="group rounded-2xl border border-slate-900 bg-slate-950/45 p-6 hover:border-slate-800/85 transition-all duration-300 backdrop-blur-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-cyan-400 group-hover:scale-105 transition-transform duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.303.197-1.591 1.591M21.75 12H19.5m-.197 5.303-1.591-1.591M12 21.75V19.5m-5.303-.197 1.591-1.591M2.25 12H4.5m.197-5.303 1.59-1.59" />
                  </svg>
                </span>
                <h3 className="text-sm font-semibold text-white tracking-wide">Orbit Control</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Hold the left mouse button (or tap and drag on touch devices) and swipe in any direction to orbit around the sun, target planets, or moons.
              </p>
            </div>
          </div>

          {/* Instruction Card 2 */}
          <div className="group rounded-2xl border border-slate-900 bg-slate-950/45 p-6 hover:border-slate-800/85 transition-all duration-300 backdrop-blur-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-cyan-400 group-hover:scale-105 transition-transform duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6" />
                  </svg>
                </span>
                <h3 className="text-sm font-semibold text-white tracking-wide">Sizing & Proximity</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Use your mouse scroll wheel (or pinch-to-zoom on touch screens) to fly through planetary ring systems, approach satellites, and zoom out.
              </p>
            </div>
          </div>

          {/* Instruction Card 3 */}
          <div className="group rounded-2xl border border-slate-900 bg-slate-950/45 p-6 hover:border-slate-800/85 transition-all duration-300 backdrop-blur-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-cyan-400 group-hover:scale-105 transition-transform duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 21L21 3 9.813 15.904ZM9.813 15.904 4 11.25H11.25V18.75L9.813 15.904Z" />
                  </svg>
                </span>
                <h3 className="text-sm font-semibold text-white tracking-wide">Telemetry Inspector</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Click directly on any celestial object (the Sun, planets, moons) to bring up their details panel, orbital speeds, structures, and statistics.
              </p>
            </div>
          </div>
          
        </div>

      </div>
    </>
  );
}
