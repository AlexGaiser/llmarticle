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
};
