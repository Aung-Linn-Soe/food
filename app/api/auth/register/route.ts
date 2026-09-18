import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { hashPassword, setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const { username, password } = await req.json();
  if (!username?.trim() || !password) {
    return NextResponse.json(
      { error: "ユーザー名とパスワードを入力してください" },
      { status: 400 }
    );
  }
  const name = username.trim();

  const existing = await pool.query("SELECT id FROM users WHERE username = $1", [name]);
  if (existing.rows.length > 0) {
    return NextResponse.json(
      { error: "このユーザー名は既に使われています" },
      { status: 409 }
    );
  }

  const passwordHash = hashPassword(password);
  await pool.query(
    "INSERT INTO users (username, password_hash) VALUES ($1, $2)",
    [name, passwordHash]
  );
  await setSessionCookie(name);
  return NextResponse.json({ username: name });
}
