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
