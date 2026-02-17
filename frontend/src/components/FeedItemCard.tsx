import React from "react";
import type { FeedItem } from "@/api/types/FeedItem.model";
import { FeedItemType } from "@/api/types/FeedItem.model";
import { ArticleCard } from "./ArticleCard";
import { ReviewCard } from "./ReviewCard";

interface FeedItemCardProps {
  item: FeedItem;
}

export const FeedItemCard: React.FC<FeedItemCardProps> = ({ item }) => {
  switch (item.type) {
    case FeedItemType.Article:
      return <ArticleCard article={item} />;
    case FeedItemType.Review:
      return <ReviewCard review={item} />;
    default:
      return (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          Unknown item type
        </div>
      );
  }
};
