"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { SEED_CATEGORIES, SEED_RECIPES } from "@/data/seed";
import { Category, Ingredient, Recipe, UNCATEGORIZED_ID } from "@/types/recipe";

const STORAGE_KEY = "recipe-app-state-v1";

type StoredState = {
  recipes: Recipe[];
  categories: Category[];
};

type NewRecipeInput = {
  name: string;
  categoryId: string;
  time: number;
  servings: number;
  ingredients: Ingredient[];
  memo: string;
};

type RecipeContextValue = {
  recipes: Recipe[];
  categories: Category[];
  toggleFavorite: (id: string) => void;
  addRecipe: (input: NewRecipeInput) => void;
  addCategory: (name: string) => void;
  renameCategory: (id: string, name: string) => void;
  removeCategory: (id: string) => void;
  categoryName: (id: string) => string;
  recipeCountForCategory: (id: string) => number;
};

const TILE_COLORS = [
  "linear-gradient(140deg,#e2a771,#bd6a34)",
  "linear-gradient(140deg,#e8b877,#c9873c)",
  "linear-gradient(140deg,#dfc389,#bd8f4a)",
  "linear-gradient(140deg,#a9bcc4,#75909e)",
  "linear-gradient(140deg,#d9b98f,#a97a45)",
  "linear-gradient(140deg,#b7c79b,#82965f)",
];

const RecipeContext = createContext<RecipeContextValue | null>(null);

function loadInitialState(): StoredState {
  if (typeof window === "undefined") {
    return { recipes: SEED_RECIPES, categories: SEED_CATEGORIES };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { recipes: SEED_RECIPES, categories: SEED_CATEGORIES };
    const parsed = JSON.parse(raw) as StoredState;
    if (!parsed.recipes || !parsed.categories) {
      return { recipes: SEED_RECIPES, categories: SEED_CATEGORIES };
    }
    return parsed;
  } catch {
    return { recipes: SEED_RECIPES, categories: SEED_CATEGORIES };
  }
}

export function RecipeProvider({ children }: { children: React.ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>(SEED_RECIPES);
  const [categories, setCategories] = useState<Category[]>(SEED_CATEGORIES);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const initial = loadInitialState();
    setRecipes(initial.recipes);
    setCategories(initial.categories);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ recipes, categories })
    );
  }, [recipes, categories, hydrated]);

  const toggleFavorite = useCallback((id: string) => {
    setRecipes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, favorite: !r.favorite } : r))
    );
  }, []);

  const addRecipe = useCallback((input: NewRecipeInput) => {
    setRecipes((prev) => {
      const tile = TILE_COLORS[prev.length % TILE_COLORS.length];
      const newRecipe: Recipe = {
        id: `${Date.now()}`,
        name: input.name,
        categoryId: input.categoryId || UNCATEGORIZED_ID,
        time: input.time,
        servings: input.servings,
        favorite: false,
        tile,
        ingredients: input.ingredients.filter((i) => i.name.trim() !== ""),
        steps: [],
        memo: input.memo,
      };
      return [newRecipe, ...prev];
    });
  }, []);

  const addCategory = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setCategories((prev) => [
      ...prev,
      { id: `cat-${Date.now()}`, name: trimmed },
    ]);
  }, []);

  const renameCategory = useCallback((id: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: trimmed } : c))
    );
  }, []);

  const removeCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setRecipes((prev) =>
      prev.map((r) =>
        r.categoryId === id ? { ...r, categoryId: UNCATEGORIZED_ID } : r
      )
    );
  }, []);

  const categoryName = useCallback(
    (id: string) => {
      if (id === UNCATEGORIZED_ID) return "未分類";
      return categories.find((c) => c.id === id)?.name ?? "未分類";
    },
    [categories]
  );

  const recipeCountForCategory = useCallback(
    (id: string) => recipes.filter((r) => r.categoryId === id).length,
    [recipes]
  );

  const value = useMemo<RecipeContextValue>(
    () => ({
      recipes,
      categories,
      toggleFavorite,
      addRecipe,
      addCategory,
      renameCategory,
      removeCategory,
      categoryName,
      recipeCountForCategory,
    }),
    [
      recipes,
      categories,
      toggleFavorite,
      addRecipe,
      addCategory,
      renameCategory,
      removeCategory,
      categoryName,
      recipeCountForCategory,
    ]
  );

  return (
    <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>
  );
}

export function useRecipes() {
  const ctx = useContext(RecipeContext);
  if (!ctx) throw new Error("useRecipes must be used within RecipeProvider");
  return ctx;
}
