"use client";

import { useState, useEffect } from "react";

export default function FullscreenPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Verify if already dismissed or if document is already fullscreened
    const dismissed = localStorage.getItem("astro_fullscreen_dismissed");
    
    // Check if window is available
    if (typeof window !== "undefined") {
      const isFullscreen = document.fullscreenElement !== null;
      if (!dismissed && !isFullscreen) {
        // Slide in after 2.5s for a smooth premium experience
        const timer = setTimeout(() => setShow(true), 2500);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleGoFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen()
        .then(() => {
          setShow(false);
          localStorage.setItem("astro_fullscreen_dismissed", "true");
        })
        .catch((err) => console.error("Fullscreen request failed:", err));
    }
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem("astro_fullscreen_dismissed", "true");
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-sm rounded-xl border border-slate-900 bg-slate-950/90 p-4 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-10 duration-500 flex flex-col gap-3 font-body">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🌌</span>
          <span className="text-xs font-bold font-mono tracking-widest text-cyan-400 uppercase">
            IMMERSIVE MODE
          </span>
        </div>
        <button 
          onClick={handleDismiss}
          className="text-slate-500 hover:text-white transition-colors cursor-pointer text-xs font-bold"
          aria-label="Close prompt"
        >
          ✕
        </button>
      </div>
      
      <p className="text-xs text-slate-400 leading-relaxed">
        For the most immersive cosmic viewing experience, this portal is best viewed in Fullscreen Mode.
      </p>

      <div className="flex gap-3 justify-end pt-1">
        <button
          onClick={handleDismiss}
          className="px-3 py-1.5 rounded text-[10px] font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          Keep Normal
        </button>
        <button
          onClick={handleGoFullscreen}
          className="bg-white hover:bg-slate-200 text-slate-950 px-3 py-1.5 rounded text-[10px] font-bold transition-colors cursor-pointer shadow-sm shadow-white/5"
        >
          Go Fullscreen
        </button>
      </div>
    </div>
  );
}
