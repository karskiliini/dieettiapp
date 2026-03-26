"use client";

import { DIET_CATEGORIES } from "@/lib/constants";
import { useAppState } from "@/lib/app-state";
import { dietLabel } from "@/lib/i18n";

export function DieettiTabs() {
  const { dietti, setDietti, locale } = useAppState();

  return (
    <div
      className="flex overflow-x-auto scrollbar-none rounded-[9px] p-[2px]"
      style={{ background: "rgba(118,118,128,0.24)" }}
    >
      {DIET_CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => setDietti(cat)}
          className="flex-1 min-w-0 rounded-[7px] px-2 py-[5px] text-[13px] font-medium transition-all"
          style={{
            background: dietti === cat ? "rgba(99,99,102,0.72)" : "transparent",
            color: dietti === cat ? "#fff" : "var(--ios-secondary-label)",
            boxShadow: dietti === cat ? "0 1px 3px rgba(0,0,0,0.3)" : "none",
          }}
        >
          {dietLabel(cat, locale)}
        </button>
      ))}
    </div>
  );
}
