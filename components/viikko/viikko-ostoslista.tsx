"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useAppState } from "@/lib/app-state";
import { RECIPES } from "@/lib/data";
import { cn } from "@/lib/utils";
import { BottomSheet } from "@/components/ui/bottom-sheet";

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
    <BottomSheet onClose={onClose} showCloseButton={false}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" style={{ color: "var(--ios-blue)" }} />
          <span className="text-[17px] font-semibold">{title}</span>
        </div>
        <span className="text-[13px]" style={{ color: "var(--ios-secondary-label)" }}>
          {checked.size}/{allIngredients.length}
        </span>
      </div>

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
    </BottomSheet>
  );
}
