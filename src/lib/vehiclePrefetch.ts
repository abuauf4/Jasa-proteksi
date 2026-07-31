/**
 * Global vehicle data prefetch — loads immediately on page import.
 * By the time the user opens the LeadFlowModal, data is already in memory.
 * Uses localStorage as persistent cache (24h TTL).
 */

export interface PrefetchedVehicleData {
  brands: string[];
  modelsByBrand: Record<string, string[]>;
  yearsByBrandModel: Record<string, Record<string, string[]>>;
  valuesByBrandModelYear: Record<string, Record<string, Record<string, number>>>;
  source: string;
  ts: number;
}

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// In-memory cache (survives across component re-renders)
const memoryCache = new Map<string, { data: PrefetchedVehicleData; ts: number }>();

// Pending promises (prevent duplicate fetches)
const pendingFetches = new Map<string, Promise<PrefetchedVehicleData | null>>();

function readLocalStorage(key: string): PrefetchedVehicleData | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts < CACHE_TTL && data?.brands?.length > 0) {
      return data as PrefetchedVehicleData;
    }
  } catch { /* ignore */ }
  return null;
}

function writeLocalStorage(key: string, data: PrefetchedVehicleData) {
  try {
    localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
  } catch { /* ignore — storage full */ }
}

/**
 * Fetch vehicle data for a given type. Returns instantly if cached,
 * otherwise fetches from API. Safe to call multiple times — deduplicates.
 */
export async function getVehicleData(vehicleType: string): Promise<PrefetchedVehicleData | null> {
  const cacheKey = `jp_prefetch_${vehicleType}`;

  // 1. Memory cache (fastest)
  const mem = memoryCache.get(cacheKey);
  if (mem && Date.now() - mem.ts < CACHE_TTL) {
    return mem.data;
  }

  // 2. localStorage cache (fast)
  const lsData = readLocalStorage(cacheKey);
  if (lsData) {
    memoryCache.set(cacheKey, { data: lsData, ts: Date.now() });
    return lsData;
  }

  // 3. Deduplicate in-flight requests
  if (pendingFetches.has(cacheKey)) {
    return pendingFetches.get(cacheKey)!;
  }

  // 4. Fetch from API
  const promise = (async (): Promise<PrefetchedVehicleData | null> => {
    try {
      const res = await fetch(`/api/vehicles/prefetch?vehicleType=${encodeURIComponent(vehicleType)}`);
      if (!res.ok) return null;
      const raw = await res.json();
      const data: PrefetchedVehicleData = {
        brands: raw.brands || [],
        modelsByBrand: raw.modelsByBrand || {},
        yearsByBrandModel: raw.yearsByBrandModel || {},
        valuesByBrandModelYear: raw.valuesByBrandModelYear || {},
        source: raw.source || "unknown",
        ts: raw.ts || Date.now(),
      };
      // Cache in memory + localStorage
      memoryCache.set(cacheKey, { data, ts: Date.now() });
      writeLocalStorage(cacheKey, data);
      return data;
    } catch {
      return null;
    } finally {
      pendingFetches.delete(cacheKey);
    }
  })();

  pendingFetches.set(cacheKey, promise);
  return promise;
}

/**
 * SYNCHRONOUS access — returns cached data if available, null otherwise.
 * Use this in components that need immediate access without awaiting.
 */
export function getVehicleDataSync(vehicleType: string): PrefetchedVehicleData | null {
  const cacheKey = `jp_prefetch_${vehicleType}`;

  // Memory cache
  const mem = memoryCache.get(cacheKey);
  if (mem && Date.now() - mem.ts < CACHE_TTL) {
    return mem.data;
  }

  // localStorage cache
  const lsData = readLocalStorage(cacheKey);
  if (lsData) {
    memoryCache.set(cacheKey, { data: lsData, ts: Date.now() });
    return lsData;
  }

  return null;
}

/**
 * Fire-and-forget prefetch — call this on page load so data is ready
 * by the time the user interacts with the modal.
 */
export function prefetchVehicleData(vehicleType: string = "mobil"): void {
  // Only prefetch if not already cached
  const cacheKey = `jp_prefetch_${vehicleType}`;
  if (memoryCache.has(cacheKey) || pendingFetches.has(cacheKey)) return;

  // Check localStorage first — if cached, just warm memory cache
  const lsData = readLocalStorage(cacheKey);
  if (lsData) {
    memoryCache.set(cacheKey, { data: lsData, ts: Date.now() });
    return;
  }

  // Not cached — start fetch in background (fire-and-forget)
  getVehicleData(vehicleType);
}

// ─── AUTO-PREFETCH REMOVED ───
// Previously, vehicle data was auto-fetched on module import, forcing
// a 287KB download even if the user never opens the lead modal.
// Now, prefetch is deferred until the user shows intent
// (scrolls near Portfolio section or hovers a "Cek Harga" button).
