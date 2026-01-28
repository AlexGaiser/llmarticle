import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ReviewsApi } from "@/api/reviews";
import { type ReviewData, ReviewId } from "@/api/types/UserReview.model";
import { useAuth } from "@/context/AuthContext";
import { getDateString } from "@/utils/date";
import { ReviewForm } from "@/components/ReviewForm";

export const ReviewDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [review, setReview] = useState<ReviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReview = async () => {
      if (!id) return;

      try {
        setLoading(true);
        // Direct fetching for detail view
        // Using existing list endpoints to find the review
        // (Maintaining parity with the previous "restore" request)
        const [publicReviews, myReviews] = await Promise.all([
          ReviewsApi.getPublicReviews(),
          user ? ReviewsApi.getMyReviews() : Promise.resolve([]),
        ]);

        const allReviews = [...publicReviews, ...myReviews];
        const found = allReviews.find((r) => r.id === id);

        if (found) {
          setReview(found);
        } else {
          setError("Review not found.");
        }
      } catch (err) {
        console.error("Error fetching detail:", err);
        setError("Failed to load review details.");
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [id, user]);

  const handleDelete = async () => {
    if (
      !review ||
      !window.confirm("Are you sure you want to delete this review?")
    )
      return;

    try {
      await ReviewsApi.delete(ReviewId(review.id));
      navigate("/");
    } catch (err) {
      alert("Failed to delete review.");
    }
  };

  const handleUpdateSuccess = (updated: ReviewData) => {
    setReview(updated);
    setIsEditing(false);
  };

  if (loading)
    return <div className="text-center py-12">Loading review...</div>;
  if (error || !review)
    return (
      <div className="text-center py-12 text-red-600">
        {error || "Review not found"}
      </div>
    );

  if (isEditing) {
    return (
      <div className="max-w-3xl mx-auto">
        <ReviewForm
          initialData={review}
          onReviewCreated={handleUpdateSuccess}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  const isOwner = user && review.author?.id === user.id;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <button
            onClick={() => navigate("/")}
            className="text-gray-400 hover:text-gray-600 flex items-center text-sm transition-colors"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Reviews
          </button>

          {isOwner && (
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded hover:bg-blue-50 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 rounded hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`h-6 w-6 ${i < review.rating ? "text-yellow-400" : "text-gray-200"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
            {review.title}
          </h1>
          <p className="text-gray-500 mt-2">
            By{" "}
            <span className="text-gray-900 font-medium">
              {review.author?.username || "Anonymous"}
            </span>
            <span className="mx-2">•</span>
            {getDateString(review.createdAt)}
          </p>
        </div>

        <div className="prose prose-blue max-w-none text-gray-800 text-lg leading-relaxed mb-10 whitespace-pre-wrap">
          {review.content}
        </div>

        {review.reviewLink && (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Reviewed Item
              </h4>
              <p className="text-gray-700 font-medium truncate max-w-md">
                {review.reviewLink}
              </p>
            </div>
            <a
              href={review.reviewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition shadow-sm whitespace-nowrap"
            >
              Visit Website
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        )}
      </div>

      <div className="px-8 py-4 bg-gray-50 text-xs text-gray-400 border-t border-gray-100">
        Originally published on{" "}
        {new Date(review.createdAt).toLocaleDateString()} at{" "}
        {new Date(review.createdAt).toLocaleTimeString()}
        {review.updatedAt && review.updatedAt !== review.createdAt && (
          <span className="ml-4 italic">
            Last updated: {new Date(review.updatedAt).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
};
