"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/lib/app-state";

export function ViikkoNavigaatio() {
  const { weekNumber, year, prevWeek, nextWeek } = useAppState();

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={prevWeek}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="text-center">
        <span className="text-lg font-semibold">Vko {weekNumber}</span>
        <span className="ml-2 text-sm text-muted-foreground">{year}</span>
      </div>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={nextWeek}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
