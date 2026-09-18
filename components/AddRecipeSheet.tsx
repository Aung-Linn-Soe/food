"use client";

import { useState } from "react";
import { Category, Ingredient, Recipe, Step } from "@/types/recipe";
import { CloseIcon, PhotoIcon } from "@/components/icons";

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function AddRecipeSheet({
  categories,
  initialRecipe,
  onClose,
  onSave,
}: {
  categories: Category[];
  initialRecipe?: Recipe;
  onClose: () => void;
  onSave: (input: {
    name: string;
    categoryId: string;
    time: number;
    servings: number;
    ingredients: Ingredient[];
    steps: Step[];
    memo: string;
    photo?: string;
  }) => void;
}) {
  const isEditing = Boolean(initialRecipe);
  const [name, setName] = useState(initialRecipe?.name ?? "");
  const [categoryId, setCategoryId] = useState(initialRecipe?.categoryId ?? categories[0]?.id ?? "");
  const [time, setTime] = useState(initialRecipe ? String(initialRecipe.time) : "");
  const [servings, setServings] = useState(initialRecipe ? String(initialRecipe.servings) : "");
  const [photo, setPhoto] = useState<string | undefined>(initialRecipe?.photo);
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    initialRecipe && initialRecipe.ingredients.length > 0
      ? initialRecipe.ingredients
      : [
          { name: "", amount: "" },
          { name: "", amount: "" },
          { name: "", amount: "" },
        ]
  );
  const [steps, setSteps] = useState<Step[]>(
    initialRecipe && initialRecipe.steps.length > 0
      ? initialRecipe.steps
      : [{ text: "" }, { text: "" }]
  );
  const [memo, setMemo] = useState(initialRecipe?.memo ?? "");

  async function handlePhotoSelect(file: File | null) {
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    setPhoto(dataUrl);
  }

  function updateIngredient(index: number, field: keyof Ingredient, value: string) {
    setIngredients((prev) =>
      prev.map((ing, i) => (i === index ? { ...ing, [field]: value } : ing))
    );
  }

  function updateStepText(index: number, value: string) {
    setSteps((prev) => prev.map((s, i) => (i === index ? { ...s, text: value } : s)));
  }

  async function updateStepPhoto(index: number, file: File | null) {
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    setSteps((prev) => prev.map((s, i) => (i === index ? { ...s, photo: dataUrl } : s)));
  }

  function removeStepPhoto(index: number) {
    setSteps((prev) =>
      prev.map((s, i) => {
        if (i !== index) return s;
        const { photo: _photo, ...rest } = s;
        return rest;
      })
    );
  }

  function removeStep(index: number) {
    setSteps((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSave() {
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      categoryId,
      time: Number(time) || 0,
      servings: Number(servings) || 0,
      ingredients,
      steps,
      memo,
      photo,
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
          <h3 style={{ margin: 0, fontSize: 22, fontFamily: "var(--font-heading)" }}>
            {isEditing ? "レシピを編集" : "レシピを追加"}
          </h3>
          <button className="btn btn-icon" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              {photo ? (
                <div style={{ position: "relative", width: 96, height: 96, flex: "none" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo}
                    alt=""
                    style={{
                      width: 96,
                      height: 96,
                      borderRadius: 26,
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  <button
                    className="btn btn-icon"
                    style={{
                      position: "absolute",
                      top: -6,
                      right: -6,
                      background: "rgba(245,234,216,.9)",
                      padding: 5,
                    }}
                    onClick={() => setPhoto(undefined)}
                  >
                    <CloseIcon size={13} />
                  </button>
                </div>
              ) : (
                <label
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
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handlePhotoSelect(e.target.files?.[0] ?? null)}
                  />
                </label>
              )}
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
          </div>
        </div>

        <div className="field" style={{ marginTop: 16 }}>
          <label>作り方</label>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 4 }}>
            {steps.map((step, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 10,
                  padding: 12,
                  borderRadius: 20,
                  background: "var(--color-surface)",
                }}
              >
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
                <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                  <textarea
                    className="input"
                    style={{ minHeight: 44, background: "var(--color-bg)" }}
                    placeholder={`手順 ${i + 1} を入力`}
                    value={step.text}
                    onChange={(e) => updateStepText(i, e.target.value)}
                  />
                  {step.photo ? (
                    <div style={{ position: "relative", width: "fit-content" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={step.photo}
                        alt=""
                        style={{
                          maxWidth: 160,
                          maxHeight: 120,
                          borderRadius: 14,
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                      <button
                        className="btn btn-icon"
                        style={{
                          position: "absolute",
                          top: 6,
                          right: 6,
                          background: "rgba(245,234,216,.9)",
                          padding: 5,
                        }}
                        onClick={() => removeStepPhoto(i)}
                      >
                        <CloseIcon size={13} />
                      </button>
                    </div>
                  ) : (
                    <label
                      className="btn btn-secondary"
                      style={{ alignSelf: "flex-start", fontSize: 12, cursor: "pointer" }}
                    >
                      <PhotoIcon size={15} />
                      写真を追加
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => updateStepPhoto(i, e.target.files?.[0] ?? null)}
                      />
                    </label>
                  )}
                </div>
                <button
                  className="btn btn-icon"
                  style={{ flex: "none", alignSelf: "flex-start" }}
                  onClick={() => removeStep(i)}
                >
                  <CloseIcon size={14} />
                </button>
              </div>
            ))}
            <button
              className="btn btn-secondary"
              style={{ alignSelf: "flex-start", fontSize: 13 }}
              onClick={() => setSteps((prev) => [...prev, { text: "" }])}
            >
              ＋ 手順を追加
            </button>
          </div>
        </div>

        <div className="field" style={{ marginTop: 16 }}>
          <label>メモ</label>
          <textarea
            className="input"
            style={{ minHeight: 70 }}
            placeholder="次回は少し醤油を減らす。"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary btn-block"
          style={{ padding: 14, fontSize: 15, marginTop: 18 }}
          onClick={handleSave}
        >
          {isEditing ? "変更を保存" : "レシピを保存"}
        </button>
      </div>
    </>
  );
}
