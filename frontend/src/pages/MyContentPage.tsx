import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArticleApi } from "@/api/articles";
import { ReviewsApi } from "@/api/reviews";
import type { ArticleData } from "@/api/types/UserArticle.model";
import type { ReviewData } from "@/api/types/UserReview.model";
import { ArticleId } from "@/api/types/UserArticle.model";
import { ReviewId } from "@/api/types/UserReview.model";
import { getDateString } from "@/utils/date";
import { ArticleForm } from "@/components/ArticleForm";
import { ReviewForm } from "@/components/ReviewForm";

export const MyContentPage = () => {
  const [activeTab, setActiveTab] = useState<"articles" | "reviews">("reviews");
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [editingArticle, setEditingArticle] = useState<ArticleData | null>(
    null,
  );
  const [editingReview, setEditingReview] = useState<ReviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [userArticles, userReviews] = await Promise.all([
        ArticleApi.getAll(),
        ReviewsApi.getMyReviews(),
      ]);
      setArticles(userArticles);
      setReviews(userReviews);
    } catch (err) {
      console.error("Failed to fetch my content:", err);
      setError("Failed to load your content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteArticle = async (id: ArticleId) => {
    if (!window.confirm("Are you sure you want to delete this article?"))
      return;
    try {
      await ArticleApi.delete(id);
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert("Failed to delete article.");
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await ReviewsApi.delete(ReviewId(id));
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert("Failed to delete review.");
    }
  };

  if (loading)
    return <div className="text-center py-12">Loading your content...</div>;

  if (editingArticle) {
    return (
      <div className="max-w-3xl mx-auto">
        <ArticleForm
          initialData={editingArticle}
          onSuccess={(updated) => {
            setArticles((prev) =>
              prev.map((a) => (a.id === updated.id ? updated : a)),
            );
            setEditingArticle(null);
          }}
          onCancel={() => setEditingArticle(null)}
        />
      </div>
    );
  }

  if (editingReview) {
    return (
      <div className="max-w-3xl mx-auto">
        <ReviewForm
          initialData={editingReview}
          onReviewCreated={(updated) => {
            setReviews((prev) =>
              prev.map((r) => (r.id === updated.id ? updated : r)),
            );
            setEditingReview(null);
          }}
          onCancel={() => setEditingReview(null)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          My Content
        </h1>
        <p className="mt-2 text-gray-500 text-lg">
          Manage all the content you've contributed to the community.
        </p>
      </div>

      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-8 w-64">
        <button
          onClick={() => setActiveTab("reviews")}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
            activeTab === "reviews"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          My Reviews ({reviews.length})
        </button>
        <button
          onClick={() => setActiveTab("articles")}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
            activeTab === "articles"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          My Articles ({articles.length})
        </button>
      </div>

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

      <div className="space-y-4">
        {activeTab === "reviews" ? (
          reviews.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500 mb-4">
                You haven't posted any reviews yet.
              </p>
              <Link to="/" className="text-blue-600 font-bold hover:underline">
                Write your first review
              </Link>
            </div>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      <Link to={`/${review.id}`}>{review.title}</Link>
                    </h3>
                    <div className="flex items-center mt-1 space-x-2 text-sm text-gray-500">
                      <span>{getDateString(review.createdAt)}</span>
                      <span>•</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${review.isPrivate ? "bg-amber-50 text-amber-700" : "bg-green-50 text-green-700"}`}
                      >
                        {review.isPrivate ? "Private" : "Public"}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingReview(review)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="mt-4 text-gray-600 line-clamp-2">
                  {review.content}
                </p>
              </div>
            ))
          )
        ) : articles.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500 mb-4">
              You haven't written any articles yet.
            </p>
            <Link
              to="/articles"
              className="text-blue-600 font-bold hover:underline"
            >
              Write an article
            </Link>
          </div>
        ) : (
          articles.map((article) => (
            <div
              key={article.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 group"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {article.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {getDateString(article.createdAt)}
                  </p>
                </div>
                <div className="flex space-x-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingArticle(article)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteArticle(article.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="mt-4 text-gray-600 line-clamp-2">
                {article.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
