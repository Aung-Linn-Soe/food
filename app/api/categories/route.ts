import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const result = await pool.query(
    "SELECT id, name FROM categories WHERE user_id IS NULL OR user_id = $1 ORDER BY created_at",
    [user.id]
  );
  return NextResponse.json(result.rows);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { name } = await req.json();
  if (!name?.trim()) {
    return NextResponse.json({ error: "カテゴリ名を入力してください" }, { status: 400 });
  }

  const result = await pool.query(
    "INSERT INTO categories (user_id, name) VALUES ($1, $2) RETURNING id, name",
    [user.id, name.trim()]
  );
  return NextResponse.json(result.rows[0]);
}
