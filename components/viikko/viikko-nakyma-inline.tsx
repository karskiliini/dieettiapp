"use client";

import { useRef, useState } from "react";
import { ChevronRight, ArrowLeftRight } from "lucide-react";
import { MEALS_BY_COUNT, type MealType } from "@/lib/constants";
import { useAppState } from "@/lib/app-state";
import { getDateForWeekDay } from "@/lib/utils";
import { dayName, mealLabel } from "@/lib/i18n";
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
  onSwapMeal?: (dayOfWeek: number, mealType: MealType) => void;
}

export function ViikkoNakymaInline({ mealPlan, mealCount, onDayClick, onRecipeClick, onSwapMeal }: Props) {
  const { weekNumber, year, locale } = useAppState();
  const visibleMeals = MEALS_BY_COUNT[mealCount] || MEALS_BY_COUNT[3];
  const swapLabel = locale === "fi" ? "Vaihda" : "Swap";
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
                    <SwipeableMealCell
                      key={type}
                      label={mealLabel(type, locale)}
                      recipeName={meal.recipe.name}
                      calories={meal.recipe.calories}
                      swapLabel={swapLabel}
                      showSeparator={i < visibleMeals.length - 1}
                      onClick={() => onRecipeClick(meal.recipe.id)}
                      onSwap={() => onSwapMeal?.(day.dayOfWeek, type)}
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

function SwipeableMealCell({
  label, recipeName, calories, swapLabel, showSeparator, onClick, onSwap,
}: {
  label: string; recipeName: string; calories: number; swapLabel: string;
  showSeparator: boolean; onClick: () => void; onSwap: () => void;
}) {
  const [offsetX, setOffsetX] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const locked = useRef<"h" | "v" | null>(null);
  const didMove = useRef(false);
  const cellWidth = useRef(typeof window !== "undefined" ? window.innerWidth : 375);
  const THRESHOLD = cellWidth.current * 0.25;
  const triggered = offsetX < -THRESHOLD;

  function handleTouchStart(e: React.TouchEvent) {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    locked.current = null;
    didMove.current = false;
    setIsAnimating(false);
    cellWidth.current = window.innerWidth;
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (!touchStart.current) return;
    const dx = e.touches[0].clientX - touchStart.current.x;
    const dy = e.touches[0].clientY - touchStart.current.y;
    if (locked.current === null && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
      locked.current = Math.abs(dx) > Math.abs(dy) ? "h" : "v";
    }
    if (locked.current !== "h") return;
    didMove.current = true;
    e.preventDefault();
    setOffsetX(Math.min(0, dx));
  }

  function handleTouchEnd() {
    touchStart.current = null;
    if (!didMove.current) { onClick(); return; }
    if (triggered) {
      setIsAnimating(true);
      setOffsetX(-cellWidth.current);
      setTimeout(() => { onSwap(); setOffsetX(0); setIsAnimating(false); }, 250);
    } else {
      setIsAnimating(true);
      setOffsetX(0);
      setTimeout(() => setIsAnimating(false), 250);
    }
  }

  const swipeProgress = Math.min(Math.abs(offsetX) / THRESHOLD, 1);
  const iconScale = 1 + swipeProgress * 0.4;
  const bgOpacity = 0.6 + swipeProgress * 0.4;

  return (
    <div
      className="relative overflow-hidden select-none"
      style={{ borderBottom: showSeparator ? "0.5px solid var(--ios-separator)" : "none", touchAction: "pan-y" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Swap action behind */}
      {Math.abs(offsetX) > 5 && (
        <div
          className="absolute right-0 top-0 bottom-0 flex items-center justify-center"
          style={{
            width: Math.abs(offsetX),
            background: `rgba(10,132,255,${bgOpacity})`,
            transition: isAnimating ? "width 0.25s ease-out" : "none",
          }}
        >
          {Math.abs(offsetX) > 20 && (
            <div style={{ transform: `scale(${iconScale})`, transition: "transform 0.1s ease-out" }}>
              <ArrowLeftRight className="h-4 w-4 text-white" />
            </div>
          )}
        </div>
      )}
      {/* Foreground */}
      <div
        className="relative cursor-pointer ios-row"
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: isAnimating ? "transform 0.25s ease-out" : "none",
          background: "var(--ios-card)",
        }}
      >
        <div className="flex items-center justify-between px-4 py-[8px]">
          <div className="min-w-0 flex-1">
            <p className="text-[11px]" style={{ color: "var(--ios-blue)" }}>{label}</p>
            <p className="text-[15px] truncate">{recipeName}</p>
          </div>
          <span className="text-[13px] font-mono shrink-0 ml-2" style={{ color: "var(--ios-secondary-label)" }}>{calories}</span>
        </div>
      </div>
    </div>
  );
}
