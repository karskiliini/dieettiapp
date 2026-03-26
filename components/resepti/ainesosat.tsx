"use client";

import { useAppState } from "@/lib/app-state";
import { t } from "@/lib/i18n";
import type { Ingredient } from "@/lib/types";

interface AinesosatProps { ingredients: Ingredient[] }

export function Ainesosat({ ingredients }: AinesosatProps) {
  const { locale } = useAppState();
  return (
    <div className="rounded-[10px] overflow-hidden" style={{ background: "var(--ios-card)" }}>
      <p className="px-4 pt-3 pb-1 text-[13px] font-semibold" style={{ color: "var(--ios-secondary-label)" }}>
        {t("recipe.ingredients", locale)}
      </p>
      {ingredients.map((item, i) => (
        <div
          key={i}
          className="flex items-baseline gap-2 px-4 py-[8px] text-[15px]"
          style={{ borderBottom: i < ingredients.length - 1 ? "0.5px solid var(--ios-separator)" : "none" }}
        >
          <span className="shrink-0 font-mono text-[13px]" style={{ color: "var(--ios-secondary-label)" }}>
            {item.amount} {item.unit}
          </span>
          <span>{item.name}</span>
        </div>
      ))}
    </div>
  );
}
