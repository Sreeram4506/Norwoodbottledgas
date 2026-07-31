import type { Response } from 'express';
import { AUTH_COOKIE_NAME } from './jwt.js';

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

const isProduction = process.env.NODE_ENV === 'production';

// 'none' is required for the frontend and API to work when hosted on
// different origins (e.g. a Vercel frontend calling a Render backend) -
// browsers refuse to send 'lax'/'strict' cookies on cross-site requests at
// all. 'none' requires Secure, which is only available over HTTPS, hence
// the production-only split (local dev is plain http).
const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax',
  path: '/',
};

export function setAuthCookie(res: Response, token: string) {
  res.cookie(AUTH_COOKIE_NAME, token, { ...cookieOptions, maxAge: THIRTY_DAYS_MS });
}

export function clearAuthCookie(res: Response) {
  res.clearCookie(AUTH_COOKIE_NAME, cookieOptions);
}
