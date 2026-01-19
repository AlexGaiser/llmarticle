import { UserId } from "./User.model";

export type ArticleId = string & { readonly __brand: unique symbol };

export const ArticleId = (id: string): ArticleId => id as ArticleId;

export interface CreateUpdateArticleData {
  title: string;
  content: string;
  authorId: UserId;
}

export interface ArticleData extends CreateUpdateArticleData {
  id: ArticleId;
  createdAt: Date;
  updatedAt: Date;
}
