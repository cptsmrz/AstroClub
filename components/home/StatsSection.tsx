"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

const AnimatedNumber = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const incrementTime = 30;
      const totalSteps = Math.ceil(duration / incrementTime);
      const increment = (end - start) / totalSteps;

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setDisplayValue(end);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.ceil(start));
        }
      }, incrementTime);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref} className="text-3xl font-bold tracking-tight text-white mb-1 bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
      {displayValue}{suffix}
    </span>
  );
};

export default function StatsSection() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full border border-slate-900 bg-slate-950/30 backdrop-blur-md rounded-2xl p-6 shadow-xl shadow-black/20"
    >
      <div className="flex flex-col items-center justify-center text-center p-4 border-r border-slate-900/60 last:border-0 max-md:even:border-r-0 max-md:[&:nth-child(2)]:border-r-0 max-md:border-b max-md:pb-4 md:border-b-0">
        <AnimatedNumber value={40} suffix="+" />
        <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase font-mono mt-1">Active Members</span>
      </div>
      <div className="flex flex-col items-center justify-center text-center p-4 border-r border-slate-900/60 last:border-0 max-md:border-b max-md:pb-4 md:border-b-0">
        <AnimatedNumber value={12} suffix="+" />
        <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase font-mono mt-1">Telemetry Sessions</span>
      </div>
      <div className="flex flex-col items-center justify-center text-center p-4 border-r border-slate-900/60 last:border-0 max-md:even:border-r-0 max-md:pt-4 md:pt-4 md:border-b-0">
        <AnimatedNumber value={3} />
        <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase font-mono mt-1">Telescopes Built</span>
      </div>
      <div className="flex flex-col items-center justify-center text-center p-4 last:border-0 max-md:pt-4 md:pt-4">
        <AnimatedNumber value={2024} />
        <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase font-mono mt-1">Established Since</span>
      </div>
    </motion.div>
  );
}
