"use client";

import { useMemo, useState } from "react";
import { useRecipes } from "@/store/RecipeContext";
import { SearchBar } from "@/components/SearchBar";
import { CategoryChips } from "@/components/CategoryChips";
import { RecipeListCard } from "@/components/RecipeListCard";
import { PantrySearchScreen } from "@/screens/PantrySearchScreen";
import { ChevronRightIcon } from "@/components/icons";
import { Recipe } from "@/types/recipe";

const ALL = "all";

export function HomeScreen({ onOpenRecipe }: { onOpenRecipe: (recipe: Recipe) => void }) {
  const { recipes, categories, categoryName, toggleFavorite } = useRecipes();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(ALL);
  const [pantryMode, setPantryMode] = useState(false);

  const chips = useMemo(
    () => [{ id: ALL, label: "すべて" }, ...categories.map((c) => ({ id: c.id, label: c.name }))],
    [categories]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return recipes.filter((r) => {
      const matchesCategory = activeCategory === ALL || r.categoryId === activeCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      const haystack = [r.name, categoryName(r.categoryId), ...r.ingredients.map((i) => i.name)]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [recipes, query, activeCategory, categoryName]);

  if (pantryMode) {
    return (
      <PantrySearchScreen onOpenRecipe={onOpenRecipe} onBack={() => setPantryMode(false)} />
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 32, lineHeight: 1.1, fontFamily: "var(--font-heading)" }}>
          料理レシピ
        </h1>
        <p className="muted" style={{ margin: "6px 0 0", fontSize: 13 }}>
          全{recipes.length}品のレシピ
        </p>
      </div>

      <button
        onClick={() => setPantryMode(true)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "16px 18px",
          borderRadius: 26,
          background: "var(--color-accent-2-100)",
          color: "var(--color-accent-2-800)",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span style={{ fontSize: 22 }}>🥬</span>
        <span style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-heading)", fontSize: 15 }}>
            冷蔵庫の材料からさがす
          </div>
          <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>
            持っている材料を選ぶだけで、作れそうなレシピを提案します
          </div>
        </span>
        <ChevronRightIcon size={18} color="var(--color-accent-2-800)" />
      </button>

      <SearchBar value={query} onChange={setQuery} placeholder="料理名・材料・カテゴリで検索" />
      <CategoryChips chips={chips} activeId={activeCategory} onPick={setActiveCategory} />

      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <h2 style={{ margin: 0, fontSize: 19 }}>
          {activeCategory === ALL ? "最近登録したレシピ" : categoryName(activeCategory)}
        </h2>
        <span className="muted" style={{ fontSize: 12 }}>
          {filtered.length}品
        </span>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {filtered.map((r) => (
          <RecipeListCard
            key={r.id}
            recipe={r}
            categoryLabel={categoryName(r.categoryId)}
            onOpen={() => onOpenRecipe(r)}
            onToggleFavorite={() => toggleFavorite(r.id)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div
          style={{
            padding: "40px 20px",
            textAlign: "center",
            borderRadius: 28,
            background: "var(--color-surface)",
          }}
        >
          <div style={{ fontFamily: "var(--font-heading)", fontSize: 18, marginBottom: 6 }}>
            見つかりませんでした
          </div>
          <div className="muted" style={{ fontSize: 13 }}>
            別の材料名や料理名で検索してみてください
          </div>
        </div>
      )}
    </div>
  );
}
