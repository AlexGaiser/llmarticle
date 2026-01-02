import { useState } from "react";
import { CreateArticleForm } from "@/components/CreateArticleForm";
import { ArticleList } from "@/components/ArticleList";
import { useAuth } from "@/context/AuthContext";

export const HomePage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const { user, logout } = useAuth();

  const handleArticleCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">
              LLM Article Project
            </h1>
            <p className="mt-2 text-gray-500">Welcome, {user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        <CreateArticleForm onArticleCreated={handleArticleCreated} />

        <div className="border-t border-gray-200 pt-8">
          <ArticleList keyProp={refreshKey} />
        </div>
      </div>
    </div>
  );
};
