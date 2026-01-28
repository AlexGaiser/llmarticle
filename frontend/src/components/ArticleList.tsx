import { useEffect, useState } from "react";
import { ArticleApi } from "@/api/articles";
import { getDateString } from "@/utils/date";
import { UI_MESSAGES } from "@/constants/messages";
import { useAuth } from "@/context/AuthContext";
import { ArticleForm } from "@/components/ArticleForm";
import type {
  ArticleData,
  ArticleId,
  CreateUpdateArticleData,
} from "@/api/types/UserArticle.model";

export const ArticleList = ({ keyProp }: { keyProp: number }) => {
  const { user } = useAuth();
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

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

  const handleDelete = async (id: ArticleId) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        await ArticleApi.delete(id);
        setArticles((prev) => prev.filter((a: ArticleData) => a.id !== id));
      } catch (err) {
        console.error("Delete error:", err);
        alert("Failed to delete article. Please try again.");
      }
    }
  };

  const handleUpdate = async (id: ArticleId, data: CreateUpdateArticleData) => {
    try {
      const updated = await ArticleApi.update(id, data);
      setArticles((prev) =>
        prev.map((a: ArticleData) => (a.id === id ? updated : a)),
      );
      setEditingId(null);
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update article. Please try again.");
    }
  };

  const startEditing = (article: ArticleData) => {
    setEditingId(article.id);
  };

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
            {editingId === article.id ? (
              <ArticleForm
                initialData={article}
                onSuccess={(updated) => handleUpdate(article.id, updated)}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      {article.title}
                    </h3>
                    {article.isPrivate && (
                      <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full text-xs font-medium border border-amber-100">
                        Private
                      </span>
                    )}
                  </div>
                  {user && user.id === article.authorId && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEditing(article)}
                        className="text-blue-500 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {article.content}
                </p>
                <div className="mt-4 text-sm text-gray-400">
                  Published on {getDateString(article.createdAt)}
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};
