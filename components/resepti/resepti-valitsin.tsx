"use client";

import { useState, useRef, useCallback } from "react";
import { RECIPES, type Recipe, type ProteinSource } from "@/lib/data";
import { useAppState } from "@/lib/app-state";
import { useFavorites } from "@/lib/favorites";
import type { MealType } from "@/lib/constants";
import { t, mealLabel, proteinLabel } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Clock, Star, GripVertical, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
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

  // Favorites for this diet (in order)
  const favRecipes = favorites
    .map((id) => dietRecipes.find((r) => r.id === id))
    .filter((r): r is Recipe => r !== undefined);

  // Non-favorite recipes, filtered by protein tab
  const nonFavRecipes = dietRecipes.filter((r) => !isFavorite(r.id));
  const filteredRecipes =
    activeTab === "all"
      ? nonFavRecipes
      : nonFavRecipes.filter((r) => r.proteinSource === activeTab);

  // Check if this diet has protein sources tagged
  const hasProteinSources = dietRecipes.some((r) => r.proteinSource);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onCancel} className="gap-1 text-muted-foreground">
          <ChevronLeft className="h-4 w-4" />
          {t("cancel", locale)}
        </Button>
        <div>
          <h2 className="text-base font-semibold">{t("picker.title", locale)}</h2>
          <p className="text-xs text-muted-foreground">{mealLabel(mealType, locale)}</p>
        </div>
      </div>

      {/* Protein source tabs */}
      {hasProteinSources && (
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          <TabButton
            active={activeTab === "all"}
            onClick={() => setActiveTab("all")}
            label={t("picker.all", locale)}
          />
          {PROTEIN_TABS.map((src) => {
            const count = nonFavRecipes.filter((r) => r.proteinSource === src).length;
            if (count === 0) return null;
            return (
              <TabButton
                key={src}
                active={activeTab === src}
                onClick={() => setActiveTab(src)}
                label={`${proteinLabel(src, locale)} (${count})`}
              />
            );
          })}
        </div>
      )}

      {/* Favorites section */}
      {favRecipes.length > 0 && (
        <>
          <p className="text-xs font-semibold text-muted-foreground">{t("picker.favorites", locale)}</p>
          <FavoritesList
            recipes={favRecipes}
            favorites={favorites}
            onSelect={onSelect}
            onToggleFavorite={toggleFavorite}
            onReorder={reorderFavorites}
          />
          <Separator />
          <p className="text-xs text-muted-foreground">{t("picker.otherRecipes", locale)}</p>
        </>
      )}

      {/* Non-favorite recipes */}
      <div className="space-y-2">
        {filteredRecipes.map((recipe) => (
          <RecipeOption
            key={recipe.id}
            recipe={recipe}
            isFav={false}
            onSelect={onSelect}
            onToggleFavorite={toggleFavorite}
          />
        ))}
        {filteredRecipes.length === 0 && (
          <p className="py-4 text-center text-sm text-muted-foreground">
            {t("picker.noRecipes", locale)}
          </p>
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground hover:bg-accent"
      )}
    >
      {label}
    </button>
  );
}

function FavoritesList({
  recipes,
  favorites,
  onSelect,
  onToggleFavorite,
  onReorder,
}: {
  recipes: Recipe[];
  favorites: number[];
  onSelect: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  onReorder: (from: number, to: number) => void;
}) {
  const [dragging, setDragging] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const touchStartY = useRef<number>(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleDragStart = useCallback(
    (index: number, startY: number) => {
      setDragging(index);
      touchStartY.current = startY;
    },
    []
  );

  const handleDragMove = useCallback(
    (clientY: number) => {
      if (dragging === null) return;
      // Find which item we're over
      for (let i = 0; i < itemRefs.current.length; i++) {
        const el = itemRefs.current[i];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (clientY >= rect.top && clientY <= rect.bottom) {
          setDragOverIndex(i);
          return;
        }
      }
    },
    [dragging]
  );

  const handleDragEnd = useCallback(() => {
    if (dragging !== null && dragOverIndex !== null && dragging !== dragOverIndex) {
      onReorder(dragging, dragOverIndex);
    }
    setDragging(null);
    setDragOverIndex(null);
  }, [dragging, dragOverIndex, onReorder]);

  return (
    <div className="space-y-2">
      {recipes.map((recipe, index) => (
        <div
          key={recipe.id}
          ref={(el) => { itemRefs.current[index] = el; }}
          className={cn(
            "flex items-center gap-1",
            dragging === index && "opacity-50",
            dragOverIndex === index && dragging !== index && "border-t-2 border-primary"
          )}
        >
          {/* Grab handle */}
          <div
            className="shrink-0 cursor-grab touch-none p-1 text-muted-foreground active:cursor-grabbing"
            onTouchStart={(e) => handleDragStart(index, e.touches[0].clientY)}
            onTouchMove={(e) => handleDragMove(e.touches[0].clientY)}
            onTouchEnd={handleDragEnd}
            onMouseDown={(e) => handleDragStart(index, e.clientY)}
          >
            <GripVertical className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <RecipeOption
              recipe={recipe}
              isFav={true}
              onSelect={onSelect}
              onToggleFavorite={onToggleFavorite}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function RecipeOption({
  recipe,
  isFav,
  onSelect,
  onToggleFavorite,
}: {
  recipe: Recipe;
  isFav: boolean;
  onSelect: (id: number) => void;
  onToggleFavorite: (id: number) => void;
}) {
  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  return (
    <Card className="transition-colors hover:bg-accent/50">
      <CardContent className="flex items-center gap-2 py-3">
        {/* Star */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(recipe.id);
          }}
          className="shrink-0 p-1"
        >
          <Star
            className={cn(
              "h-4 w-4",
              isFav
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            )}
          />
        </button>

        {/* Recipe info — clickable */}
        <button
          onClick={() => onSelect(recipe.id)}
          className="flex flex-1 items-center justify-between text-left"
        >
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{recipe.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {recipe.description}
            </p>
          </div>
          <div className="ml-2 shrink-0 text-right">
            <p className="font-mono text-sm font-semibold">
              {recipe.calories}
            </p>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock className="h-2.5 w-2.5" />
              {totalTime}min
            </div>
          </div>
        </button>
      </CardContent>
    </Card>
  );
}
