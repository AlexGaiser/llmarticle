import { useEffect, useState } from "react";
import { FeedApi } from "@/api/feed";
import { FeedItemCard } from "@/components/FeedItemCard";
import type { FeedItem } from "@/api/types/FeedItem.model";

export const FeedPage = () => {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeed = async (cursor?: string) => {
    try {
      if (cursor) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const response = await FeedApi.getFeed(cursor, 10);

      if (cursor) {
        setFeedItems((prev) => [...prev, ...response.feed]);
      } else {
        setFeedItems(response.feed);
      }

      setNextCursor(response.nextCursor);
    } catch (err) {
      console.error("Failed to fetch feed:", err);
      setError("Failed to load feed. Please try again later.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handleLoadMore = () => {
    if (nextCursor && !loadingMore) {
      fetchFeed(nextCursor);
    }
  };

  if (loading && feedItems.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && feedItems.length === 0) {
    return (
      <div className="bg-red-50 text-red-700 p-6 rounded-lg text-center my-8 border border-red-100 max-w-2xl mx-auto">
        <h3 className="text-lg font-semibold mb-2">Error</h3>
        <p>{error}</p>
        <button
          onClick={() => fetchFeed()}
          className="mt-4 text-blue-600 font-medium hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Community Feed
        </h1>
        <p className="mt-2 text-gray-500">
          Stay updated with the latest articles and reviews.
        </p>
      </div>

      <div className="space-y-8">
        {feedItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">No feed items found.</p>
          </div>
        ) : (
          feedItems.map((item, index) => (
            <FeedItemCard
              key={`${item.type}-${item.id}-${index}`}
              item={item}
            />
          ))
        )}
      </div>

      {nextCursor && (
        <div className="flex justify-center pt-8 pb-12">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 flex items-center space-x-2"
          >
            {loadingMore ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                <span>Loading...</span>
              </>
            ) : (
              <span>Load More</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
