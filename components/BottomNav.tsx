"use client";

import { HeartIcon, HomeIcon, ListIcon, TagIcon } from "@/components/icons";

export type TabKey = "home" | "list" | "favorites" | "categories";

const TABS: { key: TabKey; label: string; Icon: typeof HomeIcon }[] = [
  { key: "home", label: "ホーム", Icon: HomeIcon },
  { key: "list", label: "一覧", Icon: ListIcon },
  { key: "favorites", label: "お気に入り", Icon: HeartIcon },
  { key: "categories", label: "カテゴリ", Icon: TagIcon },
];

export function BottomNav({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}) {
  return (
    <nav
      style={{
        position: "sticky",
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        padding: "10px 8px calc(10px + env(safe-area-inset-bottom))",
        background: "color-mix(in srgb, var(--color-bg) 88%, transparent)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid var(--color-divider)",
        zIndex: 20,
      }}
    >
      {TABS.map(({ key, label, Icon }) => {
        const isActive = key === active;
        const color = isActive ? "var(--color-accent-700)" : "var(--color-neutral-700)";
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              padding: "4px 14px",
              minWidth: 56,
              background: "none",
              border: "none",
              cursor: "pointer",
              color,
            }}
          >
            <Icon color={color} filled={key === "favorites" && isActive} />
            <span style={{ fontSize: 10, fontWeight: 600 }}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
