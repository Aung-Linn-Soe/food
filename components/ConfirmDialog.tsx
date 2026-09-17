"use client";

export function ConfirmDialog({
  categoryName,
  recipeCount,
  onCancel,
  onConfirm,
}: {
  categoryName: string;
  recipeCount: number;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="dialog-backdrop animate-fade-in">
      <div className="dialog animate-sheet-up">
        <div className="dialog-title">「{categoryName}」を削除しますか？</div>
        <div className="dialog-body">
          このカテゴリは一覧から消えます。{recipeCount}品のレシピは削除されず「未分類」に移ります。
        </div>
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
