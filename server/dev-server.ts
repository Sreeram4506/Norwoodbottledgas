import { connectDB } from './db.js';
import { seedDefaultAdmin, seedPlaceholderProducts } from './seed.js';
import app from './index.js';

const PORT = Number(process.env.PORT) || 4000;

async function main() {
  await connectDB();
  await seedDefaultAdmin();
  await seedPlaceholderProducts();

  app.listen(PORT, () => {
    console.log(`[server] API listening on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error('[server] Failed to start:', err);
  process.exit(1);
});
