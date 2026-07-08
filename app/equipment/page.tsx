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
          <dd className="text-slate-350 break-words leading-relaxed">{String(value)}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function EquipmentPage() {
  const [telescopes, setTelescopes] = useState<Telescope[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

      <div className="relative z-10 flex flex-col gap-10">
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

        {/* Content */}
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
              className="mt-2 rounded-lg bg-white px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-slate-200 transition-colors"
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
                <div className="relative h-52 w-full bg-slate-950 overflow-hidden border-b border-slate-900">
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
    </>
  );
}
