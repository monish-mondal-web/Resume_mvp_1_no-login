import 'server-only';

import { z } from 'zod';

const envSchema = z.object({
  MONGODB_URI: z.string().min(1, 'MongoDB URI is required'),
  NEXTAUTH_SECRET: z.string().min(1, 'NextAuth Secret is required'),
  GOOGLE_CLIENT_ID: z.string().min(1, 'Google Client ID is required'),
  GOOGLE_CLIENT_SECRET: z.string().min(1, 'Google Client Secret is required'),
  EMAIL_SERVER_USER: z.string().min(1, 'EMAIL_SERVER_USER is required'),
  EMAIL_SERVER_PASSWORD: z.string().min(1, 'EMAIL_SERVER_PASSWORD is required'),
  NEXTAUTH_URL: z.string().url('Invalid NEXTAUTH_URL').optional(),
  CLOUDINARY_CLOUD_NAME: z.string().min(1, 'Cloudinary Cloud Name is required'),
  CLOUDINARY_API_KEY: z.string().min(1, 'Cloudinary API Key is required'),
  CLOUDINARY_API_SECRET: z.string().min(1, 'Cloudinary API Secret is required'),
});

const envParsed = envSchema.safeParse({
  MONGODB_URI: process.env.MONGODB_URI,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER,
  EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
});

if (!envParsed.success) {
  console.error('❌ Invalid environment variables:', envParsed.error.format());
  throw new Error('Invalid environment variables');
}

export const env = envParsed.data;
