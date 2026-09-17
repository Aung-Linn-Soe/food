"use client";

import { Recipe } from "@/types/recipe";
import { HeartIcon } from "@/components/icons";

export function RecipeGridCard({
  recipe,
  categoryLabel,
  onOpen,
  onToggleFavorite,
}: {
  recipe: Recipe;
  categoryLabel: string;
  onOpen: () => void;
  onToggleFavorite: () => void;
}) {
  return (
    <div
      onClick={onOpen}
      style={{
        borderRadius: 28,
        overflow: "hidden",
        background: "var(--color-surface)",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ position: "relative" }}>
        <div
          className="washed"
          style={{
            height: 112,
            background: recipe.tile,
            display: "grid",
            placeItems: "center",
          }}
        >
          <span
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              border: "2.5px solid rgba(255,255,255,.75)",
            }}
          />
        </div>
        <button
          className="btn btn-icon"
          style={{ position: "absolute", top: 8, right: 8, background: "rgba(245,234,216,.9)" }}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
        >
          <HeartIcon
            size={17}
            color={recipe.favorite ? "var(--color-accent)" : "var(--color-neutral-700)"}
            filled={recipe.favorite}
          />
        </button>
      </div>
      <div style={{ padding: "12px 14px 15px", display: "flex", flexDirection: "column", gap: 7 }}>
        <div style={{ fontFamily: "var(--font-heading)", fontSize: 16, lineHeight: 1.25 }}>
          {recipe.name}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
          <span className="tag tag-accent-2" style={{ fontSize: 10.5 }}>
            {categoryLabel}
          </span>
          <span className="muted" style={{ fontSize: 11.5 }}>
            ⏱ {recipe.time}分
          </span>
        </div>
      </div>
    </div>
  );
}
