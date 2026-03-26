"use client";

import { useState } from "react";
import { FOOD_DB, FOOD_CATEGORIES, calcMacros, type FoodItem } from "@/lib/food-db";
import type { EatenFood } from "@/lib/meal-tracker";
import { useAppState } from "@/lib/app-state";
import { t } from "@/lib/i18n";
import { ChevronLeft, Plus, Minus, Check } from "lucide-react";

interface Props {
  onSave: (foods: EatenFood[]) => void;
  onCancel: () => void;
}

export function FoodLogger({ onSave, onCancel }: Props) {
  const { locale } = useAppState();
  const [selectedFoods, setSelectedFoods] = useState<(EatenFood & { foodId: string })[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>(FOOD_CATEGORIES[0]);

  function addFood(food: FoodItem) {
    const macros = calcMacros(food, food.defaultGrams);
    setSelectedFoods((prev) => [
      ...prev,
      { foodId: food.id, name: food.name, grams: food.defaultGrams, ...macros },
    ]);
  }

  function updateGrams(index: number, grams: number) {
    setSelectedFoods((prev) => {
      const next = [...prev];
      const food = FOOD_DB.find((f) => f.id === next[index].foodId);
      if (!food) return prev;
      const g = Math.max(10, grams);
      const macros = calcMacros(food, g);
      next[index] = { ...next[index], grams: g, ...macros };
      return next;
    });
  }

  function removeFood(index: number) {
    setSelectedFoods((prev) => prev.filter((_, i) => i !== index));
  }

  const totalCal = selectedFoods.reduce((s, f) => s + f.calories, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={onCancel} className="flex items-center gap-0.5 text-[17px]" style={{ color: "var(--ios-blue)" }}>
          <ChevronLeft className="h-5 w-5" style={{ marginLeft: -6 }} />
          {t("cancel", locale)}
        </button>
        <button
          onClick={() => onSave(selectedFoods)}
          disabled={selectedFoods.length === 0}
          className="text-[17px] font-semibold"
          style={{ color: selectedFoods.length > 0 ? "var(--ios-blue)" : "var(--ios-gray)" }}
        >
          {t("done", locale)} {totalCal > 0 && `(${totalCal} kcal)`}
        </button>
      </div>

      {/* Selected foods */}
      {selectedFoods.length > 0 && (
        <div className="rounded-[10px] overflow-hidden" style={{ background: "var(--ios-card)" }}>
          {selectedFoods.map((food, i) => (
            <div
              key={`${food.foodId}-${i}`}
              className="flex items-center px-4 py-[10px]"
              style={{ borderBottom: i < selectedFoods.length - 1 ? "0.5px solid var(--ios-separator)" : "none" }}
            >
              <div className="flex-1 min-w-0">
                <p className="text-[15px]">{food.name}</p>
                <p className="text-[13px] font-mono" style={{ color: "var(--ios-secondary-label)" }}>
                  {food.calories} kcal · P {food.protein}g · R {food.fat}g
                </p>
              </div>
              <div className="flex items-center gap-2 ml-2">
                <button onClick={() => updateGrams(i, food.grams - 25)} className="p-1 rounded-full" style={{ background: "var(--ios-gray5)" }}>
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="text-[15px] font-mono w-12 text-center">{food.grams}g</span>
                <button onClick={() => updateGrams(i, food.grams + 25)} className="p-1 rounded-full" style={{ background: "var(--ios-gray5)" }}>
                  <Plus className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => removeFood(i)} className="p-1 ml-1">
                  <span className="text-[15px]" style={{ color: "var(--ios-red)" }}>✕</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none">
        {FOOD_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="shrink-0 rounded-full px-3 py-1.5 text-[13px] font-medium"
            style={{
              background: activeCategory === cat ? "var(--ios-blue)" : "var(--ios-gray5)",
              color: activeCategory === cat ? "#fff" : "var(--ios-secondary-label)",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Food list */}
      <div className="rounded-[10px] overflow-hidden" style={{ background: "var(--ios-card)" }}>
        {FOOD_DB.filter((f) => f.category === activeCategory).map((food, i, arr) => (
          <button
            key={food.id}
            onClick={() => addFood(food)}
            className="flex w-full items-center justify-between px-4 py-[10px] text-left ios-row"
            style={{ borderBottom: i < arr.length - 1 ? "0.5px solid var(--ios-separator)" : "none" }}
          >
            <div>
              <p className="text-[15px]">{food.name}</p>
              <p className="text-[13px] font-mono" style={{ color: "var(--ios-secondary-label)" }}>
                {food.caloriesPer100g} kcal/100g · {food.defaultGrams}g
              </p>
            </div>
            <Plus className="h-5 w-5 shrink-0" style={{ color: "var(--ios-blue)" }} />
          </button>
        ))}
      </div>
    </div>
  );
}
