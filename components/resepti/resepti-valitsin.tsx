"use client";

import { RECIPES, type Recipe } from "@/lib/data";
import { useAppState } from "@/lib/app-state";
import { MEAL_LABELS, type MealType } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  mealType: MealType;
  dayOfWeek: number;
  onSelect: (recipeId: number) => void;
  onCancel: () => void;
}

export function ReseptiValitsin({ mealType, dayOfWeek, onSelect, onCancel }: Props) {
  const { dietti } = useAppState();

  // Show all recipes matching the current diet
  // Prioritize same meal type, then show others
  const sameMealType = RECIPES.filter(
    (r) => r.dietCategory === dietti && r.mealType === mealType
  );
  const otherMealType = RECIPES.filter(
    (r) => r.dietCategory === dietti && r.mealType !== mealType
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onCancel} className="gap-1 text-muted-foreground">
          <ChevronLeft className="h-4 w-4" />
          Peruuta
        </Button>
        <div>
          <h2 className="text-base font-semibold">Valitse ruoka</h2>
          <p className="text-xs text-muted-foreground">
            {MEAL_LABELS[mealType]}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {sameMealType.map((recipe) => (
          <RecipeOption key={recipe.id} recipe={recipe} onSelect={onSelect} />
        ))}
      </div>

      {otherMealType.length > 0 && (
        <>
          <p className="text-xs text-muted-foreground pt-2">Muut {dietti}-reseptit</p>
          <div className="space-y-2">
            {otherMealType.map((recipe) => (
              <RecipeOption key={recipe.id} recipe={recipe} onSelect={onSelect} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function RecipeOption({
  recipe,
  onSelect,
}: {
  recipe: Recipe;
  onSelect: (id: number) => void;
}) {
  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  return (
    <button onClick={() => onSelect(recipe.id)} className="w-full text-left">
      <Card className="transition-colors hover:bg-accent/50">
        <CardContent className="flex items-center justify-between py-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate font-medium text-sm">{recipe.name}</p>
              <Badge variant="outline" className="shrink-0 text-[10px]">
                {MEAL_LABELS[recipe.mealType]}
              </Badge>
            </div>
            <p className="truncate text-xs text-muted-foreground">
              {recipe.description}
            </p>
          </div>
          <div className="ml-3 shrink-0 text-right">
            <p className="font-mono text-sm font-semibold">{recipe.calories}</p>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock className="h-2.5 w-2.5" />
              {totalTime}min
            </div>
          </div>
        </CardContent>
      </Card>
    </button>
  );
}
