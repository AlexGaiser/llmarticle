import { UserArticleDAO } from '@/db/UserArticleDAO';
import { UserArticle } from '@/generated/prisma/client';
import { DefaultIncludeAuthorClause } from '@/services/constants/queries.constants';
import {
  CursorPaginationOptions,
  OffsetPaginationOptions,
  PaginationOptions,
} from '@/types/data/Pagination.model';
import { DEFAULT_PAGE_LIMIT } from './constants/queries.constants';
import { prismaArticleToArticleData } from '@/types/data/prisma-db/datamappers';
import { UserId } from '@/types/data/User.model';
import { ArticleData, ArticleId, CreateUpdateArticleData } from '@/types/data/UserArticle.model';

// TODO add a general query function that always maps result to ArticleData

export const getPublicArticles = async (
  options: OffsetPaginationOptions = { limit: DEFAULT_PAGE_LIMIT, skip: 0 },
): Promise<ArticleData[]> => {
  const { limit = DEFAULT_PAGE_LIMIT, skip = 0 } = options;

  const articles = await UserArticleDAO.findMany({
    where: {
      isPrivate: false,
    },
    orderBy: { updatedAt: 'desc' },
    take: limit,
    skip,
    ...DefaultIncludeAuthorClause,
  });
  return articles.map(prismaArticleToArticleData);
};

export const getCursorPaginatedArticles = async (
  options: CursorPaginationOptions,
): Promise<ArticleData[]> => {
  const { limit, cursor } = options;

  const currentCursor = cursor ?? new Date();
  const articles = await UserArticleDAO.findMany({
    where: {
      isPrivate: false,
      ...(currentCursor && { updatedAt: { lt: currentCursor } }),
    },
    orderBy: { updatedAt: 'desc' },
    take: limit,
    ...DefaultIncludeAuthorClause,
  });
  return articles.map(prismaArticleToArticleData);
};

export const getOffestPaginatedArticles = async (
  options: OffsetPaginationOptions,
): Promise<ArticleData[]> => {
  const limit = options?.limit ?? DEFAULT_PAGE_LIMIT;

  const skip: number | undefined = options.skip;
  const articles = await UserArticleDAO.findMany({
    where: {
      isPrivate: false,
    },
    orderBy: { updatedAt: 'desc' },
    take: limit,
    skip,
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
