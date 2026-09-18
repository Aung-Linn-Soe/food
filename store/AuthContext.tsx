"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type AuthResult = { ok: boolean; error?: string };

type AuthContextValue = {
  username: string | null;
  ready: boolean;
  login: (username: string, password: string) => Promise<AuthResult>;
  register: (username: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function postJson(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { res, data };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => setUsername(data.username ?? null))
      .catch(() => setUsername(null))
      .finally(() => setReady(true));
  }, []);

  const login = useCallback(async (name: string, password: string): Promise<AuthResult> => {
    const { res, data } = await postJson("/api/auth/login", { username: name, password });
    if (!res.ok) return { ok: false, error: data.error ?? "ログインに失敗しました" };
    setUsername(data.username);
    return { ok: true };
  }, []);

  const register = useCallback(async (name: string, password: string): Promise<AuthResult> => {
    const { res, data } = await postJson("/api/auth/register", { username: name, password });
    if (!res.ok) return { ok: false, error: data.error ?? "登録に失敗しました" };
    setUsername(data.username);
    return { ok: true };
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUsername(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ username, ready, login, register, logout }),
    [username, ready, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
