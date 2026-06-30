"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import StarfieldCanvas from "@/components/StarfieldCanvas";
import OrbitingPlanetCanvas from "@/components/OrbitingPlanetCanvas";

// --- Type Definitions ---
interface ApodData {
  url: string;
  title: string;
  explanation: string;
}

interface Telescope {
  id?: string;
  name: string;
  specs: any;
  image_url: string | null;
}

// --- Static Data ---
const CLUB_ROLES = [
  {
    title: "President",
    description: "Oversees club operations, manages core permissions, and coordinates with GLA administration."
  },
  {
    title: "Technical Head",
    description: "Maintains observatory equipment, leads calibration, and runs technical instrumentation workshops."
  },
  {
    title: "Vice President",
    description: "Coordinates event logistics, manages sponsorships, and handles external relations."
  },
  {
    title: "General Secretary",
    description: "Manages club records, schedules observation logs, and directs internal communications."
  }
];

export default function HomePage() {
  const [scrollOffset, setScrollOffset] = useState(0);

  // --- State: NASA APOD ---
  const [apod, setApod] = useState<ApodData | null>(null);
  const [apodLoading, setApodLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  // --- State: Telescope Inventory ---
  const [telescopes, setTelescopes] = useState<Telescope[]>([]);
  const [teleLoading, setTeleLoading] = useState(true);

  // --- Data Fetching & Scroll Tracking ---
  useEffect(() => {
    const handleScroll = () => {
      setScrollOffset(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Fetch NASA APOD with localStorage caching
    const fetchApod = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];

        // Try to load from localStorage cache first
        if (typeof window !== "undefined") {
          const cached = localStorage.getItem("astroclub_apod_cache");
          if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed.date === today) {
              setApod(parsed);
              setApodLoading(false);
              return;
            }
          }
        }

        const res = await fetch("/api/apod");
        if (!res.ok) throw new Error("Failed to fetch APOD");
        const data = await res.json();

        const payload = {
          date: today,
          title: data.title,
          url: data.url,
          explanation: data.explanation
        };

        setApod(payload);

        // Save to cache
        if (typeof window !== "undefined") {
          localStorage.setItem("astroclub_apod_cache", JSON.stringify(payload));
        }
      } catch (error) {
        console.error("NASA APOD Error:", error);
        setApod({
          title: "Vistas of the Deep Cosmos",
          url: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1200&auto=format&fit=crop",
          explanation: "Exploring the cosmos from our own backyard. Our club connects stargazers and space enthusiasts to the beauty of the universe, bringing deep space closer through observations, discussions, and shared discovery."
        });
      } finally {
        setApodLoading(false);
      }
    };

    // Fetch Telescopes from Supabase
    const fetchTelescopes = async () => {
      try {
        const { data, error } = await supabase
          .from("telescopes")
          .select("*");

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

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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

  return (
    <>
      {/* Option B: Dynamic Zooming Starfield Wrapper with 15% Edge Buffer */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-transform duration-75 ease-out"
        style={{
          transform: `scale(${1.15 + Math.min(scrollOffset * 0.0004, 0.5)})`,
          opacity: Math.max(0.25, 1 - scrollOffset * 0.0006)
        }}
      >
        <StarfieldCanvas />
      </div>

      {/* SECTION 1: Integrated Hero Parallax (Restructured split layout) */}
      <section className="relative w-full min-h-[85vh] py-8 md:py-12 overflow-hidden flex items-center border-b border-slate-900/40">

        <div
          className="relative w-full max-w-7xl mx-auto px-4 md:px-6 z-20 flex flex-col-reverse lg:flex-row items-center justify-between gap-10 transition-all duration-75 ease-out"
          style={{
            transform: `translateY(${scrollOffset * 0.22}px) scale(${Math.max(0.9, 1 - scrollOffset * 0.0006)})`,
            opacity: Math.max(0, 1 - scrollOffset * 0.0016)
          }}
        >
          {/* Hero Landing Text */}
          <div className="w-full lg:max-w-2xl text-left">
            <span className="text-[10px] font-bold tracking-[0.4em] text-cyan-400 uppercase block mb-3">
              Center for Cosmology, Astrophysics & Space Science
            </span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.15]">
              Witness the Unseen.<br />
              <span className="bg-gradient-to-r from-slate-400 via-slate-100 to-slate-500 bg-clip-text text-transparent">Beyond the Stars.</span>
            </h1>
            <p className="text-sm md:text-base text-slate-400 leading-relaxed max-w-2xl mb-8">
              Welcome to AstroClub, GLA University, Mathura.
              We are a community of student researchers, engineers, and stargazers building our own optical telescopes to bring deep-space observation closer to Earth.
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

          {/* Option C: Clean Saturn Image Card */}
          <div className="w-full lg:w-auto flex justify-center">
            <OrbitingPlanetCanvas />
          </div>

        </div>

        {/* Bottom Fade Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-950 to-transparent z-10 pointer-events-none" />
      </section>

      {/* Main Page Content Wrapper (Restructured into Telemetry Dashboard Grid) */}
      <div className="flex flex-col gap-16 py-16 relative z-10 px-4 md:px-6 max-w-7xl mx-auto">

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
              <div className="rounded-xl border border-slate-900 bg-slate-950/40 overflow-hidden shadow-xl shadow-black/20 backdrop-blur-md transition-all hover:border-slate-800/80">
                <div className="relative h-60 md:h-80 w-full bg-slate-900/40">
                  <img
                    src={apod.url}
                    alt={apod.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 md:p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    {apod.title}
                  </h3>
                  <div className="relative">
                    <p
                      className={`text-xs md:text-sm text-slate-400 leading-relaxed transition-all duration-300 ${!isExpanded ? "line-clamp-3" : ""
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
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed mb-6">
                  Join us every weekend for celestial tracking. Observe satellites, map constellations, and view deep-sky bodies up close.
                </p>

                <div className="space-y-4 text-xs md:text-sm mb-8">
                  <div className="flex items-start gap-3">
                    <span className="text-base select-none">📍</span>
                    <div>
                      <h4 className="font-semibold text-slate-300">Location</h4>
                      <p className="text-slate-400">Basketball Ground, GLA University Campus</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-base select-none">⏰</span>
                    <div>
                      <h4 className="font-semibold text-slate-300">Schedule</h4>
                      <p className="text-slate-400">Fridays & Saturdays, 5:00 PM onwards</p>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                href="/request"
                className="w-full text-center rounded-lg bg-white px-4 py-2.5 text-xs font-semibold text-slate-950 transition-colors hover:bg-slate-200 active:scale-[0.99]"
              >
                Book Session Ticket
              </Link>
            </div>
          </section>

        </div>

        {/* SECTION 2: Core Leadership */}
        <section>
          <SectionTitle>Core Leadership</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CLUB_ROLES.map((role) => (
              <div
                key={role.title}
                className="group rounded-xl border border-slate-900 bg-slate-950/40 p-5 transition-all hover:border-slate-800/80 hover:bg-slate-900/30 backdrop-blur-md"
              >
                <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wide">
                  {role.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {role.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: Telescope Inventory */}
        <section>
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
              className="text-xs font-semibold text-slate-500 hover:text-slate-300 transition-colors self-start md:self-auto"
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
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-900 bg-slate-950/20 py-12 text-center px-4">
              <span className="text-3xl mb-2 select-none">🔭</span>
              <p className="text-slate-400 text-sm font-medium">Instruments inventory cataloguing in progress</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {telescopes.map((tele) => (
                <div
                  key={tele.id}
                  className="group rounded-xl border border-slate-900 bg-slate-950/40 overflow-hidden transition-all hover:border-slate-800/80 backdrop-blur-md"
                >
                  <div className="h-44 w-full bg-slate-900/40 overflow-hidden">
                    {tele.image_url ? (
                      <img
                        src={tele.image_url}
                        alt={tele.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-800 bg-slate-950/50">
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