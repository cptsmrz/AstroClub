"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import StarfieldCanvas from "@/components/StarfieldCanvas";
import OrbitingPlanetCanvas from "@/components/OrbitingPlanetCanvas";
import IntroCanvas, { type IntroPhase } from "@/components/IntroCanvas";

interface HeroSectionProps {
  scrollOffset: number;
}

export default function HeroSection({ scrollOffset }: HeroSectionProps) {
  const [screenHeight, setScreenHeight] = useState(1080);
  
  // --- Intro Sequence State ---
  const [phase, setPhase] = useState<IntroPhase>("telemetry");
  const [printedLines, setPrintedLines] = useState<string[]>([]);
  const [showSkip, setShowSkip] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(1);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setScreenHeight(window.innerHeight);
      const handleResize = () => setScreenHeight(window.innerHeight);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const lastPlayed = localStorage.getItem("astroclub_intro_last_played");
      if (lastPlayed && Date.now() - parseInt(lastPlayed, 10) < 86400000) {
        setPhase("none");
        setOverlayOpacity(0);
      }
    }
  }, []);

  useEffect(() => {
    if (phase !== "none") {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.documentElement.setAttribute("data-intro-active", "true");
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.documentElement.removeAttribute("data-intro-active");
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.documentElement.removeAttribute("data-intro-active");
    };
  }, [phase]);

  useEffect(() => {
    if (phase === "none") return;

    const TELEMETRY_LINES = [
      "CCASS COGNITIVE TELEMETRY FEED [SEC XI]",
      "ESTABLISHING STELLARPORTAL COGNITIVE LINK...",
      "==============================================",
      "[ OK ] DETECTING APERTURE COORD: 27.6058 N, 77.5924 E",
      "[ OK ] INTEGRATING NEWTONIAN OPTICAL GEOMETRIES",
      "[ OK ] INGESTING MIRROR GRINDING ALIGNMENT DRAFT",
      "[ OK ] MOUNT TRACKING STAGE: ENGAGED [BAUD: 9600]",
      "[ INFO ] CONNECTING TO SUPABASE MATRIX DATABASE...",
      "[ OK ] CONSTRAINTS VERIFIED: [hosteler / day_scholar]",
      "[ INFO ] RETRIEVING ASTR 101 CURRICULUM ARTIFACTS",
      "[ OK ] LOADED DUAL-TAB ROADMAP CONSOLE",
      "==============================================",
      "ASTRONOMY PROTOCOLS INITIATED.",
      "UPLINK SECURE.",
      "WELCOME TO ASTROCLUB PORTAL.",
      "CLEAR SKIES."
    ];

    let typingTimer: NodeJS.Timeout | null = null;

    if (phase === "telemetry") {
      const scheduleTyping = (index: number) => {
        if (index >= TELEMETRY_LINES.length) return;
        setPrintedLines(prev => [...prev, TELEMETRY_LINES[index]]);
        const delays = [1000, ...Array(11).fill(77), 1500, 250, 1326];
        const delay = delays[index] ?? 77;
        typingTimer = setTimeout(() => scheduleTyping(index + 1), delay);
      };
      scheduleTyping(0);
    }

    const skipTimer = setTimeout(() => setShowSkip(true), 4000);
    const t1 = setTimeout(() => setPhase("matrix"), 5000);

    const t2 = setTimeout(() => {
      setPhase("black");
      localStorage.setItem("astroclub_intro_last_played", Date.now().toString());

      const t3 = setTimeout(() => {
        setOverlayOpacity(0);
        const t4 = setTimeout(() => {
          setPhase("none");
        }, 950);
        return () => clearTimeout(t4);
      }, 100);
      return () => clearTimeout(t3);
    }, 9000);

    return () => {
      if (typingTimer) clearTimeout(typingTimer);
      clearTimeout(skipTimer);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [phase]);

  const skipIntro = () => {
    localStorage.setItem("astroclub_intro_last_played", Date.now().toString());
    setPhase("black");
    setTimeout(() => {
      setOverlayOpacity(0);
      setTimeout(() => {
        setPhase("none");
      }, 950);
    }, 600);
  };

  const heroFadeStart = screenHeight * 0.20;
  const heroFadeEnd = screenHeight * 0.55;
  const heroOpacity = scrollOffset <= heroFadeStart
    ? 1
    : scrollOffset >= heroFadeEnd
      ? 0
      : 1 - (scrollOffset - heroFadeStart) / (heroFadeEnd - heroFadeStart);

  return (
    <>
      <div
        className="fixed inset-0 z-[100] overflow-hidden"
        style={{
          backgroundColor: phase === "black" ? "#000000" : "#020617",
          opacity: overlayOpacity,
          transition: phase === "black" ? "opacity 0.9s ease-out" : "none",
          pointerEvents: phase === "none" ? "none" : "all",
        }}
      >
        <IntroCanvas phase={phase} />

        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px] opacity-35 z-20" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)] z-20" />

        <div
          className="absolute inset-0 flex flex-col items-start justify-center p-6 md:px-16 gap-0.5 select-none z-10"
          style={{
            opacity: phase === "telemetry" ? 1 : 0,
            transition: "opacity 1s ease-out",
            pointerEvents: "none",
            fontFamily: "'Share Tech Mono', monospace",
          }}
        >
          <div className="w-full max-w-5xl">
            {printedLines.map((line, idx) => (
              <div
                key={idx}
                className="flex items-center leading-snug tracking-wide"
                style={{
                  fontFamily: line.startsWith("==") || line.startsWith("CCASS") || line.startsWith("ASTRONOMY") || line.startsWith("WELCOME") || line.startsWith("CLEAR") || line.startsWith("UPLINK")
                    ? "'VT323', monospace"
                    : "'Share Tech Mono', monospace",
                  fontSize: line.startsWith("CCASS") || line.startsWith("ASTRONOMY") || line.startsWith("WELCOME") || line.startsWith("CLEAR") || line.startsWith("UPLINK")
                    ? "1.35rem"
                    : line.startsWith("==")
                    ? "1.1rem"
                    : "0.8rem",
                  color: line.startsWith("[ OK ]") ? "#4ade80"
                    : line.startsWith("[ INFO ]") ? "#67e8f9"
                    : line.startsWith("==") ? "#334155"
                    : line.startsWith("CCASS") ? "#a7f3d0"
                    : line.startsWith("CLEAR") ? "#4ade80"
                    : "#6ee7b7",
                  textShadow: "0 0 8px currentColor",
                }}
              >
                <span>{line}</span>
                {idx === printedLines.length - 1 && (
                  <span className="w-[2px] h-[1em] bg-emerald-400 animate-[pulse_0.8s_infinite] ml-1.5 shrink-0 inline-block" />
                )}
              </div>
            ))}
          </div>
        </div>

        {showSkip && phase !== "black" && (
          <button
            onClick={skipIntro}
            className="absolute bottom-6 right-6 px-4 py-1.5 rounded border border-emerald-900/60 bg-black/40 text-[11px] text-emerald-500 hover:text-emerald-300 hover:border-emerald-700/80 transition-all cursor-pointer select-none z-30 backdrop-blur-sm"
            style={{ fontFamily: "'Share Tech Mono', monospace" }}
          >
            [ SKIP ENTRY SEQUENCE ]
          </button>
        )}
      </div>

      <div
        className="fixed inset-0 pointer-events-none z-0 transition-transform duration-75 ease-out"
        style={{
          transform: `scale(${1.15 + Math.min(scrollOffset * 0.0004, 0.5)})`,
          opacity: Math.max(0.25, 1 - scrollOffset * 0.0006)
        }}
      >
        <StarfieldCanvas />
      </div>

      <section className="relative w-full min-h-[85vh] py-8 md:py-12 overflow-hidden flex items-center border-b border-slate-900/40">
        <div
          className="relative w-full max-w-7xl mx-auto px-4 md:px-6 z-20 flex flex-col-reverse lg:flex-row items-center justify-between gap-10 transition-all duration-75 ease-out"
          style={{
            transform: `translateY(${scrollOffset * 0.22}px) scale(${Math.max(0.9, 1 - scrollOffset * 0.0006)})`,
            opacity: heroOpacity
          }}
        >
          <div className="w-full lg:max-w-2xl text-left">
            <span className="text-[10px] font-bold tracking-[0.4em] text-cyan-400 uppercase block mb-3">
              Official Student Observatory Collective
            </span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.15]">
              Witness the Unseen.<br />
              <span className="bg-gradient-to-r from-slate-400 via-slate-100 to-slate-500 bg-clip-text text-transparent">Beyond the Stars.</span>
            </h1>
            <p className="text-sm md:text-base text-slate-400 leading-relaxed max-w-2xl mb-8">
              A student collective trading sleep for photons. We grind mirrors, write tracking algorithms, and align optics to bring deep space down to campus rooftops. From nebulas to rocket launches, we explore it together.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/request"
                className="rounded-lg bg-white px-5 py-3 text-xs font-semibold text-slate-950 transition-all hover:bg-slate-200 hover:scale-[1.02] shadow-lg shadow-white/5 active:scale-[0.98]"
              >
                Request Observation
              </Link>
              <Link
                href="/about"
                className="rounded-lg border border-slate-800 bg-slate-950/50 px-5 py-3 text-xs font-semibold text-slate-300 backdrop-blur-sm transition-all hover:border-slate-700 hover:text-white active:scale-[0.98]"
              >
                Meet The Crew
              </Link>
            </div>
          </div>

          <div className="w-full lg:w-auto flex justify-center">
            <OrbitingPlanetCanvas />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-950 to-transparent z-10 pointer-events-none" />
      </section>
    </>
  );
}
