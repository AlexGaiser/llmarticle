import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { ReviewsPage } from "@/pages/ReviewsPage";
import { ArticlesPage } from "@/pages/ArticlesPage";
import { ReviewDetailPage } from "@/pages/ReviewDetailPage";
import { MyContentPage } from "@/pages/MyContentPage";
import { FeedPage } from "@/pages/FeedPage";
import { ArticleDetailPage } from "@/pages/ArticleDetailPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { MainLayout } from "@/components/MainLayout";

export const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/" /> : <RegisterPage />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ReviewsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ReviewDetailPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-content"
        element={
          <ProtectedRoute>
            <MainLayout>
              <MyContentPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/articles"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ArticlesPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/articles/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ArticleDetailPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/feed"
        element={
          <ProtectedRoute>
            <MainLayout>
              <FeedPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/reviews" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
