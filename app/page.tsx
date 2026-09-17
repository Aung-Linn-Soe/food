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
import { Recipe } from "@/types/recipe";

export default function Home() {
  const { categories, categoryName, toggleFavorite, addRecipe } = useRecipes();
  const [tab, setTab] = useState<TabKey>("home");
  const [openRecipe, setOpenRecipe] = useState<Recipe | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--color-bg)",
      }}
    >
      <div style={{ flex: 1, overflowY: "auto", padding: "22px 20px 100px" }}>
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
        />
      )}

      {addOpen && (
        <AddRecipeSheet
          categories={categories}
          onClose={() => setAddOpen(false)}
          onSave={(input) => {
            addRecipe(input);
            setAddOpen(false);
          }}
        />
      )}
    </div>
  );
}
