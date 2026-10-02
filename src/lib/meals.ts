/**
 * Meal categories for recipes. Drives the Keystatic `meal` dropdown and the
 * label shown on recipe cards. Add a category here and it appears in both.
 */

export const MEALS = [
  { key: "breakfast", label: "Breakfast" },
  { key: "dinner", label: "Dinner" },
  { key: "snacks-treats", label: "Snacks & Treats" },
] as const;

export type MealKey = (typeof MEALS)[number]["key"];

export const mealByKey = (key: string | null | undefined) =>
  MEALS.find((m) => m.key === key);

export const MEAL_OPTIONS = MEALS.map((m) => ({ label: m.label, value: m.key }));
