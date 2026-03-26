"use client";

import { DIET_CATEGORIES, type DietCategory } from "@/lib/constants";
import { useAppState } from "@/lib/app-state";
import { dietLabel } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function DieettiTabs() {
  const { dietti, setDietti, locale } = useAppState();

  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-none">
      {DIET_CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => setDietti(cat)}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
            dietti === cat
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-accent"
          )}
        >
          {dietLabel(cat, locale)}
        </button>
      ))}
    </div>
  );
}
