type CacheEntry = {
  data: { value: string; usageCount: number }[];
  expiresAt: number;
};

const store = new Map<string, CacheEntry>();
const TTL_MS = 5 * 60 * 1000;

export function getCached(key: string): CacheEntry['data'] | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.data;
}

export function setCached(key: string, data: CacheEntry['data']): void {
  store.set(key, { data, expiresAt: Date.now() + TTL_MS });
}

export function clearCache(): void {
  store.clear();
}

export function clearCacheByPrefix(prefix: string): void {
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) {
      store.delete(key);
    }
  }
}
