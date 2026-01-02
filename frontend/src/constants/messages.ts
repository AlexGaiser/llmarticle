export const UI_MESSAGES = {
  ARTICLES: {
    EMPTY: "No articles found. Be the first to write one!",
    LOADING: "Loading articles...",
    LOAD_ERROR: "Failed to load articles",
    CREATE_ERROR: "Failed to create article",
  },
  AUTH: {
    LOGIN_ERROR: "Invalid email or password",
    REGISTER_ERROR: "Registration failed. Email may already be in use.",
    PASSWORD_MISMATCH: "Passwords do not match",
  },
} as const;
