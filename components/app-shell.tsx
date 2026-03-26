"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { AppProvider, useAppState } from "@/lib/app-state";
import { useSwipe } from "@/lib/use-swipe";
import { MEALS_BY_COUNT } from "@/lib/constants";
import { getMealPlanForWeek, RECIPES } from "@/lib/data";
import { DieettiTabs } from "./navigaatio/dieetti-tabs";
import { ViikkoNakymaInline } from "./viikko/viikko-nakyma-inline";
import { PaivaNakyma } from "./paiva/paiva-nakyma";
import { ReseptiNakyma } from "./resepti/resepti-nakyma";
import { Ostoslista } from "./resepti/ostoslista";
import { ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

type View =
  | { type: "viikko" }
  | { type: "paiva"; dayOfWeek: number }
  | { type: "resepti"; recipeId: number };

function AppContent() {
  const { dietti, weekNumber, year, mealCount } = useAppState();
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

  // Clear animation class after it plays
  useEffect(() => {
    if (!slideDir) return;
    const timer = setTimeout(() => setSlideDir(null), 300);
    return () => clearTimeout(timer);
  }, [slideDir, view]);

  const swipeHandlers = useSwipe({
    onSwipeRight: canGoBack ? goBack : undefined,
  });

  const visibleMeals = MEALS_BY_COUNT[mealCount] || MEALS_BY_COUNT[3];
  const mealPlan = getMealPlanForWeek(weekNumber, year).filter(
    (m) => m.dietCategory === dietti && visibleMeals.includes(m.mealType)
  );

  // Compute drag transform for live swipe feedback
  const dragStyle = swipeHandlers.isDragging && canGoBack
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
                onClick={goBack}
                className="gap-1 text-muted-foreground"
              >
                <ChevronLeft className="h-4 w-4" />
                Takaisin
              </Button>
            ) : (
              <h1 className="text-lg font-bold">Dieettiapp</h1>
            )}
          </div>
          {view.type === "viikko" && <DieettiTabs />}
        </div>
      </header>

      {/* Content */}
      <main
        ref={mainRef}
        className={`mx-auto flex w-full max-w-5xl flex-1 flex-col overflow-auto p-4 ${slideClass}`}
        style={dragStyle}
      >
        {view.type === "viikko" && (
          <ViikkoNakymaInline
            mealPlan={mealPlan}
            mealCount={mealCount}
            onDayClick={(day) => goTo({ type: "paiva", dayOfWeek: day })}
            onRecipeClick={(id) => goTo({ type: "resepti", recipeId: id })}
          />
        )}

        {view.type === "paiva" && (
          <PaivaNakyma
            dayOfWeek={view.dayOfWeek}
            meals={mealPlan.filter((m) => m.dayOfWeek === view.dayOfWeek) as any}
            mealCount={mealCount}
            onRecipeClick={(id) => goTo({ type: "resepti", recipeId: id })}
          />
        )}

        {view.type === "resepti" && (
          <ReseptiView recipeId={view.recipeId} />
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
