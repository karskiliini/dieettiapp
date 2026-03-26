"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { DietCategory } from "./constants";
import { getWeekNumber, getCurrentYear } from "./utils";

interface AppState {
  dietti: DietCategory;
  weekNumber: number;
  year: number;
  mealCount: number;
  setDietti: (d: DietCategory) => void;
  setWeek: (week: number, year: number) => void;
  setMealCount: (n: number) => void;
  nextWeek: () => void;
  prevWeek: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [dietti, setDietti] = useState<DietCategory>("keto");
  const [weekNumber, setWeekNumber] = useState(getWeekNumber());
  const [year, setYear] = useState(getCurrentYear());
  const [mealCount, setMealCount] = useState(3);

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

  return (
    <AppContext.Provider
      value={{
        dietti,
        weekNumber,
        year,
        mealCount,
        setDietti,
        setWeek,
        setMealCount,
        nextWeek,
        prevWeek,
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
