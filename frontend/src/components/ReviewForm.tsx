import { useState } from "react";
import { ReviewsApi } from "@/api/reviews";
import { useAuth } from "@/context/AuthContext";
import type { ReviewData } from "@/api/types/UserReview.model";

interface ReviewFormProps {
  onReviewCreated: (review: ReviewData) => void;
  onCancel: () => void;
  initialData?: ReviewData;
}

export const ReviewForm = ({
  onReviewCreated,
  onCancel,
  initialData,
}: ReviewFormProps) => {
  const { user } = useAuth();
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [rating, setRating] = useState(initialData?.rating || 5);
  const [reviewLink, setReviewLink] = useState(initialData?.reviewLink || "");
  const [isPrivate, setIsPrivate] = useState(initialData?.isPrivate ?? false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!user) throw new Error("Authentication required");

      const payload = {
        title,
        content,
        rating,
        reviewLink: reviewLink || undefined,
        isPrivate,
        authorId: user.id,
      };

      let result: ReviewData;
      if (initialData) {
        result = await ReviewsApi.update(initialData.id, payload);
      } else {
        result = await ReviewsApi.create(payload);
      }

      onReviewCreated(result);
    } catch (err) {
      console.error("Save error:", err);
      setError(
        "Failed to save review. Please check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 mb-12 animate-in fade-in slide-in-from-top-4 duration-300">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        {initialData ? "Edit Review" : "Write a New Review"}
      </h2>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-100 flex items-center">
          <svg
            className="w-5 h-5 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="What are you reviewing?"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Rating
            </label>
            <div className="flex items-center space-x-1 py-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-1 transition-transform active:scale-90 ${star <= rating ? "text-yellow-400" : "text-gray-200"}`}
                >
                  <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Item Link (Optional)
          </label>
          <input
            type="url"
            value={reviewLink}
            onChange={(e) => setReviewLink(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="https://example.com/item-to-review"
          />
          <p className="mt-1.5 text-xs text-gray-400">
            Link directly to the article or item you are reviewing.
          </p>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Your Review
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all min-h-[160px]"
            placeholder="Share your thoughts..."
            required
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPrivate"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="isPrivate" className="ml-3 text-sm text-gray-600">
            Keep this review private (only you can see it)
          </label>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-50">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 text-gray-500 hover:text-gray-700 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-600 text-white px-8 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-md active:transform active:scale-95 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading
              ? "Saving..."
              : initialData
                ? "Update Review"
                : "Post Review"}
          </button>
        </div>
      </form>
    </div>
  );
};
