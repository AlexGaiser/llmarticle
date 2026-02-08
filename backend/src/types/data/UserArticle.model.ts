import { Author, UserId } from '@/types/data/User.model';

export type ArticleId = string & { readonly __brand: unique symbol };

export const ArticleId = (id: string): ArticleId => id as ArticleId;

export interface CreateUpdateArticleData {
  title: string;
  content: string;
  authorId: UserId;
  isPrivate: boolean;
}

// Currently we are not extending because create does not include author but does include authorId
export interface ArticleData {
  id: ArticleId;
  title: string;
  content: string;
  isPrivate: boolean;
  author: Author;
  createdAt: Date;
  updatedAt: Date;
}
