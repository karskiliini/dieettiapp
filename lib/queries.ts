import { RECIPES, getMealPlanForWeek } from "./data";
import type { DietCategory, MealType } from "./constants";
import { MEALS_BY_COUNT } from "./constants";

export async function getWeekMealPlan(
  dietCategory: DietCategory,
  weekNumber: number,
  year: number,
  mealCount: number = 3
) {
  const visibleMeals = MEALS_BY_COUNT[mealCount] || MEALS_BY_COUNT[3];
  return getMealPlanForWeek(weekNumber, year).filter(
    (m) =>
      m.dietCategory === dietCategory &&
      visibleMeals.includes(m.mealType)
  );
}

export async function getDayMealPlan(
  dietCategory: DietCategory,
  weekNumber: number,
  year: number,
  dayOfWeek: number,
  mealCount: number = 3
) {
  const visibleMeals = MEALS_BY_COUNT[mealCount] || MEALS_BY_COUNT[3];
  return getMealPlanForWeek(weekNumber, year).filter(
    (m) =>
      m.dietCategory === dietCategory &&
      m.dayOfWeek === dayOfWeek &&
      visibleMeals.includes(m.mealType)
  );
}

export async function getRecipeById(id: number) {
  return RECIPES.find((r) => r.id === id) ?? null;
}
