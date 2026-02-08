import { UserArticleDAO } from '@/db/UserArticleDAO';
import { UserArticle } from '@/generated/prisma/client';
import { Author, prismaToAuthor, UserId } from '@/types/data/User.model';
import { ArticleData, ArticleId, CreateUpdateArticleData } from '@/types/data/UserArticle.model';

export type ArticleWithAuthor = UserArticle & { author: { id: string; username: string } };

export const IncludeAuthorClause = {
  include: {
    author: {
      select: {
        id: true,
        username: true,
      },
    },
  },
};

export const prismaArticleToArticleData = (articleWithAuthor: ArticleWithAuthor): ArticleData => {
  const { author, id, title, content, isPrivate, createdAt, updatedAt } = articleWithAuthor;
  const authorData: Author = prismaToAuthor(author);

  return {
    id: ArticleId(id),
    title,
    content,
    isPrivate,
    author: authorData,
    createdAt,
    updatedAt,
  };
};

export const getAllPublicArticles = async (): Promise<ArticleData[]> => {
  const articles = await UserArticleDAO.findMany({
    where: { isPrivate: false },
    orderBy: { updatedAt: 'desc' },
    ...IncludeAuthorClause,
  });
  return articles.map(prismaArticleToArticleData);
};

export const ArticleService = {
  findByAuthor: async (authorId: UserId): Promise<ArticleData[]> => {
    const articles = await UserArticleDAO.findMany({
      where: { authorId },
      orderBy: { createdAt: 'desc' },
      ...IncludeAuthorClause,
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
      ...IncludeAuthorClause,
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
      ...IncludeAuthorClause,
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
