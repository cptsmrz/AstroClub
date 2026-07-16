"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import SectionTitle from "@/components/home/SectionTitle";

const EVENTS = [
  { 
    id: "stargazing-winter-arc-3",
    url: "/images/events/stargazing-winter-arc-3.0/img-1.jpg", 
    title: "Winter Arc Stargazing 3.0", 
    desc: "Deep sky observations under peak winter visibility.",
    tag: "Recent"
  },
  { 
    id: "stellar-showdown",
    url: "/images/events/stellar-showdown/img-1.jpg", 
    title: "Stellar Showdown", 
    desc: "Astro-trivia and telescope alignment competition.",
    tag: "Competition"
  },
  { 
    id: "stargazing-event-2024",
    url: "/images/events/stargazing-event-2024/img-1.jpg", 
    title: "Winter Arc Stargazing", 
    desc: "Mapping the Orion nebula and Jovian moons.",
    tag: "Observation"
  },
  { 
    id: "telescope-making-workshop",
    url: "/images/events/telescope-making-workshop/img-1.jpg", 
    title: "Telescope Making", 
    desc: "Building Newtonians from scratch.",
    tag: "Workshop"
  }
];

export default function AstroGallery() {
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
          <SectionTitle>Event Archives</SectionTitle>
          <p className="text-slate-400 text-sm md:text-base mt-2 font-body max-w-xl">
            Explore thousands of photographs from our observation camps, workshops, and competitions.
          </p>
        </div>
        <Link
          href="/events"
          className="group text-sm font-bold text-white bg-cyan-600 hover:bg-cyan-500 transition-colors uppercase tracking-widest flex items-center gap-2 whitespace-nowrap px-5 py-2.5 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.4)]"
        >
          View All Events 
          <span className="transform transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {EVENTS.map((event, i) => (
          <Link
            href={`/events#${event.id}`}
            key={i} 
            className="glass-panel group overflow-hidden flex flex-col cursor-pointer p-2"
          >
            <div className="relative h-48 w-full overflow-hidden rounded-lg bg-slate-950">
              <img 
                src={event.url} 
                alt={event.title} 
                loading="lazy" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-80" />
              <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded border border-white/10 z-10">
                <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest">{event.tag}</span>
              </div>
            </div>
            <div className="p-4 flex-grow flex flex-col justify-end">
              <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors mb-1.5 tracking-tight">
                {event.title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed font-body">
                {event.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </motion.section>
  );
}
