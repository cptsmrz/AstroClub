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
    <span ref={ref} className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-2 bg-gradient-to-br from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
      {displayValue}{suffix}
    </span>
  );
};

export default function StatsSection() {
  const stats = [
    { value: 40, suffix: "+", label: "Active Members" },
    { value: 12, suffix: "+", label: "Telemetry Sessions" },
    { value: 3, suffix: "", label: "Telescopes Built" },
    { value: 2024, suffix: "", label: "Established Since" }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full glass-panel"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 w-full p-1 relative z-10">
        {stats.map((stat, i) => (
          <div 
            key={stat.label} 
            className={`flex flex-col items-center justify-center text-center p-6 md:p-8 
              ${i !== 3 ? 'md:border-r border-white/5' : ''} 
              ${(i === 0 || i === 1) ? 'max-md:border-b border-white/5' : ''}
              ${(i % 2 === 0) ? 'max-md:border-r border-white/5' : ''}
              hover:bg-white/[0.02] transition-colors duration-300
            `}
          >
            <AnimatedNumber value={stat.value} suffix={stat.suffix} />
            <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase font-sans mt-2 group-hover:text-cyan-400 transition-colors">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
