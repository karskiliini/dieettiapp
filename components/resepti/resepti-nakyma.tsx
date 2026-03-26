import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, Users } from "lucide-react";
import { DIET_LABELS, MEAL_LABELS, type DietCategory, type MealType } from "@/lib/constants";
import type { Ingredient } from "@/lib/types";
import { Ravintotiedot } from "./ravintotiedot";
import { Ainesosat } from "./ainesosat";
import { Ohjeet } from "./ohjeet";


interface ReseptiNakymaProps {
  recipe: {
    name: string;
    description: string;
    dietCategory: DietCategory;
    mealType: MealType;
    ingredients: Ingredient[];
    instructions: string[];
    prepTimeMinutes: number;
    cookTimeMinutes: number;
    servings: number;
    calories: number;
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
  };
}

export function ReseptiNakyma({ recipe }: ReseptiNakymaProps) {
  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{recipe.name}</h2>
        <p className="mt-1 text-muted-foreground">{recipe.description}</p>
        <div className="mt-3 flex gap-2">
          <Badge variant="secondary">
            {DIET_LABELS[recipe.dietCategory]}
          </Badge>
          <Badge variant="outline">
            {MEAL_LABELS[recipe.mealType]}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="flex flex-col items-center py-3">
            <Clock className="mb-1 h-4 w-4 text-muted-foreground" />
            <span className="font-mono text-lg font-bold">{totalTime}</span>
            <span className="text-xs text-muted-foreground">minuuttia</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center py-3">
            <Users className="mb-1 h-4 w-4 text-muted-foreground" />
            <span className="font-mono text-lg font-bold">
              {recipe.servings}
            </span>
            <span className="text-xs text-muted-foreground">annosta</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center py-3">
            <span className="mb-1 text-xs text-muted-foreground">kcal</span>
            <span className="font-mono text-lg font-bold">
              {recipe.calories}
            </span>
            <span className="text-xs text-muted-foreground">/ annos</span>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="py-4">
          <Ravintotiedot
            calories={recipe.calories}
            proteinGrams={recipe.proteinGrams}
            carbsGrams={recipe.carbsGrams}
            fatGrams={recipe.fatGrams}
          />
        </CardContent>
      </Card>

      <Separator />

      <Ainesosat ingredients={recipe.ingredients} />

      <Separator />

      <Ohjeet instructions={recipe.instructions} />
    </div>
  );
}
