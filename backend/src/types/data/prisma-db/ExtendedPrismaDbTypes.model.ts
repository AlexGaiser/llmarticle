import { UserArticle, UserReview } from '@/generated/prisma/client';

export type ArticleWithAuthor = UserArticle & { author: { id: string; username: string } };
export type ReviewWithAuthor = UserReview & { author: { id: string; username: string } };
