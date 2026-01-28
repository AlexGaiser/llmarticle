import { useState } from "react";
import { ArticleList } from "@/components/ArticleList";
import { ArticleForm } from "@/components/ArticleForm";

export const ArticlesPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleArticleCreated = () => {
    setShowForm(false);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Knowledge Articles
          </h1>
          <p className="mt-2 text-gray-500">
            Technical deep dives and insights from the community.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm active:transform active:scale-95"
          >
            Create Article
          </button>
        )}
      </div>

      {showForm && (
        <ArticleForm
          onSuccess={handleArticleCreated}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="space-y-8">
        <ArticleList keyProp={refreshKey} />
      </div>
    </div>
  );
};
