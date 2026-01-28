import { render, screen } from "@testing-library/react";
import App from "./App";
import { describe, it, expect, vi } from "vitest";
import { AuthApi } from "@/api/auth";
import { ArticleApi } from "@/api/articles";
import { ReviewsApi } from "@/api/reviews";
import { UserId, UserName } from "@/api/types/User.model";

// Mock APIs
vi.mock("@/api/auth", () => ({
  AuthApi: {
    getCurrentUser: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  },
}));

vi.mock("@/api/articles", () => ({
  ArticleApi: {
    getAll: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock("@/api/reviews", () => ({
  ReviewsApi: {
    getPublicReviews: vi.fn(),
    getMyReviews: vi.fn(),
  },
}));

describe("App", () => {
  it("renders community reviews headline", async () => {
    // Setup mocks
    vi.mocked(AuthApi.getCurrentUser).mockResolvedValue({
      id: UserId("1"),
      username: UserName("test@example.com"),
      createdAt: new Date(),
    });

    vi.mocked(ArticleApi.getAll).mockResolvedValue([]);
    vi.mocked(ReviewsApi.getPublicReviews).mockResolvedValue([]);

    render(<App />);

    // Use findByText to wait for the content to appear after loading
    const headline = await screen.findByText(/test/i);
    expect(headline).toBeInTheDocument();
  });
});
