export type ArticleId = string & { readonly __brand: unique symbol };

export const ArticleId = (id: string): ArticleId => id as ArticleId;
