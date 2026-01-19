export type ArticleId = string & { readonly __brand: unique symbol };

export const ArticleId = (id: string): ArticleId => id as ArticleId;

export interface CreateUpdateArticleData {
  title: string;
  content: string;
}

export interface ArticleData extends CreateUpdateArticleData {
  id: ArticleId;
}
