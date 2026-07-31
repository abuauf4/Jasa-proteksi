import { NextRequest, NextResponse } from "next/server";
import vehiclePriceData from "@/lib/vehicleData.json";
import vehicleCodeMap from "@/lib/vehicleCodeMap.json";

// ─── Module-level cache for brands (5-min TTL) ───
let brandsCache: { data: Record<string, { name: string; modelCount: number }[]>; ts: number } = { data: {}, ts: 0 };
const BRANDS_CACHE_TTL = 5 * 60 * 1000;

// Static JSON helpers — always used for vehicle lookups
function getStaticBrands(vehicleType?: string) {
  if (vehicleType === "motor") return [];
  return Object.keys(vehiclePriceData).sort().map((brand) => ({
    name: brand,
    modelCount: Object.keys(vehiclePriceData[brand as keyof typeof vehiclePriceData]).length,
  }));
}

function getStaticModels(brand: string): string[] {
  const brandData = vehiclePriceData[brand as keyof typeof vehiclePriceData];
  if (!brandData) return [];
  return Object.keys(brandData).sort();
}

function getStaticVehicle(brand: string, model: string, year: string) {
  const brandData = vehiclePriceData[brand as keyof typeof vehiclePriceData];
  if (!brandData) return null;
  const modelData = brandData[model as keyof typeof brandData];
  if (!modelData) return null;
  const price = modelData[year as keyof typeof modelData];
  if (typeof price !== "number") return null;
  const vehicleCode = (vehicleCodeMap as Record<string, string>)[model] || `${brand.substring(0, 3).toUpperCase()}-STATIC`;
  return {
    brand,
    vehicleCode,
    modelDescription: model,
    vehicleYear: parseInt(year),
    vehicleValue: (price * 1_000_000).toString(),
  };
}

function getStaticVehiclesByModel(brand: string, modelSearch: string) {
  const brandData = vehiclePriceData[brand as keyof typeof vehiclePriceData];
  if (!brandData) return [];
  const results: Array<{
    brand: string;
    vehicleCode: string;
    modelDescription: string;
    vehicleYear: number;
    vehicleValue: string;
  }> = [];
  for (const [modelDesc, yearPrices] of Object.entries(brandData)) {
    if (!modelDesc.toLowerCase().includes(modelSearch.toLowerCase())) continue;
    for (const [year, price] of Object.entries(yearPrices as Record<string, number>)) {
      if (typeof price !== "number") continue;
      const vehicleCode = (vehicleCodeMap as Record<string, string>)[modelDesc] || `${brand.substring(0, 3).toUpperCase()}-STATIC`;
      results.push({
        brand,
        vehicleCode,
        modelDescription: modelDesc,
        vehicleYear: parseInt(year),
        vehicleValue: (price * 1_000_000).toString(),
      });
    }
  }
  return results.sort((a, b) => b.vehicleYear - a.vehicleYear);
}

// GET /api/vehicles/brands?vehicleType=mobil — List distinct brands with model count
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vehicleType = searchParams.get("vehicleType") || undefined;
    const cacheKey = vehicleType || "all";

    // Check in-memory cache first
    if (brandsCache.data[cacheKey] && Date.now() - brandsCache.ts < BRANDS_CACHE_TTL) {
      const response = NextResponse.json({ brands: brandsCache.data[cacheKey], source: "static_json" });
      response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
      return response;
    }

    // Always use static JSON for vehicle data
    const result = getStaticBrands(vehicleType);
    brandsCache.data[cacheKey] = result;
    brandsCache.ts = Date.now();
    const response = NextResponse.json({ brands: result, source: "static_json" });
    response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    return response;
  } catch (error) {
    console.error("GET /api/vehicles/brands error:", error);
    const { searchParams } = new URL(request.url);
    const vehicleType = searchParams.get("vehicleType") || undefined;
    const response = NextResponse.json({ brands: getStaticBrands(vehicleType), source: "static_json" });
    response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120");
    return response;
  }
}

// Export helpers for reuse in search route
export { getStaticBrands, getStaticModels, getStaticVehicle, getStaticVehiclesByModel };
