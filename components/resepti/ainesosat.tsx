"use client";

import { useAppState } from "@/lib/app-state";
import { t } from "@/lib/i18n";
import type { Ingredient } from "@/lib/types";

interface AinesosatProps {
  ingredients: Ingredient[];
}

export function Ainesosat({ ingredients }: AinesosatProps) {
  const { locale } = useAppState();
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">{t("recipe.ingredients", locale)}</h3>
      <ul className="space-y-2">
        {ingredients.map((item, i) => (
          <li key={i} className="flex items-baseline gap-2 text-sm">
            <span className="shrink-0 font-mono text-muted-foreground">
              {item.amount} {item.unit}
            </span>
            <span>{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
