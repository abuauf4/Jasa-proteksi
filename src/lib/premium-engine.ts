/**
 * Real Insurance Quotation Engine
 * 
 * Business logic extracted from Excel "Simulasi Rate MV_Retail _ Fleet 2021 - DELA"
 * 
 * Calculation flow:
 * 1. Lookup vehicle value from static JSON (vehicleData.json)
 * 2. Calculate vehicle age (currentYear - vehicleYear)
 * 3. Determine wilayah from plate region
 * 4. Load all rate data in parallel (batch RateSettings, MotorRate, LoadingRate, AddonRate, TplRate)
 * 5. Lookup base rate from MotorRate (category + wilayah + coverage type)
 * 6. Calculate loading rate if vehicle age > threshold
 * 7. Apply addon rates
 * 8. Calculate TPL premium if selected
 * 9. Sum all premiums
 * 10. Apply discount
 * 11. Add admin/policy fee
 *
 * Performance optimization (v1):
 * - All RateSettings keys are fetched in a single findMany() → Map lookup
 * - All independent DB queries run in parallel via Promise.all()
 * - InsurancePartner query runs in parallel with calculatePremium in the API route
 * - Map is request-scoped (created per request, never shared across requests)
 */

import { db } from "./db";
import vehiclePriceData from "./vehicleData.json";
import vehicleCodeMap from "./vehicleCodeMap.json";

// ─── All RateSettings keys used by the premium engine ───
// Fetched in a single findMany() and stored in a request-scoped Map.
const REQUIRED_SETTING_KEYS = [
  "maxAgeAllRisk",
  "maxAgeTLO",
  "loadingThreshold",
  "loadingPercentPerYear",
  "paDriverRate",
  "paPassengerRate",
  "discountPercent",
  "adminFee",
  "policyFee",
] as const;

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
 * Calculate TPL premium using pre-loaded tiered rates.
 * Accepts pre-fetched tiers instead of querying the DB.
 */
function calculateTplPremiumFromTiers(
  tplCoverageAmount: number,
  tiers: Array<{ coverageMin: number; coverageMax: number; rate: number }>
): number {
  if (tiers.length === 0) return 0;

  let totalPremium = 0;
  let remainingCoverage = tplCoverageAmount;

  for (const tier of tiers) {
    const tierMin = Number(tier.coverageMin);
    const tierMax = Number(tier.coverageMax);

    if (remainingCoverage <= 0) break;

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

/**
 * Static fallback addon rates — used only when DB query returns 0 results or fails.
 * Identical to the previous inline definitions.
 */
const STATIC_ADDON_RATES: Record<string, { label: string; rate: number; appliesTo: string[] }> = {
  flood: { label: "Banjir & Angin Kencang", rate: 0.001, appliesTo: ["Comprehensive", "All"] },
  earthquake: { label: "Gempa Bumi & Tsunami", rate: 0.0015, appliesTo: ["Comprehensive", "All"] },
  srcc: { label: "Kerusuhan & Huru-Hara", rate: 0.0005, appliesTo: ["Comprehensive", "All"] },
  terrorism: { label: "Terorisme & Sabotase", rate: 0.0005, appliesTo: ["Comprehensive", "All"] },
  bengkelAuthorized: { label: "Bengkel Resmi", rate: 0.001, appliesTo: ["Comprehensive", "All"] },
};

/**
 * Build addon rate map from DB results, with static fallback.
 * Pure function — no DB access.
 */
function buildAddonRateMap(
  allAddonRates: Array<{ addonKey: string; addonLabel: string; rate: number; wilayah: number }>,
  standardAddonKeys: string[],
  wilayah: number,
  coverageType: string,
): Map<string, { rate: number; label: string }> {
  const addonRateMap = new Map<string, { rate: number; label: string }>();

  // Build lookup map: prefer region-specific (wilayah match) over wilayah=0 (all-region)
  // Results are ordered by wilayah DESC, so the first match for each addonKey
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
    for (const key of standardAddonKeys) {
      const staticRate = STATIC_ADDON_RATES[key];
      if (staticRate && (staticRate.appliesTo.includes(coverageType) || staticRate.appliesTo.includes("All"))) {
        addonRateMap.set(key, { rate: staticRate.rate, label: staticRate.label });
      }
    }
  }

  return addonRateMap;
}

/**
 * Apply static fallback addon rates when DB query fails.
 * Pure function — no DB access.
 */
function applyStaticAddonFallback(
  standardAddonKeys: string[],
  coverageType: string,
): Map<string, { rate: number; label: string }> {
  const addonRateMap = new Map<string, { rate: number; label: string }>();
  for (const key of standardAddonKeys) {
    const staticRate = STATIC_ADDON_RATES[key];
    if (staticRate && (staticRate.appliesTo.includes(coverageType) || staticRate.appliesTo.includes("All"))) {
      addonRateMap.set(key, { rate: staticRate.rate, label: staticRate.label });
    }
  }
  return addonRateMap;
}

/**
 * Build the "not found" error result — used for early returns.
 */
function notFoundResult(
  error: string,
  ineligibilityReason: string,
  vehicleValue: number = 0,
  vehicleAge: number = 0,
  vehicleTypeCategory: string = "",
  wilayah: number = 0,
  plateCity: string = "",
): QuotationResult {
  const otrRange = vehicleValue > 0 ? {
    min: Math.round(vehicleValue * (1 - OTR_RANGE_PERCENT)),
    max: Math.round(vehicleValue * (1 + OTR_RANGE_PERCENT)),
    display: `${formatRupiah(Math.round(vehicleValue * (1 - OTR_RANGE_PERCENT)))} – ${formatRupiah(Math.round(vehicleValue * (1 + OTR_RANGE_PERCENT)))}`,
  } : { min: 0, max: 0, display: "-" };

  return {
    success: false,
    error,
    vehicleValue,
    vehicleAge,
    vehicleTypeCategory,
    wilayah,
    plateCity,
    isEligible: false,
    ineligibilityReason,
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
    otrRange,
  };
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

  // ─── Phase 1: Vehicle lookup + Region mapping ───
  // Region mapping is the only DB query in this phase.
  // Vehicle value lookup is synchronous (JSON), so it runs after the DB query starts.
  let vehicleValue = input.vehicleValue || 0;

  // Start region query immediately (async)
  const regionPromise = db.regionMapping.findFirst({
    where: { plateCode: plateCode.toUpperCase().trim(), isActive: true },
  });

  // Vehicle lookup is synchronous — can run while DB query is in flight
  if (!vehicleValue) {
    const vehicleInfo = getVehicleValueFromJson(vehicleBrand, vehicleModel, vehicleYear);
    if (vehicleInfo) {
      vehicleValue = vehicleInfo.vehicleValue;
    } else {
      // Must await the region promise even on early return to avoid unhandled promise
      await regionPromise;
      return notFoundResult(
        "Harga kendaraan tidak ditemukan. Silakan masukkan harga OTR manual.",
        "Kendaraan tidak ditemukan",
      );
    }
  }

  // Await region mapping result
  const regionMapping = await regionPromise;

  if (!regionMapping) {
    return notFoundResult(
      `Plat kendaraan "${plateCode}" tidak ditemukan. Silakan pilih plat yang valid.`,
      "Plat tidak ditemukan",
      vehicleValue,
    );
  }

  // ─── Phase 2: Determine derived values ───
  const vehicleAge = CURRENT_YEAR - vehicleYear;
  const wilayah = regionMapping.wilayah;
  const plateCity = regionMapping.city;
  const vehicleTypeCategory = inferVehicleTypeCategory(vehicleBrand, vehicleModel, explicitCategory);
  const category = determineCategory(vehicleTypeCategory, vehicleValue);

  // ─── Phase 3: Run ALL independent DB queries in parallel ───
  // After vehicle value/category/wilayah are determined, every remaining query
  // is independent. Batch them into a single Promise.all().

  // 3a. Batch RateSettings — single findMany instead of N individual findUnique
  const settingsPromise = db.rateSettings.findMany({
    where: { key: { in: [...REQUIRED_SETTING_KEYS] } },
  });

  // 3b. MotorRate lookup
  const motorRatePromise = db.motorRate.findFirst({
    where: {
      coverageType,
      category,
      vehicleType: vehicleTypeCategory,
      isActive: true,
    },
  });

  // 3c. LoadingRate lookup
  const loadingRatePromise = db.loadingRate.findFirst({
    where: {
      minAge: { lte: vehicleAge },
      maxAge: { gte: vehicleAge },
      isActive: true,
      coverageType: "Comprehensive",
    },
  });

  // 3d. AddonRate batch lookup (only if there are standard addons)
  const standardAddonKeys = addOns.filter(
    (k) => !["tpl", "paDriver", "paPassenger"].includes(k)
  );
  const addonRatePromise = standardAddonKeys.length > 0
    ? db.addonRate.findMany({
        where: {
          addonKey: { in: standardAddonKeys },
          isActive: true,
          OR: [
            { coverageType: coverageType },
            { coverageType: "All" },
          ],
        },
        orderBy: { wilayah: "desc" }, // prefer region-specific (higher wilayah number)
      })
    : Promise.resolve([]);

  // 3e. TplRate lookup (only if TPL is in addons)
  const hasTpl = addOns.includes("tpl");
  const isBusOrTruck = vehicleTypeCategory === "Bus" || vehicleTypeCategory === "Truk dan Pick Up";
  const tplVehicleCategory = isBusOrTruck ? "Bus / Truck" : "Passenger & Motorcycle";
  const tplPromise = hasTpl
    ? db.tplRate.findMany({
        where: {
          vehicleCategory: tplVehicleCategory,
          isActive: true,
        },
        orderBy: { coverageMin: "asc" },
      })
    : Promise.resolve([]);

  // Execute all queries in parallel
  const [settingsRows, motorRate, loadingRow, addonRateRows, tplTiers] = await Promise.all([
    settingsPromise,
    motorRatePromise,
    loadingRatePromise,
    addonRatePromise,
    tplPromise,
  ]);

  // ─── Phase 4: Calculate using loaded data ───

  // Build settings Map from batch result
  const settingsMap = new Map<string, number>();
  for (const row of settingsRows) {
    settingsMap.set(row.key, Number(row.value));
  }
  // Helper: get setting from Map with fallback (same defaults as before)
  const getSetting = (key: string, fallback: number): number => {
    return settingsMap.get(key) ?? fallback;
  };

  // Check coverage eligibility
  const maxAllRisk = getSetting("maxAgeAllRisk", 12);
  const maxTLO = getSetting("maxAgeTLO", 15);

  let isEligible = true;
  let ineligibilityReason: string | undefined;

  if (coverageType === "Comprehensive" && vehicleAge > maxAllRisk) {
    isEligible = false;
    ineligibilityReason = `Kendaraan berusia ${vehicleAge} tahun. All Risk/Comprehensive maksimal ${maxAllRisk} tahun. Silakan pilih TLO.`;
  } else if (coverageType === "TLO" && vehicleAge > maxTLO) {
    isEligible = false;
    ineligibilityReason = `Kendaraan berusia ${vehicleAge} tahun. TLO maksimal ${maxTLO} tahun.`;
  }

  // Check MotorRate result
  if (!motorRate) {
    return notFoundResult(
      "Rate tidak ditemukan untuk kombinasi jenis kendaraan dan coverage ini.",
      "Rate tidak tersedia",
      vehicleValue,
      vehicleAge,
      vehicleTypeCategory,
      wilayah,
      plateCity,
    );
  }

  // Get base rate for the wilayah
  let baseRate: number;
  const coverageMax = Number(motorRate.coverageMax);
  const useRateAtas = vehicleValue > coverageMax;

  if (useRateAtas) {
    const rateAtasW1 = motorRate.rateAtasWilayah1;
    const rateAtasW2 = motorRate.rateAtasWilayah2;
    const rateAtasW3 = motorRate.rateAtasWilayah3;

    if (wilayah === 1 && rateAtasW1) baseRate = rateAtasW1;
    else if (wilayah === 2 && rateAtasW2) baseRate = rateAtasW2;
    else if (wilayah === 3 && rateAtasW3) baseRate = rateAtasW3;
    else {
      if (wilayah === 1) baseRate = motorRate.rateWilayah1;
      else if (wilayah === 2) baseRate = motorRate.rateWilayah2;
      else baseRate = motorRate.rateWilayah3;
    }
  } else {
    if (wilayah === 1) baseRate = motorRate.rateWilayah1;
    else if (wilayah === 2) baseRate = motorRate.rateWilayah2;
    else baseRate = motorRate.rateWilayah3;
  }

  // Calculate loading rate
  let loadingRate = 0;

  if (loadingRow && coverageType === "Comprehensive") {
    const yearsAboveThreshold = vehicleAge - (loadingRow.minAge - 1);
    if (yearsAboveThreshold > 0) {
      loadingRate = baseRate * (yearsAboveThreshold * loadingRow.loadingPercent);
    }
  } else if (coverageType === "Comprehensive") {
    // Fallback to RateSettings if no LoadingRate row found
    const threshold = getSetting("loadingThreshold", 5);
    if (vehicleAge > threshold) {
      const loadingPercentPerYear = getSetting("loadingPercentPerYear", 5) / 100;
      loadingRate = baseRate * ((vehicleAge - threshold) * loadingPercentPerYear);
    }
  }

  const effectiveRate = baseRate + loadingRate;
  const basePremium = Math.round(vehicleValue * effectiveRate);

  // Calculate addon premiums
  const addonPremiums: AddonPremium[] = [];

  // Build addon rate map from batch-fetched results
  let addonRateMap: Map<string, { rate: number; label: string }>;
  try {
    addonRateMap = buildAddonRateMap(addonRateRows, standardAddonKeys, wilayah, coverageType);
  } catch {
    addonRateMap = applyStaticAddonFallback(standardAddonKeys, coverageType);
  }

  for (const addonKey of addOns) {
    if (addonKey === "tpl") {
      // TPL uses pre-loaded tiered rates (no additional DB query)
      const tplPremium = calculateTplPremiumFromTiers(tplCoverageAmount, tplTiers as Array<{ coverageMin: number; coverageMax: number; rate: number }>);
      if (category <= 5 || category === 8) {
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
      const paDriverRate = getSetting("paDriverRate", 0.005);
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
      const paPassengerRate = getSetting("paPassengerRate", 0.004);
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

  // Calculate totals
  const totalAddonPremium = addonPremiums.reduce((sum, a) => sum + a.premium, 0);
  const totalPremiumBeforeDiscount = basePremium + totalAddonPremium;

  const discountFraction = getSetting("discountPercent", 0);
  const adminFee = getSetting("adminFee", 0);
  const policyFee = getSetting("policyFee", 0);

  const discountAmount = Math.round(totalPremiumBeforeDiscount * discountFraction);
  const totalPremium = totalPremiumBeforeDiscount - discountAmount + adminFee + policyFee;

  // Build OTR range
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
