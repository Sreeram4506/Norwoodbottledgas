import mongoose from 'mongoose';

type Cache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  memoryServerUri: string | null;
};

// Cached across hot-reloads / serverless invocations so we don't open a new
// connection (or spin up a new in-memory Mongo) on every request.
const globalForMongo = globalThis as typeof globalThis & { __mongoCache?: Cache };

const cache: Cache =
  globalForMongo.__mongoCache ??
  (globalForMongo.__mongoCache = { conn: null, promise: null, memoryServerUri: null });

async function resolveUri(): Promise<string> {
  const configured = process.env.MONGODB_URI;
  if (configured) return configured;

  if (cache.memoryServerUri) return cache.memoryServerUri;

  // Local-dev fallback so the app is fully runnable/testable without a real
  // MongoDB Atlas cluster. NOT used when MONGODB_URI is set (production).
  console.warn(
    '[db] MONGODB_URI is not set — starting an in-memory MongoDB for local development. ' +
      'Data will NOT persist across restarts. Set MONGODB_URI to a real MongoDB Atlas ' +
      'connection string for production.'
  );
  const { MongoMemoryServer } = await import('mongodb-memory-server');
  const mem = await MongoMemoryServer.create();
  cache.memoryServerUri = mem.getUri();
  return cache.memoryServerUri;
}

export async function connectDB(): Promise<typeof mongoose> {
  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    cache.promise = resolveUri().then((uri) => mongoose.connect(uri));
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
