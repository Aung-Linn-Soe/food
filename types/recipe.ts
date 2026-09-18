export type Ingredient = {
  name: string;
  amount: string;
};

export type Step = {
  text: string;
  photo?: string;
};

export type Recipe = {
  id: string;
  name: string;
  categoryId: string;
  time: number;
  servings: number;
  favorite: boolean;
  tile: string;
  photo?: string;
  ingredients: Ingredient[];
  steps: Step[];
  memo: string;
};

export type Category = {
  id: string;
  name: string;
};

export const UNCATEGORIZED_ID = "uncategorized";
