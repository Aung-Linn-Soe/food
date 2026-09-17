"use client";

import { useMemo, useState } from "react";
import { useRecipes } from "@/store/RecipeContext";
import { SearchBar } from "@/components/SearchBar";
import { CategoryChips } from "@/components/CategoryChips";
import { RecipeGridCard } from "@/components/RecipeGridCard";
import { Recipe } from "@/types/recipe";

const ALL = "all";

type SortKey = "new" | "time" | "name";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "new", label: "新しい順" },
  { key: "time", label: "時間が短い順" },
  { key: "name", label: "名前順" },
];

export function ListScreen({ onOpenRecipe }: { onOpenRecipe: (recipe: Recipe) => void }) {
  const { recipes, categories, categoryName, toggleFavorite } = useRecipes();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(ALL);
  const [sort, setSort] = useState<SortKey>("new");

  const chips = useMemo(
    () => [{ id: ALL, label: "すべて" }, ...categories.map((c) => ({ id: c.id, label: c.name }))],
    [categories]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = recipes.filter((r) => {
      const matchesCategory = activeCategory === ALL || r.categoryId === activeCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      const haystack = [r.name, categoryName(r.categoryId), ...r.ingredients.map((i) => i.name)]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
    const sorted = [...list];
    if (sort === "time") sorted.sort((a, b) => a.time - b.time);
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name, "ja"));
    return sorted;
  }, [recipes, query, activeCategory, sort, categoryName]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 30, lineHeight: 1.1, fontFamily: "var(--font-heading)" }}>
          レシピ一覧
        </h1>
        <p className="muted" style={{ margin: "6px 0 0", fontSize: 13 }}>
          {filtered.length}件を表示中
        </p>
      </div>

      <SearchBar value={query} onChange={setQuery} placeholder="料理名・材料で検索" />

      <div>
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
          className="muted"
        >
          カテゴリ
        </div>
        <CategoryChips chips={chips} activeId={activeCategory} onPick={setActiveCategory} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }} className="muted">
        <span>並び替え</span>
        {SORTS.map((s) => {
          const on = s.key === sort;
          return (
            <button
              key={s.key}
              className="btn"
              style={{
                background: on ? "var(--color-accent-2-600)" : "var(--color-surface)",
                color: on ? "var(--color-neutral-100)" : "var(--color-text)",
                fontSize: 12,
                padding: "6px 13px",
              }}
              onClick={() => setSort(s.key)}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}>
        {filtered.map((r) => (
          <RecipeGridCard
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
            レシピが見つかりません
          </div>
          <div className="muted" style={{ fontSize: 13 }}>
            検索条件を変えるか、新しく登録してください
          </div>
        </div>
      )}
    </div>
  );
}
