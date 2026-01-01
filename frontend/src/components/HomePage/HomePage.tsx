import React, { useState } from "react";
import { CreateArticleForm } from "../CreateArticleForm";
import { ArticleList } from "../ArticleList";

export const HomePage = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleArticleCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            LLM Article Project
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Share your thoughts and read what others have written.
          </p>
        </div>

        <CreateArticleForm onArticleCreated={handleArticleCreated} />

        <div className="border-t border-gray-200 pt-8">
          <ArticleList keyProp={refreshKey} />
        </div>
      </div>
    </div>
  );
};
