"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import StarfieldCanvas from "@/components/StarfieldCanvas";
import OrbitingPlanetCanvas from "@/components/OrbitingPlanetCanvas";
import IntroCanvas, { type IntroPhase } from "@/components/IntroCanvas";

// --- Type Definitions ---
interface ApodData {
  url: string;
  thumbnail_url?: string;
  title: string;
  explanation: string;
  media_type?: string;
  date?: string;
}

interface CatalogItem {
  title: string;
  desc: string;
  url: string;
}

const CLUB_CATALOG: CatalogItem[] = [
  {
    title: "The Heart Nebula (IC 1805)",
    desc: "Captured by Madhav Gupta using a custom aligned tracker rig at the CCASS observation camp. Explores the glowing ionized hydrogen emission fields in the constellation Cassiopeia.",
    url: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Orion's Stellar Forge (M42)",
    desc: "A wide-field deep exposure of the Orion Nebula, showing massive gas bands and the central Trapezium cluster. Calibrated and processed by our astrophotography leads.",
    url: "https://images.unsplash.com/photo-1538370965046-79c0d6907d47?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Lunar Mare Imbrium",
    desc: "Close-up high-resolution lunar details captured using our handcrafted 8-inch Newtonian Reflector telescope on campus.",
    url: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=1200&auto=format&fit=crop"
  }
];

interface Telescope {
  id?: string;
  name: string;
  specs: Record<string, unknown> | null | string;
  image_url?: string | null;
}

interface RoleInfo {
  title: string;
  name: string;
  year: string;
  branch: string;
  linkedin?: string;
  nebula: string;
}

const CLUB_ROLES: RoleInfo[] = [
  {
    title: "President",
    name: "Aditi Sharma ☀️",
    year: "Batch '25",
    branch: "B.Tech CS AIML",
    linkedin: "https://www.linkedin.com/in/aditi-sharma-6bb23133b/",
    // Lagoon Nebula — vivid magenta/teal
    nebula: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "Vice President",
    name: "Dhruv Tigunayak 🪐",
    year: "Batch '25",
    branch: "B.Tech ECSE",
    linkedin: "https://www.linkedin.com/in/dhruv-tigunayak-349a82326/",
    // Crab Nebula / deep blue-violet supernova
    nebula: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "General Secretary",
    name: "Paritosh Kumar Mishra 🌍",
    year: "Batch '25",
    branch: "B.Tech CS",
    linkedin: "https://www.linkedin.com/in/paritosh-kumar-mishra-451484351/",
    // Orion Nebula — amber/emerald gas clouds
    nebula: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "Technical Head",
    name: "Sarthak Rathode 🌙",
    year: "Batch '25",
    branch: "B.Tech CS",
    linkedin: "", // LinkedIn not provided
    // Eagle Nebula / Pillars of Creation — purple-pink
    nebula: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=600&auto=format&fit=crop"
  }
];

// Full-card nebula background component
const NebulaBackground = ({ src }: { src: string }) => (
  <div className="absolute inset-0 pointer-events-none select-none overflow-hidden rounded-xl">
    <img
      src={src}
      alt=""
      loading="lazy"
      className="w-full h-full object-cover opacity-25 scale-105 group-hover:opacity-35 group-hover:scale-110 transition-all duration-700"
    />
    {/* Heavy bottom gradient to protect text legibility */}
    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
    {/* Side vignette */}
    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 to-transparent" />
  </div>
);

const EVENT_IMAGES = [
  { 
    url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600", 
    title: "Observatory Night Setup", 
    desc: "Setting up our custom refractor rigs at the campus field." 
  },
  { 
    url: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=600", 
    title: "Astrophotography Lab", 
    desc: "Processing stellar coordinates and long-exposure deep space frames." 
  },
  { 
    url: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=600", 
    title: "Instrumentation Workshop", 
    desc: "Grinding mirrors and calibrating Newtonian optical components." 
  },
  { 
    url: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=600", 
    title: "Public Viewing Session", 
    desc: "Inviting university freshmen to trace lunar craters and planet positions." 
  }
];

const SectionTitle = ({ children, actions }: { children: React.ReactNode; actions?: React.ReactNode }) => (
  <div className="flex items-center justify-between mb-6 border-b border-slate-900 pb-3">
    <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
      {children}
    </h2>
    {actions}
  </div>
);

const SkeletonCard = () => (
  <div className="animate-pulse rounded-2xl border border-slate-900 bg-slate-900/30 p-6">
    <div className="h-44 rounded-lg bg-slate-900 mb-4" />
    <div className="h-4 bg-slate-900 rounded w-3/4 mb-2" />
    <div className="h-3 bg-slate-900 rounded w-1/2" />
  </div>
);

export default function HomePage() {
  const [scrollOffset, setScrollOffset] = useState(0);
  const [screenHeight, setScreenHeight] = useState(1080);

  // --- Intro Sequence State ---
  // Single phase drives everything. Overlay div is ALWAYS mounted so React never causes a DOM jolt.
  const [phase, setPhase] = useState<IntroPhase>("telemetry");
  const [printedLines, setPrintedLines] = useState<string[]>([]);
  const [showSkip, setShowSkip] = useState(false);
  // overlayOpacity: 1 = fully black, 0 = fully transparent (homepage visible)
  const [overlayOpacity, setOverlayOpacity] = useState(1);

  // --- Club Work Scroll Ref ---
  const clubWorkScrollRef = useRef<HTMLDivElement>(null);

  // --- Leadership Collapsible State ---
  const [expandedRoles, setExpandedRoles] = useState<Record<string, boolean>>({});

  const toggleRole = (title: string) => {
    setExpandedRoles(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const scrollClubWork = (direction: "left" | "right") => {
    if (clubWorkScrollRef.current) {
      const offset = direction === "left" ? -350 : 350;
      clubWorkScrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  // Production daily play tracking (runs once a day, checks localStorage)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const lastPlayed = localStorage.getItem("astroclub_intro_last_played");
      if (lastPlayed && Date.now() - parseInt(lastPlayed, 10) < 86400000) {
        setPhase("none");
        setOverlayOpacity(0);
      }
    }
  }, []);

  // Prevent scroll during intro sequence
  useEffect(() => {
    if (phase !== "none") {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [phase]);

  useEffect(() => {
    if (phase === "none") return;

    // ── TELEMETRY LINES ──────────────────────────────────────────────────────
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

    // ── Typewriter scheduler ──────────────────────────────────────────────────
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

    // Show skip button after 4 s
    const skipTimer = setTimeout(() => setShowSkip(true), 4000);

    // ── Phase transitions ─────────────────────────────────────────────────────
    // 0 s  → telemetry starts
    // 5 s  → matrix rain starts
    // 11 s → phase = "black" (solid black overlay, star map already live under it)
    // 12 s → overlay starts fading out (0.9 s CSS transition)
    // 12.9 s → overlay fully transparent, phase = "none", hero fades in

    const t1 = setTimeout(() => setPhase("matrix"), 5000);

    const t2 = setTimeout(() => {
      setPhase("black");
      localStorage.setItem("astroclub_intro_last_played", Date.now().toString());

      // After 0.1 s → start fading the overlay (fade starts at 11.1 s)
      const t3 = setTimeout(() => {
        setOverlayOpacity(0); // CSS transition takes 0.9 s

        // After the 0.9 s fade → mark complete
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

  // --- State: NASA APOD ---
  const [apod, setApod] = useState<ApodData | null>(null);
  const [apodLoading, setApodLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  // --- State: Telescope Inventory ---
  const [telescopes, setTelescopes] = useState<Telescope[]>([]);
  const [teleLoading, setTeleLoading] = useState(true);

  // --- Data Fetching & Scroll Tracking ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => setScreenHeight(window.innerHeight);
      const handleScroll = () => setScrollOffset(window.scrollY);

      handleResize();
      handleScroll();

      window.addEventListener("resize", handleResize);
      window.addEventListener("scroll", handleScroll, { passive: true });

      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  // Fetch NASA APOD with localStorage caching
  useEffect(() => {
    const fetchApod = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];

        // Try to load from localStorage cache first
        if (typeof window !== "undefined") {
          const cached = localStorage.getItem("astroclub_apod_cache");
          if (cached) {
            const parsed = JSON.parse(cached);
            // Self-heal: clear prior corrupted fallback caches
            if (parsed.title === "Vistas of the Deep Cosmos") {
              localStorage.removeItem("astroclub_apod_cache");
            } else if (parsed.date === today) {
              setApod(parsed);
              setApodLoading(false);
              return;
            }
          }
        }

        const res = await fetch("/api/apod");
        const data = await res.json();

        if (!res.ok) {
          // If the server returned the 502 fallback payload, use it but do not cache it!
          if (data.title === "Vistas of the Deep Cosmos") {
            setApod({
              url: data.url,
              thumbnail_url: data.url,
              title: data.title,
              explanation: data.explanation,
              media_type: data.media_type || "image"
            });
            return;
          }
          throw new Error("Failed to fetch APOD");
        }

        const payload: ApodData = {
          url: data.url,
          thumbnail_url: data.thumbnail_url,
          title: data.title,
          explanation: data.explanation,
          media_type: data.media_type,
          date: today
        };

        setApod(payload);
        if (typeof window !== "undefined") {
          localStorage.setItem("astroclub_apod_cache", JSON.stringify(payload));
        }
      } catch (error) {
        console.error("APOD Load Error:", error);
      } finally {
        setApodLoading(false);
      }
    };

    const fetchTelescopes = async () => {
      try {
        const { data, error } = await supabase
          .from("telescopes")
          .select("*")
          .order("name");

        if (error) throw error;
        setTelescopes(data || []);
      } catch (error) {
        console.error("Supabase Telescopes Error:", error);
      } finally {
        setTeleLoading(false);
      }
    };

    fetchApod();
    fetchTelescopes();
  }, []);

  // Custom scroll linked opacities
  const heroFadeStart = screenHeight * 0.20;
  const heroFadeEnd = screenHeight * 0.55;
  const heroOpacity = scrollOffset <= heroFadeStart
    ? 1
    : scrollOffset >= heroFadeEnd
      ? 0
      : 1 - (scrollOffset - heroFadeStart) / (heroFadeEnd - heroFadeStart);

  const contentFadeStart = screenHeight * 0.30;
  const contentFadeEnd = screenHeight * 0.65;
  const contentOpacity = scrollOffset <= contentFadeStart
    ? 1
    : scrollOffset >= contentFadeEnd
      ? 1
      : 1;



  return (
    <>
      {/*
       * ALWAYS-MOUNTED intro overlay.
       * pointer-events are blocked when phase is "none" so the homepage is interactive.
       * opacity is driven by overlayOpacity state + CSS transition — no DOM mount/unmount,
       * no jolt, no layout reflow.
       */}
      <div
        className="fixed inset-0 z-[100] overflow-hidden"
        style={{
          backgroundColor: phase === "black" ? "#000000" : "#020617",
          opacity: overlayOpacity,
          transition: phase === "black" ? "opacity 0.9s ease-out" : "none",
          pointerEvents: phase === "none" ? "none" : "all",
        }}
      >

        {/* Matrix rain canvas — always mounted, only draws when phase===matrix */}
        <IntroCanvas phase={phase} />

        {/* CRT scanline + vignette overlays */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px] opacity-35 z-20" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)] z-20" />

        {/* Typewriter telemetry logs — VT323 CRT font, fade out when entering matrix phase */}
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

        {/* Skip button */}
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



      {/* Background Starfield Canvas */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-transform duration-75 ease-out"
        style={{
          transform: `scale(${1.15 + Math.min(scrollOffset * 0.0004, 0.5)})`,
          opacity: Math.max(0.25, 1 - scrollOffset * 0.0006)
        }}
      >
        <StarfieldCanvas />
      </div>

      {/* SECTION 1: Integrated Hero Parallax (Split layout) */}
      <section className="relative w-full min-h-[85vh] py-8 md:py-12 overflow-hidden flex items-center border-b border-slate-900/40">
        <div
          className="relative w-full max-w-7xl mx-auto px-4 md:px-6 z-20 flex flex-col-reverse lg:flex-row items-center justify-between gap-10 transition-all duration-75 ease-out"
          style={{
            transform: `translateY(${scrollOffset * 0.22}px) scale(${Math.max(0.9, 1 - scrollOffset * 0.0006)})`,
            opacity: heroOpacity
          }}
        >
          {/* Hero Landing Text */}
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

          {/* Saturn Image Card */}
          <div className="w-full lg:w-auto flex justify-center">
            <OrbitingPlanetCanvas />
          </div>
        </div>

        {/* Bottom Fade Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-950 to-transparent z-10 pointer-events-none" />
      </section>

      {/* Dynamic Fading Container for lower page content */}
      <div 
        className="transition-opacity duration-300 flex flex-col gap-16 py-16 relative z-10 px-4 md:px-6 max-w-7xl mx-auto w-full"
        style={{ opacity: contentOpacity }}
      >
        {/* STATS STRIP */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full border border-slate-900 bg-slate-950/30 backdrop-blur-md rounded-2xl p-6 shadow-xl shadow-black/20">
          <div className="flex flex-col items-center justify-center text-center p-4 border-r border-slate-900/60 last:border-0 max-md:even:border-r-0 max-md:[&:nth-child(2)]:border-r-0 max-md:border-b max-md:pb-4 md:border-b-0">
            <span className="text-3xl font-bold tracking-tight text-white mb-1 bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">40+</span>
            <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase font-mono">Active Members</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center p-4 border-r border-slate-900/60 last:border-0 max-md:border-b max-md:pb-4 md:border-b-0">
            <span className="text-3xl font-bold tracking-tight text-white mb-1 bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">12+</span>
            <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase font-mono">Telemetry Sessions</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center p-4 border-r border-slate-900/60 last:border-0 max-md:even:border-r-0 max-md:pt-4 md:pt-4 md:border-b-0">
            <span className="text-3xl font-bold tracking-tight text-white mb-1 bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">3</span>
            <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase font-mono">Telescopes Built</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center p-4 last:border-0 max-md:pt-4 md:pt-4">
            <span className="text-3xl font-bold tracking-tight text-white mb-1 bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">2024</span>
            <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase font-mono">Established Since</span>
          </div>
        </div>

        {/* TWO-COLUMN TELEMETRY GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLUMN 1: NASA APOD (7 Cols) */}
          <section className="lg:col-span-7 flex flex-col">
            <SectionTitle>Daily Cosmic Focus
              <span className="ml-auto text-[10px] font-bold tracking-widest text-slate-500 uppercase bg-slate-900/50 px-3 py-1 rounded-full border border-slate-800 font-mono">NASA APOD</span>
            </SectionTitle>

            {apodLoading ? (
              <SkeletonCard />
            ) : apod ? (
              (() => {
                const catalogIndex = new Date().getDate() % CLUB_CATALOG.length;
                const catalogItem = CLUB_CATALOG[catalogIndex];
                const isVideo = apod.media_type === "video";
                return (
                  <div className="rounded-xl border border-slate-900 bg-slate-950/40 overflow-hidden shadow-xl shadow-black/20 backdrop-blur-md transition-all hover:border-slate-800/80">
                    <div className="relative h-60 md:h-80 w-full bg-slate-900/40">
                      {isVideo ? (
                        <a
                          href={apod.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full h-full relative group cursor-pointer"
                        >
                          <img
                            src={apod.thumbnail_url || catalogItem.url}
                            alt={apod.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                          />
                          {/* Banner overlay for video notification */}
                          <div className="absolute inset-x-0 bottom-0 bg-slate-950/85 backdrop-blur-sm border-t border-slate-900 px-4 py-3 flex items-center justify-between z-20 text-[11px]">
                            <span className="text-slate-350 flex items-center gap-1.5 font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                              📹 Today&apos;s NASA APOD is a video. Tap to view.
                            </span>
                            <span className="text-cyan-400 font-semibold uppercase tracking-wider text-[10px]">
                              Watch Video →
                            </span>
                          </div>
                        </a>
                      ) : (
                        <img
                          src={apod.url}
                          alt={apod.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="p-5 md:p-6">
                      <h3 className="text-lg font-semibold text-white mb-2 leading-snug">
                        {apod.title}
                      </h3>
                      
                      {isVideo && (
                        <div className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-3">
                          NASA Video Link
                        </div>
                      )}
 
                      <div className="relative">
                        <p
                          className={`text-xs md:text-sm text-slate-400 leading-relaxed transition-all duration-300 ${
                            !isExpanded ? "line-clamp-3" : ""
                          }`}
                        >
                          {apod.explanation}
                        </p>
                        <button
                          onClick={() => setIsExpanded(!isExpanded)}
                          className="mt-3 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
                        >
                          {isExpanded ? "Show less" : "Read more"}
                          <span>{isExpanded ? "↑" : "↓"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : (
              <p className="text-slate-500 text-xs">Failed to load Astronomy Picture of the Day.</p>
            )}
          </section>

          {/* COLUMN 2: Stella Nocturna & Session Request (5 Cols) */}
          <section className="lg:col-span-5 flex flex-col h-full">
            <SectionTitle>Observation Deck</SectionTitle>

            <div className="rounded-xl border border-slate-900 bg-slate-950/40 p-6 backdrop-blur-md shadow-xl shadow-black/20 flex flex-col justify-between flex-grow min-h-[340px] transition-all hover:border-slate-800/80">
              <div>
                <span className="text-[10px] font-bold tracking-[0.25em] text-slate-500 uppercase">Weekend Sessions</span>
                <h3 className="text-lg font-bold text-white mt-1 mb-4">
                  Stella Nocturna
                </h3>
                
                {/* 3 Punchy Gen-Z Bullet Points */}
                <div className="space-y-4 mb-6 text-xs md:text-sm">
                  <div className="flex items-start gap-3 group">
                    <span className="text-base select-none shrink-0 group-hover:scale-110 transition-transform">🌌</span>
                    <div>
                      <h4 className="font-semibold text-slate-200">Zero Cost Stargazing</h4>
                      <p className="text-[11px] text-slate-450 mt-0.5">Free public observation camps. Just bring curiosity.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 group">
                    <span className="text-base select-none shrink-0 group-hover:scale-110 transition-transform">🔭</span>
                    <div>
                      <h4 className="font-semibold text-slate-200">Handcrafted Gear Only</h4>
                      <p className="text-[11px] text-slate-450 mt-0.5">Operate student-built Newtonian reflector scopes.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 group">
                    <span className="text-base select-none shrink-0 group-hover:scale-110 transition-transform">🛰️</span>
                    <div>
                      <h4 className="font-semibold text-slate-200">Satellite Tracking</h4>
                      <p className="text-[11px] text-slate-450 mt-0.5">Map constellations and trace live satellite trains.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3.5 text-xs md:text-sm mb-8 pt-4 border-t border-slate-900/60">
                  <div className="flex items-start gap-3">
                    <span className="text-xs text-slate-500 shrink-0 select-none">📍</span>
                    <div>
                      <p className="text-[11px] text-slate-400">Basketball Court, GLA University Campus</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-xs text-slate-500 shrink-0 select-none">⏰</span>
                    <div>
                      <p className="text-[11px] text-slate-400">Fridays & Saturdays, 5:00 PM onwards</p>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                href="/request"
                className="w-full text-center rounded-lg bg-white px-4 py-2.5 text-xs font-semibold text-slate-950 transition-all hover:bg-slate-200 active:scale-[0.99] hover:scale-[1.01]"
              >
                Book Session Ticket
              </Link>
            </div>


          </section>
        </div>

        {/* SECTION 1.8: Club Work Grid Scroller */}
        <section className="w-full border-t border-slate-900 pt-10">
          <SectionTitle
            actions={
              <div className="flex gap-2">
                <button 
                  onClick={() => scrollClubWork('left')}
                  className="p-1.5 rounded-lg border border-slate-850 bg-slate-950/40 text-slate-400 hover:text-white hover:border-slate-700 transition-all active:scale-95 cursor-pointer hover:bg-slate-900/35"
                  aria-label="Scroll left"
                >
                  ←
                </button>
                <button 
                  onClick={() => scrollClubWork('right')}
                  className="p-1.5 rounded-lg border border-slate-850 bg-slate-950/40 text-slate-400 hover:text-white hover:border-slate-700 transition-all active:scale-95 cursor-pointer hover:bg-slate-900/35"
                  aria-label="Scroll right"
                >
                  →
                </button>
              </div>
            }
          >
            Club Work
          </SectionTitle>
          <div 
            ref={clubWorkScrollRef}
            className="grid grid-flow-col auto-cols-[280px] sm:auto-cols-[340px] gap-6 overflow-x-auto pb-4 custom-scrollbar snap-x scroll-smooth"
          >
            {EVENT_IMAGES.map((img, i) => (
              <div 
                key={i} 
                className="snap-start rounded-xl border border-slate-900 bg-slate-950/40 overflow-hidden group hover:border-slate-800 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                  <img 
                    src={img.url} 
                    alt={img.title} 
                    loading="lazy" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none" />
                  <span className="absolute bottom-3 left-4 text-[9px] font-mono font-bold text-cyan-400 uppercase tracking-widest bg-slate-950/80 px-2.5 py-0.5 rounded border border-slate-900">
                    EVENT 0{i + 1}
                  </span>
                </div>
                <div className="p-4">
                  <h4 className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors mb-1">
                    {img.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {img.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>



        {/* SECTION 2: Core Leadership */}
        <section className="border-t border-slate-900 pt-10">
          <SectionTitle>Core Leadership</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CLUB_ROLES.map((role) => (
              <div
                key={role.title}
                className="group rounded-xl border border-slate-900 bg-slate-950 p-5 transition-all hover:border-slate-700/60 backdrop-blur-md flex flex-col justify-between relative overflow-hidden min-h-[170px] shadow-lg shadow-black/30"
              >
                {/* Full-card nebula background */}
                <NebulaBackground src={role.nebula} />

                <div className="relative z-10 flex flex-col gap-3">
                  {/* Post badge */}
                  <span className="text-[9px] font-bold font-mono tracking-[0.22em] text-cyan-400/80 uppercase">
                    {role.title}
                  </span>

                  {/* Name */}
                  <p className="text-base font-bold text-white leading-tight group-hover:text-cyan-300 transition-colors drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                    {role.name}
                  </p>

                  {/* Year & Branch */}
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] text-slate-300 font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                      {role.year}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                      {role.branch}
                    </span>
                  </div>

                  {/* LinkedIn — shown when URL is set */}
                  {role.linkedin ? (
                    <a
                      href={role.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-cyan-400 transition-colors group/link"
                      aria-label={`${role.name} on LinkedIn`}
                    >
                      <svg className="w-3 h-3 fill-current shrink-0" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      <span className="group-hover/link:underline underline-offset-2">LinkedIn</span>
                    </a>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2.5: AstroAcademy Full-Width Section */}
        <section className="border-t border-slate-900 pt-10">
          <div className="rounded-xl border border-indigo-900/40 bg-gradient-to-r from-slate-950/60 to-indigo-950/20 p-8 backdrop-blur-md shadow-xl shadow-indigo-950/10 transition-all hover:border-indigo-850/50 relative overflow-hidden">
            {/* Indigo subtle radial highlight */}
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
              <div className="max-w-2xl">
                <span className="text-[10px] font-bold tracking-[0.25em] text-indigo-400 uppercase bg-indigo-950/50 px-3 py-1 rounded-full border border-indigo-900/30">
                  AstroAcademy Lectures
                </span>
                <h3 className="text-2xl font-bold text-white mt-4 mb-3">
                  Astronomy Class Deck
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Our core academic lecture curriculum covering deep space physics, coordinates, and optical mechanics. Unconditional entry. From freshers taking their first steps to PhD scholars auditing celestial telemetry.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 shrink-0 w-full md:max-w-md">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-950/40 border border-slate-900">
                  <span className="text-xl select-none shrink-0">📚</span>
                  <div>
                    <h4 className="font-semibold text-slate-200 text-xs">ASTR 101 & ASTR 102</h4>
                    <p className="text-[11px] text-slate-450 mt-0.5 font-mono">Core academic lectures covering orbital physics and mirror alignment.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-950/40 border border-slate-900">
                  <span className="text-xl select-none shrink-0">🎓</span>
                  <div>
                    <h4 className="font-semibold text-slate-200 text-xs">Open to All</h4>
                    <p className="text-[11px] text-slate-450 mt-0.5 font-mono">Unconditional entry for all undergraduate and graduate years.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-4 border-t border-indigo-950/40 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>CURRICULUM: ACTIVE</span>
              <span className="text-indigo-400">Classroom: CCASS Lab</span>
            </div>
          </div>
        </section>

        {/* SECTION 3: Telescope Inventory */}
        <section className="border-t border-slate-900 pt-10">
            <SectionTitle>Handcrafted Instruments</SectionTitle>
              <p className="text-slate-400 text-xs md:text-sm -mt-4 mb-6">
                AstroClub members custom-make our own high-precision telescopes and optical rigs.
              </p>
            <div className="flex justify-end mb-2">
              <Link
                href="/equipment"
                className="text-xs font-semibold text-slate-500 hover:text-slate-355 transition-colors uppercase tracking-wider"
              >
                Full Catalog →
              </Link>
            </div>

          {teleLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : telescopes.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-900 bg-slate-955/20 py-12 text-center px-4">
              <span className="text-3xl mb-2 select-none">🔭</span>
              <p className="text-slate-400 text-sm font-medium">Instruments inventory cataloguing in progress</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {telescopes.map((tele) => (
                <div
                  key={tele.id}
                  className="group rounded-xl border border-slate-905 bg-slate-955/40 overflow-hidden transition-all hover:border-slate-800/80 backdrop-blur-md"
                >
                  <div className="h-44 w-full bg-slate-900/40 overflow-hidden">
                    {tele.image_url ? (
                      <img
                        src={tele.image_url}
                        alt={tele.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-800 bg-slate-955/50">
                        <span className="text-3xl select-none">🔭</span>
                        <span className="text-[10px] uppercase tracking-widest font-semibold text-slate-600">Handcrafted</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <span className="text-[9px] font-bold tracking-[0.2em] text-slate-500 uppercase">GLA Custom Rig</span>
                    <h3 className="text-sm font-bold text-white mt-1 mb-2">
                      {tele.name}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {typeof tele.specs === 'object'
                        ? Object.entries(tele.specs || {}).map(([k, v]) => `${k}: ${v}`).join(', ')
                        : tele.specs}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </>
  );
}