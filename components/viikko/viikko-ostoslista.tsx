"use client";

import { useState } from "react";
import { ShoppingCart, Check, X } from "lucide-react";
import { useAppState } from "@/lib/app-state";
import { t, dayName } from "@/lib/i18n";
import { RECIPES } from "@/lib/data";
import { cn } from "@/lib/utils";

interface MealPlanEntry {
  dayOfWeek: number;
  recipe: { id: number };
}

interface Props {
  mealPlan: MealPlanEntry[];
  onClose: () => void;
}

export function ViikkoOstoslista({ mealPlan, onClose }: Props) {
  const { locale, weekNumber } = useAppState();
  const [checked, setChecked] = useState<Set<string>>(new Set());

  // Merge all ingredients across the entire week
  const merged = new Map<string, { amount: number; unit: string; name: string }>();
  for (const entry of mealPlan) {
    const recipe = RECIPES.find((r) => r.id === entry.recipe.id);
    if (!recipe) continue;
    for (const ing of recipe.ingredients) {
      const key = `${ing.name}__${ing.unit}`;
      const ex = merged.get(key);
      if (ex) ex.amount += ing.amount;
      else merged.set(key, { ...ing });
    }
  }

  const allIngredients = Array.from(merged.values()).sort((a, b) => a.name.localeCompare(b.name, "fi"));

  function toggle(key: string) {
    setChecked((p) => { const n = new Set(p); if (n.has(key)) n.delete(key); else n.add(key); return n; });
  }

  const title = locale === "fi" ? `Viikon ${weekNumber} ostoslista` : `Week ${weekNumber} shopping list`;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.5)" }} />
      <div
        className="relative w-full max-w-lg rounded-t-[16px] flex flex-col"
        style={{ background: "var(--ios-gray6)", maxHeight: "85dvh", paddingBottom: "env(safe-area-inset-bottom)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-2 pb-1 shrink-0">
          <div className="w-9 h-[5px] rounded-full" style={{ background: "var(--ios-gray3)" }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-2 shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" style={{ color: "var(--ios-blue)" }} />
            <span className="text-[17px] font-semibold">{title}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[13px]" style={{ color: "var(--ios-secondary-label)" }}>
              {checked.size}/{allIngredients.length}
            </span>
            <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-full" style={{ background: "var(--ios-gray4)" }}>
              <X className="h-4 w-4" style={{ color: "var(--ios-secondary-label)" }} />
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="rounded-[10px] overflow-hidden" style={{ background: "var(--ios-card)" }}>
            {allIngredients.map((item, i) => {
              const key = `${item.name}__${item.unit}`;
              return (
                <button
                  key={key}
                  onClick={() => toggle(key)}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-[10px] text-[15px] text-left",
                    checked.has(key) && "line-through"
                  )}
                  style={{
                    borderBottom: i < allIngredients.length - 1 ? "0.5px solid var(--ios-separator)" : "none",
                    color: checked.has(key) ? "var(--ios-gray)" : undefined,
                  }}
                >
                  <div
                    className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full"
                    style={{
                      background: checked.has(key) ? "var(--ios-blue)" : "transparent",
                      border: checked.has(key) ? "none" : "2px solid var(--ios-gray)",
                    }}
                  >
                    {checked.has(key) && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <span className="shrink-0 font-mono text-[13px]" style={{ color: "var(--ios-secondary-label)" }}>
                    {Math.round(item.amount * 10) / 10} {item.unit}
                  </span>
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
