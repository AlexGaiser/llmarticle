import { UserEmail, UserId, UserName } from '@/model/User.model';
import { Request } from 'express';

export interface AuthRequest extends Request {
  userId?: UserId;
}

export interface AuthRequestWithBody<T extends {} = {}> extends Exclude<AuthRequest, 'body'> {
  body: T;
}

export interface AuthRequestWithParams<T extends ParamsDictionary> extends Exclude<
  AuthRequest,
  'params'
> {
  params: T;
}

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
