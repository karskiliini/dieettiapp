import {
  pgTable,
  serial,
  text,
  integer,
  json,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const dietCategoryEnum = pgEnum("diet_category", [
  "kasvisruoka",
  "liharuoka",
  "vegaani",
  "keto",
  "proteiini",
]);

export const mealTypeEnum = pgEnum("meal_type", [
  "aamiainen",
  "lounas",
  "päivällinen",
]);

export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  dietCategory: dietCategoryEnum("diet_category").notNull(),
  mealType: mealTypeEnum("meal_type").notNull(),
  ingredients: json("ingredients")
    .$type<{ amount: number; unit: string; name: string }[]>()
    .notNull(),
  instructions: json("instructions").$type<string[]>().notNull(),
  prepTimeMinutes: integer("prep_time_minutes").notNull(),
  cookTimeMinutes: integer("cook_time_minutes").notNull(),
  servings: integer("servings").notNull(),
  calories: integer("calories").notNull(),
  proteinGrams: integer("protein_grams").notNull(),
  carbsGrams: integer("carbs_grams").notNull(),
  fatGrams: integer("fat_grams").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const mealPlans = pgTable("meal_plans", {
  id: serial("id").primaryKey(),
  dietCategory: dietCategoryEnum("diet_category").notNull(),
  weekNumber: integer("week_number").notNull(),
  year: integer("year").notNull(),
  dayOfWeek: integer("day_of_week").notNull(), // 0-6, ma-su
  mealType: mealTypeEnum("meal_type").notNull(),
  recipeId: integer("recipe_id")
    .references(() => recipes.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
