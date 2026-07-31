import { NextRequest, NextResponse } from "next/server";
import vehiclePriceData from "@/lib/vehicleData.json";
import vehicleCodeMap from "@/lib/vehicleCodeMap.json";

// ─── Module-level cache for models/years (5-min TTL per key) ───
const queryCache = new Map<string, { data: unknown; ts: number }>();
const QUERY_CACHE_TTL = 5 * 60 * 1000;

function getCached(key: string): unknown | null {
  const entry = queryCache.get(key);
  if (entry && Date.now() - entry.ts < QUERY_CACHE_TTL) return entry.data;
  if (entry) queryCache.delete(key); // expired
  return null;
}

function setCache(key: string, data: unknown) {
  queryCache.set(key, { data, ts: Date.now() });
  // Evict oldest entries if cache grows too large
  if (queryCache.size > 200) {
    const oldest = [...queryCache.entries()].sort((a, b) => a[1].ts - b[1].ts);
    for (let i = 0; i < 50; i++) queryCache.delete(oldest[i][0]);
  }
}

// Static JSON helpers — always used for vehicle lookups
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
    source: "static_json" as const,
    sourceFile: "Pricelist MV4 Mei 2026.pdf",
    sourceYear: 2026,
  };
}

function getStaticVehiclesByModel(brand: string, modelSearch: string) {
  const brandData = vehiclePriceData[brand as keyof typeof vehiclePriceData];
  if (!brandData) return [];
  const results: Array<Record<string, unknown>> = [];
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
  return results.sort((a, b) => (b.vehicleYear as number) - (a.vehicleYear as number));
}

function setCacheHeaders(response: NextResponse): NextResponse {
  response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
  return response;
}

// GET /api/vehicles/search?brand=TOYOTA&model=AVANZA&year=2026&vehicleType=mobil
export async function GET(request: NextRequest) {
  const start = Date.now();
  try {
    const { searchParams } = new URL(request.url);
    const brand = searchParams.get("brand");
    const model = searchParams.get("model");
    const year = searchParams.get("year");
    const vehicleType = searchParams.get("vehicleType") || undefined;

    if (!brand) {
      return NextResponse.json({ error: "Brand query parameter is required" }, { status: 400 });
    }

    const cacheKey = `${brand}|${model || ""}|${year || ""}|${vehicleType || ""}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return setCacheHeaders(NextResponse.json(cached));
    }

    // Brand only: return distinct modelDescription values
    if (!model) {
      if (vehicleType === "motor") {
        const result = { models: [], source: "static_json" };
        setCache(cacheKey, result);
        return setCacheHeaders(NextResponse.json(result));
      }
      const result = { models: getStaticModels(brand), source: "static_json" };
      setCache(cacheKey, result);
      return setCacheHeaders(NextResponse.json(result));
    }

    // Brand + model + year: return EXACT vehicle lookup
    if (year) {
      if (vehicleType === "motor") {
        return NextResponse.json({
          error: "Vehicle not found in pricelist",
          dataAvailable: false,
          fallbackMessage: "Data kendaraan belum tersedia. Silakan isi estimasi harga kendaraan secara manual.",
        }, { status: 404 });
      }
      const vehicle = getStaticVehicle(brand, model, year);
      if (!vehicle) {
        return NextResponse.json({
          error: "Vehicle not found in pricelist",
          dataAvailable: false,
          fallbackMessage: "Data kendaraan belum tersedia. Silakan isi estimasi harga kendaraan secara manual.",
        }, { status: 404 });
      }
      const result = { vehicle, dataAvailable: true };
      setCache(cacheKey, result);
      return setCacheHeaders(NextResponse.json(result));
    }

    // Brand + model (no year): return matching models with available years
    if (vehicleType === "motor") {
      return NextResponse.json({ error: "No matching vehicles found", dataAvailable: false }, { status: 404 });
    }
    const vehicles = getStaticVehiclesByModel(brand, model);
    if (vehicles.length === 0) {
      return NextResponse.json({ error: "No matching vehicles found", dataAvailable: false }, { status: 404 });
    }
    const result = { vehicles, dataAvailable: true, source: "static_json" };
    setCache(cacheKey, result);
    return setCacheHeaders(NextResponse.json(result));
  } catch (error) {
    console.error("GET /api/vehicles/search error:", error);
    return NextResponse.json({ error: "Failed to search vehicles" }, { status: 500 });
  }
}
