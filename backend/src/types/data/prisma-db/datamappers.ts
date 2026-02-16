import {
  ArticleWithAuthor,
  ReviewWithAuthor,
} from '@/types/data/prisma-db/ExtendedPrismaDbTypes.model';
import { FeedArticleItem, FeedItemType, FeedReviewItem } from '@/types/data/FeedItem.model';
import { Author, UserId, UserName } from '@/types/data/User.model';
import { ArticleData, ArticleId } from '@/types/data/UserArticle.model';
import { ReviewData, ReviewId } from '@/types/data/UserReview.model';

export const prismaToAuthor = ({ id, username }: { id: string; username: string }): Author =>
  Author({ id: UserId(id), username: UserName(username) });

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

export const prismaReviewToReviewData = (reviewWithAuthor: ReviewWithAuthor): ReviewData => {
  const { author, title, content, rating, isPrivate, createdAt, updatedAt, id, reviewLink } =
    reviewWithAuthor;

  const authorData: Author = prismaToAuthor(author);

  return {
    title,
    content,
    rating,
    isPrivate,
    createdAt,
    updatedAt,
    id: ReviewId(id),
    reviewLink: reviewLink || undefined,
    author: authorData,
  };
};

export const tagArticlesAsFeedItems = (articles: ArticleData[]): FeedArticleItem[] =>
  articles.map((article) => ({
    ...article,
    type: FeedItemType.Article,
  }));

export const tagReviewsAsFeedItems = (reviews: ReviewData[]): FeedReviewItem[] =>
  reviews.map((review) => ({
    ...review,
    type: FeedItemType.Review,
  }));
