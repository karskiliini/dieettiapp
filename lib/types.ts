import type { DietCategory, MealType } from "./constants";

export interface Ingredient {
  amount: number;
  unit: string;
  name: string;
}

export interface Recipe {
  id: number;
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
  imageUrl: string | null;
  createdAt: Date;
}

export interface MealPlanEntry {
  id: number;
  dietCategory: DietCategory;
  weekNumber: number;
  year: number;
  dayOfWeek: number;
  mealType: MealType;
  recipeId: number;
  recipe: Recipe;
  createdAt: Date;
}

export interface DayMeals {
  dayOfWeek: number;
  meals: {
    aamiainen?: MealPlanEntry;
    lounas?: MealPlanEntry;
    päivällinen?: MealPlanEntry;
  };
  totalCalories: number;
}
