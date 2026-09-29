/**
 * Tiny in-memory TTL cache for read-mostly production data.
 *
 * Important:
 * - Never changes calculation logic; it only avoids repeating identical DB reads.
 * - In-flight requests for the same key are deduplicated.
 * - Errors are never cached.
 * - Cache lives only inside the current Node.js process.
 */
type CacheEntry<T> = {
  hasValue: boolean;
  value?: T;
  expiresAt: number;
  inFlight?: Promise<T>;
};

const cache = new Map<string, CacheEntry<unknown>>();

export async function getCached<T>(
  namespace: string,
  key: string,
  ttlMs: number,
  loader: () => Promise<T>,
): Promise<T> {
  const cacheKey = `${namespace}:${key}`;
  const now = Date.now();
  const existing = cache.get(cacheKey) as CacheEntry<T> | undefined;

  if (existing?.hasValue && existing.expiresAt > now) {
    return existing.value as T;
  }

  if (existing?.inFlight) {
    return existing.inFlight;
  }

  const inFlight = loader()
    .then((value) => {
      cache.set(cacheKey, {
        hasValue: true,
        value,
        expiresAt: Date.now() + ttlMs,
      });
      return value;
    })
    .catch((error) => {
      cache.delete(cacheKey);
      throw error;
    });

  cache.set(cacheKey, {
    hasValue: false,
    expiresAt: 0,
    inFlight,
  });

  return inFlight;
}
