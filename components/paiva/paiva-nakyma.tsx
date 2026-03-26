"use client";

import { useRef } from "react";
import { ChevronRight, Clock } from "lucide-react";
import { MEALS_BY_COUNT, type MealType } from "@/lib/constants";
import { useAppState } from "@/lib/app-state";
import { cn, getDateForWeekDay } from "@/lib/utils";
import { t, dayName, mealLabel } from "@/lib/i18n";
import { PaivaOstoslista } from "./paiva-ostoslista";
import { RECIPES } from "@/lib/data";
import { useMealTracker, type MealStatus } from "@/lib/meal-tracker";
import { MealStatusBadge } from "@/components/tracking/meal-status-badge";
import { MealActions } from "@/components/tracking/meal-actions";

interface MealEntry {
  mealType: MealType;
  recipe: {
    id: number; name: string; calories: number;
    proteinGrams: number; carbsGrams: number; fatGrams: number;
    prepTimeMinutes: number; cookTimeMinutes: number;
  };
}

interface PaivaNakymaProps {
  dayOfWeek: number;
  meals: MealEntry[];
  mealCount: number;
  onRecipeClick?: (id: number, mealType?: MealType) => void;
  onLogCustom?: (dayOfWeek: number, mealType: MealType) => void;
}

export function PaivaNakyma({ dayOfWeek, meals, mealCount, onRecipeClick, onLogCustom }: PaivaNakymaProps) {
  const { weekNumber, year, jiggleMode, setJiggleMode, locale } = useAppState();
  const tracker = useMealTracker(weekNumber, year);
  const visibleMeals = MEALS_BY_COUNT[mealCount] || MEALS_BY_COUNT[3];

  // Calculate totals based on actual status
  let totalCalories = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;
  for (const meal of meals) {
    const s = tracker.getStatus(dayOfWeek, meal.mealType);
    if (s.status === "eaten") {
      totalCalories += meal.recipe.calories;
      totalProtein += meal.recipe.proteinGrams;
      totalCarbs += meal.recipe.carbsGrams;
      totalFat += meal.recipe.fatGrams;
    } else if (s.status === "custom") {
      for (const f of s.foods) {
        totalCalories += f.calories;
        totalProtein += f.protein;
        totalCarbs += f.carbs;
        totalFat += f.fat;
      }
    } else if (s.status === "planned") {
      totalCalories += meal.recipe.calories;
      totalProtein += meal.recipe.proteinGrams;
      totalCarbs += meal.recipe.carbsGrams;
      totalFat += meal.recipe.fatGrams;
    }
  }

  return (
    <div className="space-y-4 pb-8">
      <h2 className="text-[22px] font-bold">
        {dayName(dayOfWeek, locale)}{" "}
        <span className="text-[15px] font-normal" style={{ color: "var(--ios-secondary-label)" }}>
          {getDateForWeekDay(weekNumber, year, dayOfWeek)}
        </span>
      </h2>

      {jiggleMode && (
        <p className="text-center text-[13px] animate-pulse" style={{ color: "var(--ios-secondary-label)" }}>
          {t("picker.tapToSwap", locale)}
        </p>
      )}

      <div className="space-y-3">
        {visibleMeals.map((type) => {
          const meal = meals.find((m) => m.mealType === type);
          if (!meal) return null;
          const status = tracker.getStatus(dayOfWeek, type);
          const totalTime = meal.recipe.prepTimeMinutes + meal.recipe.cookTimeMinutes;
          return (
            <div key={type}>
              <DayMealRow
                mealType={type}
                label={mealLabel(type, locale)}
                recipe={meal.recipe}
                totalTime={totalTime}
                status={status}
                jiggling={jiggleMode}
                onLongPress={() => setJiggleMode(true)}
                onClick={() => onRecipeClick?.(meal.recipe.id, type)}
              />
              {!jiggleMode && (
                <div className="px-2 py-2">
                  <MealActions
                    status={status}
                    onEaten={() => tracker.setStatus(dayOfWeek, type, { status: "eaten" })}
                    onSkipped={() => tracker.setStatus(dayOfWeek, type, { status: "skipped" })}
                    onCustom={() => onLogCustom?.(dayOfWeek, type)}
                    onReset={() => tracker.setStatus(dayOfWeek, type, { status: "planned" })}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="rounded-[10px] p-4" style={{ background: "var(--ios-card)" }}>
        <p className="text-[13px] font-semibold mb-3" style={{ color: "var(--ios-secondary-label)" }}>
          {t("day.summary", locale)}
        </p>
        <div className="grid grid-cols-4 gap-3 text-center">
          {[
            { val: totalCalories, unit: "kcal" },
            { val: `${totalProtein}g`, unit: t("day.protein", locale) },
            { val: `${totalCarbs}g`, unit: t("day.carbs", locale) },
            { val: `${totalFat}g`, unit: t("day.fat", locale) },
          ].map(({ val, unit }) => (
            <div key={unit}>
              <p className="text-[20px] font-bold font-mono">{val}</p>
              <p className="text-[11px]" style={{ color: "var(--ios-secondary-label)" }}>{unit}</p>
            </div>
          ))}
        </div>
      </div>

      <PaivaOstoslista
        meals={meals.map((m) => ({
          mealType: m.mealType,
          recipe: {
            name: m.recipe.name,
            ingredients: RECIPES.find((r) => r.id === m.recipe.id)?.ingredients || [],
          },
        }))}
        dayName={`${dayName(dayOfWeek, locale)} ${getDateForWeekDay(weekNumber, year, dayOfWeek)}`}
      />
    </div>
  );
}

function DayMealRow({
  label, recipe, totalTime, status, jiggling, onLongPress, onClick,
}: {
  mealType: MealType; label: string;
  recipe: { name: string; calories: number; proteinGrams: number; carbsGrams: number; fatGrams: number };
  totalTime: number; status: MealStatus; jiggling: boolean;
  onLongPress: () => void; onClick: () => void;
}) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPress = useRef(false);
  const didMove = useRef(false);
  const isConsumed = status.status === "eaten" || status.status === "custom";
  const isSkipped = status.status === "skipped";

  return (
    <div
      data-meal
      className={cn("rounded-[10px] cursor-pointer select-none", jiggling && "animate-jiggle")}
      style={{
        background: "var(--ios-card)",
        opacity: isSkipped ? 0.4 : 1,
      }}
      onTouchStart={() => {
        didLongPress.current = false; didMove.current = false;
        timerRef.current = setTimeout(() => { didLongPress.current = true; onLongPress(); if(navigator.vibrate) navigator.vibrate(30); }, 500);
      }}
      onTouchEnd={() => {
        if(timerRef.current){clearTimeout(timerRef.current);timerRef.current=null;}
        if(!didLongPress.current && !didMove.current) onClick();
      }}
      onTouchMove={() => { didMove.current=true; if(timerRef.current){clearTimeout(timerRef.current);timerRef.current=null;} }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-[11px] font-semibold" style={{ color: "var(--ios-blue)" }}>{label}</p>
            <MealStatusBadge status={status} />
          </div>
          <p className={cn("text-[17px] truncate", isSkipped && "line-through")}>{recipe.name}</p>
          {status.status === "custom" && (
            <p className="text-[13px]" style={{ color: "var(--ios-blue)" }}>
              {status.foods.map((f) => `${f.name} ${f.grams}g`).join(", ")}
            </p>
          )}
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-[13px] font-mono font-semibold">
              {status.status === "custom"
                ? `${status.foods.reduce((s, f) => s + f.calories, 0)} kcal`
                : `${recipe.calories} kcal`}
            </span>
            {status.status !== "custom" && (
              <span className="text-[11px]" style={{ color: "var(--ios-secondary-label)" }}>
                P {recipe.proteinGrams}g · HH {recipe.carbsGrams}g · R {recipe.fatGrams}g
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 ml-2 shrink-0">
          <div className="flex items-center gap-0.5 text-[11px]" style={{ color: "var(--ios-secondary-label)" }}>
            <Clock className="h-3 w-3" />{totalTime}
          </div>
          {!jiggling && <ChevronRight className="h-4 w-4 ml-1" style={{ color: "var(--ios-gray3)" }} />}
        </div>
      </div>
    </div>
  );
}
