import { prisma } from '@/db/prisma';

export interface CreateArticleInput {
  title: string;
  content: string;
  authorId: string;
}

export const ArticleService = {
  findByAuthor: async (authorId: string) => {
    return prisma.userArticle.findMany({
      where: { authorId },
      orderBy: { createdAt: 'desc' },
    });
  },

  create: async ({ title, content, authorId }: CreateArticleInput) => {
    return prisma.userArticle.create({
      data: { title, content, authorId },
    });
  },

  update: async (id: string, authorId: string, data: { title?: string; content?: string }) => {
    const article = await prisma.userArticle.findFirst({
      where: { id, authorId },
    });

    if (!article) {
      throw new Error('Article not found or unauthorized');
    }

    return prisma.userArticle.update({
      where: { id },
      data,
    });
  },

  delete: async (id: string, authorId: string) => {
    const article = await prisma.userArticle.findFirst({
      where: { id, authorId },
    });

    if (!article) {
      throw new Error('Article not found or unauthorized');
    }

    return prisma.userArticle.delete({
      where: { id },
    });
  },
};
