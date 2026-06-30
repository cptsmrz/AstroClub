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
    title: "Super Admin",
    description: "Oversees all club operations, manages core permissions, and acts as the primary liaison with the university."
  },
  {
    title: "Tech Head",
    description: "Maintains all observatory equipment, handles telescope calibration, and leads technical workshops."
  },
  {
    title: "Vice President",
    description: "Coordinates event logistics, manages sponsorships, and steps in to lead during the President's absence."
  },
  {
    title: "General Secretary",
    description: "Handles documentation, meeting minutes, membership drives, and internal communications."
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

    // Fetch NASA APOD
    const fetchApod = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_NASA_API_KEY || "DEMO_KEY";
        const res = await fetch(
          `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`
        );
        if (!res.ok) throw new Error("Failed to fetch APOD");
        const data = await res.json();
        setApod(data);
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
    <h2 className="text-3xl font-bold tracking-tight text-white mb-10">
      {children}
    </h2>
  );

  const SkeletonCard = () => (
    <div className="animate-pulse rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
      <div className="h-40 rounded-lg bg-slate-800 mb-4" />
      <div className="h-4 bg-slate-800 rounded w-3/4 mb-2" />
      <div className="h-3 bg-slate-800 rounded w-1/2" />
    </div>
  );

  return (
    <>
      {/* Option B: Dynamic Zooming Starfield Wrapper */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 transition-transform duration-75 ease-out"
        style={{ 
          transform: `scale(${1 + Math.min(scrollOffset * 0.0015, 0.6)})`,
          opacity: Math.max(0.25, 1 - scrollOffset * 0.0008)
        }}
      >
        <StarfieldCanvas />
      </div>

      {/* SECTION 1: Integrated Hero Parallax (Option B zoom/fade transitions + Option C 3D Saturn Canvas) */}
      <section className="relative w-full min-h-[90vh] py-12 md:py-16 overflow-hidden flex items-center border-b border-slate-900/50">
        
        <div 
          className="relative w-full max-w-7xl mx-auto px-4 md:px-8 z-20 flex flex-col-reverse lg:flex-row items-center justify-between gap-12 transition-all duration-75 ease-out"
          style={{ 
            transform: `translateY(${scrollOffset * 0.25}px) scale(${Math.max(0.88, 1 - scrollOffset * 0.0008)})`,
            opacity: Math.max(0, 1 - scrollOffset * 0.0018)
          }}
        >
          {/* Hero Landing Text */}
          <div className="w-full lg:max-w-2xl text-left">
            <span className="text-xs font-bold tracking-[0.3em] text-cyan-400 uppercase block mb-3">
              Center for Cosmology, Astrophysics & Space Science
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
              Witness the Unseen.<br />
              <span className="bg-gradient-to-r from-slate-400 via-slate-200 to-slate-500 bg-clip-text text-transparent">Beyond the Stars.</span>
            </h1>
            <p className="text-base md:text-lg text-slate-400 leading-relaxed max-w-2xl mb-8">
              Welcome to the official portal of **AstroClub at GLA University, Mathura**. 
              We are a community of stargazers, telescope designers, and student researchers. 
              We custom-build high-precision optical instruments to bring the deep cosmos closer to home.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/request"
                className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition-all hover:bg-slate-200 hover:scale-[1.02] shadow-lg shadow-white/5 active:scale-[0.98]"
              >
                Request Observation Session
              </Link>
              <Link 
                href="/about"
                className="rounded-lg border border-slate-800 bg-slate-950/55 px-6 py-3 text-sm font-semibold text-slate-300 backdrop-blur-sm transition-all hover:border-slate-700 hover:text-white active:scale-[0.98]"
              >
                Meet the Crew
              </Link>
            </div>
          </div>

          {/* Option C: 3D Holographic Projected Saturn & Moons */}
          <div className="w-full lg:w-auto flex justify-center">
            <OrbitingPlanetCanvas />
          </div>

        </div>

        {/* Bottom Fade Gradient to blend with content background */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 to-transparent z-10 pointer-events-none" />
      </section>

      {/* Main Page Content Wrapper */}
      <div className="flex flex-col gap-24 pb-24 relative z-10 px-4 md:px-8 max-w-7xl mx-auto">
        
        {/* NASA APOD Section */}
        <section>
          <div className="mb-8">
            <span className="text-xs font-bold tracking-[0.25em] text-slate-500 uppercase">Daily Cosmic Focus</span>
            <h2 className="text-3xl font-bold tracking-tight text-white mt-2">
              Astronomy Picture of the Day
            </h2>
          </div>

          {apodLoading ? (
            <SkeletonCard />
          ) : apod ? (
            <div className="max-w-4xl rounded-2xl border border-slate-800/80 bg-slate-900/45 overflow-hidden shadow-2xl shadow-black/35 backdrop-blur-sm">
              <div className="relative h-72 md:h-96 w-full bg-slate-900">
                <img
                  src={apod.url}
                  alt={apod.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">
                    {apod.title}
                  </h3>
                  <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase bg-slate-800/60 px-3 py-1 rounded-full border border-slate-700/50">
                    NASA APOD
                  </span>
                </div>
                <div className="relative">
                  <p
                    className={`text-slate-400 leading-relaxed transition-all duration-300 ${
                      !isExpanded ? "line-clamp-3" : ""
                    }`}
                  >
                    {apod.explanation}
                  </p>
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-3 text-sm font-semibold text-white hover:text-slate-300 transition-colors flex items-center gap-1"
                  >
                    {isExpanded ? "Show less" : "Read more"}
                    <span>{isExpanded ? "↑" : "↓"}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-slate-500">Failed to load Astronomy Picture of the Day.</p>
          )}
        </section>

        {/* SECTION 2: Stargazing Sessions (Stella Nocturna) */}
        <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/35 p-8 md:p-10 backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-800/10 rounded-full blur-3xl -z-10 pointer-events-none" />
          <div className="max-w-3xl">
            <span className="text-xs font-bold tracking-[0.25em] text-slate-500 uppercase">Weekly Observation Sessions</span>
            <h2 className="text-3xl font-bold tracking-tight text-white mt-2 mb-4">
              Stella Nocturna
            </h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              Join us every weekend on the university premises for celestial tracking. Witness satellites transit, spot bright constellations, and view deep-sky objects up close. 
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 text-sm">
              <div className="flex items-start gap-3">
                <span className="text-xl select-none">📍</span>
                <div>
                  <h4 className="font-semibold text-white">Location</h4>
                  <p className="text-slate-400">Basketball Ground, GLA University Campus</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl select-none">⏰</span>
                <div>
                  <h4 className="font-semibold text-white">Schedule</h4>
                  <p className="text-slate-400">Fridays & Saturdays, 5:00 PM onwards</p>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:col-span-2">
                <span className="text-xl select-none">✨</span>
                <div>
                  <h4 className="font-semibold text-white">Observation Scope</h4>
                  <p className="text-slate-400">
                    Starlink satellite trains, meteor showers, seasonal constellations, Venus, Jupiter, and Saturn.
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/request"
              className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-slate-200"
            >
              Book Observation Session
            </Link>
          </div>
        </section>

        {/* SECTION 3: About Us & Club Roles */}
        <section>
          <SectionTitle>Core Leadership</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CLUB_ROLES.map((role) => (
              <div
                key={role.title}
                className="group rounded-2xl border border-slate-800 bg-slate-900/35 p-6 transition-all hover:border-slate-700 hover:bg-slate-900/60 backdrop-blur-sm"
              >
                <h3 className="text-lg font-semibold text-white mb-3">
                  {role.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {role.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: Telescope Inventory */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
                Handcrafted Instrument Catalog
              </h2>
              <p className="text-slate-400 text-lg">
                AstroClub members custom-make our own high-precision telescopes and optical rigs.
              </p>
            </div>
            <Link
              href="/equipment"
              className="text-sm font-semibold text-slate-400 hover:text-white transition-colors self-start md:self-auto"
            >
              Explore full catalog →
            </Link>
          </div>

          {teleLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : telescopes.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/20 py-16 text-center px-4">
              <span className="text-4xl mb-3 select-none">🛠️</span>
              <p className="text-slate-400 text-lg font-medium">Custom instruments cataloguing in progress</p>
              <p className="text-slate-600 text-sm mt-1">Our engineering team is actively measuring optical tolerances.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {telescopes.map((tele) => (
                <div
                  key={tele.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/35 overflow-hidden transition-all hover:border-slate-700 backdrop-blur-sm"
                >
                  <div className="h-48 w-full bg-slate-900">
                    {tele.image_url ? (
                      <img
                        src={tele.image_url}
                        alt={tele.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-700 bg-slate-950/40">
                        <span className="text-3xl select-none">🔭</span>
                        <span className="text-xs uppercase tracking-widest font-medium text-slate-500">Handcrafted</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">GLA Custom Rig</span>
                    <h3 className="text-lg font-semibold text-white mt-1 mb-2">
                      {tele.name}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">
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