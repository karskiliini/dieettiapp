"use client";

import { useAppState } from "@/lib/app-state";
import { t, type Locale } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const LANGUAGES: { code: Locale; flag: string; labelKey: "settings.finnish" | "settings.english" }[] = [
  { code: "fi", flag: "🇫🇮", labelKey: "settings.finnish" },
  { code: "en", flag: "🇬🇧", labelKey: "settings.english" },
];

export function AsetuksetNakyma() {
  const { locale, setLocale } = useAppState();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">{t("settings.title", locale)}</h2>

      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">
          {t("settings.language", locale)}
        </p>
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLocale(lang.code)}
            className="w-full"
          >
            <Card
              className={cn(
                "transition-colors",
                locale === lang.code && "ring-2 ring-primary"
              )}
            >
              <CardContent className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="font-medium">
                    {t(lang.labelKey, locale)}
                  </span>
                </div>
                {locale === lang.code && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </CardContent>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}
