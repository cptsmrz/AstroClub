"use client";

import { useState, useEffect } from "react";

export default function FullscreenPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("astro_fullscreen_dismissed");
    
    if (typeof window !== "undefined") {
      const isFullscreen = document.fullscreenElement !== null;
      if (!dismissed && !isFullscreen) {
        // Show after 2 seconds for a premium entrance
        const timer = setTimeout(() => setShow(true), 2000);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-lg animate-in fade-in duration-300">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="max-w-md w-full rounded-2xl border border-slate-900 bg-slate-950 p-6 md:p-8 shadow-2xl flex flex-col gap-5 animate-in zoom-in-95 duration-350"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl animate-pulse">🌌</span>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold font-mono tracking-[0.25em] text-cyan-400 uppercase">
                Immersive Experience
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">
                Stargazing Mode
              </h2>
            </div>
          </div>
          <button 
            onClick={handleDismiss}
            className="text-slate-500 hover:text-white transition-colors cursor-pointer text-sm font-bold bg-slate-900 hover:bg-slate-850 p-1.5 rounded-full"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>
        
        <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
          For the most immersive cosmic viewing experience, we recommend enabling fullscreen stargazing mode. This hides standard browser bezels so you can trace stellar coordinates seamlessly.
        </p>

        <div className="flex gap-3 justify-end pt-3 border-t border-slate-900/60">
          <button
            onClick={handleDismiss}
            className="px-4 py-2 rounded text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Keep Windowed
          </button>
          <button
            onClick={handleGoFullscreen}
            className="bg-white hover:bg-slate-200 text-slate-950 px-5 py-2 rounded text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-md shadow-white/5"
          >
            Enable Fullscreen
          </button>
        </div>
      </div>
    </div>
  );
}
