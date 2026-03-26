"use client";

import { useAppState } from "@/lib/app-state";
import { t, type Locale } from "@/lib/i18n";
import { Check } from "lucide-react";
import { Muistutukset } from "./muistutukset";

const LANGUAGES: { code: Locale; flag: string; labelKey: "settings.finnish" | "settings.english" }[] = [
  { code: "fi", flag: "🇫🇮", labelKey: "settings.finnish" },
  { code: "en", flag: "🇬🇧", labelKey: "settings.english" },
];

export function AsetuksetNakyma() {
  const { locale, setLocale } = useAppState();

  return (
    <div className="space-y-6">
      <h2 className="text-[28px] font-bold">{t("settings.title", locale)}</h2>

      <div>
        <p className="text-[13px] uppercase px-4 mb-1" style={{ color: "var(--ios-secondary-label)" }}>
          {t("settings.language", locale)}
        </p>
        <div className="rounded-[10px] overflow-hidden" style={{ background: "var(--ios-card)" }}>
          {LANGUAGES.map((lang, i) => (
            <button
              key={lang.code}
              onClick={() => setLocale(lang.code)}
              className="flex w-full items-center justify-between px-4 py-[11px] ios-row"
              style={{
                borderBottom: i < LANGUAGES.length - 1 ? "0.5px solid var(--ios-separator)" : "none",
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-[20px]">{lang.flag}</span>
                <span className="text-[17px]">{t(lang.labelKey, locale)}</span>
              </div>
              {locale === lang.code && (
                <Check className="h-5 w-5" style={{ color: "var(--ios-blue)" }} />
              )}
            </button>
          ))}
        </div>
      </div>
      <Muistutukset />
    </div>
  );
}
