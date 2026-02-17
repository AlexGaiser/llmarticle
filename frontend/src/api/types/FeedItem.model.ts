import type { ArticleData } from "./UserArticle.model";
import type { ReviewData } from "./UserReview.model";

export const FeedItemType = {
  Article: "article",
  Review: "review",
} as const;

export type FeedItemType = (typeof FeedItemType)[keyof typeof FeedItemType];

export interface FeedArticleItem extends ArticleData {
  type: typeof FeedItemType.Article;
}

export interface FeedReviewItem extends ReviewData {
  type: typeof FeedItemType.Review;
}

export type FeedItem = FeedArticleItem | FeedReviewItem;
