"use client";

export function ConfirmDialog({
  title,
  message,
  onCancel,
  onConfirm,
}: {
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="dialog-backdrop animate-fade-in">
      <div className="dialog animate-sheet-up">
        <div className="dialog-title">{title}</div>
        <div className="dialog-body">{message}</div>
        <div className="dialog-actions">
          <button className="btn btn-secondary" style={{ padding: "10px 18px" }} onClick={onCancel}>
            キャンセル
          </button>
          <button
            className="btn btn-primary"
            style={{ padding: "10px 18px", background: "var(--color-accent-700)" }}
            onClick={onConfirm}
          >
            削除する
          </button>
        </div>
      </div>
    </div>
  );
}
