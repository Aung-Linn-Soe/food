"use client";

import { Recipe } from "@/types/recipe";
import { ClockIcon, HeartIcon } from "@/components/icons";

export function RecipeListCard({
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
  const ingText = recipe.ingredients.map((i) => i.name).join("・");
  return (
    <div
      onClick={onOpen}
      style={{
        display: "flex",
        gap: 14,
        padding: 10,
        borderRadius: 26,
        background: "var(--color-surface)",
        cursor: "pointer",
        alignItems: "center",
      }}
    >
      <div
        className="washed"
        style={{
          width: 92,
          height: 92,
          flex: "none",
          borderRadius: 22,
          background: recipe.tile,
          display: "grid",
          placeItems: "center",
        }}
      >
        <span
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            border: "2.5px solid rgba(255,255,255,.75)",
          }}
        />
      </div>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 6 }}>
        <div
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 17,
            lineHeight: 1.25,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {recipe.name}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
          <span className="tag tag-accent-2" style={{ fontSize: 10.5 }}>
            {categoryLabel}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5 }} className="muted">
            <ClockIcon size={13} />
            {recipe.time}分
          </span>
          <span style={{ fontSize: 11.5 }} className="muted">
            {recipe.servings}人分
          </span>
        </div>
        <div
          className="muted-light"
          style={{
            fontSize: 11.5,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {ingText}
        </div>
      </div>
      <button
        className="btn btn-icon"
        style={{ flex: "none", alignSelf: "flex-start" }}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
      >
        <HeartIcon
          size={19}
          color={recipe.favorite ? "var(--color-accent)" : "color-mix(in srgb, var(--color-text) 40%, transparent)"}
          filled={recipe.favorite}
        />
      </button>
    </div>
  );
}
