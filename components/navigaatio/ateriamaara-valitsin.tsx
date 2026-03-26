"use client";

import { useAppState } from "@/lib/app-state";
import { t } from "@/lib/i18n";

export function AteriamaaraValitsin() {
  const { mealCount, setMealCount, locale } = useAppState();

  return (
    <div className="flex items-center gap-2">
      <span className="text-[13px]" style={{ color: "var(--ios-secondary-label)" }}>
        {t("week.meals", locale)}
      </span>
      <div className="flex rounded-[7px] p-[2px]" style={{ background: "rgba(118,118,128,0.24)" }}>
        {[3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => setMealCount(n)}
            className="w-7 h-7 rounded-[5px] text-[13px] font-medium"
            style={{
              background: mealCount === n ? "rgba(99,99,102,0.72)" : "transparent",
              color: mealCount === n ? "#fff" : "var(--ios-secondary-label)",
              boxShadow: mealCount === n ? "0 1px 3px rgba(0,0,0,0.3)" : "none",
            }}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
