"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StatsSection from "@/components/home/StatsSection";
import LeadershipCard from "@/components/home/LeadershipCard";
import HeroSection from "@/components/home/HeroSection";
import TelemetryGrid from "@/components/home/TelemetryGrid";
import AstroGallery from "@/components/home/AstroGallery";
import TelescopeInventory from "@/components/home/TelescopeInventory";
import SectionTitle from "@/components/home/SectionTitle";

// --- Type Definitions ---
interface RoleInfo {
  title: string;
  name: string;
  year: string;
  branch: string;
  linkedin?: string;
  nebula: string;
  github?: string;
  instagram?: string;
}

const CLUB_ROLES: RoleInfo[] = [
  {
    title: "President",
    name: "Aditi Sharma",
    year: "Batch '26",
    branch: "B.Tech CS AIML",
    nebula: "/images/observatory_silhouette_1782850434886.png",
    linkedin: "https://www.linkedin.com/in/aditi-sharma-6bb23133b/"
  },
  {
    title: "Vice President",
    name: "Dhruv Tigunayak",
    year: "Batch '26",
    branch: "B.Tech CSE",
    nebula: "/images/satellite_1782850416840.png",
    linkedin: "https://www.linkedin.com/in/dhruv-tigunayak-349a82326/"
  },
  {
    title: "General Secretary",
    name: "Paritosh Kumar Mishra",
    year: "Batch '26",
    branch: "B.Tech CSE",
    nebula: "/images/pinterest_pin.jpg",
    linkedin: "https://www.linkedin.com/in/paritosh-kumar-mishra-451484351/"
  },
  {
    title: "Technical Head",
    name: "Sarthak Rathode",
    year: "Batch '26",
    branch: "B.Tech CSE",
    nebula: "/images/media__1782735749757.jpg"
  }
];

export default function HomePage() {
  const [scrollOffset, setScrollOffset] = useState(0);

  // --- Scroll Tracking ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleScroll = () => setScrollOffset(window.scrollY);
      handleScroll();
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  return (
    <>
      <HeroSection scrollOffset={scrollOffset} />

      {/* Dynamic Fading Container for lower page content */}
      <div className="flex flex-col gap-16 py-16 relative z-10 px-4 md:px-6 max-w-7xl mx-auto w-full">
        {/* STATS STRIP */}
        <StatsSection />

        {/* TWO-COLUMN TELEMETRY GRID */}
        <TelemetryGrid />

        {/* SECTION 1.8: Club Work Grid Scroller */}
        <AstroGallery />

        {/* SECTION 2: Core Leadership */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="border-t border-slate-900 pt-10"
        >
          <SectionTitle>Core Leadership</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CLUB_ROLES.map((role) => (
              <LeadershipCard key={role.title} role={role} />
            ))}
          </div>
        </motion.section>

        {/* SECTION 2.5: AstroAcademy Full-Width Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="border-t border-slate-900 pt-10"
        >
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
        </motion.section>

        {/* SECTION 3: Telescope Inventory */}
        <TelescopeInventory />

      </div>
    </>
  );
}