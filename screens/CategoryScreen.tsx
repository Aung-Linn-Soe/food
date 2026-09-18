"use client";

import { useState } from "react";
import { useRecipes } from "@/store/RecipeContext";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Category } from "@/types/recipe";

export function CategoryScreen() {
  const { categories, recipeCountForCategory, addCategory, renameCategory, removeCategory } = useRecipes();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [newCat, setNewCat] = useState("");
  const [pendingDelete, setPendingDelete] = useState<Category | null>(null);

  function startEdit(c: Category) {
    setEditingId(c.id);
    setDraft(c.name);
  }

  function saveEdit(id: string) {
    renameCategory(id, draft);
    setEditingId(null);
  }

  function handleAdd() {
    addCategory(newCat);
    setNewCat("");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 30, lineHeight: 1.1, fontFamily: "var(--font-heading)" }}>
          カテゴリ管理
        </h1>
        <p className="muted" style={{ margin: "6px 0 0", fontSize: 13 }}>
          {categories.length}件のカテゴリ
        </p>
      </div>

      <p className="muted-light" style={{ margin: 0, fontSize: 12 }}>
        カテゴリを削除しても、そのレシピは「未分類」として残ります。
      </p>
      <div
        style={{
          padding: 16,
          borderRadius: 26,
          border: "2px dashed var(--color-neutral-400)",
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <input
          className="input"
          style={{ flex: 1, minWidth: 160, minHeight: 44, background: "var(--color-bg)" }}
          placeholder="例：Myanmar料理／簡単料理／お弁当"
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
        />
        <button className="btn btn-primary" style={{ padding: "11px 20px" }} onClick={handleAdd}>
          ＋ カテゴリ追加
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {categories.map((c) => {
          const editing = editingId === c.id;
          return (
            <div
              key={c.id}
              style={{
                padding: "12px 14px",
                borderRadius: 24,
                background: "var(--color-surface)",
                display: "flex",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              {editing ? (
                <>
                  <input
                    className="input"
                    style={{ flex: 1, minWidth: 140, minHeight: 40, background: "var(--color-bg)" }}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    autoFocus
                  />
                  <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
                    <button
                      className="btn btn-primary"
                      style={{ fontSize: 13, padding: "8px 16px" }}
                      onClick={() => saveEdit(c.id)}
                    >
                      保存
                    </button>
                    <button
                      className="btn btn-secondary"
                      style={{ fontSize: 13, padding: "8px 16px" }}
                      onClick={() => setEditingId(null)}
                    >
                      やめる
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span
                    style={{
                      width: 38,
                      height: 38,
                      flex: "none",
                      borderRadius: "50%",
                      background: "var(--color-accent-2-200)",
                      display: "grid",
                      placeItems: "center",
                      fontFamily: "var(--font-heading)",
                      fontSize: 15,
                      color: "var(--color-accent-2-800)",
                    }}
                  >
                    {c.name.charAt(0)}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--font-heading)", fontSize: 17, lineHeight: 1.2 }}>
                      {c.name}
                    </div>
                    <div className="muted" style={{ fontSize: 11.5, marginTop: 2 }}>
                      {recipeCountForCategory(c.id)}品のレシピ
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      className="btn btn-secondary"
                      style={{ fontSize: 13, padding: "8px 16px" }}
                      onClick={() => startEdit(c)}
                    >
                      編集
                    </button>
                    <button
                      className="btn btn-ghost"
                      style={{ fontSize: 13, padding: "8px 12px" }}
                      onClick={() => setPendingDelete(c)}
                    >
                      削除
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {pendingDelete && (
        <ConfirmDialog
          categoryName={pendingDelete.name}
          recipeCount={recipeCountForCategory(pendingDelete.id)}
          onCancel={() => setPendingDelete(null)}
          onConfirm={() => {
            removeCategory(pendingDelete.id);
            setPendingDelete(null);
          }}
        />
      )}
    </div>
  );
}
