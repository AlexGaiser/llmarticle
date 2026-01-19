import { Request } from 'express';
import { UserId, UserName, UserEmail } from '@shared-types/data/User.model';

export interface AuthRequest<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any,
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  userId?: UserId;
}

export type AuthRequestWithBody<B = any, P = ParamsDictionary> = AuthRequest<P, any, B>;

export type AuthRequestWithParams<P = ParamsDictionary> = AuthRequest<P>;

export interface ParamsDictionary {
  [key: string]: string;
}

export interface JwtPayload {
  userId: UserId;
  iat?: number;
  exp?: number;
}

export interface UserPublic {
  id: UserId;
  username: UserName;
  email?: UserEmail;
  createdAt?: Date;
}
