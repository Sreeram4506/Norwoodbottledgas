import jwt from 'jsonwebtoken';

const DEV_FALLBACK_SECRET = 'dev-only-insecure-secret-change-me';

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be set in production');
  }
  console.warn('[auth] JWT_SECRET is not set — using an insecure dev-only fallback secret.');
  return DEV_FALLBACK_SECRET;
}

export type AuthTokenPayload = {
  sub: string;
  role: 'customer' | 'admin';
};

export function signAuthToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, getSecret(), { expiresIn: '30d' });
}

export function verifyAuthToken(token: string): AuthTokenPayload | null {
  try {
    return jwt.verify(token, getSecret()) as AuthTokenPayload;
  } catch {
    return null;
  }
}

export const AUTH_COOKIE_NAME = 'auth_token';
