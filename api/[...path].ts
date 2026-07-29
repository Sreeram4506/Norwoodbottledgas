import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../server/db.ts';
import app from '../server/index.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await connectDB();
  // Express apps are plain (req, res) request listeners, so we can hand the
  // Vercel request/response straight to it.
  return (app as unknown as (req: VercelRequest, res: VercelResponse) => void)(req, res);
}
