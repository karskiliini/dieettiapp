"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MEAL_LABELS, type MealType } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface Ingredient {
  amount: number;
  unit: string;
  name: string;
}

interface MealWithIngredients {
  mealType: MealType;
  recipe: {
    name: string;
    ingredients: Ingredient[];
  };
}

interface Props {
  meals: MealWithIngredients[];
  dayName: string;
}

export function PaivaOstoslista({ meals, dayName }: Props) {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  // Merge all ingredients, grouping by name+unit
  const merged = new Map<string, { amount: number; unit: string; name: string }>();
  for (const meal of meals) {
    for (const ing of meal.recipe.ingredients) {
      const key = `${ing.name}__${ing.unit}`;
      const existing = merged.get(key);
      if (existing) {
        existing.amount += ing.amount;
      } else {
        merged.set(key, { ...ing });
      }
    }
  }
  const allIngredients = Array.from(merged.values());

  function toggle(key: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  if (!open) {
    return (
      <Button
        variant="outline"
        className="w-full gap-2"
        onClick={() => setOpen(true)}
      >
        <ShoppingCart className="h-4 w-4" />
        Koko päivän ostoslista
      </Button>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <ShoppingCart className="h-4 w-4" />
            Ostoslista — {dayName}
          </CardTitle>
          <span className="text-xs text-muted-foreground">
            {checked.size}/{allIngredients.length}
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {meals.map((m) => (
            <span
              key={m.mealType}
              className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground"
            >
              {MEAL_LABELS[m.mealType]}: {m.recipe.name}
            </span>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {allIngredients.map((item) => {
            const key = `${item.name}__${item.unit}`;
            return (
              <li key={key}>
                <button
                  onClick={() => toggle(key)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md p-2 text-left text-sm transition-colors hover:bg-accent",
                    checked.has(key) && "text-muted-foreground line-through"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded border",
                      checked.has(key)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground"
                    )}
                  >
                    {checked.has(key) && <Check className="h-3 w-3" />}
                  </div>
                  <span className="shrink-0 font-mono text-xs">
                    {item.amount} {item.unit}
                  </span>
                  <span>{item.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
