import { UserArticleDAO } from '@/db/UserArticleDAO';
import { UserArticle } from '@/generated/prisma/client';
import { UserId } from '@/types/data/User.model';
import { ArticleData, ArticleId, CreateUpdateArticleData } from '@/types/data/UserArticle.model';

export const prismaArticleToArticleData = (article: UserArticle): ArticleData => {
  return {
    ...article,
    id: ArticleId(article.id),
    authorId: UserId(article.authorId),
  };
};

export const ArticleService = {
  findByAuthor: async (authorId: UserId): Promise<ArticleData[]> => {
    const articles: UserArticle[] = await UserArticleDAO.findMany({
      where: { authorId },
      orderBy: { createdAt: 'desc' },
    });
    return articles.map(prismaArticleToArticleData);
  },

  create: async ({ title, content, authorId }: CreateUpdateArticleData): Promise<ArticleData> => {
    const res = await UserArticleDAO.create({
      data: { title, content, authorId },
    });
    return prismaArticleToArticleData(res);
  },

  update: async (
    id: ArticleId,
    { authorId, title, content }: CreateUpdateArticleData,
  ): Promise<ArticleData> => {
    const article: UserArticle | null = await UserArticleDAO.findFirst({
      where: { id, authorId },
    });

    if (!article) {
      throw new Error('Article not found or unauthorized');
    }

    const res = await UserArticleDAO.update({
      where: { id },
      data: { title, content, authorId },
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
