import type { Metadata } from "next";
import Link from "next/link";
import { Cinzel, Dela_Gothic_One, Orbitron, Rajdhani, VT323, Share_Tech_Mono } from 'next/font/google';
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";
import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import { SpeedInsights } from "@vercel/speed-insights/next";

const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-serif' });
const delaGothic = Dela_Gothic_One({ weight: '400', subsets: ['latin'], variable: '--font-dela' });
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-mono' });
const rajdhani = Rajdhani({ weight: ['300', '400', '500', '600', '700'], subsets: ['latin'], variable: '--font-body-custom' });
const vt323 = VT323({ weight: '400', subsets: ['latin'], variable: '--font-crt' });
const shareTechMono = Share_Tech_Mono({ weight: '400', subsets: ['latin'], variable: '--font-terminal' });

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
        url: "/images/nebula_core_1782850389800.png",
        width: 1200,
        height: 630,
        alt: "AstroClub Observatory Starry Night"
      }
    ],
    type: "website"
  }
};

import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${cinzel.variable} ${delaGothic.variable} ${orbitron.variable} ${rajdhani.variable} ${vt323.variable} ${shareTechMono.variable}`} suppressHydrationWarning>
      <body
        className="min-h-screen flex flex-col bg-slate-950 text-slate-200 antialiased font-body relative transition-colors duration-500"
      >
        {/* Global Background Noise for Premium Texture */}
        <div className="fixed inset-0 z-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

        <CustomCursor />
        <Navbar />
        <SmoothScroll />

        <main className="mx-auto max-w-6xl px-6 pt-32 pb-12 w-full flex-grow relative z-10">
          {children}
        </main>

        <Footer />
        <CookieBanner />
        <SpeedInsights />
      </body>
    </html>
  );
}