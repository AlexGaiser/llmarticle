import { useState } from "react";
import { ArticleApi } from "@/api/articles";
import { UI_MESSAGES } from "@/constants/messages";
import { useAuth } from "@/context/AuthContext";

interface CreateArticleFormProps {
  onArticleCreated: () => void;
}

export const CreateArticleForm = ({
  onArticleCreated,
}: CreateArticleFormProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
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
      await ArticleApi.create({ title, content, authorId: user.id });
      setTitle("");
      setContent("");
      onArticleCreated();
    } catch {
      setError(UI_MESSAGES.ARTICLES.CREATE_ERROR);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Create New Article
      </h2>
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
            placeholder="Enter article title"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 min-h-[150px]"
            required
            placeholder="Write your article content..."
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Creating..." : "Publish Article"}
        </button>
      </form>
    </div>
  );
};
