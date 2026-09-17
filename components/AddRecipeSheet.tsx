"use client";

import { useState } from "react";
import { Category, Ingredient } from "@/types/recipe";
import { CloseIcon, PhotoIcon } from "@/components/icons";

export function AddRecipeSheet({
  categories,
  onClose,
  onSave,
}: {
  categories: Category[];
  onClose: () => void;
  onSave: (input: {
    name: string;
    categoryId: string;
    time: number;
    servings: number;
    ingredients: Ingredient[];
    memo: string;
  }) => void;
}) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [time, setTime] = useState("");
  const [servings, setServings] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "", amount: "" },
    { name: "", amount: "" },
    { name: "", amount: "" },
  ]);
  const [memo, setMemo] = useState("");

  function updateIngredient(index: number, field: keyof Ingredient, value: string) {
    setIngredients((prev) =>
      prev.map((ing, i) => (i === index ? { ...ing, [field]: value } : ing))
    );
  }

  function handleSave() {
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      categoryId,
      time: Number(time) || 0,
      servings: Number(servings) || 0,
      ingredients,
      memo,
    });
  }

  return (
    <>
      <div
        onClick={onClose}
        className="animate-fade-in"
        style={{
          position: "fixed",
          inset: 0,
          background: "color-mix(in srgb, var(--color-neutral-900) 45%, transparent)",
          zIndex: 40,
        }}
      />
      <div
        className="animate-sheet-up"
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          maxHeight: "92%",
          overflowY: "auto",
          borderRadius: "34px 34px 0 0",
          background: "var(--color-bg)",
          boxShadow: "var(--shadow-lg)",
          zIndex: 41,
          padding: "14px 22px 28px",
        }}
      >
        <div
          style={{
            width: 44,
            height: 5,
            borderRadius: 999,
            background: "var(--color-neutral-400)",
            margin: "0 auto 14px",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 22, fontFamily: "var(--font-heading)" }}>レシピを追加</h3>
          <button className="btn btn-icon" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div
                style={{
                  width: 96,
                  height: 96,
                  flex: "none",
                  borderRadius: 26,
                  border: "2px dashed var(--color-neutral-400)",
                  display: "grid",
                  placeItems: "center",
                  gap: 4,
                  color: "var(--color-neutral-600)",
                  cursor: "pointer",
                  textAlign: "center",
                  fontSize: 11,
                }}
              >
                <PhotoIcon />
                写真を追加
              </div>
              <div className="field" style={{ flex: 1, minWidth: 0 }}>
                <label>料理名</label>
                <input
                  className="input"
                  style={{ minHeight: 44, fontSize: 15 }}
                  placeholder="例：豚肉の生姜焼き"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="field">
              <label>カテゴリ</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
                {categories.map((c) => {
                  const on = c.id === categoryId;
                  return (
                    <button
                      key={c.id}
                      className="btn"
                      style={{
                        background: on ? "var(--color-accent)" : "var(--color-surface)",
                        color: on ? "var(--color-bg)" : "var(--color-text)",
                        fontSize: 13,
                        padding: "7px 14px",
                      }}
                      onClick={() => setCategoryId(c.id)}
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <div className="field" style={{ flex: 1 }}>
                <label>調理時間（分）</label>
                <input
                  className="input"
                  style={{ minHeight: 44 }}
                  placeholder="20"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  inputMode="numeric"
                />
              </div>
              <div className="field" style={{ flex: 1 }}>
                <label>何人分</label>
                <input
                  className="input"
                  style={{ minHeight: 44 }}
                  placeholder="2"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                  inputMode="numeric"
                />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="field">
              <label>材料</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
                {ingredients.map((ing, i) => (
                  <div key={i} style={{ display: "flex", gap: 8 }}>
                    <input
                      className="input"
                      style={{ flex: 2, minHeight: 40 }}
                      placeholder="材料名"
                      value={ing.name}
                      onChange={(e) => updateIngredient(i, "name", e.target.value)}
                    />
                    <input
                      className="input"
                      style={{ flex: 1, minHeight: 40 }}
                      placeholder="分量"
                      value={ing.amount}
                      onChange={(e) => updateIngredient(i, "amount", e.target.value)}
                    />
                  </div>
                ))}
                <button
                  className="btn btn-secondary"
                  style={{ alignSelf: "flex-start", fontSize: 13 }}
                  onClick={() => setIngredients((prev) => [...prev, { name: "", amount: "" }])}
                >
                  ＋ 材料を追加
                </button>
              </div>
            </div>
            <div className="field">
              <label>メモ</label>
              <textarea
                className="input"
                style={{ minHeight: 70 }}
                placeholder="次回は少し醤油を減らす。"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
              />
            </div>
          </div>
        </div>

        <button
          className="btn btn-primary btn-block"
          style={{ padding: 14, fontSize: 15, marginTop: 18 }}
          onClick={handleSave}
        >
          レシピを保存
        </button>
      </div>
    </>
  );
}
