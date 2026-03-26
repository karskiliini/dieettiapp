"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { AppProvider, useAppState } from "@/lib/app-state";
import { useSwipeBack } from "@/lib/use-swipe";
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

  const canGoBack = view.type !== "viikko";
  const prevView = history[history.length - 1] ?? null;

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

  const swipe = useSwipeBack({
    canSwipeBack: canGoBack && !jiggleMode,
    onSwipeBack: goBack,
  });

  // Build meal plan with overrides
  const visibleMeals = MEALS_BY_COUNT[mealCount] || MEALS_BY_COUNT[3];
  const baseMealPlan = getMealPlanForWeek(weekNumber, year).filter(
    (m) => m.dietCategory === dietti && visibleMeals.includes(m.mealType)
  );
  const mealPlan = baseMealPlan.map((entry) => {
    const overrideId = getOverride(entry.dayOfWeek, entry.mealType);
    if (overrideId !== undefined) {
      const recipe = RECIPES.find((r) => r.id === overrideId);
      if (recipe) return { ...entry, recipeId: recipe.id, recipe };
    }
    return entry;
  });

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

  const handleBackgroundClick = useCallback(
    (e: React.MouseEvent) => {
      if (!jiggleMode) return;
      const target = e.target as HTMLElement;
      if (target === e.currentTarget || target.tagName === "MAIN") {
        setJiggleMode(false);
      }
    },
    [jiggleMode, setJiggleMode]
  );

  const slideClass =
    slideDir === "in"
      ? "animate-slide-in"
      : slideDir === "out"
        ? "animate-slide-out"
        : "";

  // During swipe: current page slides right, previous page is visible behind
  const isSwiping = swipe.isDragging || swipe.isCompleting;
  const transition = swipe.isCompleting
    ? "transform 0.25s ease-out, opacity 0.25s ease-out"
    : swipe.isDragging
      ? "none"
      : undefined;

  const currentStyle = isSwiping
    ? {
        transform: `translateX(${swipe.dragX}px)`,
        transition,
        boxShadow: "-8px 0 30px rgba(0,0,0,0.15)",
      }
    : undefined;

  // Previous page sits behind at slight offset, scales up as you swipe
  const prevScale = 0.92 + swipe.progress * 0.08;
  const prevOpacity = 0.4 + swipe.progress * 0.6;
  const prevStyle = isSwiping
    ? {
        transform: `scale(${prevScale})`,
        opacity: prevOpacity,
        transition,
      }
    : undefined;

  function renderView(v: View) {
    if (v.type === "viikko") {
      return (
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
      );
    }
    if (v.type === "paiva") {
      return (
        <PaivaNakyma
          dayOfWeek={v.dayOfWeek}
          meals={
            mealPlan.filter((m) => m.dayOfWeek === v.dayOfWeek) as any
          }
          mealCount={mealCount}
          onRecipeClick={(id, mealType) =>
            handleMealClick(id, v.dayOfWeek, mealType)
          }
        />
      );
    }
    if (v.type === "resepti") {
      return <ReseptiView recipeId={v.recipeId} />;
    }
    if (v.type === "valitse-resepti") {
      return (
        <ReseptiValitsin
          mealType={v.mealType}
          dayOfWeek={v.dayOfWeek}
          onCancel={goBack}
          onSelect={(recipeId) => {
            overrideMeal(v.dayOfWeek, v.mealType, recipeId);
            goBack();
          }}
        />
      );
    }
    return null;
  }

  return (
    <div
      className="relative flex h-[100dvh] flex-col overflow-hidden"
      onTouchStart={swipe.onTouchStart}
      onTouchMove={swipe.onTouchMove}
      onTouchEnd={swipe.onTouchEnd}
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

      {/* Content area with layered views for swipe */}
      <div className="relative flex-1 overflow-hidden">
        {/* Previous view (behind) — only rendered during swipe */}
        {isSwiping && prevView && (
          <div
            className="absolute inset-0 overflow-auto bg-background p-4"
            style={prevStyle}
          >
            <div className="mx-auto max-w-5xl">
              {renderView(prevView)}
            </div>
          </div>
        )}

        {/* Current view (on top) */}
        <main
          className={`absolute inset-0 overflow-auto bg-background p-4 ${!isSwiping ? slideClass : ""}`}
          style={currentStyle}
          onClick={handleBackgroundClick}
        >
          <div className="mx-auto flex h-full max-w-5xl flex-col">
            {renderView(view)}
          </div>
        </main>
      </div>
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
