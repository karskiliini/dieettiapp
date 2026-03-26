"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { AppProvider, useAppState } from "@/lib/app-state";
import { useSwipeBack } from "@/lib/use-swipe";
import { MEALS_BY_COUNT, type MealType } from "@/lib/constants";
import { getMealPlanForWeek, RECIPES } from "@/lib/data";
import { t } from "@/lib/i18n";
import { DieettiTabs } from "./navigaatio/dieetti-tabs";
import { ViikkoNakymaInline } from "./viikko/viikko-nakyma-inline";
import { PaivaNakyma } from "./paiva/paiva-nakyma";
import { ReseptiNakyma } from "./resepti/resepti-nakyma";
import { ReseptiValitsin } from "./resepti/resepti-valitsin";
import { Ostoslista } from "./resepti/ostoslista";
import { AsetuksetNakyma } from "./asetukset/asetukset-nakyma";
import { FoodLogger } from "./tracking/food-logger";
import { useMealTracker } from "@/lib/meal-tracker";
import { ChevronLeft, Settings } from "lucide-react";

type View =
  | { type: "viikko" }
  | { type: "paiva"; dayOfWeek: number }
  | { type: "resepti"; recipeId: number }
  | { type: "valitse-resepti"; dayOfWeek: number; mealType: MealType }
  | { type: "log-food"; dayOfWeek: number; mealType: MealType }
  | { type: "asetukset" };

function AppContent() {
  const {
    locale, dietti, weekNumber, year, mealCount, overrideMeal, getOverride,
  } = useAppState();
  const tracker = useMealTracker(weekNumber, year);
  const [view, setView] = useState<View>({ type: "viikko" });
  const [history, setHistory] = useState<View[]>([]);
  const [slideDir, setSlideDir] = useState<"in" | "out" | null>(null);
  const [wasSwipe, setWasSwipe] = useState(false);
  const swipeFrontRef = useRef<View | null>(null);
  const swipeBackRef = useRef<View | null>(null);

  const canGoBack = view.type !== "viikko";
  const prevView = history[history.length - 1] ?? null;

  const goTo = useCallback((next: View) => {
    setWasSwipe(false); setSlideDir("in");
    setHistory((h) => [...h, view]); setView(next);
  }, [view]);

  const goBackAnimated = useCallback(() => {
    setWasSwipe(false); setSlideDir("out");
    setHistory((h) => { const p = h[h.length-1]; if(p){setView(p);return h.slice(0,-1);} setView({type:"viikko"});return[]; });
  }, []);

  const goBackSilent = useCallback(() => {
    setWasSwipe(true); setSlideDir(null);
    setHistory((h) => { const p = h[h.length-1]; if(p){setView(p);return h.slice(0,-1);} setView({type:"viikko"});return[]; });
  }, []);

  useEffect(() => { if(!slideDir) return; const t=setTimeout(()=>setSlideDir(null),300); return()=>clearTimeout(t); }, [slideDir, view]);

  const swipe = useSwipeBack({ canSwipeBack: canGoBack, onSwipeBack: goBackSilent });
  const isSwiping = swipe.isDragging || swipe.isCompleting;

  useEffect(() => {
    if (swipe.isDragging && !swipe.isCompleting) { swipeFrontRef.current = view; swipeBackRef.current = prevView; }
    if (!isSwiping) { swipeFrontRef.current = null; swipeBackRef.current = null; }
  }, [swipe.isDragging, swipe.isCompleting, isSwiping]);

  const visibleMeals = MEALS_BY_COUNT[mealCount] || MEALS_BY_COUNT[3];
  const baseMealPlan = getMealPlanForWeek(weekNumber, year).filter(
    (m) => m.dietCategory === dietti && visibleMeals.includes(m.mealType)
  );
  const mealPlan = baseMealPlan.map((entry) => {
    const oid = getOverride(entry.dayOfWeek, entry.mealType);
    if (oid !== undefined) { const r = RECIPES.find((r) => r.id === oid); if(r) return{...entry,recipeId:r.id,recipe:r}; }
    return entry;
  });

  const slideClass = !wasSwipe && slideDir === "in" ? "animate-slide-in" : !wasSwipe && slideDir === "out" ? "animate-slide-out" : "";
  const transition = swipe.isCompleting ? "transform 0.25s ease-out, opacity 0.25s ease-out, box-shadow 0.25s ease-out" : swipe.isDragging ? "none" : undefined;
  const prevScale = 0.92 + swipe.progress * 0.08;
  const prevOpacity = 0.4 + swipe.progress * 0.6;

  function renderHeader(v: View, isBack: boolean) {
    const showBack = v.type !== "viikko";
    return (
      <header className="shrink-0" style={{
        paddingTop: "env(safe-area-inset-top)", background: "rgba(0,0,0,0.85)",
        backdropFilter: "saturate(180%) blur(20px)", WebkitBackdropFilter: "saturate(180%) blur(20px)",
        borderBottom: "0.5px solid var(--ios-separator)",
      }}>
        <div className="flex items-center justify-between px-4 h-11">
          {showBack ? (
            <button onClick={isBack ? undefined : goBackAnimated}
              className="flex items-center gap-0.5 text-[17px]" style={{ color: "var(--ios-blue)" }}>
              <ChevronLeft className="h-5 w-5" style={{ marginLeft: -6 }} />
              {t("back", locale)}
            </button>
          ) : (
            <span className="text-[17px] font-semibold">{t("appName", locale)}</span>
          )}
          {v.type === "viikko" && !isBack && (
            <button onClick={() => goTo({ type: "asetukset" })}>
              <Settings className="h-[22px] w-[22px]" style={{ color: "var(--ios-blue)" }} />
            </button>
          )}
        </div>
        {v.type === "viikko" && <div className="px-4 pb-2"><DieettiTabs /></div>}
      </header>
    );
  }

  function renderContent(v: View) {
    if (v.type === "viikko") return (
      <ViikkoNakymaInline mealPlan={mealPlan} mealCount={mealCount}
        onDayClick={(day) => goTo({ type: "paiva", dayOfWeek: day })}
        onRecipeClick={(id) => goTo({ type: "resepti", recipeId: id })} />
    );
    if (v.type === "paiva") return (
      <PaivaNakyma dayOfWeek={v.dayOfWeek}
        meals={mealPlan.filter((m) => m.dayOfWeek === v.dayOfWeek) as any}
        mealCount={mealCount}
        onRecipeClick={(id) => goTo({ type: "resepti", recipeId: id })}
        onSwapMeal={(day, mt) => goTo({ type: "valitse-resepti", dayOfWeek: day, mealType: mt })}
        onLogCustom={(day, mt) => goTo({ type: "log-food", dayOfWeek: day, mealType: mt })} />
    );
    if (v.type === "resepti") {
      const recipe = RECIPES.find((r) => r.id === v.recipeId);
      if (!recipe) return <p style={{ color: "var(--ios-secondary-label)" }}>{t("error.notFound", locale)}</p>;
      return <div className="space-y-4 pb-8"><ReseptiNakyma recipe={recipe} /><Ostoslista ingredients={recipe.ingredients} recipeName={recipe.name} /></div>;
    }
    if (v.type === "valitse-resepti") return (
      <ReseptiValitsin mealType={v.mealType} dayOfWeek={v.dayOfWeek}
        onCancel={goBackAnimated}
        onSelect={(id) => { overrideMeal(v.dayOfWeek, v.mealType, id); goBackAnimated(); }} />
    );
    if (v.type === "log-food") return (
      <FoodLogger onCancel={goBackAnimated}
        onSave={(foods) => { tracker.setStatus(v.dayOfWeek, v.mealType, { status: "custom", foods }); goBackAnimated(); }} />
    );
    if (v.type === "asetukset") return <AsetuksetNakyma />;
    return null;
  }

  function renderFullScreen(v: View, isBack: boolean, style?: React.CSSProperties, className?: string) {
    return (
      <div className={`absolute inset-0 flex flex-col ${className || ""}`} style={{ background: "var(--background)", ...style }}>
        {renderHeader(v, isBack)}
        <div className="flex-1 overflow-auto">
          <div className="mx-auto flex h-full max-w-lg flex-col px-4 pt-3"
            style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom))" }}>
            {renderContent(v)}
          </div>
        </div>
      </div>
    );
  }

  const displayFront = swipeFrontRef.current ?? view;
  const displayBack = swipeBackRef.current ?? prevView;

  return (
    <div className="relative h-[100dvh] overflow-hidden" style={{ background: "var(--background)" }}
      onTouchStart={swipe.onTouchStart} onTouchMove={swipe.onTouchMove} onTouchEnd={swipe.onTouchEnd}>
      {isSwiping ? (<>
        {displayBack && renderFullScreen(displayBack, true, { transform: `scale(${prevScale})`, opacity: prevOpacity, transition, zIndex: 1 })}
        {renderFullScreen(displayFront, false, { transform: `translateX(${swipe.dragX}px)`, boxShadow: swipe.dragX > 0 ? "-8px 0 30px rgba(0,0,0,0.3)" : "none", transition, zIndex: 2 })}
      </>) : (
        renderFullScreen(view, false, { zIndex: 1 }, slideClass)
      )}
    </div>
  );
}

export function AppShell() {
  return <AppProvider><AppContent /></AppProvider>;
}
