import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { connectDB } from './db';
import { seedDefaultAdmin, seedPlaceholderProducts } from './seed';
import app from './index';

// Production entry point for traditional Node hosts (Render, Railway, a VPS,
// etc.) where one process serves both the API and the built frontend. Vercel
// doesn't use this file — it deploys the static build and api/[...path].ts
// separately, so server/index.ts stays a pure API app for that path.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');

// `redirect: false` stops express.static from 301-redirecting requests like
// `/grills` (a client-side route) just because `public/grills/` also exists
// as a static asset directory — those should fall through to the SPA
// fallback below instead.
app.use(express.static(distDir, { redirect: false }));
// Express 5 no longer accepts a bare '*' route pattern, so this SPA fallback
// is registered as a path-less middleware (runs last, after static + API
// routes have already had a chance to match).
app.use((_req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

const PORT = Number(process.env.PORT) || 4000;

async function main() {
  await connectDB();
  await seedDefaultAdmin();
  await seedPlaceholderProducts();

  app.listen(PORT, () => {
    console.log(`[server] Listening on port ${PORT}`);
  });
}

main().catch((err) => {
  console.error('[server] Failed to start:', err);
  process.exit(1);
});
