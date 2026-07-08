"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/equipment", label: "Equipment" },
  { href: "/blogs", label: "Blogs" },
  { href: "/orrery", label: "Orrery 3D" },
  { href: "/about", label: "About" },
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
    <header className={`sticky top-0 z-50 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md transition-transform duration-300 ${
      visible ? "translate-y-0" : "-translate-y-full"
    }`}>
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo Brand with Premium Sub-Tagline */}
        <Link
          href="/"
          className="flex flex-col items-start transition-opacity hover:opacity-90"
        >
          <span className="text-xl font-bold tracking-wider text-white">
            AstroClub
          </span>
          <span className="text-[9px] font-medium tracking-[0.25em] text-slate-500 uppercase leading-none mt-0.5">
            Beyond The Stars
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`text-sm transition-all duration-200 relative py-1 ${
                      isActive
                        ? "text-cyan-400 font-medium"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <Link
            href="/request"
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-slate-950 transition-all hover:bg-slate-200 hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-white/5"
          >
            Request Session
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex md:hidden items-center justify-center p-2 text-slate-400 hover:text-white transition-colors focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      </nav>

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
    </header>
  );
}
