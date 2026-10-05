# 料理レシピ管理アプリ

自分で作った料理のレシピを登録・管理し、料理名や材料、カテゴリから簡単に検索できる Web アプリです。Next.js（App Router）と PostgreSQL で作られています。

個人利用（一人で使うこと）を前提にしていますが、ユーザーごとにログインしてデータを分ける仕組みになっているため、複数人での利用にも対応できる構成です。

---

## 目次

- [できること（機能一覧）](#できること機能一覧)
- [画面構成](#画面構成)
- [技術構成](#技術構成)
- [データベース設計](#データベース設計)
- [API 一覧](#api-一覧)
- [ディレクトリ構成](#ディレクトリ構成)
- [セットアップ手順](#セットアップ手順)
- [開発時によく使うコマンド](#開発時によく使うコマンド)
- [現在の制限事項・今後の予定](#現在の制限事項今後の予定)

---

## できること（機能一覧）

### アカウント
- ユーザー名とパスワードでの新規登録・ログイン・ログアウト
- パスワードはハッシュ化（scrypt）してデータベースに保存
- ログイン状態は Cookie で保持され、ブラウザを閉じても保持される

### レシピ
- 料理名・写真・カテゴリ・調理時間・人数・材料・作り方・メモを登録
- 作り方は手順ごとに「文章」と「写真」の両方を登録可能
- 登録済みレシピの編集（内容をすべて上書き）
- お気に入り登録・解除
- レシピごとに「作った回数」を記録（「調理をはじめる」ボタンを押すとカウントされ、間違えて押した場合は－ボタンで1つ戻せる）

### 検索・一覧
- ホーム画面：料理名・材料・カテゴリを横断したキーワード検索、カテゴリ絞り込み
- 一覧画面：検索・カテゴリ絞り込みに加えて並び替え（新しい順／時間が短い順／名前順）
- お気に入り画面：お気に入り登録したレシピだけを表示
- 冷蔵庫からさがす：持っている材料を「、」区切りで入力して検索すると、完全に作れるレシピを優先し、次に「あと◯つで作れる」レシピを不足材料つきで表示

### カテゴリ管理
- カテゴリの追加・名称編集・削除
- カテゴリを削除しても、そのレシピは削除されず「未分類」として残る（削除前に確認ダイアログを表示）

---

## 画面構成

下部のタブで4つの画面を切り替える、スマートフォン向けのレイアウトです（PC幅でも表示可能）。

| タブ | 画面 | 主な内容 |
| --- | --- | --- |
| ホーム | `screens/HomeScreen.tsx` | 検索・カテゴリ絞り込み・最近登録したレシピ一覧・「冷蔵庫からさがす」への入り口 |
| 一覧 | `screens/ListScreen.tsx` | 全レシピの一覧・並び替え |
| お気に入り | `screens/FavoritesScreen.tsx` | お気に入りレシピのみ表示 |
| カテゴリ | `screens/CategoryScreen.tsx` | カテゴリの追加・編集・削除 |

その他、モーダル（ボトムシート）として以下があります。

- レシピ詳細（`components/RecipeDetailSheet.tsx`）：材料・作り方・メモの表示、お気に入り切替、編集、調理回数の記録
- レシピ追加／編集フォーム（`components/AddRecipeSheet.tsx`）：新規登録と編集を同じ画面で扱う
- カテゴリ削除確認ダイアログ（`components/ConfirmDialog.tsx`）
- 冷蔵庫からさがす（`screens/PantrySearchScreen.tsx`）：ホーム画面から遷移する専用画面

---

## 技術構成

| 項目 | 技術 |
| --- | --- |
| フロントエンド / API | Next.js 16（App Router） |
| 言語 | TypeScript |
| UI | React（クライアントコンポーネント中心）、素のCSS（`app/globals.css`。Tailwindは不使用） |
| フォント | Zen Maru Gothic（見出し）、Noto Sans JP（本文） |
| データベース | PostgreSQL（ローカル） |
| DBアクセス | [`pg`](https://node-postgres.com/)（Node.js用PostgreSQLクライアント） |
| 認証 | 自前実装（Cookieセッション＋`scrypt`によるパスワードハッシュ化） |
| 状態管理 | React Context（`AuthContext` / `RecipeContext`） |

画像（料理写真・手順の写真）は、現時点では **base64文字列としてデータベースに直接保存**しています。ファイルストレージ（Supabase Storage など）は未導入です。データ量が増えるとデータベースが重くなるため、将来的な移行を想定しています。

---

## データベース設計

`db/schema.sql` にテーブル定義があります。

```
users
  id, username, password_hash, created_at

categories
  id, user_id（NULL=共通カテゴリ）, name, created_at

recipes
  id, user_id, name, image_base64, category_id,
  cooking_time, servings, memo, is_favorite,
  cook_count, last_cooked_at,
  created_at, updated_at

ingredients
  id, recipe_id, name, amount, sort_order

steps
  id, recipe_id, step_number, description, photo_base64
```

- `categories` は `user_id` が `NULL` のものが初期カテゴリ（肉料理・魚料理・麺料理・ご飯・スープ・デザート）として全ユーザー共通で表示されます
- `recipes.category_id` は `ON DELETE SET NULL` になっており、カテゴリを削除してもレシピ自体は消えず「未分類」扱いになります
- `ingredients` / `steps` は `recipe_id` に `ON DELETE CASCADE` が設定されており、レシピ削除時に連動して削除されます

---

## API 一覧

すべて Next.js の Route Handler（`app/api/**/route.ts`）として実装されています。認証が必要なエンドポイントは、Cookie のセッションからユーザーを特定します（未ログインは `401`）。

### 認証

| メソッド | パス | 内容 |
| --- | --- | --- |
| POST | `/api/auth/register` | 新規登録してログイン状態にする |
| POST | `/api/auth/login` | ログイン |
| POST | `/api/auth/logout` | ログアウト |
| GET | `/api/auth/session` | 現在ログイン中のユーザー名を取得 |

### カテゴリ

| メソッド | パス | 内容 |
| --- | --- | --- |
| GET | `/api/categories` | 共通カテゴリ＋自分のカテゴリを取得 |
| POST | `/api/categories` | カテゴリを追加 |
| PATCH | `/api/categories/[id]` | カテゴリ名を変更 |
| DELETE | `/api/categories/[id]` | カテゴリを削除 |

### レシピ

| メソッド | パス | 内容 |
| --- | --- | --- |
| GET | `/api/recipes` | 自分のレシピ一覧（材料・作り方を含む）を取得 |
| POST | `/api/recipes` | レシピを新規登録 |
| PATCH | `/api/recipes/[id]` | `{ favorite: boolean }` のみならお気に入り切替、それ以外はレシピ全体を更新 |
| DELETE | `/api/recipes/[id]` | レシピを削除 |
| POST | `/api/recipes/[id]/cook` | 「作った回数」を+1 |
| DELETE | `/api/recipes/[id]/cook` | 「作った回数」を−1（0未満にはならない） |

---

## ディレクトリ構成

```
app/
  api/                APIルート（auth・categories・recipes）
  layout.tsx          共通レイアウト（フォント・Context Provider）
  page.tsx            ログイン状態に応じてログイン画面／アプリ本体を出し分け
  globals.css         デザインの共通スタイル（配色・ボタン・入力欄など）

components/
  AppShell.tsx        ログイン後のアプリ全体（タブ切り替え・各モーダルの管理）
  BottomNav.tsx        下部タブ
  AddRecipeSheet.tsx   レシピ追加／編集フォーム
  RecipeDetailSheet.tsx  レシピ詳細
  RecipeListCard.tsx / RecipeGridCard.tsx  レシピカード（一覧表示用）
  ConfirmDialog.tsx    削除確認ダイアログ
  SearchBar.tsx / CategoryChips.tsx  検索・絞り込みUI
  icons.tsx            SVGアイコン集

screens/
  HomeScreen.tsx / ListScreen.tsx / FavoritesScreen.tsx / CategoryScreen.tsx
  LoginScreen.tsx       ログイン／新規登録画面
  PantrySearchScreen.tsx 冷蔵庫からさがす画面

store/
  AuthContext.tsx      ログイン状態の管理（APIを呼び出す）
  RecipeContext.tsx    レシピ・カテゴリデータの管理（APIを呼び出す）

lib/
  db.ts    PostgreSQL接続プール
  auth.ts  パスワードハッシュ化・セッションCookieの発行/検証

db/
  schema.sql  テーブル定義（初期カテゴリの投入も含む）

types/
  recipe.ts  Recipe / Category / Ingredient / Step の型定義
```

---

## セットアップ手順

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. PostgreSQL データベースの準備

ローカルに PostgreSQL がインストールされている前提です。データベースを作成し、スキーマを流し込みます。

```bash
psql -U postgres -c "CREATE DATABASE food;"
psql -U postgres -d food -f db/schema.sql
```

（pgAdminを使う場合は、`food` という名前でデータベースを作成し、SQLクエリツールで `db/schema.sql` の中身を実行してください。）

### 3. 環境変数の設定

プロジェクト直下に `.env.local` を作成します（Gitには含まれません）。

```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/food
```

`YOUR_PASSWORD` は自分の PostgreSQL の `postgres` ユーザーのパスワードに置き換えてください。

### 4. 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) を開くとログイン画面が表示されます。「新規登録」からアカウントを作成して使い始められます。

---

## 開発時によく使うコマンド

```bash
npm run dev      # 開発サーバー起動（Turbopack）
npm run build    # 本番ビルド
npm run start    # 本番ビルドの起動
npm run lint     # ESLint によるチェック
npx tsc --noEmit # 型チェックのみ実行
```

---

## 現在の制限事項・今後の予定

- **写真の保存方法**：base64でDBに直接保存しているため、写真が増えるとデータベース容量を圧迫します。Supabase Storage 等への移行を想定しています。
- **本番デプロイ**：現在はローカルのPostgreSQLを直接参照しているため、このままではVercel等のホスティングサービスにデプロイできません。デプロイする場合は、Supabase・Neon などクラウド上のPostgreSQLへの切り替えが必要です。
- **認証のセキュリティレベル**：パスワードはハッシュ化していますが、CSRF対策やレート制限などの本格的な対策は行っていません。個人利用・学習目的の範囲を想定しています。
- **レシピ削除のUI**：APIは用意済みですが、画面上の削除ボタンはまだ配置していません。
- **未実装の将来機能案**：人数変更に応じた材料の自動計算、複数ユーザー間でのレシピ共有、タグ機能など。
