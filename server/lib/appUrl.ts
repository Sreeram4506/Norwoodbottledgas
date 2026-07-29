import type { Request } from 'express';

export function getAppBaseUrl(req: Request): string {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/+$/, '');
  const origin = req.headers.origin;
  if (typeof origin === 'string' && origin) return origin;
  const proto = req.headers['x-forwarded-proto'] ?? req.protocol;
  return `${proto}://${req.headers.host}`;
}
