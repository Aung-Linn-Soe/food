"use client";

import { SearchIcon } from "@/components/icons";

export function SearchBar({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
      <span
        style={{
          position: "absolute",
          left: 16,
          display: "grid",
          placeItems: "center",
          color: "color-mix(in srgb, var(--color-text) 50%, transparent)",
          pointerEvents: "none",
        }}
      >
        <SearchIcon />
      </span>
      <input
        className="input"
        style={{ paddingLeft: 44, minHeight: 46, fontSize: 15 }}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
