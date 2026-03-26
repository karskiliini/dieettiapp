"use client";

import { useReminders, type MealReminder } from "@/lib/meal-tracker";
import { useAppState } from "@/lib/app-state";
import { mealLabel } from "@/lib/i18n";
import { Bell } from "lucide-react";

export function Muistutukset() {
  const { locale } = useAppState();
  const { reminders, updateReminder } = useReminders();

  return (
    <div>
      <p className="text-[13px] uppercase px-4 mb-1" style={{ color: "var(--ios-secondary-label)" }}>
        <Bell className="inline h-3.5 w-3.5 mr-1" />
        {locale === "fi" ? "Muistutukset" : "Reminders"}
      </p>
      <div className="rounded-[10px] overflow-hidden" style={{ background: "var(--ios-card)" }}>
        {reminders.map((r, i) => (
          <ReminderRow
            key={r.mealType}
            reminder={r}
            label={mealLabel(r.mealType, locale)}
            showSeparator={i < reminders.length - 1}
            onChange={(updates) => updateReminder(r.mealType, updates)}
          />
        ))}
      </div>
    </div>
  );
}

function ReminderRow({
  reminder,
  label,
  showSeparator,
  onChange,
}: {
  reminder: MealReminder;
  label: string;
  showSeparator: boolean;
  onChange: (updates: Partial<MealReminder>) => void;
}) {
  return (
    <div
      className="flex items-center justify-between px-4 py-[10px]"
      style={{ borderBottom: showSeparator ? "0.5px solid var(--ios-separator)" : "none" }}
    >
      <div className="flex items-center gap-3">
        {/* iOS-style toggle */}
        <button
          onClick={() => onChange({ enabled: !reminder.enabled })}
          className="relative h-[31px] w-[51px] rounded-full transition-colors"
          style={{ background: reminder.enabled ? "var(--ios-green)" : "var(--ios-gray4)" }}
        >
          <div
            className="absolute top-[2px] h-[27px] w-[27px] rounded-full bg-white shadow-sm transition-transform"
            style={{ left: reminder.enabled ? 22 : 2 }}
          />
        </button>
        <span className="text-[15px]">{label}</span>
      </div>
      {reminder.enabled && (
        <div className="flex items-center gap-1">
          <input
            type="number"
            min={0}
            max={23}
            value={reminder.hour}
            onChange={(e) => onChange({ hour: Math.min(23, Math.max(0, parseInt(e.target.value) || 0)) })}
            className="w-10 rounded-[6px] px-1 py-1 text-center text-[15px] font-mono"
            style={{ background: "var(--ios-gray5)", color: "#fff", border: "none" }}
          />
          <span className="text-[15px]">:</span>
          <input
            type="number"
            min={0}
            max={59}
            step={5}
            value={reminder.minute.toString().padStart(2, "0")}
            onChange={(e) => onChange({ minute: Math.min(59, Math.max(0, parseInt(e.target.value) || 0)) })}
            className="w-10 rounded-[6px] px-1 py-1 text-center text-[15px] font-mono"
            style={{ background: "var(--ios-gray5)", color: "#fff", border: "none" }}
          />
        </div>
      )}
    </div>
  );
}
