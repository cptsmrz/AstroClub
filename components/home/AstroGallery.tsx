"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import SectionTitle from "@/components/home/SectionTitle";

const EVENT_IMAGES = [
  { 
    url: "/images/nebula_core_1782850389800.png", 
    title: "Observatory Night Setup", 
    desc: "Setting up our custom refractor rigs at the campus field." 
  },
  { 
    url: "/images/observatory_silhouette_1782850434886.png", 
    title: "Astrophotography Lab", 
    desc: "Processing stellar coordinates and long-exposure deep space frames." 
  },
  { 
    url: "/images/saturn_real_1782856388535.png", 
    title: "Instrumentation Workshop", 
    desc: "Grinding mirrors and calibrating Newtonian optical components." 
  },
  { 
    url: "/images/satellite_1782850416840.png", 
    title: "Public Viewing Session", 
    desc: "Inviting university freshmen to trace lunar craters and planet positions." 
  }
];

export default function AstroGallery() {
  const clubWorkScrollRef = useRef<HTMLDivElement>(null);

  const scrollClubWork = (direction: "left" | "right") => {
    if (clubWorkScrollRef.current) {
      const offset = direction === "left" ? -350 : 350;
      clubWorkScrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full border-t border-slate-900 pt-10"
    >
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
    </motion.section>
  );
}
