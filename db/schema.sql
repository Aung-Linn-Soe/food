-- 料理レシピ管理アプリ: データベーススキーマ (pgAdmin / ローカル PostgreSQL 用)
-- 写真は Supabase Storage ではなく、base64 文字列として TEXT カラムに保存する暫定仕様。

-- gen_random_uuid() は PostgreSQL 13+ ならこの拡張機能だけで使えます。
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  image_base64 TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  cooking_time INTEGER NOT NULL DEFAULT 0,
  servings INTEGER NOT NULL DEFAULT 0,
  memo TEXT NOT NULL DEFAULT '',
  is_favorite BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  photo_base64 TEXT
);

CREATE INDEX IF NOT EXISTS idx_recipes_user_id ON recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_recipes_category_id ON recipes(category_id);
CREATE INDEX IF NOT EXISTS idx_ingredients_recipe_id ON ingredients(recipe_id);
CREATE INDEX IF NOT EXISTS idx_steps_recipe_id ON steps(recipe_id);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);

-- 初期カテゴリ（要件定義書の「初期カテゴリ例」）。user_id は NULL = 共通カテゴリ扱い。
INSERT INTO categories (name) VALUES
  ('肉料理'), ('魚料理'), ('麺料理'), ('ご飯'), ('スープ'), ('デザート')
ON CONFLICT DO NOTHING;
