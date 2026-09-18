"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "@/store/AuthContext";
import { Category, Ingredient, Recipe, Step, UNCATEGORIZED_ID } from "@/types/recipe";

type NewRecipeInput = {
  name: string;
  categoryId: string;
  time: number;
  servings: number;
  ingredients: Ingredient[];
  steps: Step[];
  memo: string;
  photo?: string;
};

type RecipeContextValue = {
  recipes: Recipe[];
  categories: Category[];
  loading: boolean;
  toggleFavorite: (id: string) => void;
  addRecipe: (input: NewRecipeInput) => Promise<void>;
  updateRecipe: (id: string, input: NewRecipeInput) => Promise<void>;
  addCategory: (name: string) => Promise<void>;
  renameCategory: (id: string, name: string) => Promise<void>;
  removeCategory: (id: string) => Promise<void>;
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

function tileForId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return TILE_COLORS[hash % TILE_COLORS.length];
}

type ApiRecipe = {
  id: string;
  name: string;
  categoryId: string | null;
  time: number;
  servings: number;
  favorite: boolean;
  memo: string;
  imageBase64: string | null;
  ingredients: Ingredient[];
  steps: Step[];
};

const RecipeContext = createContext<RecipeContextValue | null>(null);

export function RecipeProvider({ children }: { children: React.ReactNode }) {
  const { username, ready } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [catRes, recRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/recipes"),
      ]);
      const cats: Category[] = catRes.ok ? await catRes.json() : [];
      const recs: ApiRecipe[] = recRes.ok ? await recRes.json() : [];
      setCategories(cats);
      setRecipes(
        recs.map((r) => ({
          id: r.id,
          name: r.name,
          categoryId: r.categoryId ?? UNCATEGORIZED_ID,
          time: r.time,
          servings: r.servings,
          favorite: r.favorite,
          tile: tileForId(r.id),
          photo: r.imageBase64 ?? undefined,
          ingredients: r.ingredients,
          steps: r.steps,
          memo: r.memo,
        }))
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!username) {
      setRecipes([]);
      setCategories([]);
      return;
    }
    refresh();
  }, [ready, username, refresh]);

  const toggleFavorite = useCallback(
    (id: string) => {
      setRecipes((prev) => {
        const next = prev.map((r) => (r.id === id ? { ...r, favorite: !r.favorite } : r));
        const target = next.find((r) => r.id === id);
        if (target) {
          fetch(`/api/recipes/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ favorite: target.favorite }),
          }).catch(() => {});
        }
        return next;
      });
    },
    []
  );

  const addRecipe = useCallback(
    async (input: NewRecipeInput) => {
      await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      await refresh();
    },
    [refresh]
  );

  const updateRecipe = useCallback(
    async (id: string, input: NewRecipeInput) => {
      await fetch(`/api/recipes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      await refresh();
    },
    [refresh]
  );

  const addCategory = useCallback(
    async (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
      await refresh();
    },
    [refresh]
  );

  const renameCategory = useCallback(
    async (id: string, name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      await fetch(`/api/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
      await refresh();
    },
    [refresh]
  );

  const removeCategory = useCallback(
    async (id: string) => {
      await fetch(`/api/categories/${id}`, { method: "DELETE" });
      await refresh();
    },
    [refresh]
  );

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
      loading,
      toggleFavorite,
      addRecipe,
      updateRecipe,
      addCategory,
      renameCategory,
      removeCategory,
      categoryName,
      recipeCountForCategory,
    }),
    [
      recipes,
      categories,
      loading,
      toggleFavorite,
      addRecipe,
      updateRecipe,
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
