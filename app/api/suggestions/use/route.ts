import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const dynamic = 'force-dynamic';
import dbConnect from '@/lib/mongodb';
import Suggestion from '@/models/Suggestion';
import { rateLimit, getIP, createRateLimitResponse } from '@/lib/security/limiter';
import { clearCacheByPrefix } from '@/lib/suggestions/cache';

const bodySchema = z.object({
  value: z.string().min(1).max(200).transform((v) => v.trim()),
  type: z.enum(['skill', 'role', 'company', 'institute', 'language', 'location', 'degree', 'field']),
});

export async function POST(req: NextRequest) {
  const ip = getIP(req);
  const rl = rateLimit(ip, 'suggestions:use', { limit: 30, windowMs: 60_000 });
  if (!rl.success) return createRateLimitResponse(rl.resetAt);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const { value, type } = parsed.data;
  const normalizedValue = value.toLowerCase();

  try {
    await dbConnect();
    await Suggestion.findOneAndUpdate(
      { normalizedValue, type },
      { 
        $inc: { usageCount: 1 }, 
        $setOnInsert: { value, normalizedValue, type } 
      },
      { upsert: true }
    );
  } catch (error: unknown) {
    console.warn('Failed to update suggestion usage in DB:', error instanceof Error ? error.message : error);
  }

  // Invalidate ONLY the specific type's cache to keep other suggestions fast
  clearCacheByPrefix(`${type}:`);

  return NextResponse.json({ ok: true });
}
