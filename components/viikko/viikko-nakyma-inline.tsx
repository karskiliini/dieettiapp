"use client";

import { useRef, useCallback } from "react";
import { Separator } from "@/components/ui/separator";
import { ViikkoNavigaatio } from "@/components/navigaatio/viikko-navigaatio";
import { AteriamaaraValitsin } from "@/components/navigaatio/ateriamaara-valitsin";
import { MEALS_BY_COUNT, type MealType } from "@/lib/constants";
import { useAppState } from "@/lib/app-state";
import { cn, getDateForWeekDay } from "@/lib/utils";
import { t, dayName, mealLabel } from "@/lib/i18n";

interface MealPlanEntry {
  dayOfWeek: number;
  mealType: MealType;
  recipe: {
    id: number;
    name: string;
    calories: number;
  };
}

interface Props {
  mealPlan: MealPlanEntry[];
  mealCount: number;
  onDayClick: (day: number) => void;
  onRecipeClick: (id: number, day: number, mealType: MealType) => void;
}

export function ViikkoNakymaInline({
  mealPlan,
  mealCount,
  onDayClick,
  onRecipeClick,
}: Props) {
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
        <p className="shrink-0 text-center text-xs text-muted-foreground animate-pulse">
          {t("picker.tapToSwap", locale)}
        </p>
      )}
      <div className="flex-1 overflow-y-auto space-y-1">
        {dayGroups.map((day) => {
          const totalCal = day.meals.reduce((s, m) => s + m.recipe.calories, 0);
          return (
            <div key={day.dayOfWeek} className="rounded-lg border border-border bg-card">
              {/* Day header */}
              <button
                className="flex w-full items-center justify-between px-3 py-2 text-left"
                onClick={() => onDayClick(day.dayOfWeek)}
              >
                <div>
                  <span className="text-sm font-semibold">
                    {dayName(day.dayOfWeek, locale)}
                  </span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {getDateForWeekDay(weekNumber, year, day.dayOfWeek)}
                  </span>
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  {totalCal} kcal
                </span>
              </button>
              {/* Meals row */}
              <div className="flex gap-px border-t border-border">
                {visibleMeals.map((type) => {
                  const meal = day.meals.find((m) => m.mealType === type);
                  if (!meal) return null;
                  return (
                    <MealCell
                      key={type}
                      mealType={type}
                      mealLabelText={mealLabel(type, locale)}
                      recipeName={meal.recipe.name}
                      calories={meal.recipe.calories}
                      jiggling={jiggleMode}
                      onLongPress={() => setJiggleMode(true)}
                      onClick={() =>
                        onRecipeClick(meal.recipe.id, day.dayOfWeek, type)
                      }
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MealCell({
  mealLabelText,
  recipeName,
  calories,
  jiggling,
  onLongPress,
  onClick,
}: {
  mealType: MealType;
  mealLabelText: string;
  recipeName: string;
  calories: number;
  jiggling: boolean;
  onLongPress: () => void;
  onClick: () => void;
}) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPress = useRef(false);
  const didMove = useRef(false);

  const handleTouchStart = useCallback(() => {
    didLongPress.current = false;
    didMove.current = false;
    timerRef.current = setTimeout(() => {
      didLongPress.current = true;
      onLongPress();
      if (navigator.vibrate) navigator.vibrate(30);
    }, 500);
  }, [onLongPress]);

  const handleTouchEnd = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (!didLongPress.current && !didMove.current) onClick();
  }, [onClick]);

  const handleTouchMove = useCallback(() => {
    didMove.current = true;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return (
    <div
      data-meal
      className={cn(
        "flex-1 min-w-0 px-2 py-1.5 text-left cursor-pointer select-none transition-colors hover:bg-accent/50",
        jiggling && "animate-jiggle bg-accent/30"
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onContextMenu={(e) => e.preventDefault()}
    >
      <p className="text-[10px] text-muted-foreground">{mealLabelText}</p>
      <p className="truncate text-xs font-medium">{recipeName}</p>
      <p className="font-mono text-[10px] text-muted-foreground">{calories}</p>
    </div>
  );
}
