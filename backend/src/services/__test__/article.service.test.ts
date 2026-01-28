import { prisma } from '@/db/prisma';
import { ArticleService } from '@/services/article.service';
import { UserId } from '@/types/data/User.model';
import { ArticleId } from '@/types/data/UserArticle.model';

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
    const mockArticles = [{ id: '1', title: 'Test' }];
    (prisma.userArticle.findMany as jest.Mock).mockResolvedValue(mockArticles);

    const result = await ArticleService.findByAuthor(UserId('user-1'));

    expect(result).toEqual(mockArticles);
    expect(prisma.userArticle.findMany).toHaveBeenCalledWith({
      where: { authorId: 'user-1' },
      orderBy: { createdAt: 'desc' },
    });
  });

  it('should create an article', async () => {
    const mockArticle = { id: '1', title: 'Test' };
    (prisma.userArticle.create as jest.Mock).mockResolvedValue(mockArticle);

    const result = await ArticleService.create({
      title: 'Test',
      content: 'Content',
      authorId: UserId('user-1'),
      isPrivate: false,
    });

    expect(result).toEqual(mockArticle);
    expect(prisma.userArticle.create).toHaveBeenCalledWith({
      data: { title: 'Test', content: 'Content', authorId: 'user-1', isPrivate: false },
    });
  });

  it('should update an article', async () => {
    const mockArticle = { id: '1', title: 'Updated', authorId: 'user-1' };
    (prisma.userArticle.findFirst as jest.Mock).mockResolvedValue(mockArticle);
    (prisma.userArticle.update as jest.Mock).mockResolvedValue(mockArticle);

    const result = await ArticleService.update(ArticleId('1'), {
      authorId: UserId('user-1'),
      content: 'Content',
      title: 'Updated',
      isPrivate: false,
    });

    expect(result).toEqual(mockArticle);
    expect(prisma.userArticle.findFirst).toHaveBeenCalledWith({
      where: { id: '1', authorId: 'user-1' },
    });
    expect(prisma.userArticle.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { title: 'Updated', content: 'Content', authorId: 'user-1', isPrivate: false },
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
    const mockArticle = { id: '1', title: 'Test', authorId: 'user-1' };
    (prisma.userArticle.findFirst as jest.Mock).mockResolvedValue(mockArticle);
    (prisma.userArticle.delete as jest.Mock).mockResolvedValue(mockArticle);

    await ArticleService.delete('1', UserId('user-1'));

    expect(prisma.userArticle.findFirst).toHaveBeenCalledWith({
      where: { id: '1', authorId: 'user-1' },
    });
    expect(prisma.userArticle.delete).toHaveBeenCalledWith({
      where: { id: '1' },
    });
  });
});
