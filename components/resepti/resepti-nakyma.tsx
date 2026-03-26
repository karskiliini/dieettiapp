"use client";

import { Clock, Users } from "lucide-react";
import type { DietCategory, MealType } from "@/lib/constants";
import type { Ingredient } from "@/lib/types";
import { useAppState } from "@/lib/app-state";
import { t, dietLabel, mealLabel } from "@/lib/i18n";
import { Ravintotiedot } from "./ravintotiedot";
import { Ainesosat } from "./ainesosat";
import { Ohjeet } from "./ohjeet";

interface ReseptiNakymaProps {
  recipe: {
    name: string; description: string;
    dietCategory: DietCategory; mealType: MealType;
    ingredients: Ingredient[]; instructions: string[];
    prepTimeMinutes: number; cookTimeMinutes: number; servings: number;
    calories: number; proteinGrams: number; carbsGrams: number; fatGrams: number;
  };
}

export function ReseptiNakyma({ recipe }: ReseptiNakymaProps) {
  const { locale } = useAppState();
  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-[28px] font-bold leading-tight">{recipe.name}</h2>
        <p className="text-[15px] mt-1" style={{ color: "var(--ios-secondary-label)" }}>{recipe.description}</p>
        <div className="flex gap-2 mt-2">
          <span className="rounded-full px-3 py-1 text-[13px] font-medium" style={{ background: "var(--ios-gray5)", color: "var(--ios-blue)" }}>
            {dietLabel(recipe.dietCategory, locale)}
          </span>
          <span className="rounded-full px-3 py-1 text-[13px] font-medium" style={{ background: "var(--ios-gray5)", color: "var(--ios-secondary-label)" }}>
            {mealLabel(recipe.mealType, locale)}
          </span>
        </div>
      </div>

      {/* Info pills */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: <Clock className="h-4 w-4" />, value: totalTime, label: t("recipe.minutes", locale) },
          { icon: <Users className="h-4 w-4" />, value: recipe.servings, label: t("recipe.servings", locale) },
          { icon: null, value: recipe.calories, label: "kcal" },
        ].map(({ icon, value, label }) => (
          <div key={label} className="rounded-[10px] py-3 text-center" style={{ background: "var(--ios-card)" }}>
            <div className="flex justify-center mb-1" style={{ color: "var(--ios-secondary-label)" }}>{icon}</div>
            <p className="text-[20px] font-bold font-mono">{value}</p>
            <p className="text-[11px]" style={{ color: "var(--ios-secondary-label)" }}>{label}</p>
          </div>
        ))}
      </div>

      <Ravintotiedot calories={recipe.calories} proteinGrams={recipe.proteinGrams} carbsGrams={recipe.carbsGrams} fatGrams={recipe.fatGrams} />
      <Ainesosat ingredients={recipe.ingredients} />
      <Ohjeet instructions={recipe.instructions} />
    </div>
  );
}
