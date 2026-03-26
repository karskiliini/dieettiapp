"use client";

import { RECIPES } from "@/lib/data";
import { ReseptiNakyma } from "./resepti-nakyma";
import { BottomSheet } from "@/components/ui/bottom-sheet";

interface Props {
  recipeId: number;
  onClose: () => void;
}

export function ReseptiModal({ recipeId, onClose }: Props) {
  const recipe = RECIPES.find((r) => r.id === recipeId);
  if (!recipe) return null;

  return (
    <BottomSheet onClose={onClose}>
      <ReseptiNakyma recipe={recipe} />
    </BottomSheet>
  );
}
