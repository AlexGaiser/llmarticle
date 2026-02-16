export type UserEmail = string & { readonly __brand: unique symbol };
export const UserEmail = (email: string): UserEmail => email as UserEmail;

export type UserName = string & { readonly __brand: unique symbol };
export const UserName = (userName: string): UserName => userName as UserName;

export type UserId = string & { readonly __brand: unique symbol };
export const UserId = (userId: string): UserId => userId as UserId;

export interface User {
  id: UserId;
  username: UserName;
  email?: UserEmail;
  createdAt?: Date;
}

export interface Author {
  id: UserId;
  username: UserName;
}

export const Author = (author: Author): Author => author;
