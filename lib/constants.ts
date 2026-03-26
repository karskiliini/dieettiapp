export const DIET_CATEGORIES = [
  "keto",
  "proteiini",
  "kasvisruoka",
  "liharuoka",
  "vegaani",
] as const;

export type DietCategory = (typeof DIET_CATEGORIES)[number];

export const DIET_LABELS: Record<DietCategory, string> = {
  kasvisruoka: "Kasvisruoka",
  liharuoka: "Liharuoka",
  vegaani: "Vegaani",
  keto: "Keto",
  proteiini: "Proteiini",
};

export const MEAL_TYPES = [
  "aamiainen",
  "lounas",
  "välipala",
  "päivällinen",
  "iltapala",
] as const;

export type MealType = (typeof MEAL_TYPES)[number];

export const MEAL_LABELS: Record<MealType, string> = {
  aamiainen: "Aamiainen",
  lounas: "Lounas",
  välipala: "Välipala",
  päivällinen: "Päivällinen",
  iltapala: "Iltapala",
};

// Which meal types to show for each meal count setting
export const MEALS_BY_COUNT: Record<number, MealType[]> = {
  3: ["aamiainen", "lounas", "päivällinen"],
  4: ["aamiainen", "lounas", "välipala", "päivällinen"],
  5: ["aamiainen", "lounas", "välipala", "päivällinen", "iltapala"],
};

export const DAY_NAMES = [
  "Maanantai",
  "Tiistai",
  "Keskiviikko",
  "Torstai",
  "Perjantai",
  "Lauantai",
  "Sunnuntai",
];

export const DAY_SHORT_NAMES = ["Ma", "Ti", "Ke", "To", "Pe", "La", "Su"];
