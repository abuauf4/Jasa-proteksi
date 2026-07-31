/**
 * Real Insurance Quotation Engine
 * 
 * Business logic extracted from Excel "Simulasi Rate MV_Retail _ Fleet 2021 - DELA"
 * 
 * Calculation flow:
 * 1. Lookup vehicle value from static JSON (vehicleData.json)
 * 2. Calculate vehicle age (currentYear - vehicleYear)
 * 3. Determine wilayah from plate region
 * 4. Lookup base rate from MotorRate (category + wilayah + coverage type)
 * 5. Calculate loading rate if vehicle age > threshold
 * 6. Apply addon rates
 * 7. Calculate TPL premium if selected
 * 8. Sum all premiums
 * 9. Apply discount
 * 10. Add admin/policy fee
 */

import { db } from "./db";
import vehiclePriceData from "./vehicleData.json";
import vehicleCodeMap from "./vehicleCodeMap.json";

// ─── Module-level RateSettings cache (5-min TTL) ───
let rateSettingsCache: { data: Record<string, number>; ts: number } | null = null;
const RATE_SETTINGS_TTL = 5 * 60 * 1000;

async function getRateSetting(key: string): Promise<number | undefined> {
  if (!rateSettingsCache || Date.now() - rateSettingsCache.ts > RATE_SETTINGS_TTL) {
    const allSettings = await db.rateSettings.findMany();
    const map: Record<string, number> = {};
    for (const s of allSettings) {
      map[s.key] = Number(s.value);
    }
    rateSettingsCache = { data: map, ts: Date.now() };
  }
  return rateSettingsCache.data[key];
}

async function refreshRateSettings(): Promise<void> {
  if (rateSettingsCache && Date.now() - rateSettingsCache.ts < RATE_SETTINGS_TTL) return;
  const allSettings = await db.rateSettings.findMany();
  const map: Record<string, number> = {};
  for (const s of allSettings) {
    map[s.key] = Number(s.value);
  }
  rateSettingsCache = { data: map, ts: Date.now() };
}

// ─── Types ───

export interface QuotationInput {
  coverageType: "Comprehensive" | "TLO";
  vehicleBrand: string;
  vehicleModel: string;        // modelDescription or vehicle code
  vehicleYear: number;
  plateCode: string;           // e.g. "B", "D", "L"
  vehicleValue?: number;       // Optional: manual OTR override
  addOns: string[];            // e.g. ["flood", "earthquake", "srcc", "terrorism", "bengkelAuthorized", "tpl", "paDriver", "paPassenger"]
  vehicleTypeCategory?: "Non Bus dan Non Truk" | "Truk dan Pick Up" | "Bus" | "Kendaraan Roda 2";
  tplCoverageAmount?: number;  // TPL coverage amount
  paDriverAmount?: number;     // PA Driver coverage amount (default 10,000,000)
  paPassengerCount?: number;   // Number of passengers (default 4)
  paPassengerAmount?: number;  // Per passenger coverage amount (default 10,000,000)
}

export interface AddonPremium {
  key: string;
  label: string;
  rate: number;
  premium: number;
  coverageAmount: number;
}

export interface QuotationResult {
  success: boolean;
  error?: string;

  // Vehicle info
  vehicleValue: number;        // TSI (Total Sum Insured)
  vehicleAge: number;
  vehicleTypeCategory: string;
  wilayah: number;
  plateCity: string;

  // Coverage eligibility
  isEligible: boolean;
  ineligibilityReason?: string;

  // Base premium
  baseRate: number;
  loadingRate: number;
  effectiveRate: number;
  basePremium: number;

  // Add-ons
  addons: AddonPremium[];

  // Totals
  totalPremiumBeforeDiscount: number;
  discountPercent: number;
  discountAmount: number;
  adminFee: number;
  policyFee: number;
  totalPremium: number;

  // OTR Range for frontend display
  otrRange: {
    min: number;
    max: number;
    display: string;
  };
}

// ─── Constants ───

const CURRENT_YEAR = new Date().getFullYear();
const OTR_RANGE_PERCENT = 0.15; // ±15%

// ─── Helper Functions ───

/**
 * Lookup vehicle value from static JSON files.
 * Returns null if brand/model/year not found.
 * Price in JSON is in millions → converted to IDR (× 1,000,000).
 */
export function getVehicleValueFromJson(brand: string, model: string, year: number): {
  vehicleValue: number;
  vehicleCode: string;
  modelDescription: string;
} | null {
  const priceData = vehiclePriceData as Record<string, Record<string, Record<string, number>>>;
  const codeMap = vehicleCodeMap as Record<string, string>;

  const brandData = priceData[brand];
  if (!brandData) return null;

  // Try exact match first, then partial match
  let modelKey = Object.keys(brandData).find(k => k === model);
  if (!modelKey) {
    modelKey = Object.keys(brandData).find(
      k => k.toLowerCase().includes(model.toLowerCase()) || model.toLowerCase().includes(k.toLowerCase())
    );
  }
  if (!modelKey) return null;

  const yearData = brandData[modelKey];
  const price = yearData[String(year)];
  if (typeof price !== "number") return null;

  const vehicleCode = codeMap[modelKey] || `${brand.substring(0, 3).toUpperCase()}-STATIC`;

  return {
    vehicleValue: Math.round(price * 1_000_000),
    vehicleCode,
    modelDescription: modelKey,
  };
}

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Determine vehicle type category from vehicle brand/model
 * Default: "Non Bus dan Non Truk" for most passenger cars
 */
function inferVehicleTypeCategory(
  brand: string,
  model: string,
  explicitCategory?: string
): string {
  if (explicitCategory) return explicitCategory;

  const brandLower = brand.toLowerCase();
  const modelLower = model.toLowerCase();

  // Check for motorcycle brands/keywords
  const motorcycleKeywords = ["motor", "scooter", "matic", "nmax", "aerox", "vario", "beat", "vixion", "mt-", "cb", "pcx", "click", "scoopy", "genio", "jupiter", "satria", "shogun", "thunder", "suzuki sv", "ducati", "kawasaki", "honda cb", "yamaha nmax", "yamaha aerox", "honda pcx", "vespa"];
  if (motorcycleKeywords.some(kw => modelLower.includes(kw) || brandLower.includes(kw))) {
    return "Kendaraan Roda 2";
  }

  // Check for truck/pickup keywords
  const truckKeywords = ["pick up", "pickup", "truck", "truk", "cab", "cabin", "diesel", "hiace", "elan"];
  if (truckKeywords.some(kw => modelLower.includes(kw))) {
    return "Truk dan Pick Up";
  }

  // Check for bus keywords
  const busKeywords = ["bus", "coaster", "elf", "median"];
  if (busKeywords.some(kw => modelLower.includes(kw))) {
    return "Bus";
  }

  // Default to Non Bus
  return "Non Bus dan Non Truk";
}

/**
 * Determine rate category (1-8) based on vehicle type and coverage value
 */
function determineCategory(vehicleType: string, vehicleValue: number): number {
  if (vehicleType === "Non Bus dan Non Truk") {
    if (vehicleValue <= 125_000_000) return 1;
    if (vehicleValue <= 200_000_000) return 2;
    if (vehicleValue <= 400_000_000) return 3;
    if (vehicleValue <= 800_000_000) return 4;
    return 5; // > 800jt
  }
  if (vehicleType === "Truk dan Pick Up") return 6;
  if (vehicleType === "Bus") return 7;
  if (vehicleType === "Kendaraan Roda 2") return 8;
  return 1; // fallback
}

/**
 * Calculate TPL premium using tiered rates from database
 */
async function calculateTplPremium(
  tplCoverageAmount: number,
  vehicleType: string
): Promise<number> {
  // Determine vehicle category string for DB lookup
  const isBusOrTruck = vehicleType === "Bus" || vehicleType === "Truk dan Pick Up";
  const vehicleCategory = isBusOrTruck ? "Bus / Truck" : "Passenger & Motorcycle";

  // Query tiered TPL rates from database
  const tiers = await db.tplRate.findMany({
    where: {
      vehicleCategory,
      isActive: true,
    },
    orderBy: { coverageMin: "asc" },
  });

  if (tiers.length === 0) {
    // Fallback: no tiers found in DB, return 0
    return 0;
  }

  // Apply tiered calculation
  let totalPremium = 0;
  let remainingCoverage = tplCoverageAmount;

  for (const tier of tiers) {
    const tierMin = Number(tier.coverageMin);
    const tierMax = Number(tier.coverageMax);

    if (remainingCoverage <= 0) break;

    // Calculate coverage in this tier
    const tierCoverage = Math.min(
      remainingCoverage,
      tierMax - tierMin + 1
    );

    if (tierCoverage > 0) {
      totalPremium += tierCoverage * tier.rate;
    }

    remainingCoverage -= tierCoverage;
  }

  return totalPremium;
}

// ─── Main Calculation Engine ───

export async function calculatePremium(input: QuotationInput): Promise<QuotationResult> {
  const start = Date.now();
  const {
    coverageType,
    vehicleBrand,
    vehicleModel,
    vehicleYear,
    plateCode,
    addOns = [],
    vehicleTypeCategory: explicitCategory,
    tplCoverageAmount = 10_000_000,
    paDriverAmount = 10_000_000,
    paPassengerCount = 4,
    paPassengerAmount = 10_000_000,
  } = input;

  // ─── Step 1: Get vehicle value (parallel with region mapping & rate settings refresh) ───
  let vehicleValue = input.vehicleValue || 0;
  
  // Prefetch rate settings cache + region mapping in parallel
  const [regionResult] = await Promise.all([
    db.regionMapping.findFirst({ where: { plateCode: plateCode.toUpperCase().trim(), isActive: true } }),
    refreshRateSettings(),
  ]);

  if (!vehicleValue) {
    // Lookup from static JSON (vehicleData.json)
    const vehicleInfo = getVehicleValueFromJson(vehicleBrand, vehicleModel, vehicleYear);
    
    if (vehicleInfo) {
      vehicleValue = vehicleInfo.vehicleValue;
    } else {
      return {
        success: false,
        error: "Harga kendaraan tidak ditemukan. Silakan masukkan harga OTR manual.",
        vehicleValue: 0,
        vehicleAge: 0,
        vehicleTypeCategory: "",
        wilayah: 0,
        plateCity: "",
        isEligible: false,
        ineligibilityReason: "Kendaraan tidak ditemukan",
        baseRate: 0,
        loadingRate: 0,
        effectiveRate: 0,
        basePremium: 0,
        addons: [],
        totalPremiumBeforeDiscount: 0,
        discountPercent: 0,
        discountAmount: 0,
        adminFee: 0,
        policyFee: 0,
        totalPremium: 0,
        otrRange: { min: 0, max: 0, display: "-" },
      };
    }
  }

  // ─── Step 2: Calculate vehicle age ───
  const vehicleAge = CURRENT_YEAR - vehicleYear;

  // ─── Step 3: Use prefetched region mapping ───
  const regionMapping = regionResult;

  if (!regionMapping) {
    return {
      success: false,
      error: `Plat kendaraan "${plateCode}" tidak ditemukan. Silakan pilih plat yang valid.`,
      vehicleValue,
      vehicleAge,
      vehicleTypeCategory: "",
      wilayah: 0,
      plateCity: "",
      isEligible: false,
      ineligibilityReason: "Plat tidak ditemukan",
      baseRate: 0,
      loadingRate: 0,
      effectiveRate: 0,
      basePremium: 0,
      addons: [],
      totalPremiumBeforeDiscount: 0,
      discountPercent: 0,
      discountAmount: 0,
      adminFee: 0,
      policyFee: 0,
      totalPremium: 0,
      otrRange: {
        min: Math.round(vehicleValue * (1 - OTR_RANGE_PERCENT)),
        max: Math.round(vehicleValue * (1 + OTR_RANGE_PERCENT)),
        display: `${formatRupiah(Math.round(vehicleValue * (1 - OTR_RANGE_PERCENT)))} – ${formatRupiah(Math.round(vehicleValue * (1 + OTR_RANGE_PERCENT)))}`,
      },
    };
  }

  const wilayah = regionMapping.wilayah;
  const plateCity = regionMapping.city;

  // ─── Step 4: Check coverage eligibility (using cached rate settings) ───
  const maxAllRisk = (await getRateSetting("maxAgeAllRisk")) ?? 12;
  const maxTLO = (await getRateSetting("maxAgeTLO")) ?? 15;

  let isEligible = true;
  let ineligibilityReason: string | undefined;

  if (coverageType === "Comprehensive" && vehicleAge > maxAllRisk) {
    isEligible = false;
    ineligibilityReason = `Kendaraan berusia ${vehicleAge} tahun. All Risk/Comprehensive maksimal ${maxAllRisk} tahun. Silakan pilih TLO.`;
  } else if (coverageType === "TLO" && vehicleAge > maxTLO) {
    isEligible = false;
    ineligibilityReason = `Kendaraan berusia ${vehicleAge} tahun. TLO maksimal ${maxTLO} tahun.`;
  }

  // ─── Step 5: Determine vehicle type category ───
  const vehicleTypeCategory = inferVehicleTypeCategory(vehicleBrand, vehicleModel, explicitCategory);
  const category = determineCategory(vehicleTypeCategory, vehicleValue);

  // ─── Step 6: Lookup base rate from MotorRate ───
  const motorRate = await db.motorRate.findFirst({
    where: {
      coverageType,
      category,
      vehicleType: vehicleTypeCategory,
      isActive: true,
    },
  });

  if (!motorRate) {
    return {
      success: false,
      error: "Rate tidak ditemukan untuk kombinasi jenis kendaraan dan coverage ini.",
      vehicleValue,
      vehicleAge,
      vehicleTypeCategory,
      wilayah,
      plateCity,
      isEligible: false,
      ineligibilityReason: "Rate tidak tersedia",
      baseRate: 0,
      loadingRate: 0,
      effectiveRate: 0,
      basePremium: 0,
      addons: [],
      totalPremiumBeforeDiscount: 0,
      discountPercent: 0,
      discountAmount: 0,
      adminFee: 0,
      policyFee: 0,
      totalPremium: 0,
      otrRange: {
        min: Math.round(vehicleValue * (1 - OTR_RANGE_PERCENT)),
        max: Math.round(vehicleValue * (1 + OTR_RANGE_PERCENT)),
        display: `${formatRupiah(Math.round(vehicleValue * (1 - OTR_RANGE_PERCENT)))} – ${formatRupiah(Math.round(vehicleValue * (1 + OTR_RANGE_PERCENT)))}`,
      },
    };
  }

  // Get base rate for the wilayah
  // Check if vehicle value exceeds coverage max → use Rate Atas (overlimit)
  let baseRate: number;
  const coverageMax = Number(motorRate.coverageMax);
  const useRateAtas = vehicleValue > coverageMax;

  if (useRateAtas) {
    // Use Rate Atas (overlimit rate) when vehicle value exceeds coverage max
    const rateAtasW1 = motorRate.rateAtasWilayah1;
    const rateAtasW2 = motorRate.rateAtasWilayah2;
    const rateAtasW3 = motorRate.rateAtasWilayah3;

    if (wilayah === 1 && rateAtasW1) baseRate = rateAtasW1;
    else if (wilayah === 2 && rateAtasW2) baseRate = rateAtasW2;
    else if (wilayah === 3 && rateAtasW3) baseRate = rateAtasW3;
    else {
      // Fallback to regular rate if Rate Atas not available
      if (wilayah === 1) baseRate = motorRate.rateWilayah1;
      else if (wilayah === 2) baseRate = motorRate.rateWilayah2;
      else baseRate = motorRate.rateWilayah3;
    }
  } else {
    if (wilayah === 1) baseRate = motorRate.rateWilayah1;
    else if (wilayah === 2) baseRate = motorRate.rateWilayah2;
    else baseRate = motorRate.rateWilayah3;
  }

  // ─── Step 7: Calculate loading rate ───
  let loadingRate = 0;

  // Try LoadingRate DB table first
  const loadingRow = await db.loadingRate.findFirst({
    where: {
      minAge: { lte: vehicleAge },
      maxAge: { gte: vehicleAge },
      isActive: true,
      coverageType: "Comprehensive",
    },
  });

  if (loadingRow && coverageType === "Comprehensive") {
    // Loading starts at minAge, meaning 1 year above (minAge - 1) threshold
    const yearsAboveThreshold = vehicleAge - (loadingRow.minAge - 1);
    if (yearsAboveThreshold > 0) {
      loadingRate = baseRate * (yearsAboveThreshold * loadingRow.loadingPercent);
    }
  } else if (coverageType === "Comprehensive") {
    // Fallback to cached RateSettings if no LoadingRate row found
    const threshold = (await getRateSetting("loadingThreshold")) ?? 5;

    if (vehicleAge > threshold) {
      const loadingPercentPerYear = ((await getRateSetting("loadingPercentPerYear")) ?? 5) / 100;
      loadingRate = baseRate * ((vehicleAge - threshold) * loadingPercentPerYear);
    }
  }

  const effectiveRate = baseRate + loadingRate;
  const basePremium = Math.round(vehicleValue * effectiveRate);

  // ─── Step 8: Calculate addon premiums ───
  const addonPremiums: AddonPremium[] = [];

  // Separate special addons from standard DB-lookup addons
  const standardAddonKeys = addOns.filter(
    (k) => !["tpl", "paDriver", "paPassenger"].includes(k)
  );

  // Batch-fetch all standard addon rates in ONE query (replaces N+1 loop)
  let addonRateMap = new Map<string, { rate: number; label: string }>();
  if (standardAddonKeys.length > 0) {
    try {
      const allAddonRates = await db.addonRate.findMany({
        where: {
          addonKey: { in: standardAddonKeys },
          isActive: true,
          OR: [
            { coverageType: coverageType },
            { coverageType: "All" },
          ],
        },
        orderBy: { wilayah: "desc" }, // prefer region-specific (higher wilayah number)
      });

      // Build lookup map: prefer region-specific (wilayah match) over wilayah=0 (all-region)
      // Since results are ordered by wilayah DESC, the first match for each addonKey
      // is the same row that findFirst (with the same orderBy) would return.
      for (const ar of allAddonRates) {
        if (ar.wilayah !== wilayah && ar.wilayah !== 0) continue;
        if (!addonRateMap.has(ar.addonKey)) {
          addonRateMap.set(ar.addonKey, { rate: ar.rate, label: ar.addonLabel });
        }
      }

      // Fallback: if DB returned no rates, use static fallback rates
      if (addonRateMap.size === 0 && standardAddonKeys.length > 0) {
        console.warn("[premium-engine] AddonRate DB query returned 0 results, using static fallback");
        const STATIC_ADDON_RATES: Record<string, { label: string; rate: number; appliesTo: string[] }> = {
          flood: { label: "Banjir & Angin Kencang", rate: 0.001, appliesTo: ["Comprehensive", "All"] },
          earthquake: { label: "Gempa Bumi & Tsunami", rate: 0.0015, appliesTo: ["Comprehensive", "All"] },
          srcc: { label: "Kerusuhan & Huru-Hara", rate: 0.0005, appliesTo: ["Comprehensive", "All"] },
          terrorism: { label: "Terorisme & Sabotase", rate: 0.0005, appliesTo: ["Comprehensive", "All"] },
          bengkelAuthorized: { label: "Bengkel Resmi", rate: 0.001, appliesTo: ["Comprehensive", "All"] },
        };
        for (const key of standardAddonKeys) {
          const staticRate = STATIC_ADDON_RATES[key];
          if (staticRate && (staticRate.appliesTo.includes(coverageType) || staticRate.appliesTo.includes("All"))) {
            addonRateMap.set(key, { rate: staticRate.rate, label: staticRate.label });
          }
        }
      }
    } catch (addonDbError) {
      // DB query failed — use static fallback
      console.error("[premium-engine] AddonRate DB query failed:", addonDbError instanceof Error ? addonDbError.message : String(addonDbError));
      const STATIC_ADDON_RATES: Record<string, { label: string; rate: number; appliesTo: string[] }> = {
        flood: { label: "Banjir & Angin Kencang", rate: 0.001, appliesTo: ["Comprehensive", "All"] },
        earthquake: { label: "Gempa Bumi & Tsunami", rate: 0.0015, appliesTo: ["Comprehensive", "All"] },
        srcc: { label: "Kerusuhan & Huru-Hara", rate: 0.0005, appliesTo: ["Comprehensive", "All"] },
        terrorism: { label: "Terorisme & Sabotase", rate: 0.0005, appliesTo: ["Comprehensive", "All"] },
        bengkelAuthorized: { label: "Bengkel Resmi", rate: 0.001, appliesTo: ["Comprehensive", "All"] },
      };
      for (const key of standardAddonKeys) {
        const staticRate = STATIC_ADDON_RATES[key];
        if (staticRate && (staticRate.appliesTo.includes(coverageType) || staticRate.appliesTo.includes("All"))) {
          addonRateMap.set(key, { rate: staticRate.rate, label: staticRate.label });
        }
      }
    }
  }

  for (const addonKey of addOns) {
    if (addonKey === "tpl") {
      // TPL uses special tiered calculation
      const tplPremium = await calculateTplPremium(tplCoverageAmount, vehicleTypeCategory);
      // TPL not available for category 8 (Kendaraan Roda 2) if category <= 5
      if (category <= 5 || category === 8) {
        // For category 8 (motorcycle): TPL = 0
        if (category === 8) continue;
      }
      addonPremiums.push({
        key: "tpl",
        label: "Tanggung Jawab Pihak Ketiga (TPL)",
        rate: tplCoverageAmount > 0 ? tplPremium / tplCoverageAmount : 0,
        premium: tplPremium,
        coverageAmount: tplCoverageAmount,
      });
      continue;
    }

    if (addonKey === "paDriver") {
      // PA Driver rate: 0.5% from Excel DELA (also stored in RateSettings)
      const paDriverRate = (await getRateSetting("paDriverRate")) ?? 0.005;
      const paDriverPremium = Math.round(paDriverAmount * paDriverRate);
      addonPremiums.push({
        key: "paDriver",
        label: "Perlindungan Jiwa Supir",
        rate: paDriverRate,
        premium: paDriverPremium,
        coverageAmount: paDriverAmount,
      });
      continue;
    }

    if (addonKey === "paPassenger") {
      // PA Passenger rate: 0.4% from Excel DELA (also stored in RateSettings)
      // DELA formula: premium = coverage_amount * rate (NOT multiplied by passenger count)
      // The "4 orang" in DELA label is descriptive of coverage scope, not a calculation factor
      const paPassengerRate = (await getRateSetting("paPassengerRate")) ?? 0.004;
      const paPassengerPremium = Math.round(paPassengerAmount * paPassengerRate);
      addonPremiums.push({
        key: "paPassenger",
        label: `Perlindungan Jiwa Penumpang (${paPassengerCount} orang @ ${formatRupiah(paPassengerAmount)})`,
        rate: paPassengerRate,
        premium: paPassengerPremium,
        coverageAmount: paPassengerAmount,
      });
      continue;
    }

    // Standard addon lookup from batch-fetched map
    const addonRateData = addonRateMap.get(addonKey);

    if (addonRateData && addonRateData.rate > 0) {
      const addonPremium = Math.round(vehicleValue * addonRateData.rate);
      addonPremiums.push({
        key: addonKey,
        label: addonRateData.label,
        rate: addonRateData.rate,
        premium: addonPremium,
        coverageAmount: vehicleValue,
      });
    }
  }

  // ─── Step 9: Calculate totals ───
  const totalAddonPremium = addonPremiums.reduce((sum, a) => sum + a.premium, 0);
  const totalPremiumBeforeDiscount = basePremium + totalAddonPremium;

  // Get discount and fees from cached settings
  const discountFraction = (await getRateSetting("discountPercent")) ?? 0;
  const adminFee = (await getRateSetting("adminFee")) ?? 0;
  const policyFee = (await getRateSetting("policyFee")) ?? 0;

  const discountAmount = Math.round(totalPremiumBeforeDiscount * discountFraction);
  const totalPremium = totalPremiumBeforeDiscount - discountAmount + adminFee + policyFee;

  // ─── Step 10: Build OTR range ───
  const otrMin = Math.round(vehicleValue * (1 - OTR_RANGE_PERCENT));
  const otrMax = Math.round(vehicleValue * (1 + OTR_RANGE_PERCENT));

  const elapsed = Date.now() - start;
  console.log(`[PERF] calculatePremium: ${elapsed}ms (${addOns.length} addons, ${coverageType}, wilayah=${wilayah})`);

  return {
    success: true,
    vehicleValue,
    vehicleAge,
    vehicleTypeCategory,
    wilayah,
    plateCity,
    isEligible,
    ineligibilityReason,
    baseRate,
    loadingRate,
    effectiveRate,
    basePremium,
    addons: addonPremiums,
    totalPremiumBeforeDiscount,
    discountPercent: discountFraction * 100,
    discountAmount,
    adminFee,
    policyFee,
    totalPremium,
    otrRange: {
      min: otrMin,
      max: otrMax,
      display: `${formatRupiah(otrMin)} – ${formatRupiah(otrMax)}`,
    },
  };
}
