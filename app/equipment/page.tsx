"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// --- Type Definitions ---
interface Telescope {
  id: string;
  name: string;
  specs: Record<string, unknown> | null;
  image_url: string | null;
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
    <div className="animate-pulse rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
      <div className="h-52 bg-slate-800" />
      <div className="p-6 space-y-3">
        <div className="h-5 bg-slate-800 rounded w-2/3" />
        <div className="w-8 h-0.5 bg-slate-700 rounded" />
        <div className="space-y-2 pt-1">
          <div className="h-3 bg-slate-800 rounded w-full" />
          <div className="h-3 bg-slate-800 rounded w-5/6" />
          <div className="h-3 bg-slate-800 rounded w-4/6" />
        </div>
      </div>
    </div>
  );
}

function SpecsTable({ specs }: { specs: Record<string, unknown> }) {
  const entries = Object.entries(specs);
  if (entries.length === 0) return null;

  return (
    <dl className="mt-3 space-y-2">
      {entries.map(([key, value]) => (
        <div key={key} className="flex items-baseline gap-2 text-sm">
          <dt className="shrink-0 font-medium text-slate-500 w-28 truncate text-xs tracking-wide uppercase">
            {formatSpecKey(key)}
          </dt>
          <dd className="text-slate-300 break-words leading-snug">{String(value)}</dd>
        </div>
      ))}
    </dl>
  );
}

// --- Page ---
export default function EquipmentPage() {
  const [telescopes, setTelescopes] = useState<Telescope[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTelescopes = async () => {
      try {
        const { data, error } = await supabase
          .from("telescopes")
          .select("*")
          .order("name");
        if (error) throw error;
        setTelescopes(data || []);
      } catch (err) {
        console.error("Error fetching telescopes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTelescopes();
  }, []);

  return (
    <div className="flex flex-col gap-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
            Handcrafted Instruments
          </h1>
          <p className="text-slate-400 text-lg">
            AstroClub members custom-engineer, machine, and assemble our own telescopes rather than buying off-the-shelf. Explore our technical pride below.
          </p>
        </div>
        {!loading && (
          <span className="shrink-0 self-start sm:self-auto text-sm text-slate-500 bg-slate-900 border border-slate-800 rounded-full px-4 py-1.5 font-medium tabular-nums">
            {telescopes.length}{" "}
            {telescopes.length === 1 ? "rig" : "rigs"}
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
      ) : telescopes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/20 py-24 gap-3">
          <span className="text-5xl select-none">🔭</span>
          <p className="text-slate-400 text-lg font-medium">
            No equipment catalogued yet
          </p>
          <p className="text-slate-600 text-sm">
            Check back soon as we inventory our instruments.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {telescopes.map((telescope) => (
            <div
              key={telescope.id}
              className="group rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden transition-all duration-200 hover:border-slate-600 hover:bg-slate-900/80 hover:shadow-xl hover:shadow-black/20"
            >
              {/* Image */}
              <div className="relative h-52 w-full bg-slate-800 overflow-hidden">
                {telescope.image_url ? (
                  <img
                    src={telescope.image_url}
                    alt={telescope.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-600">
                    <span className="text-5xl select-none">🔭</span>
                    <span className="text-xs tracking-wider uppercase">
                      No Image Available
                    </span>
                  </div>
                )}
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content */}
              <div className="p-6">
                <h2 className="text-lg font-semibold text-white mb-1 leading-snug">
                  {telescope.name}
                </h2>
                {/* Animated accent line */}
                <div className="w-8 h-0.5 bg-slate-700 mb-3 group-hover:w-16 transition-all duration-300 ease-out" />

                {telescope.specs &&
                typeof telescope.specs === "object" &&
                !Array.isArray(telescope.specs) &&
                Object.keys(telescope.specs).length > 0 ? (
                  <SpecsTable specs={telescope.specs as Record<string, unknown>} />
                ) : (
                  <p className="text-sm text-slate-600 italic mt-3">
                    No specifications listed.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
