"use client";

import { useRef, useCallback } from "react";
import { ChevronRight } from "lucide-react";
import { MEALS_BY_COUNT, type MealType } from "@/lib/constants";
import { useAppState } from "@/lib/app-state";
import { cn, getDateForWeekDay } from "@/lib/utils";
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
  onRecipeClick: (id: number, day: number, mealType: MealType) => void;
}

export function ViikkoNakymaInline({ mealPlan, mealCount, onDayClick, onRecipeClick }: Props) {
  const { weekNumber, year, jiggleMode, setJiggleMode, locale } = useAppState();
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
      {jiggleMode && (
        <p className="text-center text-[13px] animate-pulse" style={{ color: "var(--ios-secondary-label)" }}>
          {t("picker.tapToSwap", locale)}
        </p>
      )}
      <div className="flex-1 overflow-y-auto -mx-4 px-4 space-y-3">
        {dayGroups.map((day) => {
          const totalCal = day.meals.reduce((s, m) => s + m.recipe.calories, 0);
          return (
            <div key={day.dayOfWeek} className="rounded-[10px] overflow-hidden" style={{ background: "var(--ios-card)" }}>
              {/* Day header row */}
              <button
                className="flex w-full items-center justify-between px-4 py-[10px] ios-row"
                onClick={() => !jiggleMode && onDayClick(day.dayOfWeek)}
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-[15px] font-semibold">{dayName(day.dayOfWeek, locale)}</span>
                  <span className="text-[13px]" style={{ color: "var(--ios-secondary-label)" }}>
                    {getDateForWeekDay(weekNumber, year, day.dayOfWeek)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[13px] font-mono" style={{ color: "var(--ios-secondary-label)" }}>
                    {totalCal} kcal
                  </span>
                  {!jiggleMode && <ChevronRight className="h-4 w-4" style={{ color: "var(--ios-gray3)" }} />}
                </div>
              </button>
              {/* Meals */}
              <div style={{ borderTop: "0.5px solid var(--ios-separator)" }}>
                {visibleMeals.map((type, i) => {
                  const meal = day.meals.find((m) => m.mealType === type);
                  if (!meal) return null;
                  return (
                    <MealRow
                      key={type}
                      mealType={type}
                      label={mealLabel(type, locale)}
                      recipeName={meal.recipe.name}
                      calories={meal.recipe.calories}
                      jiggling={jiggleMode}
                      showSeparator={i < visibleMeals.length - 1}
                      onLongPress={() => setJiggleMode(true)}
                      onClick={() => onRecipeClick(meal.recipe.id, day.dayOfWeek, type)}
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

function MealRow({
  label, recipeName, calories, jiggling, showSeparator, onLongPress, onClick,
}: {
  mealType: MealType; label: string; recipeName: string; calories: number;
  jiggling: boolean; showSeparator: boolean; onLongPress: () => void; onClick: () => void;
}) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPress = useRef(false);
  const didMove = useRef(false);

  const handleTouchStart = useCallback(() => {
    didLongPress.current = false; didMove.current = false;
    timerRef.current = setTimeout(() => {
      didLongPress.current = true; onLongPress();
      if (navigator.vibrate) navigator.vibrate(30);
    }, 500);
  }, [onLongPress]);

  const handleTouchEnd = useCallback(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    if (!didLongPress.current && !didMove.current) onClick();
  }, [onClick]);

  const handleTouchMove = useCallback(() => {
    didMove.current = true;
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
  }, []);

  return (
    <div
      data-meal
      className={cn("ios-row cursor-pointer select-none", jiggling && "animate-jiggle")}
      style={{
        borderBottom: showSeparator ? "0.5px solid var(--ios-separator)" : "none",
        marginLeft: showSeparator ? 16 : 0,
        background: jiggling ? "var(--ios-gray5)" : undefined,
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="flex items-center justify-between px-4 py-[8px]" style={{ marginLeft: showSeparator ? -16 : 0 }}>
        <div className="min-w-0 flex-1">
          <p className="text-[11px]" style={{ color: "var(--ios-blue)" }}>{label}</p>
          <p className="text-[15px] truncate">{recipeName}</p>
        </div>
        <span className="text-[13px] font-mono shrink-0 ml-2" style={{ color: "var(--ios-secondary-label)" }}>
          {calories}
        </span>
      </div>
    </div>
  );
}
