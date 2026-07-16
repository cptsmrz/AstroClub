"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import SectionTitle from "@/components/home/SectionTitle";

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
    desc: "Captured by Madhav Gupta using a custom aligned tracker rig at the CCASS observation camp.",
    url: "/images/nebula_core_1782850389800.png"
  },
  {
    title: "Saturn Opposition",
    desc: "Tracked during the planetary alignment phase. Features distinct Cassini division separation.",
    url: "/images/saturn_real_1782856388535.png"
  },
  {
    title: "Lunar Highlands Transit",
    desc: "High contrast crater mapping of the Tycho impact basin captured using a motorized equatorial mount.",
    url: "/images/saturn_side_view_1782858094608.png"
  }
];

const SkeletonCard = () => (
  <div className="glass-panel animate-pulse p-6 h-full min-h-[400px]">
    <div className="h-44 rounded-xl bg-slate-800/50 mb-6" />
    <div className="h-6 bg-slate-800/50 rounded-md w-3/4 mb-4" />
    <div className="h-4 bg-slate-800/50 rounded-md w-1/2" />
  </div>
);

export default function TelemetryGrid() {
  const [apod, setApod] = useState<ApodData | null>(null);
  const [apodLoading, setApodLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchApod = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        if (typeof window !== "undefined") {
          const cachedStr = localStorage.getItem("astroclub_apod_cache");
          if (cachedStr) {
            const cached = JSON.parse(cachedStr);
            if (cached.date === today && cached.url) {
              setApod(cached);
              setApodLoading(false);
              return;
            }
          }
        }

        const res = await fetch("/api/apod");
        const data = await res.json();

        if (!res.ok) {
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

    fetchApod();
  }, []);

  return (
    <div className="w-full">
      <SectionTitle>Global Telemetry</SectionTitle>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
        {/* COLUMN 1: NASA APOD (7 Cols) */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-7 flex flex-col"
        >
          {apodLoading ? (
            <SkeletonCard />
          ) : apod ? (
            (() => {
              const catalogIndex = new Date().getDate() % CLUB_CATALOG.length;
              const catalogItem = CLUB_CATALOG[catalogIndex];
              const isVideo = apod.media_type === "video";
              return (
                <div className="glass-panel group overflow-hidden h-full flex flex-col">
                  <div className="relative h-64 md:h-80 w-full overflow-hidden">
                    {isVideo ? (
                      <a
                        href={apod.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full h-full relative cursor-pointer"
                      >
                        <img
                          src={apod.thumbnail_url || catalogItem.url}
                          alt={apod.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100">
                           <div className="w-16 h-16 rounded-full bg-cyan-500/80 backdrop-blur-md flex items-center justify-center text-white font-bold tracking-widest text-xs uppercase shadow-[0_0_30px_rgba(6,182,212,0.6)]">
                             PLAY
                           </div>
                        </div>
                      </a>
                    ) : (
                      <img
                        src={apod.url}
                        alt={apod.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="text-[10px] font-bold tracking-widest text-cyan-300 uppercase bg-slate-900/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-cyan-500/30 font-sans shadow-lg shadow-black/50">
                        NASA APOD
                      </span>
                    </div>
                  </div>
                  <div className="p-6 md:p-8 flex-grow flex flex-col">
                    <h3 className="text-2xl font-bold text-white mb-3 font-sans tracking-tight">
                      {apod.title}
                    </h3>
                    
                    <div className="relative flex-grow">
                      <p
                        className={`text-sm text-slate-300 leading-relaxed font-body transition-all duration-300 ${
                          !isExpanded ? "line-clamp-4" : ""
                        }`}
                      >
                        {apod.explanation}
                      </p>
                      <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="mt-4 text-xs font-bold uppercase tracking-wider text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-2"
                      >
                        {isExpanded ? "Minimize" : "Read Database"}
                        <span className={`transform transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>↓</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="glass-panel p-8 flex items-center justify-center">
              <p className="text-slate-500 text-sm">Telemetry feed offline.</p>
            </div>
          )}
        </motion.div>

        {/* COLUMN 2: Stella Nocturna & Session Request (5 Cols) */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
          className="lg:col-span-5 flex flex-col"
        >
          <div className="glass-panel p-8 h-full flex flex-col relative overflow-hidden group">
            {/* Background subtle glow */}
            <div className="absolute -right-24 -top-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none transition-all duration-500 group-hover:bg-cyan-500/10" />
            
            <span className="text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase font-sans">Public Sessions</span>
            <h3 className="text-3xl font-bold text-white mt-2 mb-6 tracking-tight">
              Stella Nocturna
            </h3>
            
            <div className="space-y-6 mb-8 flex-grow">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-xl shrink-0">🌌</div>
                <div>
                  <h4 className="font-bold text-slate-100 text-sm">Zero Cost Stargazing</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">Free public observation camps. Just bring curiosity.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-xl shrink-0">🔭</div>
                <div>
                  <h4 className="font-bold text-slate-100 text-sm">Handcrafted Gear</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">Operate student-built Newtonian reflector scopes.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-xl shrink-0">🛰️</div>
                <div>
                  <h4 className="font-bold text-slate-100 text-sm">Satellite Tracking</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">Map constellations and trace live satellite trains.</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-8 pt-6 border-t border-white/10">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <p className="text-xs text-slate-300 font-medium">Basketball Court, GLA University</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                <p className="text-xs text-slate-300 font-medium">Fridays & Saturdays, 5:00 PM</p>
              </div>
            </div>

            <Link
              href="/request"
              className="w-full relative overflow-hidden rounded-xl bg-white px-6 py-4 text-sm font-bold text-slate-950 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center group/btn"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-200 to-white opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10">Book Session Ticket</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
