import { useState } from "react";
import { ArticleApi } from "@/api/articles";
import { UI_MESSAGES } from "@/constants/messages";
import { useAuth } from "@/context/AuthContext";
import type { ArticleData } from "@/api/types/UserArticle.model";

interface ArticleFormProps {
  onSuccess: (article: ArticleData) => void;
  onCancel?: () => void;
  initialData?: ArticleData;
}

export const ArticleForm = ({
  onSuccess,
  onCancel,
  initialData,
}: ArticleFormProps) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [isPrivate, setIsPrivate] = useState(initialData?.isPrivate ?? false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!user) {
        throw new Error("User not found");
      }

      const payload = { title, content, authorId: user.id, isPrivate };
      let result: ArticleData;

      if (initialData) {
        result = await ArticleApi.update(initialData.id, payload);
      } else {
        result = await ArticleApi.create(payload);
      }

      if (!initialData) {
        setTitle("");
        setContent("");
        setIsPrivate(false);
      }

      onSuccess(result);
    } catch {
      setError(
        initialData
          ? "Failed to update article"
          : UI_MESSAGES.ARTICLES.CREATE_ERROR,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`bg-white p-6 rounded-xl shadow-lg border border-gray-100 ${!initialData ? "mb-8" : ""} animate-in fade-in slide-in-from-top-4 duration-300`}
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        {initialData ? "Edit Article" : "Create New Article"}
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
        <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
          <input
            type="checkbox"
            id="isPrivate"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
          />
          <label
            htmlFor="isPrivate"
            className="text-sm font-semibold text-gray-700 cursor-pointer"
          >
            Make this article private (only you can see it)
          </label>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            required
            placeholder="Enter article title"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all min-h-[250px]"
            required
            placeholder="Write your article content..."
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-50">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 text-gray-500 hover:text-gray-700 font-medium transition-colors"
            >
              Cancel
            </button>
          )}
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
                ? "Update Article"
                : "Publish Article"}
          </button>
        </div>
      </form>
    </div>
  );
};
