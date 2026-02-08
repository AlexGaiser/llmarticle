import { prisma } from '@/db/prisma';
import {
  ArticleService,
  ArticleWithAuthor,
  IncludeAuthorClause,
  prismaArticleToArticleData,
} from '@/services/article.service';
import { UserId } from '@/types/data/User.model';
import { ArticleData, ArticleId } from '@/types/data/UserArticle.model';

jest.mock('@/db/prisma', () => ({
  prisma: {
    userArticle: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe('ArticleService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should find articles by author', async () => {
    const mockArticles: ArticleWithAuthor[] = [
      {
        id: '1',
        title: 'Test',
        authorId: 'user-1',
        author: { id: 'user-1', username: 'user-1' },
        createdAt: new Date(),
        updatedAt: new Date(),
        content: 'Content',
        isPrivate: false,
      },
    ];

    const mockArticleData = mockArticles.map((article) => prismaArticleToArticleData(article));
    (prisma.userArticle.findMany as jest.Mock).mockResolvedValue(mockArticles);

    const result = await ArticleService.findByAuthor(UserId('user-1'));

    expect(result).toEqual(mockArticleData);
    expect(prisma.userArticle.findMany).toHaveBeenCalledWith({
      where: { authorId: UserId('user-1') },
      orderBy: { createdAt: 'desc' },
      ...IncludeAuthorClause,
    });
  });

  it('should create an article', async () => {
    const mockArticle: ArticleWithAuthor = {
      id: '1',
      title: 'Test',
      authorId: 'user-1',
      author: { id: 'user-1', username: 'user-1' },
      createdAt: new Date(),
      updatedAt: new Date(),
      content: 'Content',
      isPrivate: false,
    };

    const mockArticleData = prismaArticleToArticleData(mockArticle);

    (prisma.userArticle.create as jest.Mock).mockResolvedValue(mockArticle);

    const result = await ArticleService.create({
      title: 'Test',
      content: 'Content',
      authorId: UserId('user-1'),
      isPrivate: false,
    });

    expect(result).toEqual(mockArticleData);
    expect(prisma.userArticle.create).toHaveBeenCalledWith({
      data: { title: 'Test', content: 'Content', authorId: 'user-1', isPrivate: false },
      ...IncludeAuthorClause,
    });
  });

  it('should update an article', async () => {
    const mockArticle: ArticleWithAuthor = {
      id: '1',
      title: 'Updated',
      authorId: 'user-1',
      author: { id: 'user-1', username: 'user-1' },
      createdAt: new Date(),
      updatedAt: new Date(),
      content: 'Content',
      isPrivate: false,
    };

    const mockArticleData: ArticleData = prismaArticleToArticleData(mockArticle);

    (prisma.userArticle.findFirst as jest.Mock).mockResolvedValue(mockArticle);
    (prisma.userArticle.update as jest.Mock).mockResolvedValue(mockArticle);

    const result = await ArticleService.update(ArticleId('1'), {
      authorId: UserId('user-1'),
      content: 'Content',
      title: 'Updated',
      isPrivate: false,
    });

    expect(result).toEqual(mockArticleData);
    expect(prisma.userArticle.findFirst).toHaveBeenCalledWith({
      where: { id: ArticleId('1'), authorId: UserId('user-1') },
    });
    expect(prisma.userArticle.update).toHaveBeenCalledWith({
      where: { id: ArticleId('1') },
      data: { title: 'Updated', content: 'Content', authorId: UserId('user-1'), isPrivate: false },
      ...IncludeAuthorClause,
    });
  });

  it('should throw error when updating unowned article', async () => {
    (prisma.userArticle.findFirst as jest.Mock).mockResolvedValue(null);

    await expect(
      ArticleService.update(ArticleId('1'), {
        authorId: UserId('user-1'),
        content: 'Content',
        title: 'Updated',
        isPrivate: false,
      }),
    ).rejects.toThrow('Article not found or unauthorized');
  });

  it('should delete an article', async () => {
    const mockArticle = { id: ArticleId('1'), title: 'Test', authorId: UserId('user-1') };
    (prisma.userArticle.findFirst as jest.Mock).mockResolvedValue(mockArticle);
    (prisma.userArticle.delete as jest.Mock).mockResolvedValue(mockArticle);

    await ArticleService.delete(ArticleId('1'), UserId('user-1'));

    expect(prisma.userArticle.findFirst).toHaveBeenCalledWith({
      where: { id: ArticleId('1'), authorId: UserId('user-1') },
    });
    expect(prisma.userArticle.delete).toHaveBeenCalledWith({
      where: { id: ArticleId('1') },
    });
  });
});
