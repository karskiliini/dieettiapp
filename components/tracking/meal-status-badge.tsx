"use client";

import type { MealStatus } from "@/lib/meal-tracker";
import { Check, X, Utensils } from "lucide-react";

export function MealStatusBadge({ status }: { status: MealStatus }) {
  if (status.status === "planned") return null;

  const config = {
    eaten: { icon: <Check className="h-3 w-3" />, bg: "var(--ios-green)", label: "✓" },
    skipped: { icon: <X className="h-3 w-3" />, bg: "var(--ios-gray)", label: "—" },
    custom: { icon: <Utensils className="h-3 w-3" />, bg: "var(--ios-blue)", label: "~" },
  }[status.status];

  return (
    <div
      className="flex h-5 w-5 items-center justify-center rounded-full"
      style={{ background: config.bg, color: "#fff" }}
    >
      {config.icon}
    </div>
  );
}
