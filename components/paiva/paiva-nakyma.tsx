"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock } from "lucide-react";
import { DAY_NAMES, MEALS_BY_COUNT, MEAL_LABELS, type MealType } from "@/lib/constants";
import { useAppState } from "@/lib/app-state";
import { getDateForWeekDay } from "@/lib/utils";
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
  onRecipeClick?: (id: number) => void;
}

export function PaivaNakyma({
  dayOfWeek,
  meals,
  mealCount,
  onRecipeClick,
}: PaivaNakymaProps) {
  const { weekNumber, year } = useAppState();
  const totalCalories = meals.reduce((sum, m) => sum + m.recipe.calories, 0);
  const totalProtein = meals.reduce((sum, m) => sum + m.recipe.proteinGrams, 0);
  const totalCarbs = meals.reduce((sum, m) => sum + m.recipe.carbsGrams, 0);
  const totalFat = meals.reduce((sum, m) => sum + m.recipe.fatGrams, 0);
  const visibleMeals = MEALS_BY_COUNT[mealCount] || MEALS_BY_COUNT[3];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">
        {DAY_NAMES[dayOfWeek]}{" "}
        <span className="text-sm font-normal text-muted-foreground">
          {getDateForWeekDay(weekNumber, year, dayOfWeek)}
        </span>
      </h2>

      <div className="space-y-3">
        {visibleMeals.map((type) => {
          const meal = meals.find((m) => m.mealType === type);
          if (!meal) return null;
          const totalTime =
            meal.recipe.prepTimeMinutes + meal.recipe.cookTimeMinutes;
          return (
            <button
              key={type}
              onClick={() => onRecipeClick?.(meal.recipe.id)}
              className="w-full text-left"
            >
              <Card className="transition-colors hover:bg-accent/50">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {MEAL_LABELS[type]}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {totalTime} min
                    </div>
                  </div>
                  <CardTitle className="text-base">
                    {meal.recipe.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-semibold">
                      {meal.recipe.calories} kcal
                    </span>
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      <span>P {meal.recipe.proteinGrams}g</span>
                      <span>HH {meal.recipe.carbsGrams}g</span>
                      <span>R {meal.recipe.fatGrams}g</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>

      <Separator />

      <div className="rounded-lg bg-muted p-4">
        <h3 className="mb-2 text-sm font-semibold">Päivän yhteenveto</h3>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="font-mono text-lg font-bold">{totalCalories}</p>
            <p className="text-xs text-muted-foreground">kcal</p>
          </div>
          <div>
            <p className="font-mono text-lg font-bold">{totalProtein}g</p>
            <p className="text-xs text-muted-foreground">Proteiini</p>
          </div>
          <div>
            <p className="font-mono text-lg font-bold">{totalCarbs}g</p>
            <p className="text-xs text-muted-foreground">Hiilihydr.</p>
          </div>
          <div>
            <p className="font-mono text-lg font-bold">{totalFat}g</p>
            <p className="text-xs text-muted-foreground">Rasva</p>
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
        dayName={`${DAY_NAMES[dayOfWeek]} ${getDateForWeekDay(weekNumber, year, dayOfWeek)}`}
      />
    </div>
  );
}
