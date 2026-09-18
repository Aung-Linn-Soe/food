"use client";

import { useState } from "react";
import { BottomNav, TabKey } from "@/components/BottomNav";
import { PlusIcon } from "@/components/icons";
import { HomeScreen } from "@/screens/HomeScreen";
import { ListScreen } from "@/screens/ListScreen";
import { FavoritesScreen } from "@/screens/FavoritesScreen";
import { CategoryScreen } from "@/screens/CategoryScreen";
import { RecipeDetailSheet } from "@/components/RecipeDetailSheet";
import { AddRecipeSheet } from "@/components/AddRecipeSheet";
import { useRecipes } from "@/store/RecipeContext";
import { useAuth } from "@/store/AuthContext";
import { Recipe } from "@/types/recipe";

export function AppShell() {
  const { categories, categoryName, toggleFavorite, addRecipe, updateRecipe } = useRecipes();
  const { username, logout } = useAuth();
  const [tab, setTab] = useState<TabKey>("home");
  const [openRecipe, setOpenRecipe] = useState<Recipe | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--color-bg)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 10,
          padding: "14px 20px 0",
          fontSize: 12.5,
        }}
        className="muted"
      >
        <span>{username}さん</span>
        <button className="btn btn-ghost" style={{ fontSize: 12.5, padding: "4px 10px" }} onClick={logout}>
          ログアウト
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "10px 20px 100px" }}>
        {tab === "home" && <HomeScreen onOpenRecipe={setOpenRecipe} />}
        {tab === "list" && <ListScreen onOpenRecipe={setOpenRecipe} />}
        {tab === "favorites" && (
          <FavoritesScreen onOpenRecipe={setOpenRecipe} onGoList={() => setTab("list")} />
        )}
        {tab === "categories" && <CategoryScreen />}
      </div>

      <button
        className="btn btn-primary"
        style={{
          position: "fixed",
          right: 20,
          bottom: 96,
          width: 60,
          height: 60,
          padding: 0,
          borderRadius: "50%",
          boxShadow: "var(--shadow-lg)",
          zIndex: 15,
        }}
        onClick={() => setAddOpen(true)}
      >
        <PlusIcon size={26} />
      </button>

      <BottomNav active={tab} onChange={setTab} />

      {openRecipe && (
        <RecipeDetailSheet
          recipe={openRecipe}
          categoryLabel={categoryName(openRecipe.categoryId)}
          onClose={() => setOpenRecipe(null)}
          onToggleFavorite={() => {
            toggleFavorite(openRecipe.id);
            setOpenRecipe({ ...openRecipe, favorite: !openRecipe.favorite });
          }}
          onEdit={() => {
            setEditingRecipe(openRecipe);
            setOpenRecipe(null);
          }}
        />
      )}

      {addOpen && (
        <AddRecipeSheet
          categories={categories}
          onClose={() => setAddOpen(false)}
          onSave={async (input) => {
            await addRecipe(input);
            setAddOpen(false);
          }}
        />
      )}

      {editingRecipe && (
        <AddRecipeSheet
          categories={categories}
          initialRecipe={editingRecipe}
          onClose={() => setEditingRecipe(null)}
          onSave={async (input) => {
            await updateRecipe(editingRecipe.id, input);
            setEditingRecipe(null);
          }}
        />
      )}
    </div>
  );
}
