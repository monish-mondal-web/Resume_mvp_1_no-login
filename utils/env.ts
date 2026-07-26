import { z } from 'zod';

const envSchema = z.object({
  MONGODB_URI: z.string().min(1, 'MongoDB URI is required'),
});

const envParsed = envSchema.safeParse({
  MONGODB_URI: process.env.MONGODB_URI,
});

if (!envParsed.success) {
  console.error('❌ Invalid environment variables:', envParsed.error.format());
  throw new Error('Invalid environment variables');
}

export const env = envParsed.data;
