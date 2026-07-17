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
    <span ref={ref} className="text-4xl md:text-5xl font-bold tracking-tighter text-slate-900 dark:text-white mb-2 bg-gradient-to-br from-cyan-600 via-indigo-600 to-slate-900 dark:from-white dark:via-slate-200 dark:to-cyan-400 bg-clip-text text-transparent drop-shadow-sm dark:drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
      {displayValue}{suffix}
    </span>
  );
};

export default function StatsSection() {
  const stats = [
    { value: 40, suffix: "+", label: "Active Members" },
    { value: 50, suffix: "+", label: "Telemetry Sessions" },
    { value: 10, suffix: "+", label: "Astrophysics Events & Talks" },
    { value: 2024, suffix: "", label: "Established Since", isStatic: true }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-12 w-full"
    >
      {stats.map((stat, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="bg-white/50 dark:bg-slate-900/40 border border-slate-900/10 dark:border-slate-800/60 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center hover:bg-slate-100/50 dark:hover:bg-slate-900/60 transition-colors rounded-xl shadow-lg dark:shadow-none"
        >
          {stat.isStatic ? (
            <span className="text-4xl md:text-5xl font-bold tracking-tighter text-slate-900 dark:text-white mb-2 bg-gradient-to-br from-cyan-600 via-indigo-600 to-slate-900 dark:from-white dark:via-slate-200 dark:to-cyan-400 bg-clip-text text-transparent drop-shadow-sm dark:drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              {stat.value}{stat.suffix}
            </span>
          ) : (
            <AnimatedNumber value={stat.value} suffix={stat.suffix} />
          )}
          <span className="text-sm font-bold tracking-[0.2em] text-slate-600 dark:text-slate-500 uppercase font-mono">{stat.label}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}
