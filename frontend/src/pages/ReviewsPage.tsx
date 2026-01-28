import { useState } from "react";
import { ReviewList } from "@/components/ReviewList";
import { ReviewForm } from "@/components/ReviewForm";

export const ReviewsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleReviewCreated = () => {
    setShowForm(false);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Community Reviews
          </h1>
          <p className="mt-2 text-gray-500">
            Insights and experiences from users across the platform.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm active:transform active:scale-95"
          >
            Write a Review
          </button>
        )}
      </div>

      {showForm && (
        <ReviewForm
          onReviewCreated={handleReviewCreated}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="space-y-8">
        <ReviewList key={refreshKey} />
      </div>
    </div>
  );
};
