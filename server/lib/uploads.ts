import { randomBytes } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_UPLOADS_DIR = path.resolve(__dirname, '../../public/uploads');

function safeExtension(originalName: string): string {
  const ext = path.extname(originalName).toLowerCase();
  const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
  return allowed.includes(ext) ? ext : '.jpg';
}

/**
 * Saves an uploaded image and returns its public URL.
 *
 * Uses Vercel Blob when `BLOB_READ_WRITE_TOKEN` is set (works on Vercel's
 * read-only/ephemeral serverless filesystem). Otherwise falls back to
 * writing into `public/uploads/` for local development — that fallback does
 * NOT persist across Vercel deployments/invocations, only local `npm run
 * dev:all`.
 */
export async function saveUpload(buffer: Buffer, originalName: string): Promise<string> {
  const filename = `${Date.now()}-${randomBytes(6).toString('hex')}${safeExtension(originalName)}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import('@vercel/blob');
    const blob = await put(`uploads/${filename}`, buffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return blob.url;
  }

  await mkdir(PUBLIC_UPLOADS_DIR, { recursive: true });
  await writeFile(path.join(PUBLIC_UPLOADS_DIR, filename), buffer);
  return `/uploads/${filename}`;
}
