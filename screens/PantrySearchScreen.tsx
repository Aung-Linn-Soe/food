"use client";

import { useMemo, useState } from "react";
import { useRecipes } from "@/store/RecipeContext";
import { ChevronRightIcon } from "@/components/icons";
import { Recipe } from "@/types/recipe";

function parseIngredientText(text: string): string[] {
  return text
    .split(/[、,，\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function PantrySearchScreen({
  onOpenRecipe,
  onBack,
}: {
  onOpenRecipe: (recipe: Recipe) => void;
  onBack: () => void;
}) {
  const { recipes, categoryName } = useRecipes();
  const [text, setText] = useState("");
  const [searched, setSearched] = useState<string[]>([]);

  function handleSearch() {
    setSearched(parseIngredientText(text));
  }

  const matches = useMemo(() => {
    if (searched.length === 0) return [];
    const have = new Set(searched);
    return recipes
      .map((r) => {
        const names = r.ingredients.map((i) => i.name.trim()).filter(Boolean);
        if (names.length === 0) return null;
        const missing = names.filter((n) => !have.has(n));
        const matchedCount = names.length - missing.length;
        if (matchedCount === 0) return null;
        return { recipe: r, missing, matchedCount, total: names.length };
      })
      .filter((x): x is { recipe: Recipe; missing: string[]; matchedCount: number; total: number } => x !== null)
      .sort((a, b) => {
        const aFull = a.missing.length === 0 ? 0 : 1;
        const bFull = b.missing.length === 0 ? 0 : 1;
        if (aFull !== bFull) return aFull - bFull;
        return a.missing.length - b.missing.length;
      });
  }, [recipes, searched]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <button
        className="btn btn-ghost"
        style={{ alignSelf: "flex-start", fontSize: 13, padding: "4px 8px" }}
        onClick={onBack}
      >
        ← ホームに戻る
      </button>

      <div>
        <h1 style={{ margin: 0, fontSize: 29, lineHeight: 1.1, fontFamily: "var(--font-heading)" }}>
          冷蔵庫から
          <br />
          さがす
        </h1>
        <p className="muted" style={{ margin: "8px 0 0", fontSize: 13 }}>
          今ある材料を「、」区切りで書いて検索してください
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <textarea
          className="input"
          style={{ minHeight: 70, fontSize: 15 }}
          placeholder="例：卵、もやし、ネギ"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSearch();
            }
          }}
        />
        <button className="btn btn-primary btn-block" style={{ padding: 13, fontSize: 15 }} onClick={handleSearch}>
          検索する
        </button>
      </div>

      {searched.length === 0 && (
        <div
          style={{
            padding: "40px 20px",
            textAlign: "center",
            borderRadius: 28,
            background: "var(--color-surface)",
          }}
        >
          <div className="muted" style={{ fontSize: 13 }}>
            材料を書いて「検索する」を押すと、作れそうなレシピが表示されます
          </div>
        </div>
      )}

      {searched.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "14px 18px",
            borderRadius: 24,
            background: "var(--color-accent-2-100)",
          }}
        >
          <span style={{ fontSize: 13.5, color: "var(--color-accent-2-800)" }}>
            {searched.join("・")} で検索・{matches.length}品ヒット
          </span>
          <button
            className="btn btn-ghost"
            style={{ fontSize: 13, color: "var(--color-accent-2-800)" }}
            onClick={() => {
              setText("");
              setSearched([]);
            }}
          >
            クリア
          </button>
        </div>
      )}

      {searched.length > 0 && matches.length === 0 && (
        <div
          style={{
            padding: "40px 20px",
            textAlign: "center",
            borderRadius: 28,
            background: "var(--color-surface)",
          }}
        >
          <div style={{ fontFamily: "var(--font-heading)", fontSize: 18, marginBottom: 6 }}>
            その材料のレシピはまだありません
          </div>
          <div className="muted" style={{ fontSize: 13 }}>
            別の材料で試してみてください
          </div>
        </div>
      )}

      {matches.length > 0 && (
        <div style={{ display: "grid", gap: 10 }}>
          {matches.map(({ recipe, missing }) => (
            <div
              key={recipe.id}
              onClick={() => onOpenRecipe(recipe)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 13,
                padding: "12px 14px",
                borderRadius: 24,
                background: "var(--color-surface)",
                cursor: "pointer",
              }}
            >
              <div
                className="washed"
                style={{
                  width: 52,
                  height: 52,
                  flex: "none",
                  borderRadius: "50%",
                  background: recipe.photo ? undefined : recipe.tile,
                  overflow: "hidden",
                }}
              >
                {recipe.photo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={recipe.photo}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: 16, lineHeight: 1.25 }}>
                  {recipe.name}
                </div>
                <div
                  style={{
                    fontSize: 11.5,
                    marginTop: 3,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {missing.length === 0 ? (
                    <span className="tag tag-accent-2" style={{ fontSize: 10.5 }}>
                      作れる！
                    </span>
                  ) : (
                    <span className="muted">
                      あと{missing.length}つ・{missing.join("・")}
                    </span>
                  )}
                </div>
              </div>
              <span className="muted" style={{ flex: "none", fontSize: 12 }}>
                {categoryName(recipe.categoryId)}
              </span>
              <ChevronRightIcon
                size={16}
                color="color-mix(in srgb, var(--color-text) 40%, transparent)"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
