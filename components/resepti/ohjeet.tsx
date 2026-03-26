"use client";

import { useAppState } from "@/lib/app-state";
import { t } from "@/lib/i18n";

interface OhjeetProps { instructions: string[] }

export function Ohjeet({ instructions }: OhjeetProps) {
  const { locale } = useAppState();
  return (
    <div className="rounded-[10px] overflow-hidden" style={{ background: "var(--ios-card)" }}>
      <p className="px-4 pt-3 pb-1 text-[13px] font-semibold" style={{ color: "var(--ios-secondary-label)" }}>
        {t("recipe.instructions", locale)}
      </p>
      {instructions.map((step, i) => (
        <div
          key={i}
          className="flex gap-3 px-4 py-[10px] text-[15px]"
          style={{ borderBottom: i < instructions.length - 1 ? "0.5px solid var(--ios-separator)" : "none" }}
        >
          <span
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[13px] font-bold"
            style={{ background: "var(--ios-blue)", color: "#fff" }}
          >
            {i + 1}
          </span>
          <span className="pt-0.5">{step}</span>
        </div>
      ))}
    </div>
  );
}
