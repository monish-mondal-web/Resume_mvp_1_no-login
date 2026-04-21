import { z } from 'zod';

const email = z
  .string()
  .trim()
  .toLowerCase()
  .email('Please enter a valid email address');

const otp = z
  .string()
  .trim()
  .regex(/^\d{6}$/, 'OTP must be exactly 6 digits');

const strongPassword = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Password must contain uppercase, lowercase and numbers')
  .regex(/[a-z]/, 'Password must contain uppercase, lowercase and numbers')
  .regex(/[0-9]/, 'Password must contain uppercase, lowercase and numbers');

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(80, 'Name is too long'),
  email,
  password: strongPassword,
});

export const emailSchema = z.object({
  email,
});

export const verifyOtpSchema = z.object({
  email,
  otp,
});

export const resetPasswordSchema = z.object({
  email,
  otp,
  newPassword: z.string().min(8, 'Password must be at least 8 characters long'),
});
