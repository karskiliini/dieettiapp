"use client";

import { useState, useCallback, useEffect } from "react";
import { AppProvider, useAppState } from "@/lib/app-state";
import { useSwipeBack } from "@/lib/use-swipe";
import { MEALS_BY_COUNT, type MealType } from "@/lib/constants";
import { getMealPlanForWeek, RECIPES } from "@/lib/data";
import { t, mealLabel } from "@/lib/i18n";
import { DieettiTabs } from "./navigaatio/dieetti-tabs";
import { ViikkoNakymaInline } from "./viikko/viikko-nakyma-inline";
import { PaivaNakyma } from "./paiva/paiva-nakyma";
import { ReseptiNakyma } from "./resepti/resepti-nakyma";
import { ReseptiValitsin } from "./resepti/resepti-valitsin";
import { Ostoslista } from "./resepti/ostoslista";
import { AsetuksetNakyma } from "./asetukset/asetukset-nakyma";
import { ChevronLeft, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

type View =
  | { type: "viikko" }
  | { type: "paiva"; dayOfWeek: number }
  | { type: "resepti"; recipeId: number }
  | { type: "valitse-resepti"; dayOfWeek: number; mealType: MealType }
  | { type: "asetukset" };

function AppContent() {
  const {
    locale,
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
  const [wasSwipe, setWasSwipe] = useState(false);

  const canGoBack = view.type !== "viikko";
  const prevView = history[history.length - 1] ?? null;

  const goTo = useCallback(
    (next: View) => {
      setWasSwipe(false);
      setSlideDir("in");
      setHistory((h) => [...h, view]);
      setView(next);
    },
    [view]
  );

  const goBackAnimated = useCallback(() => {
    setWasSwipe(false);
    setSlideDir("out");
    setHistory((h) => {
      const prev = h[h.length - 1];
      if (prev) { setView(prev); return h.slice(0, -1); }
      setView({ type: "viikko" }); return [];
    });
  }, []);

  const goBackSilent = useCallback(() => {
    setWasSwipe(true);
    setSlideDir(null);
    setHistory((h) => {
      const prev = h[h.length - 1];
      if (prev) { setView(prev); return h.slice(0, -1); }
      setView({ type: "viikko" }); return [];
    });
  }, []);

  useEffect(() => {
    if (!slideDir) return;
    const timer = setTimeout(() => setSlideDir(null), 300);
    return () => clearTimeout(timer);
  }, [slideDir, view]);

  const swipe = useSwipeBack({
    canSwipeBack: canGoBack && !jiggleMode,
    onSwipeBack: goBackSilent,
  });

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
      if (target.closest("[data-meal]")) return;
      setJiggleMode(false);
    },
    [jiggleMode, setJiggleMode]
  );

  const slideClass =
    !wasSwipe && slideDir === "in"
      ? "animate-slide-in"
      : !wasSwipe && slideDir === "out"
        ? "animate-slide-out"
        : "";

  const isSwiping = swipe.isDragging || swipe.isCompleting;
  const transition = swipe.isCompleting
    ? "transform 0.25s ease-out, opacity 0.25s ease-out, box-shadow 0.25s ease-out"
    : swipe.isDragging ? "none" : undefined;

  const prevScale = 0.92 + swipe.progress * 0.08;
  const prevOpacity = 0.4 + swipe.progress * 0.6;

  function renderHeader(v: View, isBack: boolean) {
    const showBackBtn = v.type !== "viikko";
    return (
      <header className="shrink-0 border-b border-border bg-background" style={{ paddingTop: "env(safe-area-inset-top)" }}>
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center justify-between px-4 py-3">
            {showBackBtn ? (
              <Button
                variant="ghost" size="sm"
                onClick={isBack ? undefined : () => { setJiggleMode(false); goBackAnimated(); }}
                className="gap-1 text-muted-foreground"
              >
                <ChevronLeft className="h-4 w-4" />
                {t("back", locale)}
              </Button>
            ) : (
              <h1 className="text-lg font-bold">{t("appName", locale)}</h1>
            )}
            <div className="flex items-center gap-2">
              {jiggleMode && v.type !== "valitse-resepti" && !isBack && (
                <Button variant="secondary" size="sm" onClick={() => setJiggleMode(false)}>
                  {t("done", locale)}
                </Button>
              )}
              {v.type === "viikko" && !isBack && (
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => goTo({ type: "asetukset" })}>
                  <Settings className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          {v.type === "viikko" && !jiggleMode && <DieettiTabs />}
        </div>
      </header>
    );
  }

  function renderContent(v: View) {
    if (v.type === "viikko") {
      return (
        <ViikkoNakymaInline
          mealPlan={mealPlan} mealCount={mealCount}
          onDayClick={(day) => { if (!jiggleMode) goTo({ type: "paiva", dayOfWeek: day }); }}
          onRecipeClick={(id, day, mealType) => handleMealClick(id, day, mealType)}
        />
      );
    }
    if (v.type === "paiva") {
      return (
        <PaivaNakyma
          dayOfWeek={v.dayOfWeek}
          meals={mealPlan.filter((m) => m.dayOfWeek === v.dayOfWeek) as any}
          mealCount={mealCount}
          onRecipeClick={(id, mealType) => handleMealClick(id, v.dayOfWeek, mealType)}
        />
      );
    }
    if (v.type === "resepti") {
      const recipe = RECIPES.find((r) => r.id === v.recipeId);
      if (!recipe) return <p className="text-muted-foreground">{t("error.notFound", locale)}</p>;
      return (
        <div className="space-y-6">
          <ReseptiNakyma recipe={recipe} />
          <Separator />
          <Ostoslista ingredients={recipe.ingredients} recipeName={recipe.name} />
        </div>
      );
    }
    if (v.type === "valitse-resepti") {
      return (
        <ReseptiValitsin
          mealType={v.mealType} dayOfWeek={v.dayOfWeek}
          onCancel={goBackAnimated}
          onSelect={(recipeId) => { overrideMeal(v.dayOfWeek, v.mealType, recipeId); goBackAnimated(); }}
        />
      );
    }
    if (v.type === "asetukset") {
      return <AsetuksetNakyma />;
    }
    return null;
  }

  function renderFullScreen(v: View, isBack: boolean, style?: React.CSSProperties, className?: string) {
    return (
      <div className={`absolute inset-0 flex flex-col bg-background ${className || ""}`} style={style}>
        {renderHeader(v, isBack)}
        <div
          className="flex-1 overflow-auto p-4"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          onClick={isBack ? undefined : handleBackgroundClick}
        >
          <div className="mx-auto flex h-full max-w-5xl flex-col">
            {renderContent(v)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative h-[100dvh] overflow-hidden"
      onTouchStart={swipe.onTouchStart}
      onTouchMove={swipe.onTouchMove}
      onTouchEnd={swipe.onTouchEnd}
    >
      {isSwiping ? (
        <>
          {prevView && renderFullScreen(prevView, true, {
            transform: `scale(${prevScale})`, opacity: prevOpacity, transition, zIndex: 1,
          })}
          {renderFullScreen(view, false, {
            transform: `translateX(${swipe.dragX}px)`,
            boxShadow: swipe.dragX > 0 ? "-8px 0 30px rgba(0,0,0,0.15)" : "none",
            transition, zIndex: 2,
          })}
        </>
      ) : (
        renderFullScreen(view, false, { zIndex: 1 }, slideClass)
      )}
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
