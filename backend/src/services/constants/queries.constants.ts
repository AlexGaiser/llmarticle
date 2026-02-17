export const DefaultIncludeAuthorClause = {
  include: {
    author: {
      select: {
        id: true,
        username: true,
      },
    },
  },
};

export const DEFAULT_PAGE_LIMIT = 20;

export const MAX_PAGE_LIMIT = 100;
