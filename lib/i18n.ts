export type Locale = "fi" | "en";

const translations = {
  // App
  appName: { fi: "myPlate", en: "myPlate" },
  back: { fi: "Takaisin", en: "Back" },
  done: { fi: "Valmis", en: "Done" },
  cancel: { fi: "Peruuta", en: "Cancel" },

  // Diet categories
  "diet.keto": { fi: "Keto", en: "Keto" },
  "diet.proteiini": { fi: "Proteiini", en: "Protein" },
  "diet.kasvisruoka": { fi: "Kasvisruoka", en: "Vegetarian" },
  "diet.liharuoka": { fi: "Liharuoka", en: "Meat" },
  "diet.vegaani": { fi: "Vegaani", en: "Vegan" },

  // Meal types
  "meal.aamiainen": { fi: "Aamiainen", en: "Breakfast" },
  "meal.lounas": { fi: "Lounas", en: "Lunch" },
  "meal.välipala": { fi: "Välipala", en: "Snack" },
  "meal.päivällinen": { fi: "Päivällinen", en: "Dinner" },
  "meal.iltapala": { fi: "Iltapala", en: "Evening snack" },

  // Days
  "day.0": { fi: "Maanantai", en: "Monday" },
  "day.1": { fi: "Tiistai", en: "Tuesday" },
  "day.2": { fi: "Keskiviikko", en: "Wednesday" },
  "day.3": { fi: "Torstai", en: "Thursday" },
  "day.4": { fi: "Perjantai", en: "Friday" },
  "day.5": { fi: "Lauantai", en: "Saturday" },
  "day.6": { fi: "Sunnuntai", en: "Sunday" },

  // Week view
  "week.label": { fi: "Vko", en: "Wk" },
  "week.meals": { fi: "Ateriat", en: "Meals" },
  "week.total": { fi: "Yht.", en: "Total" },

  // Day view
  "day.summary": { fi: "Päivän yhteenveto", en: "Daily summary" },
  "day.protein": { fi: "Proteiini", en: "Protein" },
  "day.carbs": { fi: "Hiilihydr.", en: "Carbs" },
  "day.fat": { fi: "Rasva", en: "Fat" },
  "day.shoppingList": { fi: "Koko päivän ostoslista", en: "Full day shopping list" },
  "day.shoppingTitle": { fi: "Ostoslista", en: "Shopping list" },

  // Recipe view
  "recipe.minutes": { fi: "minuuttia", en: "minutes" },
  "recipe.servings": { fi: "annosta", en: "servings" },
  "recipe.perServing": { fi: "/ annos", en: "/ serving" },
  "recipe.nutrition": { fi: "Ravintotiedot", en: "Nutrition" },
  "recipe.ingredients": { fi: "Ainekset", en: "Ingredients" },
  "recipe.instructions": { fi: "Valmistusohje", en: "Instructions" },
  "recipe.shoppingList": { fi: "Ostoslista", en: "Shopping list" },

  // Recipe picker
  "picker.title": { fi: "Valitse ruoka", en: "Choose meal" },
  "picker.tapToSwap": { fi: "Klikkaa ruokaa vaihtaaksesi sen", en: "Tap a meal to swap it" },
  "picker.favorites": { fi: "Suosikit", en: "Favorites" },
  "picker.otherRecipes": { fi: "Muut reseptit", en: "Other recipes" },
  "picker.noRecipes": { fi: "Ei reseptejä tässä kategoriassa.", en: "No recipes in this category." },
  "picker.all": { fi: "Kaikki", en: "All" },

  // Protein sources
  "protein.kana": { fi: "Kana", en: "Chicken" },
  "protein.nauta": { fi: "Nauta", en: "Beef" },
  "protein.porsas": { fi: "Porsas", en: "Pork" },
  "protein.kala": { fi: "Kala", en: "Fish" },
  "protein.muu": { fi: "Muu", en: "Other" },

  // Settings
  "settings.title": { fi: "Asetukset", en: "Settings" },
  "settings.language": { fi: "Kieli", en: "Language" },
  "settings.finnish": { fi: "Suomi", en: "Finnish" },
  "settings.english": { fi: "English", en: "English" },

  // Offline
  "offline.title": { fi: "Ei verkkoyhteyttä", en: "No connection" },
  "offline.message": {
    fi: "Tämä sivu ei ole saatavilla offline-tilassa.",
    en: "This page is not available offline.",
  },

  // Error
  "error.title": { fi: "Jokin meni pieleen", en: "Something went wrong" },
  "error.retry": { fi: "Yritä uudelleen", en: "Try again" },
  "error.notFound": { fi: "Reseptiä ei löytynyt.", en: "Recipe not found." },
} as const;

export type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey, locale: Locale): string {
  return translations[key]?.[locale] ?? key;
}

// Helper for diet/meal/day lookups
export function dietLabel(diet: string, locale: Locale): string {
  return t(`diet.${diet}` as TranslationKey, locale);
}

export function mealLabel(meal: string, locale: Locale): string {
  return t(`meal.${meal}` as TranslationKey, locale);
}

export function dayName(dayOfWeek: number, locale: Locale): string {
  return t(`day.${dayOfWeek}` as TranslationKey, locale);
}

export function proteinLabel(src: string, locale: Locale): string {
  return t(`protein.${src}` as TranslationKey, locale);
}
