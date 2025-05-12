import { MemberRole } from '@prisma/client';
import { Request } from 'express';

interface RequestUser {
  id: string;
  organizationId: string;
  role: MemberRole;
}

interface AuthCookies {
  accessToken: string;
  refreshToken: string;
  sub: string;
}

export interface AuthRequest extends Request {
  user: RequestUser;
  cookies: AuthCookies;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    count: number;
  };
}
