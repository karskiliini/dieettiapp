"use client";

import { useAppState } from "@/lib/app-state";
import { t } from "@/lib/i18n";

interface RavintotiedotProps {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
}

export function Ravintotiedot({
  calories,
  proteinGrams,
  carbsGrams,
  fatGrams,
}: RavintotiedotProps) {
  const { locale } = useAppState();
  const total = proteinGrams + carbsGrams + fatGrams;
  const proteinPct = total > 0 ? (proteinGrams / total) * 100 : 0;
  const carbsPct = total > 0 ? (carbsGrams / total) * 100 : 0;
  const fatPct = total > 0 ? (fatGrams / total) * 100 : 0;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">{t("recipe.nutrition", locale)}</h3>
      <div className="text-center">
        <p className="font-mono text-3xl font-bold">{calories}</p>
        <p className="text-sm text-muted-foreground">kcal / annos</p>
      </div>
      <div className="space-y-3">
        <MacroBar
          label={t("day.protein", locale)}
          grams={proteinGrams}
          percentage={proteinPct}
          color="bg-blue-500"
        />
        <MacroBar
          label={t("day.carbs", locale)}
          grams={carbsGrams}
          percentage={carbsPct}
          color="bg-amber-500"
        />
        <MacroBar
          label={t("day.fat", locale)}
          grams={fatGrams}
          percentage={fatPct}
          color="bg-rose-500"
        />
      </div>
    </div>
  );
}

function MacroBar({
  label,
  grams,
  percentage,
  color,
}: {
  label: string;
  grams: number;
  percentage: number;
  color: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-mono">{grams}g</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
