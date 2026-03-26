"use client";

import type { MealStatus } from "@/lib/meal-tracker";
import { useAppState } from "@/lib/app-state";
import { Check, X, Utensils, RotateCcw } from "lucide-react";

interface Props {
  status: MealStatus;
  onEaten: () => void;
  onSkipped: () => void;
  onCustom: () => void;
  onReset: () => void;
}

export function MealActions({ status, onEaten, onSkipped, onCustom, onReset }: Props) {
  const { locale } = useAppState();

  if (status.status !== "planned") {
    return (
      <div className="flex gap-2">
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px]"
          style={{ background: "var(--ios-gray5)", color: "var(--ios-secondary-label)" }}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {locale === "fi" ? "Kumoa" : "Undo"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={onEaten}
        className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium"
        style={{ background: "rgba(48,209,88,0.2)", color: "var(--ios-green)" }}
      >
        <Check className="h-3.5 w-3.5" />
        {locale === "fi" ? "Syöty" : "Eaten"}
      </button>
      <button
        onClick={onSkipped}
        className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium"
        style={{ background: "var(--ios-gray5)", color: "var(--ios-secondary-label)" }}
      >
        <X className="h-3.5 w-3.5" />
        {locale === "fi" ? "Ohitettu" : "Skipped"}
      </button>
      <button
        onClick={onCustom}
        className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium"
        style={{ background: "rgba(10,132,255,0.2)", color: "var(--ios-blue)" }}
      >
        <Utensils className="h-3.5 w-3.5" />
        {locale === "fi" ? "Muu ruoka" : "Other food"}
      </button>
    </div>
  );
}
