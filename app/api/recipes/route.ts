import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

type IngredientRow = { recipe_id: string; name: string; amount: string };
type StepRow = { recipe_id: string; description: string; photo_base64: string | null };

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const recipesResult = await pool.query(
    `SELECT id, name, category_id, cooking_time, servings, memo, is_favorite, image_base64
     FROM recipes WHERE user_id = $1 ORDER BY created_at DESC`,
    [user.id]
  );
  const recipes = recipesResult.rows;
  const ids = recipes.map((r) => r.id);

  const ingredientsByRecipe: Record<string, { name: string; amount: string }[]> = {};
  const stepsByRecipe: Record<string, { text: string; photo?: string }[]> = {};

  if (ids.length > 0) {
    const ingResult = await pool.query<IngredientRow>(
      `SELECT recipe_id, name, amount FROM ingredients WHERE recipe_id = ANY($1) ORDER BY sort_order`,
      [ids]
    );
    for (const row of ingResult.rows) {
      (ingredientsByRecipe[row.recipe_id] ??= []).push({ name: row.name, amount: row.amount });
    }

    const stepResult = await pool.query<StepRow>(
      `SELECT recipe_id, description, photo_base64 FROM steps WHERE recipe_id = ANY($1) ORDER BY step_number`,
      [ids]
    );
    for (const row of stepResult.rows) {
      (stepsByRecipe[row.recipe_id] ??= []).push({
        text: row.description,
        photo: row.photo_base64 ?? undefined,
      });
    }
  }

  const payload = recipes.map((r) => ({
    id: r.id,
    name: r.name,
    categoryId: r.category_id,
    time: r.cooking_time,
    servings: r.servings,
    favorite: r.is_favorite,
    memo: r.memo,
    imageBase64: r.image_base64,
    ingredients: ingredientsByRecipe[r.id] ?? [],
    steps: stepsByRecipe[r.id] ?? [],
  }));

  return NextResponse.json(payload);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, categoryId, time, servings, memo, ingredients, steps, photo } = body;
  if (!name?.trim()) {
    return NextResponse.json({ error: "料理名を入力してください" }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const recipeResult = await client.query(
      `INSERT INTO recipes (user_id, name, category_id, cooking_time, servings, memo, image_base64)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [user.id, name.trim(), categoryId || null, time || 0, servings || 0, memo || "", photo || null]
    );
    const recipeId = recipeResult.rows[0].id;

    const ingredientList = (ingredients ?? []).filter(
      (i: { name?: string }) => i.name?.trim()
    );
    for (let i = 0; i < ingredientList.length; i++) {
      await client.query(
        `INSERT INTO ingredients (recipe_id, name, amount, sort_order) VALUES ($1, $2, $3, $4)`,
        [recipeId, ingredientList[i].name.trim(), ingredientList[i].amount ?? "", i]
      );
    }

    const stepList = (steps ?? []).filter(
      (s: { text?: string; photo?: string }) => s.text?.trim() || s.photo
    );
    for (let i = 0; i < stepList.length; i++) {
      await client.query(
        `INSERT INTO steps (recipe_id, step_number, description, photo_base64) VALUES ($1, $2, $3, $4)`,
        [recipeId, i + 1, stepList[i].text ?? "", stepList[i].photo ?? null]
      );
    }

    await client.query("COMMIT");
    return NextResponse.json({ id: recipeId });
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}
