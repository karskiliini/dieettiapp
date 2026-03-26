"use client";

import { useAppState } from "@/lib/app-state";
import { t } from "@/lib/i18n";

interface RavintotiedotProps {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
}

export function Ravintotiedot({ proteinGrams, carbsGrams, fatGrams }: RavintotiedotProps) {
  const { locale } = useAppState();
  const total = proteinGrams + carbsGrams + fatGrams;
  const bars = [
    { label: t("day.protein", locale), grams: proteinGrams, pct: total > 0 ? (proteinGrams / total) * 100 : 0, color: "#0A84FF" },
    { label: t("day.carbs", locale), grams: carbsGrams, pct: total > 0 ? (carbsGrams / total) * 100 : 0, color: "#FF9F0A" },
    { label: t("day.fat", locale), grams: fatGrams, pct: total > 0 ? (fatGrams / total) * 100 : 0, color: "#FF453A" },
  ];

  return (
    <div className="rounded-[10px] p-4 space-y-3" style={{ background: "var(--ios-card)" }}>
      <p className="text-[13px] font-semibold" style={{ color: "var(--ios-secondary-label)" }}>
        {t("recipe.nutrition", locale)}
      </p>
      {bars.map(({ label, grams, pct, color }) => (
        <div key={label} className="space-y-1">
          <div className="flex justify-between text-[13px]">
            <span>{label}</span>
            <span className="font-mono">{grams}g</span>
          </div>
          <div className="h-[6px] rounded-full overflow-hidden" style={{ background: "var(--ios-gray4)" }}>
            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
          </div>
        </div>
      ))}
    </div>
  );
}
