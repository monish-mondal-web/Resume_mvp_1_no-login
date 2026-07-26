import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const dynamic = 'force-dynamic';
import dbConnect from '@/lib/mongodb';
import Suggestion from '@/models/Suggestion';
import { getCached, setCached } from '@/lib/suggestions/cache';
import { rateLimit, getIP, createRateLimitResponse } from '@/lib/security/limiter';

const querySchema = z.object({
  q:     z.string().max(100).default('').transform((v) => v.trim()),
  type:  z.enum(['skill', 'role', 'company', 'institute', 'language', 'location', 'degree', 'field']),
  limit: z.coerce.number().int().min(1).max(20).default(8),
});

const DEFAULT_FALLBACKS: Record<string, string[]> = {
  role: [
    'Software Engineer', 'Frontend Developer', 'Full Stack Developer', 'Backend Developer',
    'Data Scientist', 'Product Manager', 'DevOps Engineer', 'UI/UX Designer',
    'System Administrator', 'QA Engineer', 'Mobile App Developer', 'Cloud Architect',
    'Machine Learning Engineer', 'Cybersecurity Analyst', 'Technical Lead'
  ],
  skill: [
    'React.js', 'Node.js', 'TypeScript', 'JavaScript', 'Python', 'Java', 'C++',
    'HTML5 & CSS3', 'SQL', 'MongoDB', 'Docker', 'Git & GitHub', 'AWS', 'REST APIs',
    'Next.js', 'Tailwind CSS', 'GraphQL', 'PostgreSQL', 'Redux', 'Kubernetes', 'Express.js'
  ],
  company: [
    'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Infosys', 'TCS', 'Wipro',
    'Accenture', 'Flipkart', 'Swiggy', 'Paytm', 'Razorpay', 'Zomato', 'Oracle', 'IBM', 'Cognizant'
  ],
  institute: [
    'Indian Institute of Technology (IIT)', 'National Institute of Technology (NIT)',
    'Delhi University', 'Anna University', 'BITS Pilani', 'Vellore Institute of Technology (VIT)',
    'Mumbai University', 'Bangalore University', 'SRM Institute of Science and Technology'
  ],
  location: [
    'Bengaluru, Karnataka', 'Mumbai, Maharashtra', 'Delhi NCR', 'Hyderabad, Telangana',
    'Pune, Maharashtra', 'Chennai, Tamil Nadu', 'Kolkata, West Bengal', 'Remote'
  ],
  degree: [
    'Bachelor of Technology (B.Tech)', 'Bachelor of Engineering (B.E.)', 'Bachelor of Science (B.Sc)',
    'Master of Technology (M.Tech)', 'Master of Computer Applications (MCA)',
    'Bachelor of Computer Applications (BCA)', 'Master of Business Administration (MBA)'
  ],
  field: [
    'Computer Science & Engineering', 'Information Technology', 'Electronics & Communication',
    'Electrical Engineering', 'Artificial Intelligence & Data Science', 'Mechanical Engineering'
  ],
  language: [
    'English', 'Hindi', 'Bengali', 'Tamil', 'Telugu', 'Marathi', 'Gujarati', 'Spanish', 'French', 'German'
  ],
};

function getStaticFallback(type: string, q: string, limit: number) {
  const list = DEFAULT_FALLBACKS[type] || [];
  const normalized = q.toLowerCase();
  const matches = normalized
    ? list.filter((item) => item.toLowerCase().includes(normalized))
    : list;
  return matches.slice(0, limit).map((val) => ({ value: val, usageCount: 0 }));
}

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

  let results: { value: string; usageCount: number }[] = [];

  try {
    await dbConnect();

    if (!normalized) {
      // Empty query → return most popular from DB
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
    }
  } catch (err) {
    console.warn(`MongoDB suggestions query failed for ${type}:${q}:`, err instanceof Error ? err.message : err);
    results = [];
  }

  // If DB results are fewer than requested, fill with static fallbacks
  if (results.length < limit) {
    const staticItems = getStaticFallback(type, q, limit - results.length);
    const existing = new Set(results.map((r) => r.value.toLowerCase()));
    for (const s of staticItems) {
      if (!existing.has(s.value.toLowerCase()) && results.length < limit) {
        results.push(s);
      }
    }
  }

  // Nominatim fallback for locations
  if (type === 'location' && results.length < 5) {
    const nominatim = await fetchLocationFallback(q, limit - results.length);
    const existing = new Set(results.map((r) => r.value.toLowerCase()));
    for (const n of nominatim) {
      if (!existing.has(n.value.toLowerCase()) && results.length < limit) {
        results.push(n);
      }
    }
  }

  // Final deduplication
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
