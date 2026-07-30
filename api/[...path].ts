import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../server/db.ts';
import app from '../server/index.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await connectDB();
  } catch (err) {
    console.error('[api] Database connection failed:', err);
    res.status(500).json({ error: 'Database is not configured. Check server logs for details.' });
    return;
  }
  // Express apps are plain (req, res) request listeners, so we can hand the
  // Vercel request/response straight to it.
  return (app as unknown as (req: VercelRequest, res: VercelResponse) => void)(req, res);
}
