import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import dbConnect from '@/lib/mongodb';
import Suggestion from '@/models/Suggestion';
import { getCached, setCached } from '@/lib/suggestions/cache';
import { rateLimit, getIP, createRateLimitResponse } from '@/lib/security/limiter';

const querySchema = z.object({
  q:     z.string().max(100).default('').transform((v) => v.trim()),
  type:  z.enum(['skill', 'role', 'company', 'institute', 'language', 'location', 'degree', 'field']),
  limit: z.coerce.number().int().min(1).max(20).default(8),
});

async function fetchLocationFallback(q: string, limit: number) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q + ' India')}&countrycodes=in&format=json&limit=${limit}&addressdetails=0`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'FreshResume/1.0 (contact@freshresume.in)' },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return [];
    const data = await res.json() as { display_name: string }[];
    return data.map((item) => ({
      value: item.display_name.split(',').slice(0, 2).join(',').trim(),
      usageCount: 0,
    }));
  } catch {
    return [];
  }
}

export async function GET(req: NextRequest) {
  const ip = getIP(req);
  const rl = rateLimit(ip, 'suggestions:get', { limit: 120, windowMs: 60_000 });
  if (!rl.success) return createRateLimitResponse(rl.resetAt);

  const params = Object.fromEntries(req.nextUrl.searchParams);
  const parsed = querySchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 });
  }

  const { q, type, limit } = parsed.data;
  const normalized = q.toLowerCase();
  const cacheKey = `${type}:${normalized || '__top__'}:${limit}`;

  const cached = getCached(cacheKey);
  if (cached) {
    return NextResponse.json({ suggestions: cached });
  }

  await dbConnect();

  let results: { value: string; usageCount: number }[];

  if (!normalized) {
    // Empty query → return most popular
    results = await Suggestion.find(
      { type },
      { _id: 0, value: 1, usageCount: 1 }
    )
      .sort({ usageCount: -1 })
      .limit(limit)
      .lean<{ value: string; usageCount: number }[]>();
  } else {
    const escaped = normalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // 1. Prefix matches (highest relevance)
    results = await Suggestion.find(
      { type, normalizedValue: { $regex: `^${escaped}` } },
      { _id: 0, value: 1, usageCount: 1 }
    )
      .sort({ usageCount: -1 })
      .limit(limit)
      .lean<{ value: string; usageCount: number }[]>();

    // 2. Substring fallback if prefix didn't fill the list
    if (results.length < limit) {
      const prefixValues = new Set(results.map((r) => r.value));
      const extra = await Suggestion.find(
        {
          type,
          normalizedValue: { $regex: escaped },
        },
        { _id: 0, value: 1, usageCount: 1 }
      )
        .sort({ usageCount: -1 })
        .limit(limit * 2)
        .lean<{ value: string; usageCount: number }[]>();

      for (const e of extra) {
        if (!prefixValues.has(e.value) && results.length < limit) {
          results.push(e);
        }
      }
    }

    // 3. Nominatim fallback for locations
    if (type === 'location' && results.length < 5) {
      const nominatim = await fetchLocationFallback(q, limit - results.length);
      const existing = new Set(results.map((r) => r.value.toLowerCase()));
      for (const n of nominatim) {
        if (!existing.has(n.value.toLowerCase()) && results.length < limit) {
          results.push(n);
        }
      }
    }
  }

  // Final deduplication before return
  const finalResults = [];
  const seen = new Set<string>();
  for (const r of results) {
    const v = r.value.toLowerCase();
    if (!seen.has(v)) {
      seen.add(v);
      finalResults.push(r);
    }
  }

  setCached(cacheKey, finalResults);
  return NextResponse.json({ suggestions: finalResults });
}
