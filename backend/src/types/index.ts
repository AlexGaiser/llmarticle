import { User } from '@/generated/prisma/client';
import { UserId } from '@/types/data/User.model';
import { Request } from 'express';

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

export type { User };
