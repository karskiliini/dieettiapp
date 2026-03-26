"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ViikkoNavigaatio } from "@/components/navigaatio/viikko-navigaatio";
import { AteriamaaraValitsin } from "@/components/navigaatio/ateriamaara-valitsin";
import { DAY_NAMES, MEALS_BY_COUNT, MEAL_LABELS, type MealType } from "@/lib/constants";
import { useAppState } from "@/lib/app-state";
import { getDateForWeekDay } from "@/lib/utils";

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
  onRecipeClick: (id: number) => void;
}

export function ViikkoNakymaInline({
  mealPlan,
  mealCount,
  onDayClick,
  onRecipeClick,
}: Props) {
  const { weekNumber, year } = useAppState();
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
                      <button
                        key={type}
                        onClick={() => onRecipeClick(meal.recipe.id)}
                        className="block w-full rounded-md p-2 text-left text-sm transition-colors hover:bg-accent"
                      >
                        <span className="text-xs text-muted-foreground">
                          {MEAL_LABELS[type]}
                        </span>
                        <p className="truncate font-medium">
                          {meal.recipe.name}
                        </p>
                        <span className="font-mono text-xs text-muted-foreground">
                          {meal.recipe.calories} kcal
                        </span>
                      </button>
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
