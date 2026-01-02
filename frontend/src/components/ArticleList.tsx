import { useEffect, useState } from "react";
import { ArticleApi } from "@/api/articles";
import { formatDate } from "@/utils/date";
import { UI_MESSAGES } from "@/constants/messages";
import { type Article } from "@/types";

export const ArticleList = ({ keyProp }: { keyProp: number }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await ArticleApi.getAll();
        setArticles(data);
      } catch {
        setError(UI_MESSAGES.ARTICLES.LOAD_ERROR);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [keyProp]);

  if (loading)
    return (
      <div className="text-center py-4 text-gray-600">
        {UI_MESSAGES.ARTICLES.LOADING}
      </div>
    );
  if (error)
    return <div className="text-center py-4 text-red-600">{error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Recent Articles
      </h2>
      {articles.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          {UI_MESSAGES.ARTICLES.EMPTY}
        </p>
      ) : (
        articles.map((article) => (
          <div
            key={article.id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {article.title}
            </h3>
            <p className="text-gray-600 whitespace-pre-wrap">
              {article.content}
            </p>
            <div className="mt-4 text-sm text-gray-400">
              Published on {formatDate(article.createdAt)}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
