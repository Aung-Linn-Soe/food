"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/store/AuthContext";

export function LoginScreen() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const name = username.trim();
    if (!name || !password) {
      setError("ユーザー名とパスワードを入力してください");
      return;
    }
    setSubmitting(true);
    const result = mode === "login" ? await login(name, password) : await register(name, password);
    setSubmitting(false);
    setError(result.ok ? "" : result.error ?? "エラーが発生しました");
  }

  function switchMode() {
    setMode((m) => (m === "login" ? "register" : "login"));
    setError("");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "var(--color-bg)",
      }}
    >
      <div style={{ width: "100%", maxWidth: 360, display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "var(--color-accent)",
              display: "grid",
              placeItems: "center",
              margin: "0 auto 14px",
              color: "var(--color-bg)",
            }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.75} strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
            </svg>
          </div>
          <h1 style={{ margin: 0, fontSize: 26, fontFamily: "var(--font-heading)" }}>料理レシピ</h1>
          <p className="muted" style={{ marginTop: 6, fontSize: 13 }}>
            {mode === "login" ? "おかえりなさい" : "はじめまして。アカウントを作りましょう"}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            background: "var(--color-surface)",
            padding: 22,
            borderRadius: 28,
          }}
        >
          <div className="field">
            <label>ユーザー名</label>
            <input
              className="input"
              style={{ minHeight: 46 }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="例：yuki"
              autoComplete="username"
            />
          </div>
          <div className="field">
            <label>パスワード</label>
            <input
              className="input"
              style={{ minHeight: 46 }}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
          </div>

          {error && (
            <p style={{ margin: 0, fontSize: 12.5, color: "var(--color-accent-700)" }}>{error}</p>
          )}

          <button
            className="btn btn-primary btn-block"
            style={{ padding: 13, fontSize: 15, opacity: submitting ? 0.7 : 1 }}
            type="submit"
            disabled={submitting}
          >
            {mode === "login" ? "ログイン" : "登録してはじめる"}
          </button>
        </form>

        <button className="btn btn-ghost" style={{ alignSelf: "center", fontSize: 13 }} onClick={switchMode}>
          {mode === "login" ? "新規登録" : "すでにアカウントをお持ちの方はこちら"}
        </button>
      </div>
    </div>
  );
}
