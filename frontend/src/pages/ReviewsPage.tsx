import { ReviewList } from "@/components/ReviewList";

export const ReviewsPage = () => {
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
        <button
          onClick={() => alert("Review creation coming in Step 3!")}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
        >
          Write a Review
        </button>
      </div>

      <div className="space-y-8">
        <ReviewList />
      </div>
    </div>
  );
};
