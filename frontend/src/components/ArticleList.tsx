import { useEffect, useState } from "react";
import { ArticleApi } from "@/api/articles";
import { formatDate } from "@/utils/date";
import { UI_MESSAGES } from "@/constants/messages";
import { useAuth } from "@/context/AuthContext";
import type {
  ArticleData,
  ArticleId,
  CreateUpdateArticleData,
} from "@shared-types/data/UserArticle.model";

export const ArticleList = ({ keyProp }: { keyProp: number }) => {
  const { user } = useAuth();
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: "", content: "" });

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

  const handleUpdate = async (
    id: ArticleId,
    { title, content, authorId }: CreateUpdateArticleData,
  ) => {
    try {
      const updated = await ArticleApi.update(id, {
        title,
        content,
        authorId,
      });
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
    setEditForm({ title: article.title, content: article.content });
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
              <div className="space-y-4">
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  className="w-full text-xl font-bold text-gray-900 border-b focus:outline-none focus:border-blue-500 pb-1"
                />
                <textarea
                  value={editForm.content}
                  onChange={(e) =>
                    setEditForm({ ...editForm, content: e.target.value })
                  }
                  className="w-full text-gray-600 resize-none border focus:outline-none focus:border-blue-500 p-2 rounded"
                  rows={4}
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() =>
                      handleUpdate(article.id, {
                        title: editForm.title,
                        content: editForm.content,
                        authorId: article.authorId,
                      })
                    }
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900">
                    {article.title}
                  </h3>
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
                  Published on {formatDate(article.createdAt)}
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};
