"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { RECIPES } from "@/lib/data";
import { ReseptiNakyma } from "./resepti-nakyma";

interface Props {
  recipeId: number;
  onClose: () => void;
}

export function ReseptiModal({ recipeId, onClose }: Props) {
  const recipe = RECIPES.find((r) => r.id === recipeId);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  if (!recipe) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.5)" }} />

      {/* Modal sheet */}
      <div
        className="relative w-full max-w-lg rounded-t-[16px] flex flex-col"
        style={{
          background: "var(--ios-gray6)",
          maxHeight: "85dvh",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-2 pb-1 shrink-0">
          <div className="w-9 h-[5px] rounded-full" style={{ background: "var(--ios-gray3)" }} />
        </div>

        {/* Close button */}
        <div className="flex justify-end px-4 pb-1 shrink-0">
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full"
            style={{ background: "var(--ios-gray4)" }}
          >
            <X className="h-4 w-4" style={{ color: "var(--ios-secondary-label)" }} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 pb-6">
          <ReseptiNakyma recipe={recipe} />
        </div>
      </div>
    </div>
  );
}
