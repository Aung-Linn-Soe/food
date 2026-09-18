import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  if (typeof body.favorite === "boolean" && body.name === undefined) {
    await pool.query(
      "UPDATE recipes SET is_favorite = $1, updated_at = now() WHERE id = $2 AND user_id = $3",
      [body.favorite, id, user.id]
    );
    return NextResponse.json({ ok: true });
  }

  const { name, categoryId, time, servings, memo, ingredients, steps, photo } = body;
  if (!name?.trim()) {
    return NextResponse.json({ error: "料理名を入力してください" }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const result = await client.query(
      `UPDATE recipes SET name = $1, category_id = $2, cooking_time = $3, servings = $4,
       memo = $5, image_base64 = $6, updated_at = now()
       WHERE id = $7 AND user_id = $8`,
      [
        name.trim(),
        categoryId || null,
        time || 0,
        servings || 0,
        memo || "",
        photo || null,
        id,
        user.id,
      ]
    );
    if (result.rowCount === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    await client.query("DELETE FROM ingredients WHERE recipe_id = $1", [id]);
    await client.query("DELETE FROM steps WHERE recipe_id = $1", [id]);

    const ingredientList = (ingredients ?? []).filter(
      (i: { name?: string }) => i.name?.trim()
    );
    for (let i = 0; i < ingredientList.length; i++) {
      await client.query(
        `INSERT INTO ingredients (recipe_id, name, amount, sort_order) VALUES ($1, $2, $3, $4)`,
        [id, ingredientList[i].name.trim(), ingredientList[i].amount ?? "", i]
      );
    }

    const stepList = (steps ?? []).filter(
      (s: { text?: string; photo?: string }) => s.text?.trim() || s.photo
    );
    for (let i = 0; i < stepList.length; i++) {
      await client.query(
        `INSERT INTO steps (recipe_id, step_number, description, photo_base64) VALUES ($1, $2, $3, $4)`,
        [id, i + 1, stepList[i].text ?? "", stepList[i].photo ?? null]
      );
    }

    await client.query("COMMIT");
    return NextResponse.json({ ok: true });
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await params;
  await pool.query("DELETE FROM recipes WHERE id = $1 AND user_id = $2", [id, user.id]);
  return NextResponse.json({ ok: true });
}
