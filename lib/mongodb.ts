import mongoose from 'mongoose';
import dns from 'dns';
import { env } from '@/utils/env';

// Set public DNS servers to resolve MongoDB SRV records reliably on Windows/local dev
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore if unsupported
}

const MONGODB_URI = env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached = globalThis.mongooseCache ?? {
  conn: null,
  promise: null,
};

globalThis.mongooseCache = cached;

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
