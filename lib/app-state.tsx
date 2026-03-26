"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { DietCategory, MealType } from "./constants";
import { getWeekNumber, getCurrentYear } from "./utils";

// Key for meal overrides: "weekNum-year-day-mealType"
function overrideKey(weekNumber: number, year: number, dayOfWeek: number, mealType: MealType) {
  return `${weekNumber}-${year}-${dayOfWeek}-${mealType}`;
}

interface AppState {
  dietti: DietCategory;
  weekNumber: number;
  year: number;
  mealCount: number;
  jiggleMode: boolean;
  setDietti: (d: DietCategory) => void;
  setWeek: (week: number, year: number) => void;
  setMealCount: (n: number) => void;
  nextWeek: () => void;
  prevWeek: () => void;
  setJiggleMode: (on: boolean) => void;
  overrideMeal: (dayOfWeek: number, mealType: MealType, recipeId: number) => void;
  getOverride: (dayOfWeek: number, mealType: MealType) => number | undefined;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [dietti, setDietti] = useState<DietCategory>("keto");
  const [weekNumber, setWeekNumber] = useState(getWeekNumber());
  const [year, setYear] = useState(getCurrentYear());
  const [mealCount, setMealCount] = useState(3);
  const [jiggleMode, setJiggleMode] = useState(false);
  const [overrides, setOverrides] = useState<Map<string, number>>(new Map());

  function setWeek(w: number, y: number) {
    setWeekNumber(w);
    setYear(y);
  }

  function nextWeek() {
    if (weekNumber >= 52) {
      setWeekNumber(1);
      setYear(year + 1);
    } else {
      setWeekNumber(weekNumber + 1);
    }
  }

  function prevWeek() {
    if (weekNumber <= 1) {
      setWeekNumber(52);
      setYear(year - 1);
    } else {
      setWeekNumber(weekNumber - 1);
    }
  }

  const overrideMeal = useCallback(
    (dayOfWeek: number, mealType: MealType, recipeId: number) => {
      setOverrides((prev) => {
        const next = new Map(prev);
        next.set(overrideKey(weekNumber, year, dayOfWeek, mealType), recipeId);
        return next;
      });
    },
    [weekNumber, year]
  );

  const getOverride = useCallback(
    (dayOfWeek: number, mealType: MealType) => {
      return overrides.get(overrideKey(weekNumber, year, dayOfWeek, mealType));
    },
    [overrides, weekNumber, year]
  );

  return (
    <AppContext.Provider
      value={{
        dietti,
        weekNumber,
        year,
        mealCount,
        jiggleMode,
        setDietti,
        setWeek,
        setMealCount,
        nextWeek,
        prevWeek,
        setJiggleMode,
        overrideMeal,
        getOverride,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppState must be inside AppProvider");
  return ctx;
}
