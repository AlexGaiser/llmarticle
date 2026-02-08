import { UserArticleDAO } from '@/db/UserArticleDAO';
import { UserArticle } from '@/generated/prisma/client';
import { DefaultIncludeAuthorClause } from '@/services/__test__/queries.constants';
import { prismaArticleToArticleData } from '@/types/data/prisma-db/datamappers';
import { UserId } from '@/types/data/User.model';
import { ArticleData, ArticleId, CreateUpdateArticleData } from '@/types/data/UserArticle.model';

export const getAllPublicArticles = async (): Promise<ArticleData[]> => {
  const articles = await UserArticleDAO.findMany({
    where: { isPrivate: false },
    orderBy: { updatedAt: 'desc' },
    ...DefaultIncludeAuthorClause,
  });
  return articles.map(prismaArticleToArticleData);
};

export const ArticleService = {
  findByAuthor: async (authorId: UserId): Promise<ArticleData[]> => {
    const articles = await UserArticleDAO.findMany({
      where: { authorId },
      orderBy: { createdAt: 'desc' },
      ...DefaultIncludeAuthorClause,
    });
    return articles.map(prismaArticleToArticleData);
  },

  create: async ({
    title,
    content,
    authorId,
    isPrivate,
  }: CreateUpdateArticleData): Promise<ArticleData> => {
    const res = await UserArticleDAO.create({
      data: { title, content, authorId, isPrivate },
      ...DefaultIncludeAuthorClause,
    });
    return prismaArticleToArticleData(res);
  },

  update: async (
    id: ArticleId,
    { authorId, title, content, isPrivate }: CreateUpdateArticleData,
  ): Promise<ArticleData> => {
    const article: UserArticle | null = await UserArticleDAO.findFirst({
      where: { id, authorId },
    });

    if (!article) {
      throw new Error('Article not found or unauthorized');
    }

    const res = await UserArticleDAO.update({
      where: { id },
      data: { title, content, authorId, isPrivate },
      ...DefaultIncludeAuthorClause,
    });

    return prismaArticleToArticleData(res);
  },

  delete: async (id: string, authorId: UserId) => {
    const article: UserArticle | null = await UserArticleDAO.findFirst({
      where: { id, authorId },
    });

    if (!article) {
      throw new Error('Article not found or unauthorized');
    }

    return UserArticleDAO.delete({
      where: { id },
    });
  },
};
