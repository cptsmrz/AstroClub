"use client";

import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if consent has already been given
    const consent = localStorage.getItem("astroclub_cookie_consent");
    if (!consent) {
      // Delay slightly for smooth user entry
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (level: "necessary" | "all") => {
    localStorage.setItem("astroclub_cookie_consent", level);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-fade-in-up">
      <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 md:p-6 shadow-2xl backdrop-blur-md shadow-black/80 flex flex-col gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg select-none">🍪</span>
            <h4 className="text-sm font-bold tracking-wider uppercase text-white">
              Stellar Cookies
            </h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            We use cookie tokens to keep your authentication secure, cache daily NASA imagery, and evaluate site metrics. Choose your planetary data authorization level:
          </p>
        </div>

        <div className="flex gap-3 text-xs">
          <button
            onClick={() => handleConsent("necessary")}
            className="flex-1 rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-2.5 font-semibold text-slate-400 hover:border-slate-700 hover:text-white transition-all active:scale-[0.98]"
          >
            Necessary Only
          </button>
          <button
            onClick={() => handleConsent("all")}
            className="flex-1 rounded-lg bg-white px-4 py-2.5 font-semibold text-slate-950 hover:bg-slate-200 transition-all active:scale-[0.98]"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
