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
    desc: "Captured by Madhav Gupta using a custom aligned tracker rig at the CCASS observation camp. Explores the glowing ionized hydrogen emission fields in the constellation Cassiopeia.",
    url: "/images/nebula_core_1782850389800.png"
  },
  {
    title: "Saturn Opposition",
    desc: "Tracked during the planetary alignment phase. Features distinct Cassini division separation in the ring system.",
    url: "/images/saturn_real_1782856388535.png"
  },
  {
    title: "Lunar Highlands Transit",
    desc: "High contrast crater mapping of the Tycho impact basin captured using a motorized equatorial mount.",
    url: "/images/saturn_side_view_1782858094608.png"
  }
];

const SkeletonCard = () => (
  <div className="animate-pulse rounded-2xl border border-slate-900 bg-slate-900/30 p-6">
    <div className="h-44 rounded-lg bg-slate-900 mb-4" />
    <div className="h-4 bg-slate-900 rounded w-3/4 mb-2" />
    <div className="h-3 bg-slate-900 rounded w-1/2" />
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* COLUMN 1: NASA APOD (7 Cols) */}
      <motion.section 
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="lg:col-span-7 flex flex-col"
      >
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
      </motion.section>

      {/* COLUMN 2: Stella Nocturna & Session Request (5 Cols) */}
      <motion.section 
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="lg:col-span-5 flex flex-col h-full"
      >
        <SectionTitle>Observation Deck</SectionTitle>

        <div className="rounded-xl border border-slate-900 bg-slate-950/40 p-6 backdrop-blur-md shadow-xl shadow-black/20 flex flex-col justify-between flex-grow min-h-[340px] transition-all hover:border-slate-800/80">
          <div>
            <span className="text-[10px] font-bold tracking-[0.25em] text-slate-500 uppercase">Weekend Sessions</span>
            <h3 className="text-lg font-bold text-white mt-1 mb-4">
              Stella Nocturna
            </h3>
            
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
      </motion.section>
    </div>
  );
}
