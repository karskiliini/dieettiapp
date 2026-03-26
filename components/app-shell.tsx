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
    locale, dietti, weekNumber, year, mealCount,
    jiggleMode, setJiggleMode, overrideMeal, getOverride,
  } = useAppState();
  const tracker = useMealTracker(weekNumber, year);
  const [view, setView] = useState<View>({ type: "viikko" });
  const [history, setHistory] = useState<View[]>([]);
  const [slideDir, setSlideDir] = useState<"in" | "out" | null>(null);
  const [wasSwipe, setWasSwipe] = useState(false);

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

  const swipe = useSwipeBack({ canSwipeBack: canGoBack && !jiggleMode, onSwipeBack: goBackSilent });

  const visibleMeals = MEALS_BY_COUNT[mealCount] || MEALS_BY_COUNT[3];
  const baseMealPlan = getMealPlanForWeek(weekNumber, year).filter(
    (m) => m.dietCategory === dietti && visibleMeals.includes(m.mealType)
  );
  const mealPlan = baseMealPlan.map((entry) => {
    const oid = getOverride(entry.dayOfWeek, entry.mealType);
    if (oid !== undefined) { const r = RECIPES.find((r) => r.id === oid); if(r) return{...entry,recipeId:r.id,recipe:r}; }
    return entry;
  });

  const handleMealClick = useCallback((recipeId: number, dayOfWeek?: number, mealType?: MealType) => {
    if (jiggleMode && dayOfWeek !== undefined && mealType) goTo({ type: "valitse-resepti", dayOfWeek, mealType });
    else goTo({ type: "resepti", recipeId });
  }, [jiggleMode, goTo]);

  const handleBackgroundClick = useCallback((e: React.MouseEvent) => {
    if (!jiggleMode) return;
    if ((e.target as HTMLElement).closest("[data-meal]")) return;
    setJiggleMode(false);
  }, [jiggleMode, setJiggleMode]);

  const slideClass = !wasSwipe && slideDir === "in" ? "animate-slide-in" : !wasSwipe && slideDir === "out" ? "animate-slide-out" : "";
  const isSwiping = swipe.isDragging || swipe.isCompleting;
  const transition = swipe.isCompleting ? "transform 0.25s ease-out, opacity 0.25s ease-out, box-shadow 0.25s ease-out" : swipe.isDragging ? "none" : undefined;
  const prevScale = 0.92 + swipe.progress * 0.08;
  const prevOpacity = 0.4 + swipe.progress * 0.6;

  function renderHeader(v: View, isBack: boolean) {
    const showBack = v.type !== "viikko";
    return (
      <header
        className="shrink-0"
        style={{
          paddingTop: "env(safe-area-inset-top)",
          background: "rgba(0,0,0,0.85)",
          backdropFilter: "saturate(180%) blur(20px)",
          WebkitBackdropFilter: "saturate(180%) blur(20px)",
          borderBottom: "0.5px solid var(--ios-separator)",
        }}
      >
        <div className="flex items-center justify-between px-4 h-11">
          {showBack ? (
            <button
              onClick={isBack ? undefined : () => { setJiggleMode(false); goBackAnimated(); }}
              className="flex items-center gap-0.5 text-[17px]"
              style={{ color: "var(--ios-blue)" }}
            >
              <ChevronLeft className="h-5 w-5" style={{ marginLeft: -6 }} />
              {t("back", locale)}
            </button>
          ) : (
            <span className="text-[17px] font-semibold">{t("appName", locale)}</span>
          )}
          <div className="flex items-center gap-3">
            {jiggleMode && v.type !== "valitse-resepti" && !isBack && (
              <button
                onClick={() => setJiggleMode(false)}
                className="text-[17px] font-semibold"
                style={{ color: "var(--ios-blue)" }}
              >
                {t("done", locale)}
              </button>
            )}
            {v.type === "viikko" && !isBack && (
              <button onClick={() => goTo({ type: "asetukset" })}>
                <Settings className="h-[22px] w-[22px]" style={{ color: "var(--ios-blue)" }} />
              </button>
            )}
          </div>
        </div>
        {v.type === "viikko" && !jiggleMode && (
          <div className="px-4 pb-2">
            <DieettiTabs />
          </div>
        )}
      </header>
    );
  }

  function renderContent(v: View) {
    if (v.type === "viikko") return (
      <ViikkoNakymaInline mealPlan={mealPlan} mealCount={mealCount}
        onDayClick={(day) => { if(!jiggleMode) goTo({type:"paiva",dayOfWeek:day}); }}
        onRecipeClick={(id,day,mt) => handleMealClick(id,day,mt)} />
    );
    if (v.type === "paiva") return (
      <PaivaNakyma dayOfWeek={v.dayOfWeek}
        meals={mealPlan.filter((m)=>m.dayOfWeek===v.dayOfWeek) as any}
        mealCount={mealCount}
        onRecipeClick={(id,mt) => handleMealClick(id,v.dayOfWeek,mt)}
        onLogCustom={(day,mt) => goTo({type:"log-food",dayOfWeek:day,mealType:mt})} />
    );
    if (v.type === "resepti") {
      const recipe = RECIPES.find((r)=>r.id===v.recipeId);
      if (!recipe) return <p style={{color:"var(--ios-secondary-label)"}}>{t("error.notFound",locale)}</p>;
      return <><ReseptiNakyma recipe={recipe} /><div className="h-4" /><Ostoslista ingredients={recipe.ingredients} recipeName={recipe.name} /></>;
    }
    if (v.type === "valitse-resepti") return (
      <ReseptiValitsin mealType={v.mealType} dayOfWeek={v.dayOfWeek}
        onCancel={goBackAnimated}
        onSelect={(id) => { overrideMeal(v.dayOfWeek,v.mealType,id); goBackAnimated(); }} />
    );
    if (v.type === "log-food") return (
      <FoodLogger
        onCancel={goBackAnimated}
        onSave={(foods) => {
          tracker.setStatus(v.dayOfWeek, v.mealType, { status: "custom", foods });
          goBackAnimated();
        }}
      />
    );
    if (v.type === "asetukset") return <AsetuksetNakyma />;
    return null;
  }

  function renderFullScreen(v: View, isBack: boolean, style?: React.CSSProperties, className?: string) {
    return (
      <div className={`absolute inset-0 flex flex-col ${className||""}`} style={{background:"var(--background)", ...style}}>
        {renderHeader(v, isBack)}
        <div className="flex-1 overflow-auto" style={{paddingBottom:"env(safe-area-inset-bottom)"}} onClick={isBack?undefined:handleBackgroundClick}>
          <div className="mx-auto flex h-full max-w-lg flex-col px-4 py-3">
            {renderContent(v)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[100dvh] overflow-hidden" style={{background:"var(--background)"}}
      onTouchStart={swipe.onTouchStart} onTouchMove={swipe.onTouchMove} onTouchEnd={swipe.onTouchEnd}>
      {isSwiping ? (<>
        {prevView && renderFullScreen(prevView, true, { transform:`scale(${prevScale})`, opacity:prevOpacity, transition, zIndex:1 })}
        {renderFullScreen(view, false, { transform:`translateX(${swipe.dragX}px)`, boxShadow:swipe.dragX>0?"-8px 0 30px rgba(0,0,0,0.3)":"none", transition, zIndex:2 })}
      </>) : (
        renderFullScreen(view, false, { zIndex:1 }, slideClass)
      )}
    </div>
  );
}

export function AppShell() {
  return <AppProvider><AppContent /></AppProvider>;
}
