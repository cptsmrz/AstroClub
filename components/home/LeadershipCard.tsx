"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";

const NebulaBackground = ({ src }: { src: string }) => (
  <div className="absolute inset-0 pointer-events-none select-none overflow-hidden rounded-2xl">
    <img
      src={src}
      alt=""
      loading="lazy"
      className="w-full h-full object-cover opacity-30 scale-105 group-hover:opacity-50 group-hover:scale-110 transition-all duration-700 mix-blend-screen"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-slate-100 via-slate-100/80 to-slate-100/40 dark:from-[#020617] dark:via-[#020617]/80 dark:to-[#020617]/40 transition-colors duration-500" />
    <div className="absolute inset-0 bg-gradient-to-r from-slate-100/60 dark:from-[#020617]/60 to-transparent transition-colors duration-500" />
  </div>
);

interface Role {
  title: string;
  name: string;
  year: string;
  branch: string;
  nebula: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
}

export default function LeadershipCard({ role }: { role: Role }) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useMotionTemplate`${mouseYSpring}deg`;
  const rotateY = useMotionTemplate`${mouseXSpring}deg`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct * 15); // max 15 degrees
    y.set(yPct * -15);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="group bg-white/50 dark:bg-slate-900/40 border border-slate-900/10 dark:border-slate-800/60 backdrop-blur-md rounded-xl p-6 flex flex-col justify-between relative min-h-[190px] cursor-pointer shadow-lg dark:shadow-none"
    >
      <div 
        className="absolute inset-0 z-0 rounded-xl overflow-hidden"
        style={{ transform: "translateZ(-30px)" }}
      >
        <NebulaBackground src={role.nebula} />
      </div>

      <div 
        className="relative z-10 flex flex-col gap-3 pointer-events-none h-full justify-end"
        style={{ transform: "translateZ(30px)" }}
      >
        <div>
          <span className="text-[10px] font-bold font-mono tracking-[0.22em] text-cyan-700 dark:text-cyan-400 uppercase drop-shadow-[0_0_8px_rgba(6,182,212,0.2)] dark:drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">
            {role.title}
          </span>
          <p className="text-xl font-bold text-slate-900 dark:text-white leading-tight mt-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
            {role.name}
          </p>
        </div>

        <div className="flex flex-col gap-0.5 mt-2">
          <span className="text-xs text-slate-700 dark:text-slate-300 font-medium font-sans">
            {role.year}
          </span>
          <span className="text-[11px] text-slate-600 dark:text-slate-400 font-mono tracking-wider">
            {role.branch}
          </span>
        </div>

        {role.linkedin ? (
          <a
            href={role.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-0 right-0 w-8 h-8 rounded-full bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/20 transition-all pointer-events-auto backdrop-blur-sm"
            title="LinkedIn Profile"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
          </a>
        ) : null}
      </div>

      <motion.div 
        className="absolute inset-0 bg-cyan-600/5 dark:bg-cyan-400/10 blur-2xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{ transform: "translateZ(-10px)" }}
      />
    </motion.div>
  );
}
