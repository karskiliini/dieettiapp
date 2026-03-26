"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAppState } from "@/lib/app-state";
import { t } from "@/lib/i18n";

export function ViikkoNavigaatio() {
  const { weekNumber, year, prevWeek, nextWeek, locale } = useAppState();

  return (
    <div className="flex items-center gap-1">
      <button className="p-1" onClick={prevWeek}>
        <ChevronLeft className="h-5 w-5" style={{ color: "var(--ios-blue)" }} />
      </button>
      <span className="text-[15px] font-semibold min-w-[80px] text-center">
        {t("week.label", locale)} {weekNumber}
      </span>
      <button className="p-1" onClick={nextWeek}>
        <ChevronRight className="h-5 w-5" style={{ color: "var(--ios-blue)" }} />
      </button>
    </div>
  );
}
