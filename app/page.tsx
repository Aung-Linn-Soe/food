"use client";

import { useAuth } from "@/store/AuthContext";
import { LoginScreen } from "@/screens/LoginScreen";
import { AppShell } from "@/components/AppShell";

export default function Home() {
  const { username, ready } = useAuth();

  if (!ready) return null;
  if (!username) return <LoginScreen />;
  return <AppShell />;
}
