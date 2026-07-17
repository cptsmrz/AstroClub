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

      {/* Dynamic Fading Container for lower page content with massive negative space */}
      <div className="flex flex-col gap-32 py-32 relative z-10 px-4 md:px-6 max-w-7xl mx-auto w-full">
        {/* STATS STRIP */}
        <StatsSection />

        {/* SECTION 1.8: Club Work Grid Scroller */}
        <AstroGallery />

        {/* SECTION 2: Core Leadership */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="pt-10 flex flex-col items-center justify-center w-full"
        >
          <div className="w-full text-center flex flex-col items-center">
             <SectionTitle>Core Leadership</SectionTitle>
             <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-center italic mt-4 mb-16">
               "For small creatures such as we the vastness is bearable only through love." — Carl Sagan
             </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 w-full max-w-6xl">
            {CLUB_ROLES.map((role, i) => (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className={i % 2 === 0 ? "lg:mt-0" : "lg:mt-16"}
              >
                <LeadershipCard role={role} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </>
  );
}