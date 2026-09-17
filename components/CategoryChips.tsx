"use client";

export type Chip = {
  id: string;
  label: string;
};

export function CategoryChips({
  chips,
  activeId,
  onPick,
}: {
  chips: Chip[];
  activeId: string;
  onPick: (id: string) => void;
}) {
  return (
    <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, margin: "-2px" }}>
      {chips.map((chip) => {
        const on = chip.id === activeId;
        return (
          <div key={chip.id} style={{ flex: "none", padding: 2 }}>
            <button
              className="btn"
              style={{
                background: on ? "var(--color-accent)" : "var(--color-surface)",
                color: on ? "var(--color-bg)" : "var(--color-text)",
                fontSize: 13,
                padding: "8px 16px",
                whiteSpace: "nowrap",
              }}
              onClick={() => onPick(chip.id)}
            >
              {chip.label}
            </button>
          </div>
        );
      })}
    </div>
  );
}
