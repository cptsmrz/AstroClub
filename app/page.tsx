"use client";

import { useState, useEffect } from "react";
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
  description: string;
}

const CLUB_ROLES: RoleInfo[] = [
  {
    title: "President",
    name: "Aditi Sharma ☀️",
    description: "3rd Year, B.Tech CS AIML. Serves as the official representative, provides strategic direction, co-approves membership applications, and holds final decision-making and equipment approval authority."
  },
  {
    title: "Vice President",
    name: "Dhruv Tigunayak 🪐",
    description: "3rd Year, B.Tech ECSE. Maintains internal operational stability, coordinates cross-functional activities, secures administrative permissions, manages conflict resolution, and co-approves membership/equipment access."
  },
  {
    title: "General Secretary",
    name: "Paritosh Kumar Mishra 🌍",
    description: "3rd Year, B.Tech CS. Maintains official club records and correspondence, tracks membership database and attendance, ensures policy compliance, and co-approves membership/equipment access."
  },
  {
    title: "Technical Head",
    name: "Sarthak Rathore 🌙",
    description: "3rd Year, B.Tech CS. Serves as the unified head of technical operations, coordinating the website, design, and content teams, and ensuring digital infrastructure maintenance and security."
  }
];

const getRoleBackground = (title: string) => {
  let imageUrl = "";
  switch (title) {
    case "President":
      imageUrl = "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=300"; // NASA Sun solar flare close-up
      break;
    case "Vice President":
      imageUrl = "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=300"; // NASA Chandra supernova remnants (White Hole representation)
      break;
    case "General Secretary":
      imageUrl = "https://images.unsplash.com/photo-1462332420958-a05d1e002413?q=80&w=300"; // NASA Hubble accretion disk (Black Hole representation)
      break;
    case "Technical Head":
      imageUrl = "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=300"; // NASA Active galactic nucleus / Quasar jet
      break;
    default:
      return null;
  }

  return (
    <div className="absolute -right-2 -bottom-2 w-32 h-32 opacity-40 pointer-events-none select-none overflow-hidden rounded-br-xl">
      <img 
        src={imageUrl} 
        alt="" 
        loading="lazy"
        className="w-full h-full object-cover" 
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/10 to-transparent" />
    </div>
  );
};

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

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-2xl font-bold tracking-tight text-white mb-6 border-b border-slate-900 pb-3 flex items-center gap-2">
    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
    {children}
  </h2>
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
  const [showFullscreenModal, setShowFullscreenModal] = useState(false);
  // overlayOpacity: 1 = fully black, 0 = fully transparent (homepage visible)
  const [overlayOpacity, setOverlayOpacity] = useState(1);

  // Auto-request fullscreen on load
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } catch (err) {
        console.log("Fullscreen deferred:", err);
      }
    };
    enterFullscreen();
  }, []);

  // Production daily play tracking (commented out for testing — runs every refresh)
  /*
  useEffect(() => {
    const lastPlayed = localStorage.getItem("astroclub_intro_last_played");
    if (lastPlayed && Date.now() - parseInt(lastPlayed, 10) < 86400000) {
      setPhase("none");
      setOverlayOpacity(0);
    }
  }, []);
  */

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
          if (document.fullscreenElement) setShowFullscreenModal(true);
        }, 950);

        return () => clearTimeout(t4);
      }, 100);

      return () => clearTimeout(t3);
    }, 11000);

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
        if (document.fullscreenElement) setShowFullscreenModal(true);
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
    ? 0.15
    : scrollOffset >= contentFadeEnd
      ? 1
      : 0.15 + (0.85 * (scrollOffset - contentFadeStart)) / (contentFadeEnd - contentFadeStart);



  return (
    <>
      {/*
       * ALWAYS-MOUNTED intro overlay.
       * pointer-events are blocked when phase is "none" so the homepage is interactive.
       * opacity is driven by overlayOpacity state + CSS transition — no DOM mount/unmount,
       * no jolt, no layout reflow.
       */}
      <div
        className="fixed inset-0 z-[100] bg-black overflow-hidden"
        style={{
          opacity: overlayOpacity,
          transition: phase === "black" ? "opacity 0.9s ease-out" : "none",
          pointerEvents: phase === "none" ? "none" : "all",
        }}
      >
        {/* Matrix rain canvas — always mounted, only draws when phase===matrix */}
        <IntroCanvas phase={phase} />

        {/* CRT scanline + vignette overlays */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px] opacity-35 z-20" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.5)_100%)] z-20" />

        {/* Typewriter telemetry logs — fade out when entering matrix phase */}
        <div
          className="absolute inset-0 flex flex-col items-start justify-center p-6 md:px-16 gap-1 font-mono text-emerald-500 select-none z-10"
          style={{
            opacity: phase === "telemetry" ? 1 : 0,
            transition: "opacity 1s ease-out",
            pointerEvents: "none",
          }}
        >
          <div className="w-full max-w-5xl">
            {printedLines.map((line, idx) => (
              <div key={idx} className="text-xs md:text-sm tracking-wider flex items-center leading-relaxed font-semibold">
                <span>{line}</span>
                {idx === printedLines.length - 1 && (
                  <span className="w-1.5 h-3.5 bg-emerald-500 animate-[pulse_1s_infinite] ml-1.5 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Skip button */}
        {showSkip && phase !== "black" && (
          <button
            onClick={skipIntro}
            className="absolute bottom-6 right-6 px-4 py-1.5 rounded border border-emerald-900/60 bg-emerald-950/20 text-[10px] font-bold text-emerald-600 hover:text-emerald-400 hover:border-emerald-700/80 transition-all cursor-pointer select-none z-30"
          >
            [ SKIP ENTRY SEQUENCE ]
          </button>
        )}
      </div>

      {/* Fullscreen Stay/Exit Selection Modal (Shown after the intro sequence finishes) */}
      {showFullscreenModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="bg-slate-950/90 border border-slate-900 rounded-xl p-8 max-w-md w-full text-center space-y-6 font-mono text-xs shadow-2xl">
            <span className="text-cyan-400 font-bold uppercase tracking-widest text-[9px] bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-900/30">
              Telemetry Uplink Complete
            </span>
            <h4 className="text-sm font-semibold text-white tracking-wide">AstroClub Portal Live</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Uplink succeeded. Would you like to keep the immersive widescreen fullscreen telemetry mode active for this session?
            </p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => setShowFullscreenModal(false)}
                className="px-4 py-2 border border-emerald-900 bg-emerald-950/20 text-emerald-500 hover:text-emerald-400 hover:bg-emerald-950/40 rounded transition-all cursor-pointer font-bold"
              >
                [ KEEP FULLSCREEN ]
              </button>
              <button 
                onClick={async () => {
                  try {
                    if (document.exitFullscreen) {
                      await document.exitFullscreen();
                    }
                  } catch (err) {
                    console.log("Exit fullscreen failed:", err);
                  }
                  setShowFullscreenModal(false);
                }}
                className="px-4 py-2 border border-slate-800 bg-slate-900/40 text-slate-400 hover:text-white hover:bg-slate-900/60 rounded transition-all cursor-pointer font-bold"
              >
                [ EXIT FULLSCREEN ]
              </button>
            </div>
          </div>
        </div>
      )}

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
        className="transition-opacity duration-300 flex flex-col gap-16 py-16 relative z-10 px-4 md:px-6 max-w-7xl mx-auto"
        style={{ opacity: contentOpacity }}
      >
        {/* TWO-COLUMN TELEMETRY GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLUMN 1: NASA APOD (7 Cols) */}
          <section className="lg:col-span-7 flex flex-col">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                Daily Cosmic Focus
              </h2>
              <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase bg-slate-900/50 px-3 py-1 rounded-full border border-slate-800">
                NASA APOD
              </span>
            </div>

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
            <h2 className="text-xl font-bold tracking-tight text-white mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              Observation Deck
            </h2>

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

            {/* AstroAcademy Card */}
            <div className="mt-6 rounded-xl border border-slate-900 bg-slate-950/40 p-6 backdrop-blur-md shadow-xl shadow-black/20 transition-all hover:border-slate-800/80">
              <span className="text-[10px] font-bold tracking-[0.25em] text-cyan-400 uppercase">AstroAcademy Lectures</span>
              <h3 className="text-lg font-bold text-white mt-1 mb-4">
                Astronomy Class Deck
              </h3>
              
              <div className="space-y-4 text-xs md:text-sm">
                <div className="flex items-start gap-3 group">
                  <span className="text-base select-none shrink-0 group-hover:scale-110 transition-transform">📚</span>
                  <div>
                    <h4 className="font-semibold text-slate-200">ASTR 101 & ASTR 102</h4>
                    <p className="text-[11px] text-slate-450 mt-0.5">
                      Our core academic lecture curriculum covering deep space physics, coordinates, and optical mechanics.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 group">
                  <span className="text-base select-none shrink-0 group-hover:scale-110 transition-transform">🎓</span>
                  <div>
                    <h4 className="font-semibold text-slate-200">Open to All</h4>
                    <p className="text-[11px] text-slate-450 mt-0.5">
                      Unconditional entry. From freshers taking their first steps to PhD scholars auditing celestial telemetry.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-900/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>CURRICULUM: ACTIVE</span>
                <span className="text-slate-400">Classroom: CCASS Lab</span>
              </div>
            </div>
          </section>
        </div>

        {/* SECTION 1.8: Club Work Marquee/Slider */}
        <section className="w-full border-t border-slate-900 pt-10">
          <SectionTitle>Club Work</SectionTitle>
          <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar snap-x scroll-smooth">
            {EVENT_IMAGES.map((img, i) => (
              <div 
                key={i} 
                className="min-w-[280px] sm:min-w-[340px] snap-start rounded-xl border border-slate-900 bg-slate-950/40 overflow-hidden group hover:border-slate-800 transition-all duration-300 flex flex-col justify-between"
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

        {/* SECTION 1.5: Mission Strip with expanded spacing */}
        <section className="relative w-full mb-4">
          <div className="rounded-2xl border border-slate-900 bg-slate-950/60 p-6 md:p-8 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl hover:border-slate-850 transition-all duration-300">
            <div className="flex items-center gap-4">
              <span className="text-3xl hidden sm:inline-block animate-pulse">✨</span>
              <div className="text-left">
                <span className="text-[10px] font-bold tracking-[0.25em] text-cyan-400 uppercase block mb-1">
                  Our Mandate
                </span>
                <p className="text-slate-200 text-sm md:text-base font-medium leading-relaxed">
                  A student-run astronomy collective at GLA University, Mathura — custom engineering optical telescopes and cataloging deep space.
                </p>
              </div>
            </div>
            <Link
              href="/about"
              className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-wider group"
            >
              <span>Learn More About Us</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </section>

        {/* SECTION 2: Core Leadership */}
        <section className="border-t border-slate-900 pt-10">
          <SectionTitle>Core Leadership</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CLUB_ROLES.map((role) => (
              <div
                key={role.title}
                className="group rounded-xl border border-slate-900 bg-slate-950/40 p-5 transition-all hover:border-slate-800/80 hover:bg-slate-900/30 backdrop-blur-md flex flex-col justify-between relative overflow-hidden"
              >
                {getRoleBackground(role.title)}
                <div className="relative z-10">
                  <h3 className="text-[10px] font-bold font-mono tracking-widest text-slate-500 mb-1.5 uppercase drop-shadow-[0_1.5px_3px_rgba(2,6,23,0.9)]">
                    {role.title}
                  </h3>
                  <p className="text-sm font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors drop-shadow-[0_1.5px_3px_rgba(2,6,23,0.9)]">
                    {role.name}
                  </p>
                  <p className="text-[11px] text-slate-300 leading-relaxed drop-shadow-[0_1.5px_3px_rgba(2,6,23,0.9)]">
                    {role.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: Telescope Inventory */}
        <section className="border-t border-slate-900 pt-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white mb-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                Handcrafted Instruments
              </h2>
              <p className="text-slate-400 text-xs md:text-sm">
                AstroClub members custom-make our own high-precision telescopes and optical rigs.
              </p>
            </div>
            <Link
              href="/equipment"
              className="text-xs font-semibold text-slate-500 hover:text-slate-355 transition-colors self-start md:self-auto uppercase tracking-wider"
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