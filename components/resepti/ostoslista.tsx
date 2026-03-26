"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Ingredient } from "@/lib/types";

interface OstoslistaProps {
  ingredients: Ingredient[];
  recipeName: string;
}

export function Ostoslista({ ingredients, recipeName }: OstoslistaProps) {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState<Set<number>>(new Set());

  function toggle(index: number) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  if (!open) {
    return (
      <Button
        variant="outline"
        className="w-full gap-2"
        onClick={() => setOpen(true)}
      >
        <ShoppingCart className="h-4 w-4" />
        Ostoslista
      </Button>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <ShoppingCart className="h-4 w-4" />
            Ostoslista
          </CardTitle>
          <span className="text-xs text-muted-foreground">
            {checked.size}/{ingredients.length}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">{recipeName}</p>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {ingredients.map((item, i) => (
            <li key={i}>
              <button
                onClick={() => toggle(i)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md p-2 text-left text-sm transition-colors hover:bg-accent",
                  checked.has(i) && "text-muted-foreground line-through"
                )}
              >
                <div
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded border",
                    checked.has(i)
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground"
                  )}
                >
                  {checked.has(i) && <Check className="h-3 w-3" />}
                </div>
                <span className="shrink-0 font-mono text-xs">
                  {item.amount} {item.unit}
                </span>
                <span>{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
