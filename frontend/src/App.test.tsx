import { render, screen } from "@testing-library/react";
import App from "./App";
import { describe, it, expect, vi } from "vitest";
import { AuthApi } from "@/api/auth";
import { ArticleApi } from "@/api/articles";

// Mock AuthApi and ArticleApi
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

describe("App", () => {
  it("renders headline", async () => {
    // Setup mocks
    vi.mocked(AuthApi.getCurrentUser).mockResolvedValue({
      id: "1",
      username: "test@example.com",
      createdAt: new Date().toISOString(),
    });

    vi.mocked(ArticleApi.getAll).mockResolvedValue([]);

    render(<App />);

    // Use findByText to wait for the content to appear after loading
    const headline = await screen.findByText(/LLM Article Project/i);
    expect(headline).toBeInTheDocument();
  });
});
