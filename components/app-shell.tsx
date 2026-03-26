"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { AppProvider, useAppState } from "@/lib/app-state";
import { useSwipe } from "@/lib/use-swipe";
import { MEALS_BY_COUNT, type MealType } from "@/lib/constants";
import { getMealPlanForWeek, RECIPES } from "@/lib/data";
import { DieettiTabs } from "./navigaatio/dieetti-tabs";
import { ViikkoNakymaInline } from "./viikko/viikko-nakyma-inline";
import { PaivaNakyma } from "./paiva/paiva-nakyma";
import { ReseptiNakyma } from "./resepti/resepti-nakyma";
import { ReseptiValitsin } from "./resepti/resepti-valitsin";
import { Ostoslista } from "./resepti/ostoslista";
import { ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

type View =
  | { type: "viikko" }
  | { type: "paiva"; dayOfWeek: number }
  | { type: "resepti"; recipeId: number }
  | { type: "valitse-resepti"; dayOfWeek: number; mealType: MealType };

function AppContent() {
  const {
    dietti,
    weekNumber,
    year,
    mealCount,
    jiggleMode,
    setJiggleMode,
    overrideMeal,
    getOverride,
  } = useAppState();
  const [view, setView] = useState<View>({ type: "viikko" });
  const [history, setHistory] = useState<View[]>([]);
  const [slideDir, setSlideDir] = useState<"in" | "out" | null>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  const canGoBack = view.type !== "viikko";

  const goTo = useCallback(
    (next: View) => {
      setSlideDir("in");
      setHistory((h) => [...h, view]);
      setView(next);
    },
    [view]
  );

  const goBack = useCallback(() => {
    setSlideDir("out");
    setHistory((h) => {
      const prev = h[h.length - 1];
      if (prev) {
        setView(prev);
        return h.slice(0, -1);
      }
      setView({ type: "viikko" });
      return [];
    });
  }, []);

  useEffect(() => {
    if (!slideDir) return;
    const timer = setTimeout(() => setSlideDir(null), 300);
    return () => clearTimeout(timer);
  }, [slideDir, view]);

  const swipeHandlers = useSwipe({
    onSwipeRight: canGoBack ? goBack : undefined,
  });

  // Build meal plan with overrides applied
  const visibleMeals = MEALS_BY_COUNT[mealCount] || MEALS_BY_COUNT[3];
  const baseMealPlan = getMealPlanForWeek(weekNumber, year).filter(
    (m) => m.dietCategory === dietti && visibleMeals.includes(m.mealType)
  );

  const mealPlan = baseMealPlan.map((entry) => {
    const overrideId = getOverride(entry.dayOfWeek, entry.mealType);
    if (overrideId !== undefined) {
      const recipe = RECIPES.find((r) => r.id === overrideId);
      if (recipe) {
        return { ...entry, recipeId: recipe.id, recipe };
      }
    }
    return entry;
  });

  // Handle click on meal in jiggle mode
  const handleMealClick = useCallback(
    (recipeId: number, dayOfWeek?: number, mealType?: MealType) => {
      if (jiggleMode && dayOfWeek !== undefined && mealType) {
        goTo({ type: "valitse-resepti", dayOfWeek, mealType });
      } else {
        goTo({ type: "resepti", recipeId });
      }
    },
    [jiggleMode, goTo]
  );

  // Handle background tap to exit jiggle mode
  const handleBackgroundClick = useCallback(
    (e: React.MouseEvent) => {
      if (!jiggleMode) return;
      // Only exit if clicking the background, not a meal button
      const target = e.target as HTMLElement;
      if (target === e.currentTarget || target.tagName === "MAIN") {
        setJiggleMode(false);
      }
    },
    [jiggleMode, setJiggleMode]
  );

  const dragStyle =
    swipeHandlers.isDragging && canGoBack
      ? {
          transform: `translateX(${Math.min(swipeHandlers.dragX, 200)}px)`,
          opacity: 1 - Math.min(swipeHandlers.dragX / 400, 0.3),
          transition: "none",
        }
      : undefined;

  const slideClass =
    slideDir === "in"
      ? "animate-slide-in"
      : slideDir === "out"
        ? "animate-slide-out"
        : "";

  return (
    <div
      className="flex h-[100dvh] flex-col overflow-hidden"
      onTouchStart={swipeHandlers.onTouchStart}
      onTouchMove={swipeHandlers.onTouchMove}
      onTouchEnd={swipeHandlers.onTouchEnd}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center justify-between px-4 py-3">
            {canGoBack ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setJiggleMode(false);
                  goBack();
                }}
                className="gap-1 text-muted-foreground"
              >
                <ChevronLeft className="h-4 w-4" />
                Takaisin
              </Button>
            ) : (
              <h1 className="text-lg font-bold">Dieettiapp</h1>
            )}
            {jiggleMode && view.type !== "valitse-resepti" && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setJiggleMode(false)}
              >
                Valmis
              </Button>
            )}
          </div>
          {view.type === "viikko" && !jiggleMode && <DieettiTabs />}
        </div>
      </header>

      {/* Content */}
      <main
        ref={mainRef}
        className={`mx-auto flex w-full max-w-5xl flex-1 flex-col overflow-auto p-4 ${slideClass}`}
        style={dragStyle}
        onClick={handleBackgroundClick}
      >
        {view.type === "viikko" && (
          <ViikkoNakymaInline
            mealPlan={mealPlan}
            mealCount={mealCount}
            onDayClick={(day) => {
              if (!jiggleMode) goTo({ type: "paiva", dayOfWeek: day });
            }}
            onRecipeClick={(id, day, mealType) =>
              handleMealClick(id, day, mealType)
            }
          />
        )}

        {view.type === "paiva" && (
          <PaivaNakyma
            dayOfWeek={view.dayOfWeek}
            meals={
              mealPlan.filter(
                (m) => m.dayOfWeek === view.dayOfWeek
              ) as any
            }
            mealCount={mealCount}
            onRecipeClick={(id, mealType) =>
              handleMealClick(id, view.dayOfWeek, mealType)
            }
          />
        )}

        {view.type === "resepti" && (
          <ReseptiView recipeId={view.recipeId} />
        )}

        {view.type === "valitse-resepti" && (
          <ReseptiValitsin
            mealType={view.mealType}
            dayOfWeek={view.dayOfWeek}
            onCancel={goBack}
            onSelect={(recipeId) => {
              overrideMeal(view.dayOfWeek, view.mealType, recipeId);
              goBack();
            }}
          />
        )}
      </main>
    </div>
  );
}

function ReseptiView({ recipeId }: { recipeId: number }) {
  const recipe = RECIPES.find((r) => r.id === recipeId);
  if (!recipe)
    return <p className="text-muted-foreground">Reseptiä ei löytynyt.</p>;

  return (
    <div className="space-y-6">
      <ReseptiNakyma recipe={recipe} />
      <Separator />
      <Ostoslista ingredients={recipe.ingredients} recipeName={recipe.name} />
    </div>
  );
}

export function AppShell() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
