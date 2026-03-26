"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { DietCategory, MealType } from "./constants";
import { getWeekNumber, getCurrentYear } from "./utils";
import type { Locale } from "./i18n";

function overrideKey(weekNumber: number, year: number, dayOfWeek: number, mealType: MealType) {
  return `${weekNumber}-${year}-${dayOfWeek}-${mealType}`;
}

function loadLocale(): Locale {
  if (typeof window === "undefined") return "fi";
  try {
    const saved = localStorage.getItem("dieettiapp-locale");
    if (saved === "en" || saved === "fi") return saved;
  } catch {}
  return "fi";
}

interface AppState {
  locale: Locale;
  dietti: DietCategory;
  weekNumber: number;
  year: number;
  mealCount: number;
  jiggleMode: boolean;
  setLocale: (l: Locale) => void;
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
  const [locale, setLocaleState] = useState<Locale>("fi");
  const [dietti, setDietti] = useState<DietCategory>("keto");
  const [weekNumber, setWeekNumber] = useState(getWeekNumber());
  const [year, setYear] = useState(getCurrentYear());
  const [mealCount, setMealCount] = useState(3);
  const [jiggleMode, setJiggleMode] = useState(false);
  const [overrides, setOverrides] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    setLocaleState(loadLocale());
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try { localStorage.setItem("dieettiapp-locale", l); } catch {}
  }, []);

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
        locale,
        dietti,
        weekNumber,
        year,
        mealCount,
        jiggleMode,
        setLocale,
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
