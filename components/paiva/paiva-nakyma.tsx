"use client";

import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock } from "lucide-react";
import { MEALS_BY_COUNT, type MealType } from "@/lib/constants";
import { useAppState } from "@/lib/app-state";
import { cn, getDateForWeekDay } from "@/lib/utils";
import { t, dayName, mealLabel } from "@/lib/i18n";
import { PaivaOstoslista } from "./paiva-ostoslista";
import { RECIPES } from "@/lib/data";

interface MealEntry {
  mealType: MealType;
  recipe: {
    id: number;
    name: string;
    calories: number;
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
    prepTimeMinutes: number;
    cookTimeMinutes: number;
  };
}

interface PaivaNakymaProps {
  dayOfWeek: number;
  meals: MealEntry[];
  mealCount: number;
  onRecipeClick?: (id: number, mealType?: MealType) => void;
}

export function PaivaNakyma({
  dayOfWeek,
  meals,
  mealCount,
  onRecipeClick,
}: PaivaNakymaProps) {
  const { weekNumber, year, jiggleMode, setJiggleMode, locale } = useAppState();
  const totalCalories = meals.reduce((sum, m) => sum + m.recipe.calories, 0);
  const totalProtein = meals.reduce((sum, m) => sum + m.recipe.proteinGrams, 0);
  const totalCarbs = meals.reduce((sum, m) => sum + m.recipe.carbsGrams, 0);
  const totalFat = meals.reduce((sum, m) => sum + m.recipe.fatGrams, 0);
  const visibleMeals = MEALS_BY_COUNT[mealCount] || MEALS_BY_COUNT[3];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">
        {dayName(dayOfWeek, locale)}{" "}
        <span className="text-sm font-normal text-muted-foreground">
          {getDateForWeekDay(weekNumber, year, dayOfWeek)}
        </span>
      </h2>

      {jiggleMode && (
        <p className="text-center text-xs text-muted-foreground animate-pulse">
          {t("picker.tapToSwap", locale)}
        </p>
      )}

      <div className="space-y-3">
        {visibleMeals.map((type) => {
          const meal = meals.find((m) => m.mealType === type);
          if (!meal) return null;
          const totalTime =
            meal.recipe.prepTimeMinutes + meal.recipe.cookTimeMinutes;
          return (
            <DayMealCard
              key={type}
              mealType={type}
              recipe={meal.recipe}
              totalTime={totalTime}
              jiggling={jiggleMode}
              onLongPress={() => setJiggleMode(true)}
              onClick={() => onRecipeClick?.(meal.recipe.id, type)}
            />
          );
        })}
      </div>

      <Separator />

      <div className="rounded-lg bg-muted p-4">
        <h3 className="mb-2 text-sm font-semibold">{t("day.summary", locale)}</h3>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="font-mono text-lg font-bold">{totalCalories}</p>
            <p className="text-xs text-muted-foreground">kcal</p>
          </div>
          <div>
            <p className="font-mono text-lg font-bold">{totalProtein}g</p>
            <p className="text-xs text-muted-foreground">{t("day.protein", locale)}</p>
          </div>
          <div>
            <p className="font-mono text-lg font-bold">{totalCarbs}g</p>
            <p className="text-xs text-muted-foreground">{t("day.carbs", locale)}</p>
          </div>
          <div>
            <p className="font-mono text-lg font-bold">{totalFat}g</p>
            <p className="text-xs text-muted-foreground">{t("day.fat", locale)}</p>
          </div>
        </div>
      </div>

      <Separator />

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

function DayMealCard({
  mealType,
  recipe,
  totalTime,
  jiggling,
  onLongPress,
  onClick,
}: {
  mealType: MealType;
  recipe: {
    name: string;
    calories: number;
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
  };
  totalTime: number;
  jiggling: boolean;
  onLongPress: () => void;
  onClick: () => void;
}) {
  const { locale } = useAppState();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPress = useRef(false);
  const didMove = useRef(false);

  const handleTouchStart = () => {
    didLongPress.current = false;
    didMove.current = false;
    timerRef.current = setTimeout(() => {
      didLongPress.current = true;
      onLongPress();
      if (navigator.vibrate) navigator.vibrate(30);
    }, 500);
  };

  const handleTouchEnd = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (!didLongPress.current && !didMove.current) {
      onClick();
    }
  };

  const handleTouchMove = () => {
    didMove.current = true;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <div
      data-meal
      className={cn(
        "w-full text-left select-none cursor-pointer",
        jiggling && "animate-jiggle"
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onContextMenu={(e) => e.preventDefault()}
    >
      <Card className={cn(
        "transition-colors hover:bg-accent/50",
        jiggling && "ring-1 ring-primary/30 bg-accent/30"
      )}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {mealLabel(mealType, locale)}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {totalTime} min
            </div>
          </div>
          <CardTitle className="text-base">{recipe.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm font-semibold">
              {recipe.calories} kcal
            </span>
            <div className="flex gap-3 text-xs text-muted-foreground">
              <span>P {recipe.proteinGrams}g</span>
              <span>HH {recipe.carbsGrams}g</span>
              <span>R {recipe.fatGrams}g</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
