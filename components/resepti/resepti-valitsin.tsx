"use client";

import { useState, useRef, useCallback } from "react";
import { RECIPES, type Recipe, type ProteinSource } from "@/lib/data";
import { useAppState } from "@/lib/app-state";
import { useFavorites } from "@/lib/favorites";
import type { MealType } from "@/lib/constants";
import { t, mealLabel, proteinLabel } from "@/lib/i18n";
import { Star, GripVertical, ChevronLeft, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const PROTEIN_TABS: ProteinSource[] = ["kana", "nauta", "porsas", "kala", "muu"];

interface Props {
  mealType: MealType;
  dayOfWeek: number;
  onSelect: (recipeId: number) => void;
  onCancel: () => void;
}

export function ReseptiValitsin({ mealType, dayOfWeek, onSelect, onCancel }: Props) {
  const { dietti, locale } = useAppState();
  const { favorites, isFavorite, toggleFavorite, reorderFavorites } = useFavorites();
  const [activeTab, setActiveTab] = useState<ProteinSource | "all">("all");

  const dietRecipes = RECIPES.filter((r) => r.dietCategory === dietti);
  const favRecipes = favorites.map((id) => dietRecipes.find((r) => r.id === id)).filter((r): r is Recipe => !!r);
  const nonFavRecipes = dietRecipes.filter((r) => !isFavorite(r.id));
  const filteredRecipes = activeTab === "all" ? nonFavRecipes : nonFavRecipes.filter((r) => r.proteinSource === activeTab);
  const hasProteinSources = dietRecipes.some((r) => r.proteinSource);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-[22px] font-bold">{t("picker.title", locale)}</h2>
        <p className="text-[13px]" style={{ color: "var(--ios-secondary-label)" }}>{mealLabel(mealType, locale)}</p>
      </div>

      {hasProteinSources && (
        <div className="flex overflow-x-auto scrollbar-none rounded-[9px] p-[2px]" style={{ background: "rgba(118,118,128,0.24)" }}>
          <button
            onClick={() => setActiveTab("all")}
            className="flex-1 min-w-0 rounded-[7px] px-2 py-[5px] text-[13px] font-medium"
            style={{
              background: activeTab === "all" ? "rgba(99,99,102,0.72)" : "transparent",
              color: activeTab === "all" ? "#fff" : "var(--ios-secondary-label)",
              boxShadow: activeTab === "all" ? "0 1px 3px rgba(0,0,0,0.3)" : "none",
            }}
          >
            {t("picker.all", locale)}
          </button>
          {PROTEIN_TABS.map((src) => {
            const count = nonFavRecipes.filter((r) => r.proteinSource === src).length;
            if (count === 0) return null;
            return (
              <button
                key={src}
                onClick={() => setActiveTab(src)}
                className="flex-1 min-w-0 rounded-[7px] px-1 py-[5px] text-[13px] font-medium"
                style={{
                  background: activeTab === src ? "rgba(99,99,102,0.72)" : "transparent",
                  color: activeTab === src ? "#fff" : "var(--ios-secondary-label)",
                  boxShadow: activeTab === src ? "0 1px 3px rgba(0,0,0,0.3)" : "none",
                }}
              >
                {proteinLabel(src, locale)}
              </button>
            );
          })}
        </div>
      )}

      {favRecipes.length > 0 && (
        <>
          <p className="text-[13px] uppercase" style={{ color: "var(--ios-secondary-label)" }}>
            {t("picker.favorites", locale)}
          </p>
          <div className="rounded-[10px] overflow-hidden" style={{ background: "var(--ios-card)" }}>
            <FavoritesList recipes={favRecipes} favorites={favorites} onSelect={onSelect} onToggleFavorite={toggleFavorite} onReorder={reorderFavorites} />
          </div>
          <p className="text-[13px] uppercase" style={{ color: "var(--ios-secondary-label)" }}>
            {t("picker.otherRecipes", locale)}
          </p>
        </>
      )}

      <div className="rounded-[10px] overflow-hidden" style={{ background: "var(--ios-card)" }}>
        {filteredRecipes.length === 0 ? (
          <p className="py-6 text-center text-[15px]" style={{ color: "var(--ios-secondary-label)" }}>
            {t("picker.noRecipes", locale)}
          </p>
        ) : (
          filteredRecipes.map((recipe, i) => (
            <RecipeRow key={recipe.id} recipe={recipe} isFav={false} showSeparator={i < filteredRecipes.length - 1}
              onSelect={onSelect} onToggleFavorite={toggleFavorite} />
          ))
        )}
      </div>
    </div>
  );
}

function FavoritesList({ recipes, favorites, onSelect, onToggleFavorite, onReorder }: {
  recipes: Recipe[]; favorites: number[]; onSelect: (id: number) => void;
  onToggleFavorite: (id: number) => void; onReorder: (from: number, to: number) => void;
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [dragY, setDragY] = useState(0);
  const [startY, setStartY] = useState(0);
  const [itemHeight, setItemHeight] = useState(60);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleTouchStart = useCallback((index: number, y: number) => {
    const el = itemRefs.current[index];
    if (el) setItemHeight(el.getBoundingClientRect().height);
    setDragIndex(index);
    setOverIndex(index);
    setStartY(y);
    setDragY(0);
  }, []);

  const handleTouchMove = useCallback((y: number) => {
    if (dragIndex === null) return;
    setDragY(y - startY);
    // Determine which slot we're over
    for (let i = 0; i < itemRefs.current.length; i++) {
      const el = itemRefs.current[i];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      const mid = rect.top + rect.height / 2;
      if (y < mid) { setOverIndex(i); return; }
    }
    setOverIndex(recipes.length - 1);
  }, [dragIndex, startY, recipes.length]);

  const handleTouchEnd = useCallback(() => {
    if (dragIndex !== null && overIndex !== null && dragIndex !== overIndex) {
      onReorder(dragIndex, overIndex);
    }
    setDragIndex(null);
    setOverIndex(null);
    setDragY(0);
  }, [dragIndex, overIndex, onReorder]);

  // Calculate visual offsets for each item during drag
  function getItemStyle(index: number): React.CSSProperties {
    if (dragIndex === null || overIndex === null) return {};

    if (index === dragIndex) {
      return {
        position: "relative",
        zIndex: 50,
        transform: `translateY(${dragY}px) scale(1.03)`,
        boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
        transition: "box-shadow 0.15s, scale 0.15s",
        borderRadius: 10,
        background: "var(--ios-gray5)",
      };
    }

    // Items between dragIndex and overIndex need to shift
    if (dragIndex < overIndex) {
      // Dragging down: items between (dragIndex, overIndex] shift up
      if (index > dragIndex && index <= overIndex) {
        return { transform: `translateY(-${itemHeight}px)`, transition: "transform 0.2s ease" };
      }
    } else {
      // Dragging up: items between [overIndex, dragIndex) shift down
      if (index >= overIndex && index < dragIndex) {
        return { transform: `translateY(${itemHeight}px)`, transition: "transform 0.2s ease" };
      }
    }

    return { transition: "transform 0.2s ease" };
  }

  return (
    <div ref={containerRef} className="relative">
      {recipes.map((recipe, index) => (
        <div
          key={recipe.id}
          ref={(el) => { itemRefs.current[index] = el; }}
          style={getItemStyle(index)}
        >
          <div className="flex items-center">
            <div
              className="shrink-0 touch-none px-2 py-3 cursor-grab active:cursor-grabbing"
              style={{ color: "var(--ios-gray)" }}
              onTouchStart={(e) => { e.stopPropagation(); handleTouchStart(index, e.touches[0].clientY); }}
              onTouchMove={(e) => { e.stopPropagation(); e.preventDefault(); handleTouchMove(e.touches[0].clientY); }}
              onTouchEnd={(e) => { e.stopPropagation(); handleTouchEnd(); }}
            >
              <GripVertical className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <RecipeRow recipe={recipe} isFav={true} showSeparator={index < recipes.length - 1 && dragIndex === null}
                onSelect={onSelect} onToggleFavorite={onToggleFavorite} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function RecipeRow({ recipe, isFav, showSeparator, onSelect, onToggleFavorite }: {
  recipe: Recipe; isFav: boolean; showSeparator: boolean;
  onSelect: (id: number) => void; onToggleFavorite: (id: number) => void;
}) {
  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;
  return (
    <div
      className="flex items-center ios-row"
      style={{ borderBottom: showSeparator ? "0.5px solid var(--ios-separator)" : "none" }}
    >
      <button className="shrink-0 p-3" onClick={(e) => { e.stopPropagation(); onToggleFavorite(recipe.id); }}>
        <Star className={cn("h-4 w-4", isFav ? "fill-yellow-400 text-yellow-400" : "")}
          style={isFav ? {} : { color: "var(--ios-gray)" }} />
      </button>
      <button onClick={() => onSelect(recipe.id)} className="flex flex-1 items-center justify-between pr-4 py-[10px] text-left min-w-0">
        <div className="min-w-0 flex-1">
          <p className="text-[15px] truncate">{recipe.name}</p>
          <p className="text-[13px] truncate" style={{ color: "var(--ios-secondary-label)" }}>{recipe.description}</p>
        </div>
        <div className="ml-2 shrink-0 text-right">
          <p className="text-[15px] font-mono font-semibold">{recipe.calories}</p>
          <div className="flex items-center gap-0.5 text-[11px]" style={{ color: "var(--ios-secondary-label)" }}>
            <Clock className="h-2.5 w-2.5" />{totalTime}min
          </div>
        </div>
      </button>
    </div>
  );
}
