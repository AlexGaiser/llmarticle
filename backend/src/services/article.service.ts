import { UserArticleDAO } from '@/db/UserArticleDAO';
import { UserId } from '@shared-types/data/User.model';

export interface CreateArticleInput {
  title: string;
  content: string;
  authorId: UserId;
}

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

  create: async ({ title, content, authorId }: CreateArticleInput) => {
    return UserArticleDAO.create({
      data: { title, content, authorId },
    });
  },

  update: async (id: string, authorId: UserId, data: { title?: string; content?: string }) => {
    const article = await UserArticleDAO.findFirst({
      where: { id, authorId },
    });

    if (!article) {
      throw new Error('Article not found or unauthorized');
    }

    return UserArticleDAO.update({
      where: { id },
      data,
    });
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
