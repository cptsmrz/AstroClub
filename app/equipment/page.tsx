"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import StarfieldCanvas from "@/components/StarfieldCanvas";

// --- Type Definitions ---
interface Telescope {
  id: string;
  name: string;
  specs: Record<string, unknown> | null;
  image_url: string | null;
  description?: string;
  availability_status?: "in_service" | "maintenance" | "retired" | string;
}

interface AstroCapture {
  title: string;
  instrument: string;
  credit: string;
  date: string;
  image_url: string;
}

const STELLAR_CAPTURES: AstroCapture[] = [
  {
    title: "Andromeda Galaxy (M31)",
    instrument: "8\" Newtonian Reflector",
    credit: "Madhav Gupta",
    date: "Oct 2025",
    image_url: "https://images.unsplash.com/photo-1538370965046-79c0d6907d47?q=80&w=1200"
  },
  {
    title: "The Lagoon Nebula (M8)",
    instrument: "Custom DSLR Star Tracker",
    credit: "Aditya Varma",
    date: "Aug 2025",
    image_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200"
  },
  {
    title: "Pleiades Star Cluster (M45)",
    instrument: "Galilean Refractor Calibrator",
    credit: "Hemang Shikhar Rai",
    date: "Nov 2025",
    image_url: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1200"
  },
  {
    title: "Lunar Crater Copernicus",
    instrument: "8\" Newtonian Reflector",
    credit: "Prashant Chauhan",
    date: "Sep 2025",
    image_url: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=1200"
  },
  {
    title: "The Heart Nebula (IC 1805)",
    instrument: "Custom DSLR Star Tracker",
    credit: "Madhav Gupta",
    date: "Dec 2025",
    image_url: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=1200"
  },
  {
    title: "Great Nebula in Orion (M42)",
    instrument: "8\" Newtonian Reflector",
    credit: "Sameeraj",
    date: "Jan 2026",
    image_url: "https://images.unsplash.com/photo-1538370965046-79c0d6907d47?q=80&w=1200"
  }
];

// --- Helpers ---
function formatSpecKey(key: string): string {
  return key
    .split(/[_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// --- Sub-components ---
function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-900 bg-slate-950/40 overflow-hidden">
      <div className="h-52 bg-slate-900" />
      <div className="p-6 space-y-3">
        <div className="h-5 bg-slate-900 rounded w-2/3" />
        <div className="w-8 h-0.5 bg-slate-800 rounded" />
        <div className="space-y-2 pt-1">
          <div className="h-3 bg-slate-900 rounded w-full" />
          <div className="h-3 bg-slate-900 rounded w-5/6" />
          <div className="h-3 bg-slate-900 rounded w-4/6" />
        </div>
      </div>
    </div>
  );
}

function SpecsTable({ specs }: { specs: Record<string, unknown> }) {
  const entries = Object.entries(specs);
  if (entries.length === 0) return null;

  return (
    <dl className="mt-4 pt-4 border-t border-slate-900 space-y-2.5">
      {entries.map(([key, value]) => (
        <div key={key} className="flex items-baseline gap-2 text-xs">
          <dt className="shrink-0 font-semibold text-slate-500 w-24 truncate tracking-wider uppercase">
            {formatSpecKey(key)}
          </dt>
          <dd className="text-slate-355 break-words leading-relaxed">{String(value)}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function EquipmentPage() {
  const [telescopes, setTelescopes] = useState<Telescope[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeCapture, setActiveCapture] = useState<AstroCapture | null>(null);

  const fetchTelescopes = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const { data, error } = await supabase
        .from("telescopes")
        .select("*")
        .order("name");
      if (error) throw error;
      setTelescopes(data || []);
    } catch (err: unknown) {
      console.error("Error fetching telescopes:", err);
      setErrorMsg(
        err instanceof Error ? err.message : "Failed to load equipment catalog from Supabase."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelescopes();
  }, []);

  const getStatusBadge = (status?: string) => {
    let text = "In Service";
    let bg = "bg-emerald-500/10 text-emerald-400 border-emerald-800/30";
    let dot = "bg-emerald-400 shadow-[0_0_8px_#34d399]";

    if (status === "maintenance") {
      text = "Under Maintenance";
      bg = "bg-amber-500/10 text-amber-400 border-amber-800/30";
      dot = "bg-amber-400 shadow-[0_0_8px_#fbbf24]";
    } else if (status === "retired") {
      text = "Retired";
      bg = "bg-red-500/10 text-red-400 border-red-800/30";
      dot = "bg-red-400 shadow-[0_0_8px_#f87171]";
    }

    return (
      <span className={`absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full border backdrop-blur-md text-[10px] font-bold tracking-wider uppercase ${bg}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
        {text}
      </span>
    );
  };

  return (
    <>
      <StarfieldCanvas />

      <div className="relative z-10 flex flex-col gap-16 pb-16">
        
        {/* Section 1: Instrument Catalog */}
        <div className="flex flex-col gap-10">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-slate-900">
            <div>
              <span className="text-xs font-bold tracking-[0.25em] text-cyan-400 uppercase block mb-3">
                Technical Inventory
              </span>
              <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
                Handcrafted Instruments
              </h1>
              <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-3xl">
                AstroClub members custom-engineer, machine, and assemble our own telescopes rather than buying off-the-shelf. Explore our technical pride below.
              </p>
            </div>
            {!loading && !errorMsg && telescopes.length > 0 && (
              <span className="shrink-0 self-start sm:self-auto text-[11px] font-bold tracking-widest text-slate-500 bg-slate-950 border border-slate-900 rounded-full px-4 py-1.5 uppercase">
                {telescopes.length} {telescopes.length === 1 ? "rig" : "rigs"} active
              </span>
            )}
          </div>

          {/* Catalog Content Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : errorMsg ? (
            <div className="rounded-2xl border border-red-900/50 bg-red-950/10 p-8 text-center max-w-lg mx-auto flex flex-col items-center gap-4">
              <span className="text-4xl">⚠️</span>
              <h3 className="text-lg font-bold text-white">Database Query Failure</h3>
              <p className="text-sm text-slate-450 leading-relaxed">
                {errorMsg}. Make sure you have run the latest database migrations in the Supabase SQL editor.
              </p>
              <button
                onClick={fetchTelescopes}
                className="mt-2 rounded-lg bg-white px-5 py-2.5 text-xs font-bold text-slate-955 hover:bg-slate-200 transition-colors"
              >
                Retry Connection
              </button>
            </div>
          ) : telescopes.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-900 bg-slate-950/20 py-24 gap-3">
              <span className="text-5xl select-none">🔭</span>
              <p className="text-slate-400 text-lg font-medium">
                No equipment catalogued yet
              </p>
              <p className="text-slate-650 text-sm">
                Check back soon as we inventory our instruments.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {telescopes.map((telescope) => (
                <div
                  key={telescope.id}
                  className="group rounded-2xl border border-slate-900 bg-slate-950/40 overflow-hidden transition-all duration-300 hover:border-slate-750 hover:bg-slate-900/20 hover:scale-[1.01] hover:shadow-xl hover:shadow-black/30 flex flex-col h-full"
                >
                  {/* Image Area */}
                  <div className="relative h-52 w-full bg-slate-955 overflow-hidden border-b border-slate-900">
                    {/* Status Badge */}
                    {getStatusBadge(telescope.availability_status)}

                    {telescope.image_url ? (
                      <img
                        src={telescope.image_url}
                        alt={telescope.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-700">
                        <span className="text-5xl select-none">🔭</span>
                        <span className="text-[10px] tracking-wider uppercase font-bold">
                          No Image Available
                        </span>
                      </div>
                    )}
                    {/* Hover Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>

                  {/* Content Area */}
                  <div className="p-5 md:p-6 flex flex-col justify-between flex-grow">
                    <div>
                      <h2 className="text-lg font-semibold text-white mb-1 leading-snug group-hover:text-cyan-400 transition-colors">
                        {telescope.name}
                      </h2>
                      {/* Animated Line */}
                      <div className="w-8 h-0.5 bg-slate-800 mb-4 group-hover:w-16 transition-all duration-300 ease-out" />

                      {/* Optional narrative description */}
                      {telescope.description && (
                        <p className="text-xs md:text-sm text-slate-400 leading-relaxed mb-4">
                          {telescope.description}
                        </p>
                      )}
                    </div>

                    {telescope.specs &&
                    typeof telescope.specs === "object" &&
                    !Array.isArray(telescope.specs) &&
                    Object.keys(telescope.specs).length > 0 ? (
                      <SpecsTable specs={telescope.specs as Record<string, unknown>} />
                    ) : (
                      <p className="text-xs text-slate-600 italic mt-3">
                        No specifications listed.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Stellar Captures Gallery */}
        <section className="border-t border-slate-900 pt-12 flex flex-col gap-10">
          <div>
            <span className="text-xs font-bold tracking-[0.25em] text-cyan-400 uppercase block mb-3">
              Observational Output
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
              Stellar Captures
            </h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-2xl">
              Photographs captured directly from the AstroClub observatory zones using our student-assembled optical rigs. Click any thumbnail to load the full-res capture profile.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {STELLAR_CAPTURES.map((capture, idx) => (
              <div
                key={idx}
                onClick={() => setActiveCapture(capture)}
                className="group relative rounded-2xl border border-slate-900 bg-slate-950/40 overflow-hidden cursor-pointer hover:border-cyan-500/40 hover:scale-[1.01] transition-all duration-300 shadow-lg shadow-black/25 flex flex-col justify-between"
              >
                {/* Photo container */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <img
                    src={capture.image_url}
                    alt={capture.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent pointer-events-none" />
                </div>

                {/* Captures Details */}
                <div className="p-4 md:p-5">
                  <h3 className="text-[15px] font-semibold text-white group-hover:text-cyan-400 transition-colors leading-snug">
                    {capture.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Lightbox Modal Overlay */}
      {activeCapture && (
        <div 
          onClick={() => setActiveCapture(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="max-w-4xl w-full rounded-2xl border border-slate-900 bg-slate-950 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-250 cursor-default"
          >
            {/* Modal Image container */}
            <div className="relative aspect-video w-full bg-slate-900">
              <img
                src={activeCapture.image_url}
                alt={activeCapture.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActiveCapture(null)}
                className="absolute top-4 right-4 bg-slate-950/80 border border-slate-800 hover:border-slate-750 text-white rounded-full p-2.5 transition-colors cursor-pointer"
                aria-label="Close image profile"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Metadata description */}
            <div className="p-6 md:p-8 bg-slate-950 border-t border-slate-900">
              <h3 className="text-xl font-bold text-white tracking-tight">
                {activeCapture.title}
              </h3>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
