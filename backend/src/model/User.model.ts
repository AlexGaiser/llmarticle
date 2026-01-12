export type UserEmail = `${string}@${string}.${string}`;

export const UserEmail = (email: UserEmail): UserEmail => email;

export type UserName = string;

export const UserName = (userName: string): UserName => userName;
