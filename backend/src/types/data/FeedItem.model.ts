import { ArticleData } from '@/types/data/UserArticle.model';
import { ReviewData } from '@/types/data/UserReview.model';

export enum FeedItemType {
  Article = 'article',
  Review = 'review',
}

export interface FeedArticleItem extends ArticleData {
  type: FeedItemType.Article;
}

export interface FeedReviewItem extends ReviewData {
  type: FeedItemType.Review;
}

export type FeedItem = FeedArticleItem | FeedReviewItem;
