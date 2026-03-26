"use client";

import { useAppState } from "@/lib/app-state";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function AteriamaaraValitsin() {
  const { mealCount, setMealCount, locale } = useAppState();

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">{t("week.meals", locale)}:</span>
      {[3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => setMealCount(n)}
          className={cn(
            "h-7 w-7 rounded-md text-xs font-medium transition-colors",
            mealCount === n
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-accent"
          )}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
