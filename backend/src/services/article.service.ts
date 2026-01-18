import { UserArticleDAO } from '@/db/UserArticleDAO';
import { AuthorId } from '@/model/UserArticle.model';

export interface CreateArticleInput {
  title: string;
  content: string;
  authorId: AuthorId;
}

export const ArticleService = {
  findByAuthor: async (authorId: AuthorId) => {
    return UserArticleDAO.findMany({
      where: { authorId },
      orderBy: { createdAt: 'desc' },
    });
  },

  create: async ({ title, content, authorId }: CreateArticleInput) => {
    return UserArticleDAO.create({
      data: { title, content, authorId },
    });
  },

  update: async (id: string, authorId: AuthorId, data: { title?: string; content?: string }) => {
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

  delete: async (id: string, authorId: AuthorId) => {
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
