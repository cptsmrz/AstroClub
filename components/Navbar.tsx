"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/equipment", label: "Equipment" },
  { href: "/blogs", label: "Blogs" },
  { href: "/orrery", label: "Orrery 3D" },
  { href: "/about", label: "About Us" },
  { href: "/roadmap", label: "Archive" },
] as const;

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (isOpen) {
        setVisible(true);
        return;
      }

      // Always keep visible at the top
      if (currentScrollY < 60) {
        setVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }

      if (currentScrollY > lastScrollY) {
        // Scrolling down -> hide header
        setVisible(false);
      } else {
        // Scrolling up -> show header
        setVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isOpen]);

  return (
    <>
      <div className="fixed top-0 inset-x-0 z-50 flex justify-center w-full px-4 pt-4 md:pt-6 pointer-events-none">
        <header className={`pointer-events-auto transition-transform duration-300 w-full max-w-5xl rounded-full border border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)] ${
          visible ? "translate-y-0" : "-translate-y-[150%]"
        }`}>
          <nav className="grid grid-cols-2 md:grid-cols-[1fr_auto_1fr] items-center px-6 py-3">
            {/* Left Column: Logo Brand */}
            <div className="flex justify-start">
              <Link
                href="/"
                className="flex flex-col items-start transition-opacity hover:opacity-90 group"
              >
                <span className="text-xl font-bold tracking-wider text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                  AstroClub
                </span>
              </Link>
            </div>

            {/* Center Column: Desktop Navigation Links (Hidden on Mobile) */}
            <div className="hidden md:flex justify-center">
              <ul className="flex items-center gap-8">
                {NAV_LINKS.map(({ href, label }) => {
                  const isActive = pathname === href;
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        className={`text-[13px] font-semibold transition-all duration-300 relative py-1 whitespace-nowrap tracking-wide ${
                          isActive
                            ? "text-slate-900 dark:text-white"
                            : "text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-300"
                        }`}
                      >
                        {label}
                        {isActive && (
                          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyan-500 dark:bg-cyan-400 rounded-full shadow-[0_0_10px_#06b6d4] dark:shadow-[0_0_10px_#22d3ee]" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Right Column: CTA Button (Desktop) & Hamburger (Mobile) */}
            <div className="flex justify-end items-center gap-3">
              <Link
                href="/request"
                className="hidden md:block rounded-full bg-slate-900/5 hover:bg-slate-900/10 dark:bg-white/10 dark:hover:bg-white/20 border border-slate-900/10 dark:border-white/10 px-5 py-1.5 text-xs font-bold tracking-widest uppercase text-slate-900 dark:text-white transition-all hover:scale-105 active:scale-95 backdrop-blur-md"
              >
                Request Session
              </Link>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex md:hidden items-center justify-center p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </nav>
        </header>
      </div>
      {/* Mobile Drawer (Slide in from Right) */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-64 bg-slate-950 border-l border-slate-900 p-6 shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end mb-8">
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-slate-400 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <ul className="flex flex-col gap-6 mb-8">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={`text-base block py-1 transition-colors ${
                    isActive ? "text-cyan-400 font-semibold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        <Link
          href="/request"
          onClick={() => setIsOpen(false)}
          className="block w-full text-center rounded-md bg-white py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-slate-200"
        >
          Request Session
        </Link>
      </div>

      {/* Backdrop for mobile drawer */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}
    </>
  );
}
