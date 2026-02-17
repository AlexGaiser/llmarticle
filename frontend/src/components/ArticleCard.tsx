import { Link } from "react-router-dom";
import type { ArticleData, ArticleId } from "@/api/types/UserArticle.model";
import { getDateString } from "@/utils/date";
import { useAuth } from "@/context/AuthContext";

interface ArticleCardProps {
  article: ArticleData;
  onEdit?: (article: ArticleData) => void;
  onDelete?: (id: ArticleId) => void;
  showFullContent?: boolean;
}

export const ArticleCard = ({
  article,
  onEdit,
  onDelete,
  showFullContent = false,
}: ArticleCardProps) => {
  const { user } = useAuth();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-3">
          <h3 className="text-xl font-bold text-gray-900">{article.title}</h3>
          {article.isPrivate && (
            <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full text-xs font-medium border border-amber-100">
              Private
            </span>
          )}
        </div>
        {user && user.id === article.author.id && (
          <div className="flex space-x-2">
            {onEdit && (
              <button
                onClick={() => onEdit(article)}
                className="text-blue-500 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(article.id)}
                className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors duration-200"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      <p
        className={`text-gray-700 mb-6 leading-relaxed whitespace-pre-wrap ${!showFullContent ? "line-clamp-3" : ""}`}
      >
        {article.content}
      </p>

      {!showFullContent && (
        <div className="flex flex-wrap gap-3 mb-6">
          <Link
            to={`/articles/${article.id}`}
            className="text-white bg-blue-600 hover:bg-blue-700 text-sm font-bold px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            Read full article
          </Link>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between text-sm text-gray-400 border-t border-gray-50 pt-4">
        <span>By {article.author.username}</span>
        <span>Published on {getDateString(article.createdAt)}</span>
      </div>
    </div>
  );
};
