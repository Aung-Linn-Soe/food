"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type StoredUser = {
  username: string;
  password: string;
};

type AuthContextValue = {
  username: string | null;
  ready: boolean;
  login: (username: string, password: string) => boolean;
  register: (username: string, password: string) => boolean;
  logout: () => void;
};

const USERS_KEY = "recipe-app-users-v1";
const SESSION_KEY = "recipe-app-session-v1";

const AuthContext = createContext<AuthContextValue | null>(null);

function loadUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUsername(window.localStorage.getItem(SESSION_KEY));
    setReady(true);
  }, []);

  const login = useCallback((name: string, password: string) => {
    const users = loadUsers();
    const found = users.find((u) => u.username === name && u.password === password);
    if (!found) return false;
    window.localStorage.setItem(SESSION_KEY, name);
    setUsername(name);
    return true;
  }, []);

  const register = useCallback((name: string, password: string) => {
    const users = loadUsers();
    if (users.some((u) => u.username === name)) return false;
    saveUsers([...users, { username: name, password }]);
    window.localStorage.setItem(SESSION_KEY, name);
    setUsername(name);
    return true;
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(SESSION_KEY);
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
