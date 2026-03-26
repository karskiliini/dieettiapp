// Simple food database: common foods with macros per 100g
export interface FoodItem {
  id: string;
  name: string;
  category: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  defaultGrams: number;
}

export const FOOD_CATEGORIES = [
  "Liha & kala",
  "Maitotuotteet",
  "Kasvikset",
  "Viljatuotteet",
  "Hedelmät",
  "Rasvat & öljyt",
  "Muut",
] as const;

export const FOOD_DB: FoodItem[] = [
  // Liha & kala
  { id: "chicken-breast", name: "Kananrintafilee", category: "Liha & kala", caloriesPer100g: 165, proteinPer100g: 31, carbsPer100g: 0, fatPer100g: 3.6, defaultGrams: 150 },
  { id: "chicken-thigh", name: "Kanankoipi", category: "Liha & kala", caloriesPer100g: 209, proteinPer100g: 26, carbsPer100g: 0, fatPer100g: 11, defaultGrams: 150 },
  { id: "ground-beef", name: "Jauheliha", category: "Liha & kala", caloriesPer100g: 250, proteinPer100g: 26, carbsPer100g: 0, fatPer100g: 15, defaultGrams: 200 },
  { id: "beef-steak", name: "Naudan pihvi", category: "Liha & kala", caloriesPer100g: 271, proteinPer100g: 26, carbsPer100g: 0, fatPer100g: 18, defaultGrams: 200 },
  { id: "pork-fillet", name: "Porsaan filee", category: "Liha & kala", caloriesPer100g: 143, proteinPer100g: 27, carbsPer100g: 0, fatPer100g: 3.5, defaultGrams: 150 },
  { id: "pork-belly", name: "Possunkylki", category: "Liha & kala", caloriesPer100g: 518, proteinPer100g: 9, carbsPer100g: 0, fatPer100g: 53, defaultGrams: 150 },
  { id: "bacon", name: "Pekoni", category: "Liha & kala", caloriesPer100g: 541, proteinPer100g: 37, carbsPer100g: 1, fatPer100g: 42, defaultGrams: 50 },
  { id: "salmon", name: "Lohi", category: "Liha & kala", caloriesPer100g: 208, proteinPer100g: 20, carbsPer100g: 0, fatPer100g: 13, defaultGrams: 150 },
  { id: "tuna", name: "Tonnikala", category: "Liha & kala", caloriesPer100g: 130, proteinPer100g: 29, carbsPer100g: 0, fatPer100g: 1, defaultGrams: 100 },
  { id: "shrimp", name: "Katkarapu", category: "Liha & kala", caloriesPer100g: 85, proteinPer100g: 20, carbsPer100g: 0, fatPer100g: 0.5, defaultGrams: 150 },
  { id: "turkey", name: "Kalkkuna", category: "Liha & kala", caloriesPer100g: 135, proteinPer100g: 30, carbsPer100g: 0, fatPer100g: 1, defaultGrams: 150 },
  { id: "egg", name: "Kananmuna (1kpl)", category: "Liha & kala", caloriesPer100g: 155, proteinPer100g: 13, carbsPer100g: 1, fatPer100g: 11, defaultGrams: 60 },

  // Maitotuotteet
  { id: "cheese-cheddar", name: "Cheddar-juusto", category: "Maitotuotteet", caloriesPer100g: 403, proteinPer100g: 25, carbsPer100g: 1, fatPer100g: 33, defaultGrams: 30 },
  { id: "cheese-mozzarella", name: "Mozzarella", category: "Maitotuotteet", caloriesPer100g: 280, proteinPer100g: 28, carbsPer100g: 3, fatPer100g: 17, defaultGrams: 50 },
  { id: "cream", name: "Kerma", category: "Maitotuotteet", caloriesPer100g: 340, proteinPer100g: 2, carbsPer100g: 3, fatPer100g: 36, defaultGrams: 50 },
  { id: "yogurt-greek", name: "Kreikkalainen jogurtti", category: "Maitotuotteet", caloriesPer100g: 97, proteinPer100g: 9, carbsPer100g: 4, fatPer100g: 5, defaultGrams: 200 },
  { id: "cottage-cheese", name: "Raejuusto", category: "Maitotuotteet", caloriesPer100g: 98, proteinPer100g: 11, carbsPer100g: 3, fatPer100g: 4, defaultGrams: 200 },
  { id: "butter", name: "Voi", category: "Maitotuotteet", caloriesPer100g: 717, proteinPer100g: 1, carbsPer100g: 0, fatPer100g: 81, defaultGrams: 15 },
  { id: "quark", name: "Rahka", category: "Maitotuotteet", caloriesPer100g: 64, proteinPer100g: 12, carbsPer100g: 4, fatPer100g: 0.2, defaultGrams: 200 },

  // Kasvikset
  { id: "broccoli", name: "Parsakaali", category: "Kasvikset", caloriesPer100g: 34, proteinPer100g: 3, carbsPer100g: 7, fatPer100g: 0.4, defaultGrams: 150 },
  { id: "spinach", name: "Pinaatti", category: "Kasvikset", caloriesPer100g: 23, proteinPer100g: 3, carbsPer100g: 4, fatPer100g: 0.4, defaultGrams: 100 },
  { id: "avocado", name: "Avokado", category: "Kasvikset", caloriesPer100g: 160, proteinPer100g: 2, carbsPer100g: 9, fatPer100g: 15, defaultGrams: 80 },
  { id: "cucumber", name: "Kurkku", category: "Kasvikset", caloriesPer100g: 15, proteinPer100g: 1, carbsPer100g: 4, fatPer100g: 0.1, defaultGrams: 100 },
  { id: "tomato", name: "Tomaatti", category: "Kasvikset", caloriesPer100g: 18, proteinPer100g: 1, carbsPer100g: 4, fatPer100g: 0.2, defaultGrams: 100 },
  { id: "cauliflower", name: "Kukkakaali", category: "Kasvikset", caloriesPer100g: 25, proteinPer100g: 2, carbsPer100g: 5, fatPer100g: 0.3, defaultGrams: 150 },
  { id: "pepper", name: "Paprika", category: "Kasvikset", caloriesPer100g: 31, proteinPer100g: 1, carbsPer100g: 6, fatPer100g: 0.3, defaultGrams: 100 },

  // Viljatuotteet
  { id: "rice", name: "Riisi (keitetty)", category: "Viljatuotteet", caloriesPer100g: 130, proteinPer100g: 3, carbsPer100g: 28, fatPer100g: 0.3, defaultGrams: 200 },
  { id: "pasta", name: "Pasta (keitetty)", category: "Viljatuotteet", caloriesPer100g: 131, proteinPer100g: 5, carbsPer100g: 25, fatPer100g: 1, defaultGrams: 200 },
  { id: "oats", name: "Kaurahiutale", category: "Viljatuotteet", caloriesPer100g: 367, proteinPer100g: 14, carbsPer100g: 56, fatPer100g: 7, defaultGrams: 40 },
  { id: "bread-rye", name: "Ruisleipä", category: "Viljatuotteet", caloriesPer100g: 259, proteinPer100g: 9, carbsPer100g: 48, fatPer100g: 3, defaultGrams: 40 },

  // Hedelmät
  { id: "banana", name: "Banaani", category: "Hedelmät", caloriesPer100g: 89, proteinPer100g: 1, carbsPer100g: 23, fatPer100g: 0.3, defaultGrams: 120 },
  { id: "apple", name: "Omena", category: "Hedelmät", caloriesPer100g: 52, proteinPer100g: 0.3, carbsPer100g: 14, fatPer100g: 0.2, defaultGrams: 150 },
  { id: "berries", name: "Marjat (sekoitus)", category: "Hedelmät", caloriesPer100g: 57, proteinPer100g: 1, carbsPer100g: 14, fatPer100g: 0.3, defaultGrams: 100 },

  // Rasvat & öljyt
  { id: "olive-oil", name: "Oliiviöljy", category: "Rasvat & öljyt", caloriesPer100g: 884, proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 100, defaultGrams: 15 },
  { id: "coconut-oil", name: "Kookosöljy", category: "Rasvat & öljyt", caloriesPer100g: 862, proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 100, defaultGrams: 15 },
  { id: "peanut-butter", name: "Maapähkinävoi", category: "Rasvat & öljyt", caloriesPer100g: 588, proteinPer100g: 25, carbsPer100g: 20, fatPer100g: 50, defaultGrams: 20 },
  { id: "nuts-mixed", name: "Pähkinäsekoitus", category: "Rasvat & öljyt", caloriesPer100g: 607, proteinPer100g: 20, carbsPer100g: 21, fatPer100g: 54, defaultGrams: 30 },

  // Muut
  { id: "hummus", name: "Hummus", category: "Muut", caloriesPer100g: 166, proteinPer100g: 8, carbsPer100g: 14, fatPer100g: 10, defaultGrams: 50 },
  { id: "tofu", name: "Tofu", category: "Muut", caloriesPer100g: 76, proteinPer100g: 8, carbsPer100g: 2, fatPer100g: 5, defaultGrams: 150 },
  { id: "protein-shake", name: "Proteiinishake", category: "Muut", caloriesPer100g: 100, proteinPer100g: 20, carbsPer100g: 4, fatPer100g: 1, defaultGrams: 300 },
];

export function calcMacros(food: FoodItem, grams: number) {
  const factor = grams / 100;
  return {
    calories: Math.round(food.caloriesPer100g * factor),
    protein: Math.round(food.proteinPer100g * factor),
    carbs: Math.round(food.carbsPer100g * factor),
    fat: Math.round(food.fatPer100g * factor),
  };
}
