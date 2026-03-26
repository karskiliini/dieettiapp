"use client";

import { useRef, useCallback } from "react";
import { ChevronRight } from "lucide-react";
import { MEALS_BY_COUNT, type MealType } from "@/lib/constants";
import { useAppState } from "@/lib/app-state";
import { getDateForWeekDay } from "@/lib/utils";
import { t, dayName, mealLabel } from "@/lib/i18n";
import { ViikkoNavigaatio } from "@/components/navigaatio/viikko-navigaatio";
import { AteriamaaraValitsin } from "@/components/navigaatio/ateriamaara-valitsin";

interface MealPlanEntry {
  dayOfWeek: number;
  mealType: MealType;
  recipe: { id: number; name: string; calories: number };
}

interface Props {
  mealPlan: MealPlanEntry[];
  mealCount: number;
  onDayClick: (day: number) => void;
  onRecipeClick: (id: number) => void;
}

export function ViikkoNakymaInline({ mealPlan, mealCount, onDayClick, onRecipeClick }: Props) {
  const { weekNumber, year, locale } = useAppState();
  const visibleMeals = MEALS_BY_COUNT[mealCount] || MEALS_BY_COUNT[3];
  const dayGroups = Array.from({ length: 7 }, (_, i) => ({
    dayOfWeek: i,
    meals: mealPlan.filter((m) => m.dayOfWeek === i),
  }));

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex shrink-0 items-center justify-between">
        <ViikkoNavigaatio />
        <AteriamaaraValitsin />
      </div>
      <div className="flex-1 overflow-y-auto -mx-4 px-4 space-y-3">
        {dayGroups.map((day) => {
          const totalCal = day.meals.reduce((s, m) => s + m.recipe.calories, 0);
          return (
            <div key={day.dayOfWeek} className="rounded-[10px] overflow-hidden" style={{ background: "var(--ios-card)" }}>
              <button
                className="flex w-full items-center justify-between px-4 py-[10px] ios-row"
                onClick={() => onDayClick(day.dayOfWeek)}
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-[15px] font-semibold">{dayName(day.dayOfWeek, locale)}</span>
                  <span className="text-[13px]" style={{ color: "var(--ios-secondary-label)" }}>
                    {getDateForWeekDay(weekNumber, year, day.dayOfWeek)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[13px] font-mono" style={{ color: "var(--ios-secondary-label)" }}>{totalCal} kcal</span>
                  <ChevronRight className="h-4 w-4" style={{ color: "var(--ios-gray3)" }} />
                </div>
              </button>
              <div style={{ borderTop: "0.5px solid var(--ios-separator)" }}>
                {visibleMeals.map((type, i) => {
                  const meal = day.meals.find((m) => m.mealType === type);
                  if (!meal) return null;
                  return (
                    <MealRow
                      key={type}
                      label={mealLabel(type, locale)}
                      recipeName={meal.recipe.name}
                      calories={meal.recipe.calories}
                      showSeparator={i < visibleMeals.length - 1}
                      onClick={() => onRecipeClick(meal.recipe.id)}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
        <div className="h-2" />
      </div>
    </div>
  );
}

function MealRow({ label, recipeName, calories, showSeparator, onClick }: {
  label: string; recipeName: string; calories: number; showSeparator: boolean; onClick: () => void;
}) {
  const didMove = useRef(false);

  const handleTouchStart = useCallback(() => { didMove.current = false; }, []);
  const handleTouchMove = useCallback(() => { didMove.current = true; }, []);
  const handleTouchEnd = useCallback(() => { if (!didMove.current) onClick(); }, [onClick]);

  return (
    <div
      className="cursor-pointer select-none ios-row"
      style={{ borderBottom: showSeparator ? "0.5px solid var(--ios-separator)" : "none" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex items-center justify-between px-4 py-[8px]">
        <div className="min-w-0 flex-1">
          <p className="text-[11px]" style={{ color: "var(--ios-blue)" }}>{label}</p>
          <p className="text-[15px] truncate">{recipeName}</p>
        </div>
        <span className="text-[13px] font-mono shrink-0 ml-2" style={{ color: "var(--ios-secondary-label)" }}>{calories}</span>
      </div>
    </div>
  );
}
