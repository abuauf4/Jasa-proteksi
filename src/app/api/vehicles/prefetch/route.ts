import { NextRequest, NextResponse } from "next/server";
import vehiclePriceData from "@/lib/vehicleData.json";

// ─── Module-level cache (30-min TTL) ───
let prefetchCache: { data: Record<string, unknown>; ts: number } | null = null;
const PREFETCH_CACHE_TTL = 30 * 60 * 1000; // 30 minutes

// Build full vehicle tree from static JSON (always used — vehicle data is static)
function buildStaticTree(): Record<string, unknown> {
  const brands: string[] = [];
  const modelsByBrand: Record<string, string[]> = {};
  const yearsByBrandModel: Record<string, Record<string, string[]>> = {};
  const valuesByBrandModelYear: Record<string, Record<string, Record<string, number>>> = {};

  for (const [brand, brandData] of Object.entries(vehiclePriceData)) {
    brands.push(brand);
    modelsByBrand[brand] = Object.keys(brandData as Record<string, unknown>).sort();

    for (const [modelDesc, yearPrices] of Object.entries(brandData as Record<string, Record<string, number>>)) {
      if (!yearsByBrandModel[brand]) yearsByBrandModel[brand] = {};
      if (!valuesByBrandModelYear[brand]) valuesByBrandModelYear[brand] = {};

      const years = Object.keys(yearPrices)
        .filter((y) => typeof yearPrices[y] === "number")
        .sort((a, b) => Number(b) - Number(a));
      yearsByBrandModel[brand][modelDesc] = years;

      valuesByBrandModelYear[brand][modelDesc] = {};
      for (const [year, price] of Object.entries(yearPrices)) {
        if (typeof price === "number") {
          valuesByBrandModelYear[brand][modelDesc][year] = price * 1_000_000;
        }
      }
    }
  }

  brands.sort();

  return {
    vehicleType: "mobil",
    brands,
    modelsByBrand,
    yearsByBrandModel,
    valuesByBrandModelYear,
    source: "static_json",
    sourceYear: 2026,
    ts: Date.now(),
  };
}

// GET /api/vehicles/prefetch?vehicleType=mobil
export async function GET(request: NextRequest) {
  const start = Date.now();
  try {
    const { searchParams } = new URL(request.url);
    const vehicleType = searchParams.get("vehicleType") || "mobil";
    const cacheKey = vehicleType;

    // Check in-memory cache
    if (prefetchCache && Date.now() - prefetchCache.ts < PREFETCH_CACHE_TTL) {
      const cached = prefetchCache.data as Record<string, Record<string, unknown>>;
      if (cached[cacheKey]) {
        const response = NextResponse.json(cached[cacheKey]);
        response.headers.set("Cache-Control", "public, s-maxage=1800, stale-while-revalidate=3600");
        return response;
      }
    }

    let result: Record<string, unknown>;

    // Always use static JSON for vehicle data
    if (vehicleType === "motor") {
      result = {
        vehicleType: "motor",
        brands: [],
        modelsByBrand: {},
        yearsByBrandModel: {},
        valuesByBrandModelYear: {},
        source: "static_json",
        ts: Date.now(),
      };
    } else {
      result = buildStaticTree();
    }

    // Update cache
    if (!prefetchCache || Date.now() - prefetchCache.ts >= PREFETCH_CACHE_TTL) {
      prefetchCache = { data: { [cacheKey]: result }, ts: Date.now() };
    } else {
      (prefetchCache.data as Record<string, unknown>)[cacheKey] = result;
    }

    const response = NextResponse.json(result);
    response.headers.set("Cache-Control", "public, s-maxage=1800, stale-while-revalidate=3600");

    const elapsed = Date.now() - start;
    console.log(`[PERF] GET /api/vehicles/prefetch: ${elapsed}ms (type=${vehicleType}, source=static_json)`);

    return response;
  } catch (error) {
    console.error("GET /api/vehicles/prefetch error:", error);
    return NextResponse.json({ error: "Failed to prefetch vehicle data" }, { status: 500 });
  }
}
