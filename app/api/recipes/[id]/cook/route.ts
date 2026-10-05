import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await params;
  const result = await pool.query(
    `UPDATE recipes SET cook_count = cook_count + 1, last_cooked_at = now()
     WHERE id = $1 AND user_id = $2
     RETURNING cook_count, last_cooked_at`,
    [id, user.id]
  );

  if (result.rowCount === 0) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  return NextResponse.json({
    cookCount: result.rows[0].cook_count,
    lastCookedAt: result.rows[0].last_cooked_at,
  });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await params;
  const result = await pool.query(
    `UPDATE recipes SET cook_count = GREATEST(cook_count - 1, 0)
     WHERE id = $1 AND user_id = $2
     RETURNING cook_count, last_cooked_at`,
    [id, user.id]
  );

  if (result.rowCount === 0) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  return NextResponse.json({
    cookCount: result.rows[0].cook_count,
    lastCookedAt: result.rows[0].last_cooked_at,
  });
}
