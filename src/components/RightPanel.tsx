"use client";

import Dashboard from "@/components/Dashboard";
import { useState } from "react";

export default function RightPanel() {
  const [mode, setMode] = useState<'month'|'week'|'year'>('month');
  return (
    <div className="flex h-full flex-col gap-6">
      <div className="card-base p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Calendar</h3>
          <div className="flex gap-2 text-xs">
            {['week','month','year'].map(m => (
              <button key={m} onClick={()=>setMode(m as any)} className={`rounded-md px-2 py-1 ${mode===m?'bg-(--color-brand) text-white':'bg-(--color-bg-accent) text-(--color-text-secondary)'}`}>{m}</button>
            ))}
          </div>
        </div>
        <div className="mt-3 h-40 w-full rounded-md bg-(--color-bg-accent) flex items-center justify-center text-xs text-(--color-text-secondary)">
          (Calendar placeholder)
        </div>
      </div>
      <div className="card-base p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold">Storage</h3>
          <span className="text-xs text-(--color-text-secondary)">Month</span>
        </div>
        <div className="h-48 w-full">
          <Dashboard />
        </div>
      </div>
    </div>
  );
}
