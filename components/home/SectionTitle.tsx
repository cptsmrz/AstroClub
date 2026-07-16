import React from "react";

export default function SectionTitle({ children, actions }: { children: React.ReactNode, actions?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
        {children}
      </h2>
      {actions}
    </div>
  );
}
