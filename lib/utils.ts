import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getWeekNumber(date: Date = new Date()): number {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor(
    (date.getTime() - startOfYear.getTime()) / 86400000
  );
  return Math.ceil((days + startOfYear.getDay() + 1) / 7);
}

export function getCurrentYear(): number {
  return new Date().getFullYear();
}

/** Get the date (day.month) for a given day-of-week (0=ma) in a specific ISO week */
export function getDateForWeekDay(
  weekNumber: number,
  year: number,
  dayOfWeek: number
): string {
  // ISO week: week 1 contains Jan 4
  const jan4 = new Date(year, 0, 4);
  const dayOfJan4 = (jan4.getDay() + 6) % 7; // convert to 0=mon
  const mondayOfWeek1 = new Date(jan4);
  mondayOfWeek1.setDate(jan4.getDate() - dayOfJan4);

  const target = new Date(mondayOfWeek1);
  target.setDate(mondayOfWeek1.getDate() + (weekNumber - 1) * 7 + dayOfWeek);

  const dd = target.getDate();
  const mm = target.getMonth() + 1;
  return `${dd}.${mm}.`;
}
