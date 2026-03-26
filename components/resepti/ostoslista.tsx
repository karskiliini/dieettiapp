"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useAppState } from "@/lib/app-state";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { Ingredient } from "@/lib/types";

interface OstoslistaProps { ingredients: Ingredient[]; recipeName: string }

export function Ostoslista({ ingredients, recipeName }: OstoslistaProps) {
  const { locale } = useAppState();
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState<Set<number>>(new Set());

  function toggle(index: number) {
    setChecked((prev) => { const n = new Set(prev); if(n.has(index)) n.delete(index); else n.add(index); return n; });
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-[10px] py-[11px] text-[17px] font-medium"
        style={{ background: "var(--ios-card)", color: "var(--ios-blue)" }}
      >
        <ShoppingCart className="h-5 w-5" />
        {t("recipe.shoppingList", locale)}
      </button>
    );
  }

  return (
    <div className="rounded-[10px] overflow-hidden" style={{ background: "var(--ios-card)" }}>
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-4 w-4" style={{ color: "var(--ios-blue)" }} />
          <span className="text-[15px] font-semibold">{t("recipe.shoppingList", locale)}</span>
        </div>
        <span className="text-[13px]" style={{ color: "var(--ios-secondary-label)" }}>
          {checked.size}/{ingredients.length}
        </span>
      </div>
      {ingredients.map((item, i) => (
        <button
          key={i}
          onClick={() => toggle(i)}
          className={cn(
            "flex w-full items-center gap-3 px-4 py-[10px] text-[15px] text-left",
            checked.has(i) && "line-through"
          )}
          style={{
            borderTop: "0.5px solid var(--ios-separator)",
            color: checked.has(i) ? "var(--ios-gray)" : undefined,
          }}
        >
          <div
            className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full"
            style={{
              background: checked.has(i) ? "var(--ios-blue)" : "transparent",
              border: checked.has(i) ? "none" : "2px solid var(--ios-gray)",
            }}
          >
            {checked.has(i) && <Check className="h-3 w-3 text-white" />}
          </div>
          <span className="shrink-0 font-mono text-[13px]" style={{ color: "var(--ios-secondary-label)" }}>
            {item.amount} {item.unit}
          </span>
          <span>{item.name}</span>
        </button>
      ))}
    </div>
  );
}
