"use client";

import { useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ViikkoNavigaatio } from "@/components/navigaatio/viikko-navigaatio";
import { AteriamaaraValitsin } from "@/components/navigaatio/ateriamaara-valitsin";
import { DAY_NAMES, MEALS_BY_COUNT, MEAL_LABELS, type MealType } from "@/lib/constants";
import { useAppState } from "@/lib/app-state";
import { getDateForWeekDay } from "@/lib/utils";
import { cn } from "@/lib/utils";

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
  const { weekNumber, year, jiggleMode, setJiggleMode } = useAppState();
  const visibleMeals = MEALS_BY_COUNT[mealCount] || MEALS_BY_COUNT[3];
  const dayGroups = Array.from({ length: 7 }, (_, i) => ({
    dayOfWeek: i,
    meals: mealPlan.filter((m) => m.dayOfWeek === i),
  }));

  return (
    <div className="flex h-full flex-col gap-3">
      {!jiggleMode && (
        <div className="flex shrink-0 items-center justify-between">
          <ViikkoNavigaatio />
          <AteriamaaraValitsin />
        </div>
      )}
      {jiggleMode && (
        <p className="shrink-0 text-center text-xs text-muted-foreground animate-pulse">
          Klikkaa ruokaa vaihtaaksesi sen
        </p>
      )}
      <div className="flex min-h-0 flex-1 gap-3 overflow-x-auto pb-2 scrollbar-none">
        {dayGroups.map((day) => {
          const totalCalories = day.meals.reduce(
            (sum, m) => sum + m.recipe.calories,
            0
          );
          return (
            <Card
              key={day.dayOfWeek}
              className="flex min-w-[180px] shrink-0 flex-col"
            >
              <CardHeader className="shrink-0 pb-2">
                <CardTitle
                  className="cursor-pointer text-sm font-semibold hover:underline"
                  onClick={() => onDayClick(day.dayOfWeek)}
                >
                  {DAY_NAMES[day.dayOfWeek]}{" "}
                  <span className="font-normal text-muted-foreground">
                    {getDateForWeekDay(weekNumber, year, day.dayOfWeek)}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between pb-3">
                <div className="space-y-1">
                  {visibleMeals.map((type) => {
                    const meal = day.meals.find((m) => m.mealType === type);
                    if (!meal) return null;
                    return (
                      <MealButton
                        key={type}
                        mealType={type}
                        recipeName={meal.recipe.name}
                        calories={meal.recipe.calories}
                        jiggling={jiggleMode}
                        onLongPress={() => setJiggleMode(true)}
                        onClick={() =>
                          onRecipeClick(
                            meal.recipe.id,
                            day.dayOfWeek,
                            type
                          )
                        }
                      />
                    );
                  })}
                </div>
                <div className="mt-2">
                  <Separator />
                  <div className="px-2 pt-2 text-right font-mono text-xs text-muted-foreground">
                    Yht. {totalCalories} kcal
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function MealButton({
  mealType,
  recipeName,
  calories,
  jiggling,
  onLongPress,
  onClick,
}: {
  mealType: MealType;
  recipeName: string;
  calories: number;
  jiggling: boolean;
  onLongPress: () => void;
  onClick: () => void;
}) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPress = useRef(false);

  const handleTouchStart = useCallback(() => {
    didLongPress.current = false;
    timerRef.current = setTimeout(() => {
      didLongPress.current = true;
      onLongPress();
      // Haptic feedback if available
      if (navigator.vibrate) navigator.vibrate(30);
    }, 500);
  }, [onLongPress]);

  const handleTouchEnd = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (!didLongPress.current) {
      onClick();
    }
  }, [onClick]);

  const handleTouchMove = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return (
    <div
      className={cn(
        "block w-full rounded-md p-2 text-left text-sm transition-colors hover:bg-accent cursor-pointer select-none",
        jiggling && "animate-jiggle ring-1 ring-primary/30 bg-accent/30"
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onContextMenu={(e) => e.preventDefault()}
    >
      <span className="text-xs text-muted-foreground">
        {MEAL_LABELS[mealType]}
      </span>
      <p className="truncate font-medium">{recipeName}</p>
      <span className="font-mono text-xs text-muted-foreground">
        {calories} kcal
      </span>
    </div>
  );
}
