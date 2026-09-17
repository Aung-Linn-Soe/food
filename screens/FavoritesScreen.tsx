"use client";

import { useMemo } from "react";
import { useRecipes } from "@/store/RecipeContext";
import { RecipeListCard } from "@/components/RecipeListCard";
import { HeartIcon } from "@/components/icons";
import { Recipe } from "@/types/recipe";

export function FavoritesScreen({
  onOpenRecipe,
  onGoList,
}: {
  onOpenRecipe: (recipe: Recipe) => void;
  onGoList: () => void;
}) {
  const { recipes, categoryName, toggleFavorite } = useRecipes();
  const favorites = useMemo(() => recipes.filter((r) => r.favorite), [recipes]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 30, lineHeight: 1.1, fontFamily: "var(--font-heading)" }}>
          お気に入り
        </h1>
        <p className="muted" style={{ margin: "6px 0 0", fontSize: 13 }}>
          {favorites.length}品のお気に入り
        </p>
      </div>

      {favorites.length > 0 ? (
        <div style={{ display: "grid", gap: 12 }}>
          {favorites.map((r) => (
            <RecipeListCard
              key={r.id}
              recipe={r}
              categoryLabel={categoryName(r.categoryId)}
              onOpen={() => onOpenRecipe(r)}
              onToggleFavorite={() => toggleFavorite(r.id)}
            />
          ))}
        </div>
      ) : (
        <div
          style={{
            padding: "46px 24px",
            textAlign: "center",
            borderRadius: 30,
            background: "var(--color-surface)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span
            style={{
              width: 76,
              height: 76,
              borderRadius: "50%",
              background: "var(--color-accent-200)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <HeartIcon size={32} color="var(--color-accent-700)" />
          </span>
          <div style={{ fontFamily: "var(--font-heading)", fontSize: 19 }}>
            まだお気に入りがありません
          </div>
          <div className="muted" style={{ fontSize: 13, maxWidth: 280 }}>
            レシピの♥を押すと、よく作る料理をここにまとめられます
          </div>
          <button className="btn btn-primary" style={{ marginTop: 4, padding: "11px 22px" }} onClick={onGoList}>
            レシピ一覧を見る
          </button>
        </div>
      )}
    </div>
  );
}
