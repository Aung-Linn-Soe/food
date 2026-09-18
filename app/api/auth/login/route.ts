import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { verifyPassword, setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const { username, password } = await req.json();
  if (!username?.trim() || !password) {
    return NextResponse.json(
      { error: "ユーザー名とパスワードを入力してください" },
      { status: 400 }
    );
  }
  const name = username.trim();

  const result = await pool.query(
    "SELECT username, password_hash FROM users WHERE username = $1",
    [name]
  );
  const user = result.rows[0];
  if (!user || !verifyPassword(password, user.password_hash)) {
    return NextResponse.json(
      { error: "ユーザー名またはパスワードが正しくありません" },
      { status: 401 }
    );
  }

  await setSessionCookie(user.username);
  return NextResponse.json({ username: user.username });
}
