"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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

      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="relative w-full max-w-7xl mx-auto px-6 z-20 flex flex-col-reverse lg:flex-row items-center justify-between gap-12 transition-all duration-75 ease-out mt-16 lg:mt-0"
          style={{
            transform: `translateY(${scrollOffset * 0.22}px) scale(${Math.max(0.9, 1 - scrollOffset * 0.0006)})`,
            opacity: heroOpacity
          }}
        >
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="w-full lg:max-w-3xl text-left"
          >
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-[11px] font-bold tracking-[0.3em] text-cyan-600 dark:text-cyan-400 uppercase block mb-4 border-l-2 border-cyan-600 dark:border-cyan-400 pl-3"
            >
              Official Student Observatory Collective
            </motion.span>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-slate-900 dark:text-white mb-6 leading-[1.1] font-sans">
              Rage Against<br />
              <span className="bg-gradient-to-r from-cyan-500 to-indigo-600 dark:from-cyan-300 dark:via-indigo-300 dark:to-slate-100 bg-clip-text text-transparent">The Dying of the Light.</span>
            </h1>
            
            <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mb-10 font-body opacity-90">
              <span className="italic block mb-3 font-serif">"I, a universe of atoms, an atom in the universe." — Richard Feynman.</span>
              We are a collective trading sleep for photons, standing on a pale blue dot. We build optics to stare into the abyss of time and bring the majesty of the cosmos down to earth. We do not go gentle into that good night.
            </p>

            <div className="flex flex-wrap gap-5">
              <Link
                href="/request"
                className="group relative overflow-hidden rounded-xl bg-slate-900 dark:bg-white px-8 py-4 text-sm font-bold text-white dark:text-slate-950 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg dark:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-slate-900 dark:from-cyan-200 dark:to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center gap-2">
                  Request Observation
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </span>
              </Link>
              
              <Link
                href="/events"
                className="group rounded-xl border border-slate-300 dark:border-slate-700/50 bg-slate-100/50 dark:bg-slate-900/30 backdrop-blur-md px-8 py-4 text-sm font-bold text-slate-900 dark:text-slate-200 transition-all hover:bg-slate-200 dark:hover:bg-slate-800/50 hover:border-cyan-500/30 active:scale-[0.98]"
              >
                <span className="flex items-center gap-2">
                  View Events Archive
                </span>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
            className="w-full lg:w-auto flex justify-center scale-90 lg:scale-100 pointer-events-none"
          >
            <OrbitingPlanetCanvas />
          </motion.div>
        </div>

        {/* Cinematic gradient fade at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none transition-colors duration-500" />
      </section>
    </>
  );
}
