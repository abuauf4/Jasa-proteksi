import { NextResponse } from "next/server";
import vehiclePriceData from "@/lib/vehicleData.json";
import vehicleCodeMap from "@/lib/vehicleCodeMap.json";

// GET /api/vehicles/stats — Vehicle database statistics
// Vehicle data comes from static JSON; stats are computed from the JSON files
export async function GET() {
  const start = Date.now();
  try {
    // Compute stats from static JSON files
    const priceData = vehiclePriceData as Record<string, Record<string, Record<string, number>>>;
    const codeMap = vehicleCodeMap as Record<string, string>;

    const brands = Object.keys(priceData).sort();
    const totalBrands = brands.length;

    let totalModels = 0;
    let totalEntries = 0;
    let brandWithMostModels = { name: "", modelCount: 0 };

    const brandModelCounts: Array<{ name: string; modelCount: number }> = [];

    for (const brand of brands) {
      const brandData = priceData[brand];
      const modelNames = Object.keys(brandData);
      const modelCount = modelNames.length;
      totalModels += modelCount;

      brandModelCounts.push({ name: brand, modelCount });

      if (modelCount > brandWithMostModels.modelCount) {
        brandWithMostModels = { name: brand, modelCount };
      }

      for (const modelDesc of modelNames) {
        const yearData = brandData[modelDesc];
        totalEntries += Object.values(yearData).filter(v => typeof v === "number").length;
      }
    }

    // Top 10 brands by model count
    const sampleBrands = [...brandModelCounts]
      .sort((a, b) => b.modelCount - a.modelCount)
      .slice(0, 10);

    const elapsed = Date.now() - start;
    console.log(`[PERF] GET /api/vehicles/stats: ${elapsed}ms (source=static_json)`);

    const response = NextResponse.json({
      totalBrands,
      totalModels,
      totalEntries,
      sourceFile: "Pricelist MV4 Mei 2026.pdf",
      sourceYear: 2026,
      source: "static_json",
      latestImportDate: null,
      brandWithMostModels: brandWithMostModels.name ? brandWithMostModels : null,
      sampleBrands,
      vehicleCodeCount: Object.keys(codeMap).length,
    });
    response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    return response;
  } catch (error) {
    console.error("GET /api/vehicles/stats error:", error);
    return NextResponse.json({ error: "Failed to fetch vehicle stats" }, { status: 500 });
  }
}
