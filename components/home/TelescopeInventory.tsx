"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import SectionTitle from "@/components/home/SectionTitle";

interface Telescope {
  id?: string;
  name: string;
  specs: Record<string, unknown> | null | string;
  image_url?: string | null;
}

const SkeletonCard = () => (
  <div className="glass-panel animate-pulse p-6">
    <div className="h-48 rounded-xl bg-slate-800/50 mb-6" />
    <div className="h-5 bg-slate-800/50 rounded-md w-3/4 mb-3" />
    <div className="h-3 bg-slate-800/50 rounded-md w-1/2" />
  </div>
);

export default function TelescopeInventory() {
  const [telescopes, setTelescopes] = useState<Telescope[]>([]);
  const [teleLoading, setTeleLoading] = useState(true);

  useEffect(() => {
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

    fetchTelescopes();
  }, []);

  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full mt-8"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <SectionTitle>Handcrafted Instruments</SectionTitle>
          <p className="text-slate-400 text-sm md:text-base mt-2 font-body max-w-xl">
            AstroClub members custom-make our own high-precision telescopes and optical rigs.
          </p>
        </div>
        <Link
          href="/equipment"
          className="group text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-widest flex items-center gap-2 whitespace-nowrap bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800/50"
        >
          Full Catalog 
          <span className="transform transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>

      {teleLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : telescopes.length === 0 ? (
        <div className="glass-panel flex flex-col items-center justify-center py-16 text-center px-4">
          <span className="text-4xl mb-4 select-none drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">🔭</span>
          <p className="text-slate-400 text-sm font-medium tracking-wide">Instruments inventory cataloguing in progress</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {telescopes.map((tele, index) => {
            const fallbackImages = [
              "/images/telescope1.jpg",
              "/images/telescope2.jpg"
            ];
            const displayImage = tele.image_url || fallbackImages[index % fallbackImages.length];

            return (
            <div
              key={tele.id}
              className="glass-panel group overflow-hidden flex flex-col"
            >
              <div className="h-56 w-full relative overflow-hidden bg-slate-950">
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt={tele.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                    <span className="text-4xl select-none opacity-50 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">🔭</span>
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full z-10">
                   <span className="text-[9px] uppercase tracking-widest font-bold text-cyan-400">Handcrafted</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] to-transparent opacity-80" />
              </div>
              <div className="p-6 md:p-8 flex-grow flex flex-col relative z-10 -mt-6">
                <span className="text-[10px] font-bold tracking-[0.25em] text-slate-500 uppercase font-mono">GLA Custom Rig</span>
                <h3 className="text-xl font-bold text-white mt-1 mb-3 tracking-tight">
                  {tele.name}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed font-body line-clamp-3">
                  {typeof tele.specs === 'object'
                    ? Object.entries(tele.specs || {}).map(([k, v]) => `${k}: ${v}`).join(' • ')
                    : tele.specs}
                </p>
              </div>
            </div>
            );
          })}
        </div>
      )}
    </motion.section>
  );
}
