"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import SectionTitle from "@/components/home/SectionTitle";
import { useState, useEffect } from "react";

const EVENTS = [
  { 
    id: "stargazing-winter-arc-3.0",
    pathPrefix: "/images/events/stargazing-winter-arc-3.0",
    maxImages: 24,
    title: "Stargazing Winter Arc 3.0", 
    desc: "Deep sky observations under peak winter visibility.",
    tag: "Recent"
  },
  { 
    id: "stargazing-event-winter-arc",
    pathPrefix: "/images/events/stargazing-event-winter-arc",
    maxImages: 31,
    title: "Stargazing Winter Arc", 
    desc: "Late-night stargazing session.",
    tag: "Observation"
  },
  { 
    id: "stellar-showdown",
    pathPrefix: "/images/events/stellar-showdown",
    maxImages: 17,
    title: "Stellar Showdown", 
    desc: "Astro-trivia and telescope alignment competition.",
    tag: "Competition"
  },
  { 
    id: "stargazing-event-2024",
    pathPrefix: "/images/events/stargazing-event-2024",
    maxImages: 23,
    title: "Stargazing Event", 
    desc: "Mapping the Orion nebula and Jovian moons.",
    tag: "Observation"
  }
];

function GalleryCard({ event, delayIndex }: { event: any, delayIndex: number }) {
  const [imgIndex, setImgIndex] = useState(1);

  useEffect(() => {
    // Initial random image to avoid everyone starting at img-1
    setImgIndex(Math.floor(Math.random() * event.maxImages) + 1);

    // Explicit offset mapping as requested:
    // 1st card (index 0): 3s
    // 2nd card (index 1): 5s
    // 3rd card (index 2): 0s
    // 4th card (index 3): 4s
    const offsets = [3, 5, 0, 4];
    const offsetSeconds = offsets[delayIndex] ?? 0;

    const timeoutId = setTimeout(() => {
      // Pick a new random image
      setImgIndex(Math.floor(Math.random() * event.maxImages) + 1);
      
      // Start the 8-second interval
      const intervalId = setInterval(() => {
        setImgIndex(Math.floor(Math.random() * event.maxImages) + 1);
      }, 8000);

      return () => clearInterval(intervalId);
    }, offsetSeconds * 1000); 

    return () => clearTimeout(timeoutId);
  }, [event.maxImages, delayIndex]);

  return (
    <Link
      href={`/events#${event.id}`}
      className="glass-panel group overflow-hidden flex flex-col cursor-pointer p-2"
    >
      <div className="relative h-48 w-full overflow-hidden rounded-lg bg-slate-950">
        <AnimatePresence mode="popLayout">
          <motion.img 
            key={imgIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            src={`${event.pathPrefix}/img-${imgIndex}.jpg`} 
            alt={event.title} 
            loading="lazy" 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-100 dark:from-[#020617] via-transparent to-transparent opacity-90 z-10 transition-colors" />
        <div className="absolute top-3 right-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded border border-slate-900/10 dark:border-white/10 z-20">
          <span className="text-[9px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">{event.tag}</span>
        </div>
      </div>
      <div className="p-4 flex-grow flex flex-col justify-end relative z-20">
        <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors mb-1.5 tracking-tight">
          {event.title}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-body">
          {event.desc}
        </p>
      </div>
    </Link>
  );
}

export default function AstroGallery() {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full mt-8 flex flex-col items-center"
    >
      <div className="w-full text-center flex flex-col items-center mb-16">
        <SectionTitle>Event Archives</SectionTitle>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-center italic mt-4 mb-4">
          "Somewhere, something incredible is waiting to be known." — Carl Sagan<br />
          We archive our pursuit of the cosmos.
        </p>
        <Link
          href="/events"
          className="group mt-4 text-[11px] font-bold text-slate-900 dark:text-white bg-slate-200/50 dark:bg-white/10 hover:bg-slate-300/50 dark:hover:bg-white/20 border border-slate-900/10 dark:border-white/10 transition-colors uppercase tracking-widest flex items-center gap-2 whitespace-nowrap px-6 py-2 rounded-full"
        >
          View Full Archive
          <span className="transform transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 w-full max-w-6xl">
        {EVENTS.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            className={i % 2 !== 0 ? "lg:mt-16" : "lg:mt-0"}
          >
            <GalleryCard event={event} delayIndex={i} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
