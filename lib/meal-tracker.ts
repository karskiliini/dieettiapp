"use client";

import { useState, useCallback, useEffect } from "react";
import type { MealType } from "./constants";

const STORAGE_KEY = "myplate-meal-tracker";
const REMINDERS_KEY = "myplate-reminders";

export interface EatenFood {
  foodId: string;
  name: string;
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export type MealStatus =
  | { status: "planned" }
  | { status: "eaten" }        // ate the planned meal
  | { status: "skipped" }
  | { status: "custom"; foods: EatenFood[] }; // ate something else

interface DayTracking {
  [mealKey: string]: MealStatus; // key: "dayOfWeek-mealType"
}

interface TrackingData {
  [weekKey: string]: DayTracking; // key: "year-weekNumber"
}

export interface MealReminder {
  mealType: MealType;
  hour: number;
  minute: number;
  enabled: boolean;
}

const DEFAULT_REMINDERS: MealReminder[] = [
  { mealType: "aamiainen", hour: 7, minute: 30, enabled: false },
  { mealType: "lounas", hour: 11, minute: 30, enabled: false },
  { mealType: "välipala", hour: 15, minute: 0, enabled: false },
  { mealType: "päivällinen", hour: 18, minute: 0, enabled: false },
  { mealType: "iltapala", hour: 20, minute: 30, enabled: false },
];

function loadTracking(): TrackingData {
  if (typeof window === "undefined") return {};
  try { const r = localStorage.getItem(STORAGE_KEY); if (r) return JSON.parse(r); } catch {}
  return {};
}

function saveTracking(data: TrackingData) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

function loadReminders(): MealReminder[] {
  if (typeof window === "undefined") return DEFAULT_REMINDERS;
  try { const r = localStorage.getItem(REMINDERS_KEY); if (r) return JSON.parse(r); } catch {}
  return DEFAULT_REMINDERS;
}

function saveReminders(data: MealReminder[]) {
  try { localStorage.setItem(REMINDERS_KEY, JSON.stringify(data)); } catch {}
}

function mealKey(dayOfWeek: number, mealType: MealType) {
  return `${dayOfWeek}-${mealType}`;
}

function weekKey(year: number, weekNumber: number) {
  return `${year}-${weekNumber}`;
}

export function useMealTracker(weekNumber: number, year: number) {
  const [tracking, setTracking] = useState<TrackingData>({});

  useEffect(() => { setTracking(loadTracking()); }, []);

  const wk = weekKey(year, weekNumber);

  const getStatus = useCallback(
    (dayOfWeek: number, mealType: MealType): MealStatus => {
      return tracking[wk]?.[mealKey(dayOfWeek, mealType)] ?? { status: "planned" };
    },
    [tracking, wk]
  );

  const setStatus = useCallback(
    (dayOfWeek: number, mealType: MealType, status: MealStatus) => {
      setTracking((prev) => {
        const next = { ...prev };
        if (!next[wk]) next[wk] = {};
        next[wk] = { ...next[wk], [mealKey(dayOfWeek, mealType)]: status };
        saveTracking(next);
        return next;
      });
    },
    [wk]
  );

  // Calculate remaining budget for the day based on what's been eaten/skipped
  const getDayBudget = useCallback(
    (
      dayOfWeek: number,
      plannedMeals: { mealType: MealType; calories: number; proteinGrams: number; carbsGrams: number; fatGrams: number }[],
      dailyTarget: { calories: number; protein: number; carbs: number; fat: number }
    ) => {
      let consumed = { calories: 0, protein: 0, carbs: 0, fat: 0 };

      for (const meal of plannedMeals) {
        const s = getStatus(dayOfWeek, meal.mealType);
        if (s.status === "eaten") {
          consumed.calories += meal.calories;
          consumed.protein += meal.proteinGrams;
          consumed.carbs += meal.carbsGrams;
          consumed.fat += meal.fatGrams;
        } else if (s.status === "custom") {
          for (const f of s.foods) {
            consumed.calories += f.calories;
            consumed.protein += f.protein;
            consumed.carbs += f.carbs;
            consumed.fat += f.fat;
          }
        }
        // skipped = 0 consumed
      }

      return {
        consumed,
        remaining: {
          calories: dailyTarget.calories - consumed.calories,
          protein: dailyTarget.protein - consumed.protein,
          carbs: dailyTarget.carbs - consumed.carbs,
          fat: dailyTarget.fat - consumed.fat,
        },
      };
    },
    [getStatus]
  );

  return { getStatus, setStatus, getDayBudget };
}

export function useReminders() {
  const [reminders, setReminders] = useState<MealReminder[]>(DEFAULT_REMINDERS);

  useEffect(() => { setReminders(loadReminders()); }, []);

  const updateReminder = useCallback(
    (mealType: MealType, updates: Partial<MealReminder>) => {
      setReminders((prev) => {
        const next = prev.map((r) =>
          r.mealType === mealType ? { ...r, ...updates } : r
        );
        saveReminders(next);
        return next;
      });
    },
    []
  );

  return { reminders, updateReminder };
}
