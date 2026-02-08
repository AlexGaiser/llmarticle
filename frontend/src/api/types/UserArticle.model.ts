import type { Author, UserId } from "@/api/types/User.model";

export type ArticleId = string & { readonly __brand: unique symbol };

export const ArticleId = (id: string): ArticleId => id as ArticleId;

export interface CreateUpdateArticleData {
  title: string;
  content: string;
  authorId: UserId;
  isPrivate: boolean;
}

export interface ArticleData {
  id: ArticleId;
  title: string;
  content: string;
  isPrivate: boolean;
  author: Author;
  createdAt: Date;
  updatedAt: Date;
}
