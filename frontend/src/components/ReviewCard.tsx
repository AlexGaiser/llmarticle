import React from "react";
import { Link } from "react-router-dom";
import type { ReviewData } from "@/api/types/UserReview.model";
import { getDateString } from "@/utils/date";

interface ReviewCardProps {
  review: ReviewData;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{review.title}</h3>
          <p className="text-sm text-gray-500 mt-1">
            By{" "}
            <span className="font-medium text-gray-700">
              {review.author?.username || "Anonymous"}
            </span>
          </p>
        </div>
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`h-5 w-5 ${
                i < review.rating ? "text-yellow-400" : "text-gray-300"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>

      <p className="text-gray-700 mb-6 line-clamp-3 leading-relaxed">
        {review.content}
      </p>

      <div className="flex flex-wrap gap-3 mb-6">
        <Link
          to={`/${review.id}`}
          className="text-white bg-blue-600 hover:bg-blue-700 text-sm font-bold px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          Read full review
        </Link>

        {review.reviewLink && (
          <a
            href={review.reviewLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center px-3 py-1.5 bg-blue-50 rounded-md transition-colors border border-blue-100"
          >
            <svg
              className="mr-2 w-4 h-4"
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
            Link
          </a>
        )}
      </div>

      <div className="flex justify-between items-center text-xs text-gray-400 border-t border-gray-50 pt-4">
        <span>Created: {getDateString(review.createdAt)}</span>
        {review.updatedAt && review.updatedAt !== review.createdAt && (
          <span>Updated: {getDateString(review.updatedAt)}</span>
        )}
      </div>
    </div>
  );
};
