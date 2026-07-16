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
  <div className="animate-pulse rounded-2xl border border-slate-900 bg-slate-900/30 p-6">
    <div className="h-44 rounded-lg bg-slate-900 mb-4" />
    <div className="h-4 bg-slate-900 rounded w-3/4 mb-2" />
    <div className="h-3 bg-slate-900 rounded w-1/2" />
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
      className="border-t border-slate-900 pt-10"
    >
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
    </motion.section>
  );
}
