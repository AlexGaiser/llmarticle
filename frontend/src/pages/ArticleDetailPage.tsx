import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArticleApi } from "@/api/articles";
import { type ArticleData, ArticleId } from "@/api/types/UserArticle.model";
import { ArticleCard } from "@/components/ArticleCard";
import { ArticleForm } from "@/components/ArticleForm";

export const ArticleDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [article, setArticle] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await ArticleApi.getById(ArticleId(id));
        setArticle(data);
      } catch (err) {
        console.error("Error fetching article:", err);
        setError("Failed to load article details.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleDelete = async () => {
    if (
      !article ||
      !window.confirm("Are you sure you want to delete this article?")
    )
      return;

    try {
      await ArticleApi.delete(ArticleId(article.id));
      navigate("/articles");
    } catch (err) {
      alert("Failed to delete article.");
    }
  };

  const handleUpdateSuccess = (updated: ArticleData) => {
    setArticle(updated);
    setIsEditing(false);
  };

  if (loading)
    return <div className="text-center py-12">Loading article...</div>;
  if (error || !article)
    return (
      <div className="text-center py-12 text-red-600">
        {error || "Article not found"}
      </div>
    );

  if (isEditing) {
    return (
      <div className="max-w-3xl mx-auto">
        <ArticleForm
          initialData={article}
          onSuccess={handleUpdateSuccess}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
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
          Back
        </button>
      </div>

      <ArticleCard
        article={article}
        showFullContent={true}
        onEdit={() => setIsEditing(true)}
        onDelete={handleDelete}
      />
    </div>
  );
};
