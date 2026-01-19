import { UserArticleDAO } from '@/db/UserArticleDAO';
import { UserId } from '@shared-types/data/User.model';
import {
  ArticleData,
  ArticleId,
  CreateUpdateArticleData,
} from '@shared-types/data/UserArticle.model';

export const ArticleService = {
  findByAuthor: async (authorId: UserId) => {
    const articles = await UserArticleDAO.findMany({
      where: { authorId },
      orderBy: { createdAt: 'desc' },
    });
    return articles; // UserArticleDAO returns types from prisma, which are standard objects
    // If ArticleService is expected to return branded types, we should map them here,
    // but usually DAOs share the same branding or we cast at the boundary.
    // For now, I'll keep it as is unless build errors occur.
  },

  create: async ({ title, content, authorId }: CreateUpdateArticleData): Promise<ArticleData> => {
    const res = await UserArticleDAO.create({
      data: { title, content, authorId },
    });
    // TODO create a util to convert prisma types to branded types
    return {
      ...res,
      id: ArticleId(res.id),
      authorId: UserId(res.authorId),
    };
  },

  update: async (
    id: ArticleId,
    { authorId, title, content }: CreateUpdateArticleData,
  ): Promise<ArticleData> => {
    const article = await UserArticleDAO.findFirst({
      where: { id, authorId },
    });

    if (!article) {
      throw new Error('Article not found or unauthorized');
    }

    const res = await UserArticleDAO.update({
      where: { id },
      data: { title, content, authorId },
    });

    // TODO create a util to convert prisma types to branded types
    return {
      ...res,
      id: ArticleId(res.id),
      authorId: UserId(res.authorId),
    };
  },

  delete: async (id: string, authorId: UserId) => {
    const article = await UserArticleDAO.findFirst({
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
