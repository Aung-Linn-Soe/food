"use client";

import { Recipe } from "@/types/recipe";
import { CloseIcon } from "@/components/icons";

export function RecipeDetailSheet({
  recipe,
  categoryLabel,
  onClose,
  onToggleFavorite,
  onEdit,
}: {
  recipe: Recipe;
  categoryLabel: string;
  onClose: () => void;
  onToggleFavorite: () => void;
  onEdit: () => void;
}) {
  return (
    <>
      <div
        onClick={onClose}
        className="animate-fade-in"
        style={{
          position: "fixed",
          inset: 0,
          background: "color-mix(in srgb, var(--color-neutral-900) 45%, transparent)",
          zIndex: 30,
        }}
      />
      <div
        className="animate-sheet-up"
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          maxHeight: "88%",
          overflowY: "auto",
          borderRadius: "34px 34px 0 0",
          background: "var(--color-bg)",
          boxShadow: "var(--shadow-lg)",
          zIndex: 31,
          padding: "14px 22px 28px",
        }}
      >
        <div
          style={{
            width: 44,
            height: 5,
            borderRadius: 999,
            background: "var(--color-neutral-400)",
            margin: "0 auto 16px",
          }}
        />
        <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 18 }}>
          <div
            className="washed"
            style={{
              width: 74,
              height: 74,
              flex: "none",
              borderRadius: 24,
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
            <h3 style={{ margin: 0, fontSize: 23, lineHeight: 1.15, fontFamily: "var(--font-heading)" }}>
              {recipe.name}
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8, fontSize: 12 }} className="muted">
              <span className="tag tag-accent-2" style={{ fontSize: 10.5 }}>
                {categoryLabel}
              </span>
              <span>⏱ {recipe.time}分</span>
              <span>{recipe.servings}人分</span>
            </div>
          </div>
          <button className="btn btn-icon" style={{ flex: "none" }} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div style={{ display: "grid", gap: 22, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          <div>
            <h4 style={{ margin: "0 0 10px", fontSize: 15 }}>材料</h4>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {recipe.ingredients.length === 0 && (
                <div className="muted" style={{ fontSize: 13, padding: "9px 2px" }}>
                  材料は登録されていません
                </div>
              )}
              {recipe.ingredients.map((ing, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    padding: "9px 2px",
                    borderBottom: "1px solid var(--color-divider)",
                    fontSize: 15,
                  }}
                >
                  <span>{ing.name}</span>
                  <span className="muted">{ing.amount}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ margin: "0 0 10px", fontSize: 15 }}>作り方</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {recipe.steps.length === 0 && (
                <div className="muted" style={{ fontSize: 13 }}>作り方は登録されていません</div>
              )}
              {recipe.steps.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span
                    style={{
                      width: 26,
                      height: 26,
                      flex: "none",
                      borderRadius: "50%",
                      background: "var(--color-accent)",
                      color: "var(--color-bg)",
                      display: "grid",
                      placeItems: "center",
                      fontFamily: "var(--font-heading)",
                      fontSize: 13,
                    }}
                  >
                    {i + 1}
                  </span>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 2 }}>
                    <span style={{ fontSize: 16, lineHeight: 1.55 }}>{step.text}</span>
                    {step.photo && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={step.photo}
                        alt=""
                        style={{
                          maxWidth: "100%",
                          maxHeight: 220,
                          borderRadius: 18,
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {recipe.memo && (
          <div style={{ marginTop: 22 }}>
            <h4 style={{ margin: "0 0 8px", fontSize: 15 }}>メモ</h4>
            <p className="muted" style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>
              {recipe.memo}
            </p>
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 22, flexWrap: "wrap" }}>
          <button className="btn btn-primary" style={{ flex: 1, minWidth: 150, padding: "12px 18px" }} onClick={onClose}>
            調理をはじめる
          </button>
          <button className="btn btn-secondary" style={{ padding: "12px 18px" }} onClick={onToggleFavorite}>
            {recipe.favorite ? "お気に入り解除" : "お気に入り登録"}
          </button>
          <button className="btn btn-secondary" style={{ padding: "12px 18px" }} onClick={onEdit}>
            編集
          </button>
        </div>
      </div>
    </>
  );
}
