"use client";

import { useState, useEffect } from "react";

export default function SAISimulator() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<string>("none");
  const [activeStatus, setActiveStatus] = useState<string>("approved");
  const [graceState, setGraceState] = useState<string>("none");
  const [hasSecondary, setHasSecondary] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setActiveRole(localStorage.getItem("dev_role_override") || "none");
      setActiveStatus(localStorage.getItem("dev_status_override") || "approved");
      setGraceState(localStorage.getItem("dev_grace_override") || "none");
      setHasSecondary(!!localStorage.getItem("dev_secondary_email_override"));
    }
  }, []);

  // Only render simulator in local development mode
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const applyOverride = (role: string, status: string, email: string | null, secondary: string | null) => {
    if (role === "none") {
      localStorage.removeItem("dev_role_override");
      localStorage.removeItem("dev_status_override");
      localStorage.removeItem("dev_email_override");
      localStorage.removeItem("dev_secondary_email_override");
      localStorage.removeItem("dev_grace_override");
      localStorage.removeItem("dev_created_at_override");
    } else {
      localStorage.setItem("dev_role_override", role);
      localStorage.setItem("dev_status_override", status);
      if (email) localStorage.setItem("dev_email_override", email);
      else localStorage.removeItem("dev_email_override");
      
      if (secondary) localStorage.setItem("dev_secondary_email_override", secondary);
      else localStorage.removeItem("dev_secondary_email_override");
    }
    window.location.reload();
  };

  const setGracePeriod = (state: string) => {
    if (state === "fresh") {
      const freshTime = new Date().toISOString();
      localStorage.setItem("dev_created_at_override", freshTime);
      localStorage.setItem("dev_grace_override", "fresh");
    } else if (state === "expired") {
      const expiredTime = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(); // 4 days ago
      localStorage.setItem("dev_created_at_override", expiredTime);
      localStorage.setItem("dev_grace_override", "expired");
    } else {
      localStorage.removeItem("dev_created_at_override");
      localStorage.removeItem("dev_grace_override");
    }
    window.location.reload();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans text-xs">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-cyan-800 bg-slate-950 px-4 py-2.5 font-semibold text-cyan-400 shadow-lg shadow-black/80 hover:bg-slate-900 transition-all cursor-pointer"
      >
        <span>🛰️</span> S.AI Dev Panel
      </button>

      {/* Expanded Control Board */}
      {isOpen && (
        <div className="absolute bottom-12 right-0 w-72 rounded-xl border border-slate-800 bg-slate-950/95 p-5 shadow-2xl backdrop-blur-md flex flex-col gap-4 text-slate-300">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2">
            <span className="font-bold uppercase tracking-wider text-cyan-400">Simulation Matrix</span>
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white">✕</button>
          </div>

          {/* Persona Presets */}
          <div className="flex flex-col gap-1.5">
            <span className="font-semibold text-slate-500 uppercase">Simulate Persona</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => applyOverride("president", "approved", "president@gla.ac.in", null)}
                className={`py-1.5 px-2 rounded border transition text-left ${
                  activeRole === "president" ? "border-cyan-500 text-white bg-cyan-950/20" : "border-slate-800 hover:bg-slate-900"
                }`}
              >
                👑 President
              </button>
              <button
                onClick={() => applyOverride("guest", "approved", "student@gla.ac.in", null)}
                className={`py-1.5 px-2 rounded border transition text-left ${
                  activeRole === "guest" && activeStatus === "approved" ? "border-cyan-500 text-white bg-cyan-950/20" : "border-slate-800 hover:bg-slate-900"
                }`}
              >
                🎓 GLA Student
              </button>
              <button
                onClick={() => applyOverride("guest", "approved", null, null)}
                className={`py-1.5 px-2 rounded border transition text-left ${
                  activeRole === "guest" && !localStorage.getItem("dev_email_override") ? "border-cyan-500 text-white bg-cyan-950/20" : "border-slate-800 hover:bg-slate-900"
                }`}
              >
                👁️ Anon Observer
              </button>
              <button
                onClick={() => applyOverride("guest", "restricted", "violator@gla.ac.in", null)}
                className={`py-1.5 px-2 rounded border transition text-left ${
                  activeStatus === "restricted" ? "border-red-500 text-red-400 bg-red-950/20" : "border-slate-800 hover:bg-slate-900"
                }`}
              >
                🚨 Restricted
              </button>
            </div>
          </div>

          {/* Grace Period Overrides */}
          {activeRole !== "guest" && activeRole !== "none" && (
            <div className="flex flex-col gap-1.5 border-t border-slate-900 pt-3">
              <span className="font-semibold text-slate-500 uppercase">Onboarding Timeline (72h)</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setGracePeriod("fresh")}
                  className={`flex-1 py-1 px-1.5 rounded border text-center transition ${
                    graceState === "fresh" ? "border-cyan-500 text-white bg-cyan-950/20" : "border-slate-800 hover:bg-slate-900"
                  }`}
                >
                  Fresh Signup
                </button>
                <button
                  onClick={() => setGracePeriod("expired")}
                  className={`flex-1 py-1 px-1.5 rounded border text-center transition ${
                    graceState === "expired" ? "border-red-500 text-red-400 bg-red-950/20" : "border-slate-800 hover:bg-slate-900"
                  }`}
                >
                  Expired (&gt;72h)
                </button>
              </div>
              <button
                onClick={() => {
                  localStorage.setItem("dev_secondary_email_override", "linked@gmail.com");
                  window.location.reload();
                }}
                disabled={hasSecondary}
                className="w-full mt-1.5 py-1.5 rounded bg-slate-900 border border-slate-850 hover:bg-slate-800 text-slate-400 transition disabled:opacity-40"
              >
                {hasSecondary ? "✓ Secondary Email Linked" : "Link Secondary Email Now"}
              </button>
            </div>
          )}

          {/* Reset button */}
          <button
            onClick={() => applyOverride("none", "approved", null, null)}
            className="w-full mt-2 py-2 rounded bg-red-950/40 border border-red-900/50 text-red-400 font-semibold hover:bg-red-950/60 transition"
          >
            Clear Overrides & Sync Live
          </button>
        </div>
      )}
    </div>
  );
}
