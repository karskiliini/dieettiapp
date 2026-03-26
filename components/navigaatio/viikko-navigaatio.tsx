"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/lib/app-state";
import { t } from "@/lib/i18n";

export function ViikkoNavigaatio() {
  const { weekNumber, year, prevWeek, nextWeek, locale } = useAppState();

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={prevWeek}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="text-center">
        <span className="text-lg font-semibold">{t("week.label", locale)} {weekNumber}</span>
        <span className="ml-2 text-sm text-muted-foreground">{year}</span>
      </div>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={nextWeek}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
