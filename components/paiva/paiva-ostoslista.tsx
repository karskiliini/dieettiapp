"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import type { MealType } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useAppState } from "@/lib/app-state";
import { t, mealLabel } from "@/lib/i18n";

interface Ingredient { amount: number; unit: string; name: string }
interface MealWithIngredients { mealType: MealType; recipe: { name: string; ingredients: Ingredient[] } }
interface Props { meals: MealWithIngredients[]; dayName: string }

export function PaivaOstoslista({ meals, dayName }: Props) {
  const { locale } = useAppState();
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const merged = new Map<string, { amount: number; unit: string; name: string }>();
  for (const meal of meals) {
    for (const ing of meal.recipe.ingredients) {
      const key = `${ing.name}__${ing.unit}`;
      const ex = merged.get(key);
      if (ex) ex.amount += ing.amount; else merged.set(key, { ...ing });
    }
  }
  const allIngredients = Array.from(merged.values());

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-[10px] py-[11px] text-[17px] font-medium"
        style={{ background: "var(--ios-card)", color: "var(--ios-blue)" }}
      >
        <ShoppingCart className="h-5 w-5" />
        {t("day.shoppingList", locale)}
      </button>
    );
  }

  return (
    <div className="rounded-[10px] overflow-hidden" style={{ background: "var(--ios-card)" }}>
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" style={{ color: "var(--ios-blue)" }} />
            <span className="text-[15px] font-semibold">{t("day.shoppingTitle", locale)}</span>
          </div>
          <span className="text-[13px]" style={{ color: "var(--ios-secondary-label)" }}>{checked.size}/{allIngredients.length}</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {meals.map((m) => (
            <span key={m.mealType} className="rounded-full px-2 py-0.5 text-[11px]" style={{ background: "var(--ios-gray5)", color: "var(--ios-secondary-label)" }}>
              {mealLabel(m.mealType, locale)}: {m.recipe.name}
            </span>
          ))}
        </div>
      </div>
      {allIngredients.map((item) => {
        const key = `${item.name}__${item.unit}`;
        return (
          <button
            key={key}
            onClick={() => setChecked((p) => { const n = new Set(p); if(n.has(key)) n.delete(key); else n.add(key); return n; })}
            className={cn("flex w-full items-center gap-3 px-4 py-[10px] text-[15px] text-left", checked.has(key) && "line-through")}
            style={{ borderTop: "0.5px solid var(--ios-separator)", color: checked.has(key) ? "var(--ios-gray)" : undefined }}
          >
            <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full"
              style={{ background: checked.has(key) ? "var(--ios-blue)" : "transparent", border: checked.has(key) ? "none" : "2px solid var(--ios-gray)" }}>
              {checked.has(key) && <Check className="h-3 w-3 text-white" />}
            </div>
            <span className="shrink-0 font-mono text-[13px]" style={{ color: "var(--ios-secondary-label)" }}>{item.amount} {item.unit}</span>
            <span>{item.name}</span>
          </button>
        );
      })}
    </div>
  );
}
