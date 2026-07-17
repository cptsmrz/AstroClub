"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-slate-200 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors">
      {/* Background Glow & Noise */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-900/10 dark:bg-cyan-900/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-6">
            <Link href="/" className="inline-block group">
              <span className="text-3xl font-bold tracking-tighter text-slate-900 dark:text-white font-sans flex items-center gap-3">
                <span className="bg-gradient-to-r from-cyan-600 to-emerald-600 dark:from-cyan-400 dark:to-emerald-400 bg-clip-text text-transparent group-hover:drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all duration-500">
                  AstroClub
                </span>
                <span className="text-xl text-slate-400 dark:text-slate-600">GLA</span>
              </span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md font-body leading-relaxed">
              We are the official astronomy club of GLA University. Discovering the cosmos through custom-machined Newtonian telescopes, deep-sky astrophotography, and late-night observation camps.
            </p>
            <div className="flex gap-4 pt-2">
              <SocialLink href="https://www.instagram.com/astroclub_glau" icon={InstagramIcon} />
              <SocialLink href="https://www.linkedin.com/company/astroclubglau" icon={LinkedInIcon} />
              <SocialLink href="https://x.com/AstroClubGLAU" icon={XIcon} />
              <SocialLink href="mailto:astroclub@gla.ac.in" icon={MailIcon} />
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-6">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-widest uppercase">Explore</h4>
            <ul className="space-y-3 font-body text-sm text-slate-600 dark:text-slate-400">
              <li><FooterLink href="/equipment">Our Telescopes</FooterLink></li>
              <li><FooterLink href="/events">Event Archives</FooterLink></li>
              <li><FooterLink href="/orrery">3D Solar System</FooterLink></li>
              <li><FooterLink href="/blogs">Mission Logs (Blogs)</FooterLink></li>
            </ul>
          </div>

          {/* Cosmic Verse / CTA */}
          <div className="md:col-span-4 space-y-6">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-widest uppercase">The Void</h4>
            <div className="p-4 rounded-xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 backdrop-blur-sm relative overflow-hidden group w-max max-w-full shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 dark:from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div 
                className="italic text-[17px] text-cyan-800 dark:text-cyan-300/80 leading-relaxed relative z-10 tracking-wide whitespace-nowrap"
                style={{ fontFamily: "'Times New Roman', Times, serif" }}
              >
                Do not go gentle into that good night,<br />
                Old age should burn and rave at close of day;<br />
                Rage, rage against the dying of the light.
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-body text-slate-500">
          <p>© {new Date().getFullYear()} AstroClub GLA. Initiated in the dark.</p>
          <div className="flex gap-6">
            <Link href="/about" className="hover:text-cyan-400 transition-colors">About Us</Link>
            <Link href="/constitution" className="hover:text-cyan-400 transition-colors">Constitution</Link>
            <Link href="/request" className="hover:text-cyan-400 transition-colors">Request Session</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="group flex items-center gap-2 hover:text-cyan-400 transition-colors"
    >
      <span className="w-0 h-[1px] bg-cyan-400 transition-all duration-300 group-hover:w-3" />
      {children}
    </Link>
  );
}

function SocialLink({ href, icon: Icon }: { href: string; icon: React.FC<any> }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-slate-800 transition-all duration-300 hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-cyan-500/20"
    >
      <Icon className="w-4 h-4" />
    </a>
  );
}

const InstagramIcon = (props: any) => (
  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const LinkedInIcon = (props: any) => (
  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const XIcon = (props: any) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const MailIcon = (props: any) => (
  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);
