import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";
import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AstroClub — GLA University",
  description:
    "Official portal for the university astronomy club. Explore handcrafted telescopes, read blog posts, view our 3D solar system simulator, and request observation sessions.",
  openGraph: {
    title: "AstroClub — GLA University",
    description: "Official portal for the university astronomy club. Explore equipment, read blog posts, and request stargazing sessions.",
    url: "https://astroclub.gla.ac.in",
    siteName: "AstroClub GLA",
    images: [
      {
        url: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "AstroClub Observatory Starry Night"
      }
    ],
    type: "website"
  }
};

function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-12 relative z-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Col 1: Club Info */}
          <div className="space-y-3">
            <div className="flex flex-col items-start">
              <span className="text-lg font-bold tracking-wider text-white">AstroClub</span>
              <span className="text-[8px] tracking-[0.2em] text-slate-500 uppercase">GLA UNIVERSITY</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              Designing, building, and operating handcrafted telescopes from GLA University, Mathura. Witness the unseen and explore the vast cosmos.
            </p>
          </div>

          {/* Col 2: Observational Center */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Observational Spot</h4>
            <div className="text-xs text-slate-400 space-y-1">
              <p className="font-medium text-slate-300">Basketball Court</p>
              <p>GLA University Campus</p>
              <p>Mathura, Uttar Pradesh, IN</p>
            </div>
          </div>

          {/* Col 3: Social & Digital Presence */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Connect With Us</h4>
            <div className="flex flex-wrap gap-4 items-center">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/astroclub_glau"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 transition-colors hover:text-white"
                title="Instagram"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/company/astroclubglau"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 transition-colors hover:text-white"
                title="LinkedIn"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>

              {/* X / Twitter */}
              <a
                href="https://x.com/AstroClubGLAU"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 transition-colors hover:text-white"
                title="X (Twitter)"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Email */}
              <a
                href="mailto:astroclub@gla.ac.in"
                className="text-slate-400 transition-colors hover:text-white"
                title="Gmail"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </a>
            </div>
            <div className="text-xs text-slate-500 pt-1">
              Email: <a href="mailto:astroclub@gla.ac.in" className="hover:text-slate-300">astroclub@gla.ac.in</a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-600">
          <p>© 2026 AstroClub GLA. All rights reserved.</p>
          <div className="flex flex-wrap gap-4 items-center justify-center sm:justify-start text-[11px] text-slate-500">
            <Link href="/" className="hover:text-slate-350 transition-colors">
              Home
            </Link>
            <span className="text-slate-800">|</span>
            <Link href="/about" className="hover:text-slate-350 transition-colors">
              About Us
            </Link>
            <span className="text-slate-800">|</span>
            <Link href="/blogs" className="hover:text-slate-350 transition-colors">
              Blogs
            </Link>
            <span className="text-slate-800">|</span>
            <Link href="/constitution" className="hover:text-slate-350 transition-colors">
              Constitution
            </Link>
            <span className="text-slate-800">|</span>
            <span className="text-slate-600">GLA University, Mathura</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen flex flex-col bg-slate-950 text-slate-200 antialiased`}
      >
        <Navbar />
        <SmoothScroll />

        <main className="mx-auto max-w-6xl px-6 py-12 w-full flex-grow relative z-10">
          {children}
        </main>

        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}