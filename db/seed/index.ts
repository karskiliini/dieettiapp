import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { recipes, mealPlans } from "../schema";
import { kasvisruokaRecipes } from "./kasvisruoka";
import { liharuokaRecipes } from "./liharuoka";
import { vegaaniRecipes } from "./vegaani";
import { ketoRecipes } from "./keto";
import { proteiiniRecipes } from "./proteiini";

const MEAL_TYPES = ["aamiainen", "lounas", "päivällinen"] as const;

async function seed() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL ei ole asetettu");
    process.exit(1);
  }

  const sql = neon(databaseUrl);
  const db = drizzle(sql);

  console.log("Tyhjennetään vanhat tiedot...");
  await db.delete(mealPlans);
  await db.delete(recipes);

  console.log("Lisätään reseptit...");

  const allRecipes = [
    ...kasvisruokaRecipes,
    ...liharuokaRecipes,
    ...vegaaniRecipes,
    ...ketoRecipes,
    ...proteiiniRecipes,
  ];

  const insertedRecipes = await db
    .insert(recipes)
    .values(allRecipes)
    .returning();

  console.log(`Lisätty ${insertedRecipes.length} reseptiä.`);

  // Generate a default weekly meal plan for each diet category
  console.log("Luodaan viikkosuunnitelmat...");

  const categories = [
    "kasvisruoka",
    "liharuoka",
    "vegaani",
    "keto",
    "proteiini",
  ] as const;
  const currentDate = new Date();
  const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(
    ((currentDate.getTime() - startOfYear.getTime()) / 86400000 +
      startOfYear.getDay() +
      1) /
      7
  );
  const year = currentDate.getFullYear();

  const mealPlanEntries: (typeof mealPlans.$inferInsert)[] = [];

  for (const category of categories) {
    const categoryRecipes = insertedRecipes.filter(
      (r) => r.dietCategory === category
    );

    const breakfasts = categoryRecipes.filter(
      (r) => r.mealType === "aamiainen"
    );
    const lunches = categoryRecipes.filter((r) => r.mealType === "lounas");
    const dinners = categoryRecipes.filter(
      (r) => r.mealType === "päivällinen"
    );

    for (let day = 0; day < 7; day++) {
      for (const mealType of MEAL_TYPES) {
        let recipePool: typeof categoryRecipes;
        if (mealType === "aamiainen") recipePool = breakfasts;
        else if (mealType === "lounas") recipePool = lunches;
        else recipePool = dinners;

        if (recipePool.length === 0) continue;

        const recipe = recipePool[day % recipePool.length];

        mealPlanEntries.push({
          dietCategory: category,
          weekNumber,
          year,
          dayOfWeek: day,
          mealType,
          recipeId: recipe.id,
        });
      }
    }
  }

  await db.insert(mealPlans).values(mealPlanEntries);
  console.log(`Lisätty ${mealPlanEntries.length} ateriasuunnitelmaa.`);
  console.log("Seed valmis!");
}

seed().catch((err) => {
  console.error("Seed epäonnistui:", err);
  process.exit(1);
});
