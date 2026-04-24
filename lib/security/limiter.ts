import { NextResponse } from 'next/server';

/**
 * A lightweight in-memory rate limiter.
 * NOTE: In a distributed production environment (like Vercel), 
 * this should be replaced with Redis (e.g., @upstash/ratelimit) 
 * for consistent global rate limiting.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const cache = new Map<string, RateLimitEntry>();

export interface RateLimitConfig {
  limit: number;
  windowMs: number;
}

export function rateLimit(ip: string, key: string, config: RateLimitConfig) {
  const now = Date.now();
  const id = `${key}:${ip}`;
  const entry = cache.get(id);

  if (!entry || now > entry.resetAt) {
    const newEntry = { count: 1, resetAt: now + config.windowMs };
    cache.set(id, newEntry);
    return { success: true, count: 1, limit: config.limit, resetAt: newEntry.resetAt };
  }

  if (entry.count >= config.limit) {
    return { success: false, count: entry.count, limit: config.limit, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return { success: true, count: entry.count, limit: config.limit, resetAt: entry.resetAt };
}

export function getIP(req: Request) {
  const xForwardedFor = req.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }
  return '127.0.0.1';
}

export function createRateLimitResponse(resetAt: number) {
  return NextResponse.json(
    { message: 'Too many requests. Please try again later.' },
    { 
      status: 429,
      headers: {
        'Retry-After': Math.ceil((resetAt - Date.now()) / 1000).toString()
      }
    }
  );
}
