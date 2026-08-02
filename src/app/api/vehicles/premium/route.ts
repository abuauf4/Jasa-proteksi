import { NextRequest, NextResponse } from "next/server";
import { calculatePremium, type QuotationInput } from "@/lib/premium-engine";
import { db } from "@/lib/db";
import vehiclePriceData from "@/lib/vehicleData.json";

// Force dynamic rendering — partner data must always be fresh from DB
export const dynamic = "force-dynamic";

// ─── Partner Configuration (Static Fallback) ───
// Used only when the database is unreachable.
// When DB is available, active InsurancePartner records are queried instead.
//
// Per-partner bengkel resmi rules (confirmed by owner, 2026-08-01):
//   - bengkelResmiMaxYears: max vehicle age eligible for bengkel resmi coverage
//   - bengkelResmiRate: per-partner rate override for bengkelAuthorized addon
//     (when undefined, falls back to global addon rate 0.001 = 0.1%)
const PARTNERS = [
  {
    name: "Sinarmas",
    key: "partnerSinarmasModifier",
    bengkelResmiMaxYears: 10,
    bengkelResmiRate: 0.005, // 0.5%
    benefits: ["Bantuan Claim", "Jaringan Bengkel Luas", "Bengkel Resmi 10 Tahun"],
    facilities: ["Free derek", "Layanan call 24 jam"],
    availableAddOns: ["flood", "earthquake", "srcc", "terrorism", "bengkelAuthorized", "tpl", "paDriver", "paPassenger"],
  },
  {
    name: "Multi Artha Guna",
    key: "partnerMultiArthaGlobalModifier",
    bengkelResmiMaxYears: 3,
    // bengkelResmiRate: undefined → uses global default 0.001 (0.1%)
    benefits: ["Bantuan Claim", "Jaringan Bengkel Luas", "Bengkel Resmi 3 Tahun"],
    facilities: ["Free derek", "Layanan call 24 jam"],
    availableAddOns: ["flood", "earthquake", "srcc", "terrorism", "bengkelAuthorized", "tpl", "paDriver", "paPassenger"],
  },
  {
    name: "ACA",
    key: "partnerACAModifier",
    bengkelResmiMaxYears: 10,
    // bengkelResmiRate: undefined → uses global default 0.001 (0.1%)
    benefits: ["Bantuan Claim", "Jaringan Bengkel Luas", "Bengkel Resmi 10 Tahun"],
    facilities: ["Free derek", "Layanan call 24 jam"],
    availableAddOns: ["flood", "earthquake", "srcc", "terrorism", "bengkelAuthorized", "tpl", "paDriver", "paPassenger"],
  },
  {
    name: "Mega Insurance",
    key: "partnerMegaInsuranceModifier",
    bengkelResmiMaxYears: 10,
    bengkelResmiRate: 0.001, // 0.1%
    benefits: ["Bantuan Claim", "Jaringan Bengkel Luas", "Bengkel Resmi 10 Tahun"],
    facilities: ["Free derek", "Layanan call 24 jam"],
    availableAddOns: ["flood", "earthquake", "srcc", "terrorism", "bengkelAuthorized", "tpl", "paDriver", "paPassenger"],
  },
  {
    name: "Zurich Syariah",
    key: "partnerZurichsyariahModifier",
    bengkelResmiMaxYears: 10,
    bengkelResmiRate: 0.0015, // 0.15%
    benefits: ["Bantuan Claim", "Jaringan Bengkel Luas", "Bengkel Resmi 10 Tahun", "Syariah Compliant"],
    facilities: ["Free derek", "Layanan call 24 jam"],
    availableAddOns: ["flood", "earthquake", "srcc", "terrorism", "bengkelAuthorized", "tpl", "paDriver", "paPassenger"],
  },
  {
    name: "Tugu",
    key: "partnerTuguModifier",
    bengkelResmiMaxYears: 5,
    bengkelResmiRate: 0.0015, // 0.15%
    benefits: ["Bantuan Claim", "Jaringan Bengkel Luas", "Bengkel Resmi 5 Tahun"],
    facilities: ["Free derek", "Layanan call 24 jam"],
    availableAddOns: ["flood", "earthquake", "srcc", "terrorism", "bengkelAuthorized", "tpl", "paDriver", "paPassenger"],
  },
  {
    name: "Sahabat",
    key: "partnerSahabatModifier",
    bengkelResmiMaxYears: 5,
    bengkelResmiRate: 0.001, // 0.1%
    benefits: ["Bantuan Claim", "Jaringan Bengkel Luas", "Bengkel Resmi 5 Tahun"],
    facilities: ["Free derek", "Layanan call 24 jam"],
    availableAddOns: ["flood", "earthquake", "srcc", "terrorism", "bengkelAuthorized", "tpl", "paDriver", "paPassenger"],
  },
  {
    name: "Oona",
    key: "partnerOonaModifier",
    bengkelResmiMaxYears: 5,
    bengkelResmiRate: 0.001, // 0.1%
    benefits: ["Bantuan Claim", "Jaringan Bengkel Luas", "Bengkel Resmi 5 Tahun"],
    facilities: ["Free derek", "Layanan call 24 jam"],
    availableAddOns: ["flood", "earthquake", "srcc", "terrorism", "bengkelAuthorized", "tpl", "paDriver", "paPassenger"],
  },
];

// Default add-ons available for all partners (used when loading from DB)
const DEFAULT_AVAILABLE_ADDONS = [
  "flood", "earthquake", "srcc", "terrorism",
  "bengkelAuthorized", "tpl", "paDriver", "paPassenger",
];

// Fetch active partners from the database (with addon rate overrides)
async function getActivePartnersFromDB() {
  try {
    const dbPartners = await db.insurancePartner.findMany({
      where: { status: "active" },
      orderBy: { sortOrder: "asc" },
      include: { addonRateOverrides: { where: { isActive: true } } },
    });
    return dbPartners.map((p) => ({
      name: p.name,
      key: `partner${p.slug.replace(/-/g, "").replace(/\s+/g, "")}Modifier`,
      modifier: p.modifier,
      addonModifier: p.addonModifier ?? 1.0,
      adminFee: p.adminFee ?? 50000,
      bengkelResmiMaxYears: p.bengkelResmiMaxYears ?? null,
      benefits: p.benefits ? JSON.parse(p.benefits) : [],
      facilities: p.facilities ? JSON.parse(p.facilities) : [],
      availableAddOns: DEFAULT_AVAILABLE_ADDONS,
      addonRateOverrides: (p.addonRateOverrides || []).map(o => ({
        addonKey: o.addonKey,
        rate: o.rate,
        addonLabel: o.addonLabel,
      })),
    }));
  } catch {
    return null;
  }
}

// ─── Static Fallback Data (used when DB connection fails) ───
// Default rates based on industry standards and the Excel simulation

const STATIC_RATES: Record<string, Record<string, number[]>> = {
  // Comprehensive rates: [wilayah1, wilayah2, wilayah3]
  "Non Bus dan Non Truk": {
    "cat1": [0.0382, 0.0308, 0.0247],  // <= 125jt
    "cat2": [0.0344, 0.0278, 0.0223],  // <= 200jt
    "cat3": [0.0293, 0.0237, 0.0190],  // <= 400jt
    "cat4": [0.0256, 0.0208, 0.0167],  // <= 800jt
    "cat5": [0.0208, 0.0168, 0.0135],  // > 800jt
  },
  "Truk dan Pick Up": {
    "cat6": [0.0334, 0.0270, 0.0216],
  },
  "Bus": {
    "cat7": [0.0334, 0.0270, 0.0216],
  },
  "Kendaraan Roda 2": {
    "cat8": [0.0382, 0.0308, 0.0247],
  },
};

const STATIC_TLO_RATES: Record<string, Record<string, number[]>> = {
  "Non Bus dan Non Truk": {
    "cat1": [0.0099, 0.0080, 0.0064],
    "cat2": [0.0089, 0.0072, 0.0058],
    "cat3": [0.0076, 0.0061, 0.0049],
    "cat4": [0.0066, 0.0054, 0.0043],
    "cat5": [0.0054, 0.0044, 0.0035],
  },
  "Truk dan Pick Up": {
    "cat6": [0.0087, 0.0070, 0.0056],
  },
  "Bus": {
    "cat7": [0.0087, 0.0070, 0.0056],
  },
  "Kendaraan Roda 2": {
    "cat8": [0.0099, 0.0080, 0.0064],
  },
};

// Static addon rates (fallback when DB is down)
const STATIC_ADDON_RATES: Record<string, { label: string; rate: number; appliesTo: string[] }> = {
  flood: { label: "Banjir & Angin Kencang", rate: 0.001, appliesTo: ["Comprehensive", "All"] },
  earthquake: { label: "Gempa Bumi & Tsunami", rate: 0.0015, appliesTo: ["Comprehensive", "All"] },
  srcc: { label: "Kerusuhan & Huru-Hara", rate: 0.0005, appliesTo: ["Comprehensive", "All"] },
  terrorism: { label: "Terorisme & Sabotase", rate: 0.0005, appliesTo: ["Comprehensive", "All"] },
  bengkelAuthorized: { label: "Bengkel Resmi", rate: 0.001, appliesTo: ["Comprehensive", "All"] },
};

// Static plate → wilayah mapping
const STATIC_PLATE_MAP: Record<string, { city: string; wilayah: number }> = {
  "B": { city: "Jakarta", wilayah: 2 },
  "D": { city: "Bandung", wilayah: 2 },
  "E": { city: "Cirebon", wilayah: 3 },
  "F": { city: "Bogor", wilayah: 2 },
  "G": { city: "Pekalongan", wilayah: 3 },
  "H": { city: "Semarang", wilayah: 3 },
  "K": { city: "Pati", wilayah: 3 },
  "L": { city: "Surabaya", wilayah: 2 },
  "M": { city: "Madura", wilayah: 3 },
  "N": { city: "Malang", wilayah: 3 },
  "P": { city: "Jember", wilayah: 3 },
  "S": { city: "Bojonegoro", wilayah: 3 },
  "T": { city: "Purwakarta", wilayah: 2 },
  "W": { city: "Sidoarjo", wilayah: 2 },
  "AA": { city: "Magelang", wilayah: 3 },
  "AB": { city: "Yogyakarta", wilayah: 3 },
  "AD": { city: "Surakarta", wilayah: 3 },
  "AE": { city: "Madiun", wilayah: 3 },
  "AG": { city: "Kediri", wilayah: 3 },
  "BA": { city: "Lampung", wilayah: 1 },
  "BB": { city: "Tanggamus", wilayah: 1 },
  "BD": { city: "Bengkulu", wilayah: 1 },
  "BE": { city: "Palembang", wilayah: 1 },
  "BG": { city: "Lahat", wilayah: 1 },
  "BH": { city: "Jambi", wilayah: 1 },
  "BK": { city: "Padang", wilayah: 1 },
  "BL": { city: "Batusangkar", wilayah: 1 },
  "BM": { city: "Riau", wilayah: 1 },
  "BN": { city: "Tanjung Pinang", wilayah: 1 },
  "BP": { city: "Batam", wilayah: 1 },
  "DB": { city: "Denpasar", wilayah: 3 },
  "DA": { city: "Mataram", wilayah: 3 },
  "DH": { city: "Lombok", wilayah: 3 },
  "KB": { city: "Pontianak", wilayah: 1 },
  "KH": { city: "Sampit", wilayah: 1 },
  "EA": { city: "Samarinda", wilayah: 1 },
  "EB": { city: "Balikpapan", wilayah: 1 },
  "PA": { city: "Makassar", wilayah: 1 },
  "PB": { city: "Bone", wilayah: 1 },
  "PC": { city: "Pare-Pare", wilayah: 1 },
  "RA": { city: "Manado", wilayah: 1 },
  "RB": { city: "Gorontalo", wilayah: 1 },
  "TA": { city: "Ambon", wilayah: 1 },
  "TB": { city: "Ternate", wilayah: 1 },
};

// ─── Static Fallback Calculation ───
function calculateStaticPremium(input: {
  brand: string;
  modelDescription: string;
  vehicleYear: number;
  coverageType: "Comprehensive" | "TLO";
  plateCode: string;
  addOns: string[];
  vehicleValueOverride?: number;
  vehicleTypeCategory?: string;
  tplCoverageAmount?: number;
  paDriverAmount?: number;
  paPassengerCount?: number;
}) {
  const CURRENT_YEAR = new Date().getFullYear();

  // 1. Get vehicle value from static JSON
  let vehicleValue = input.vehicleValueOverride || 0;
  if (!vehicleValue) {
    const brandData = vehiclePriceData[input.brand as keyof typeof vehiclePriceData];
    if (brandData) {
      const modelKey = Object.keys(brandData).find(
        (m) => m.toLowerCase().includes(input.modelDescription.toLowerCase()) ||
               input.modelDescription.toLowerCase().includes(m.toLowerCase())
      );
      if (modelKey) {
        const yearData = brandData[modelKey as keyof typeof brandData];
        const price = yearData[String(input.vehicleYear) as keyof typeof yearData];
        if (typeof price === "number") {
          vehicleValue = price * 1_000_000; // Convert from millions
        }
      }
    }
  }

  if (!vehicleValue) {
    return {
      success: false as const,
      error: "Harga kendaraan tidak ditemukan. Silakan masukkan harga OTR manual.",
    };
  }

  // 2. Vehicle age
  const vehicleAge = CURRENT_YEAR - input.vehicleYear;

  // 3. Wilayah from static plate map
  const plateUpper = input.plateCode.toUpperCase().trim();
  const plateInfo = STATIC_PLATE_MAP[plateUpper] || { city: "Jakarta", wilayah: 2 };
  const wilayah = plateInfo.wilayah;
  const plateCity = plateInfo.city;

  // 4. Vehicle type category
  const vehicleTypeCategory = input.vehicleTypeCategory || "Non Bus dan Non Truk";

  // 5. Category
  let category: number;
  if (vehicleTypeCategory === "Non Bus dan Non Truk") {
    if (vehicleValue <= 125_000_000) category = 1;
    else if (vehicleValue <= 200_000_000) category = 2;
    else if (vehicleValue <= 400_000_000) category = 3;
    else if (vehicleValue <= 800_000_000) category = 4;
    else category = 5;
  } else if (vehicleTypeCategory === "Truk dan Pick Up") {
    category = 6;
  } else if (vehicleTypeCategory === "Bus") {
    category = 7;
  } else {
    category = 8;
  }

  // 6. Get rate
  const catKey = `cat${category}`;
  const rateTable = input.coverageType === "TLO" ? STATIC_TLO_RATES : STATIC_RATES;
  const typeRates = rateTable[vehicleTypeCategory] || rateTable["Non Bus dan Non Truk"];
  const rates = typeRates[catKey] || typeRates["cat3"] || [0.0293, 0.0237, 0.0190];
  const baseRate = wilayah === 1 ? rates[0] : wilayah === 2 ? rates[1] : rates[2];

  // 7. Loading (for Comprehensive only, age > 5)
  let loadingRate = 0;
  if (input.coverageType === "Comprehensive" && vehicleAge > 5) {
    const loadingPercent = 0.05; // 5% per year above threshold
    loadingRate = baseRate * ((vehicleAge - 5) * loadingPercent);
  }

  const effectiveRate = baseRate + loadingRate;
  const basePremium = Math.round(vehicleValue * effectiveRate);

  // 8. Add-ons
  const addonPremiums: Array<{ key: string; label: string; rate: number; premium: number; coverageAmount: number }> = [];

  for (const addonKey of input.addOns) {
    if (addonKey === "tpl") {
      // TPL for motorcycle = skip
      if (category === 8) continue;
      const tplCoverageAmount = input.tplCoverageAmount || 10_000_000;
      // Simplified TPL: ~1% of coverage
      const tplPremium = Math.round(tplCoverageAmount * 0.01);
      addonPremiums.push({
        key: "tpl",
        label: "Tanggung Jawab Pihak Ketiga (TPL)",
        rate: 0.01,
        premium: tplPremium,
        coverageAmount: tplCoverageAmount,
      });
      continue;
    }

    if (addonKey === "paDriver") {
      const paDriverAmount = input.paDriverAmount || 10_000_000;
      const paDriverPremium = Math.round(paDriverAmount * 0.005);
      addonPremiums.push({
        key: "paDriver",
        label: "Perlindungan Jiwa Supir",
        rate: 0.005,
        premium: paDriverPremium,
        coverageAmount: paDriverAmount,
      });
      continue;
    }

    if (addonKey === "paPassenger") {
      const paPassengerPremium = 40000;
      const paPassengerCount = input.paPassengerCount || 4;
      addonPremiums.push({
        key: "paPassenger",
        label: `Perlindungan Jiwa Penumpang (${paPassengerCount} orang)`,
        rate: 0,
        premium: paPassengerPremium,
        coverageAmount: paPassengerPremium,
      });
      continue;
    }

    const staticAddon = STATIC_ADDON_RATES[addonKey];
    if (staticAddon) {
      const applies = staticAddon.appliesTo.includes(input.coverageType) || staticAddon.appliesTo.includes("All");
      if (applies) {
        addonPremiums.push({
          key: addonKey,
          label: staticAddon.label,
          rate: staticAddon.rate,
          premium: Math.round(vehicleValue * staticAddon.rate),
          coverageAmount: vehicleValue,
        });
      }
    }
  }

  // 9. Totals
  const totalAddonPremium = addonPremiums.reduce((sum, a) => sum + a.premium, 0);
  const totalPremiumBeforeDiscount = basePremium + totalAddonPremium;
  const discountPercent = 25; // Default discount
  const discountAmount = Math.round(totalPremiumBeforeDiscount * (discountPercent / 100));
  const adminFee = 50000;
  const policyFee = 0;
  const totalPremium = totalPremiumBeforeDiscount - discountAmount + adminFee + policyFee;

  // 10. OTR range
  const OTR_RANGE_PERCENT = 0.15;
  const otrMin = Math.round(vehicleValue * (1 - OTR_RANGE_PERCENT));
  const otrMax = Math.round(vehicleValue * (1 + OTR_RANGE_PERCENT));
  const formatRupiah = (amt: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amt);

  // 11. Eligibility
  let isEligible = true;
  let ineligibilityReason: string | undefined;
  if (input.coverageType === "Comprehensive" && vehicleAge > 12) {
    isEligible = false;
    ineligibilityReason = `Kendaraan berusia ${vehicleAge} tahun. All Risk/Comprehensive maksimal 12 tahun.`;
  } else if (input.coverageType === "TLO" && vehicleAge > 15) {
    isEligible = false;
    ineligibilityReason = `Kendaraan berusia ${vehicleAge} tahun. TLO maksimal 15 tahun.`;
  }

  // 12. Partner calculation
  const defaultModifiers: Record<string, number> = {
    partnerSinarmasModifier: 1.0,
    partnerMultiArthaGlobalModifier: 1.0,
    partnerACAModifier: 1.0,
    partnerMegaInsuranceModifier: 1.0,
    partnerZurichsyariahModifier: 1.0,
    partnerTuguModifier: 1.0,
    partnerSahabatModifier: 1.0,
    partnerOonaModifier: 1.0,
  };

  const partners = PARTNERS.map((partner) => {
    const modifier = defaultModifiers[partner.key] ?? 1.0;
    // Filter bengkelAuthorized if vehicle age exceeds partner's max
    const bengkelExcluded = partner.bengkelResmiMaxYears != null && vehicleAge > partner.bengkelResmiMaxYears;

    // Apply per-partner bengkelResmiRate override if defined.
    // Other addons use the global addon premium as-is.
    const filteredAddonPremiums = (bengkelExcluded
      ? addonPremiums.filter(a => a.key !== "bengkelAuthorized")
      : addonPremiums
    ).map((a) => {
      if (a.key === "bengkelAuthorized" && partner.bengkelResmiRate != null && !bengkelExcluded) {
        // Recalculate bengkel premium using partner-specific rate
        const partnerPremium = Math.round(vehicleValue * partner.bengkelResmiRate);
        return { ...a, premium: partnerPremium, rate: partner.bengkelResmiRate };
      }
      return a;
    });

    const addonTotal = filteredAddonPremiums.reduce((sum, a) => sum + a.premium, 0);
    const adjustedBasePremium = Math.round(basePremium * modifier);
    const adjustedTotalBeforeDiscount = adjustedBasePremium + addonTotal;
    const adjustedDiscountAmount = Math.round(adjustedTotalBeforeDiscount * (discountPercent / 100));
    const estimatedPremium = adjustedTotalBeforeDiscount - adjustedDiscountAmount + adminFee + policyFee;
    return {
      name: partner.name,
      modifier,
      addonModifier: 1.0,
      adminFee,
      bengkelAuthorizedExcluded: bengkelExcluded,
      bengkelResmiRate: partner.bengkelResmiRate,
      estimatedPremium,
      benefits: partner.benefits,
      facilities: partner.facilities,
      availableAddOns: partner.availableAddOns,
      breakdown: {
        basePremium: adjustedBasePremium,
        addOnPremium: addonTotal,
        addons: filteredAddonPremiums,
        totalPremiumBeforeDiscount: adjustedTotalBeforeDiscount,
        discountPercent,
        discountAmount: adjustedDiscountAmount,
        adminFee,
        policyFee,
      },
    };
  });

  return {
    success: true as const,
    dataAvailable: true,
    source: input.vehicleValueOverride ? "manual_override_static" : "pricelist_static_fallback",

    vehicleValue,
    vehicleAge,
    vehicleTypeCategory,
    wilayah,
    wilayahName: wilayah === 1 ? "Wilayah 1 (Sumatera — Rate Tertinggi)" : wilayah === 2 ? "Wilayah 2 (Jabodetabek & Bandung)" : "Wilayah 3 (Wilayah Lainnya)",
    plateCity,

    isEligible,
    ineligibilityReason,

    otrRange: {
      min: otrMin,
      max: otrMax,
      display: `${formatRupiah(otrMin)} – ${formatRupiah(otrMax)}`,
    },

    coverageType: input.coverageType,
    baseRate,
    loadingRate,
    effectiveRate,
    basePremium,

    addOns: addonPremiums,
    addOnPremium: totalAddonPremium,

    totalPremiumBeforeDiscount,
    discountPercent,
    discountAmount,
    adminFee,
    policyFee,
    totalPremium,

    partners,
  };
}

// POST /api/vehicles/premium — Real Insurance Quotation Engine
// Vehicle values always from static JSON; rates/partners from DB with static fallback
export async function POST(request: NextRequest) {
  const start = Date.now();
  try {
    const body = await request.json();
    const {
      brand,
      modelDescription,
      vehicleYear,
      coverageType,
      addOns,
      vehicleValueOverride,
      plateCode,
      vehicleTypeCategory,
      tplCoverageAmount,
      paDriverAmount,
      paPassengerCount,
      paPassengerAmount,
    } = body as {
      brand: string;
      modelDescription: string;
      vehicleYear: number;
      coverageType: "TLO" | "AllRisk" | "Comprehensive";
      addOns: string[];
      vehicleValueOverride?: number;
      plateCode?: string;
      vehicleTypeCategory?: string;
      tplCoverageAmount?: number;
      paDriverAmount?: number;
      paPassengerCount?: number;
      paPassengerAmount?: number;
    };

    // Validate required fields
    if (!brand || !modelDescription || !vehicleYear || !coverageType) {
      return NextResponse.json(
        { error: "Missing required fields: brand, modelDescription, vehicleYear, coverageType" },
        { status: 400 }
      );
    }

    // Normalize coverage type
    const normalizedCoverage: "Comprehensive" | "TLO" =
      coverageType === "TLO" ? "TLO" : "Comprehensive";

    // ─── Try DB-powered calculation first (vehicle values from JSON, rates from DB) ───
    try {
      const input: QuotationInput = {
        coverageType: normalizedCoverage,
        vehicleBrand: brand,
        vehicleModel: modelDescription,
        vehicleYear: Number(vehicleYear),
        plateCode: plateCode || "B",
        vehicleValue: vehicleValueOverride || undefined,
        addOns: Array.isArray(addOns) ? addOns : [],
        vehicleTypeCategory: vehicleTypeCategory as QuotationInput["vehicleTypeCategory"],
        tplCoverageAmount: tplCoverageAmount || 10_000_000,
        paDriverAmount: paDriverAmount || 10_000_000,
        paPassengerCount: paPassengerCount || 4,
        paPassengerAmount: paPassengerAmount || 10_000_000,
      };

      // Run premium calculation and partner loading in parallel
      // (previously these were sequential — partner DB query waited for full calculation)
      const [result, dbPartners] = await Promise.all([
        calculatePremium(input),
        getActivePartnersFromDB(),
      ]);

      const calcElapsed = Date.now() - start;
      console.log(`[PERF] POST /api/vehicles/premium calculatePremium+partners: ${calcElapsed}ms (${brand} ${modelDescription} ${vehicleYear} ${normalizedCoverage})`);

      if (!result.success) {
        return NextResponse.json(
          {
            error: result.error,
            dataAvailable: false,
            isEligible: result.isEligible,
            ineligibilityReason: result.ineligibilityReason,
            ...(result.vehicleValue > 0 ? {
              vehicleValue: result.vehicleValue,
              otrRange: result.otrRange,
            } : {}),
          },
          { status: result.vehicleValue > 0 ? 200 : 404 }
        );
      }

      // ─── Partner Comparison Calculation ───
      // dbPartners was loaded in parallel with calculatePremium above

      // If DB partners are available, use them; otherwise fall back to hardcoded + rateSettings
      let partners: Array<{
        name: string;
        modifier: number;
        estimatedPremium: number;
        benefits: string[];
        facilities: string[];
        availableAddOns: string[];
      }>;

      if (dbPartners && dbPartners.length > 0) {
        // Use database-sourced partners (respects active/inactive status)
        partners = dbPartners.map((partner) => {
          // Calculate addon total with per-partner rate overrides
          const overrideMap = new Map(partner.addonRateOverrides?.map(o => [o.addonKey, o]) ?? []);
          let addonTotal = 0;

          // Filter out bengkelAuthorized if vehicle age exceeds partner's max
          const vehicleAge = result.vehicleAge ?? 0;
          const bengkelExcluded = partner.bengkelResmiMaxYears != null && vehicleAge > partner.bengkelResmiMaxYears;

          for (const addon of result.addons) {
            // Skip bengkelAuthorized if vehicle is too old for this partner
            if (addon.key === "bengkelAuthorized" && bengkelExcluded) continue;

            const override = overrideMap.get(addon.key);
            if (override && override.rate > 0) {
              // Partner-specific rate override — recalculate premium using override rate
              addonTotal += Math.round(result.vehicleValue * override.rate);
            } else {
              // No override — apply addonModifier to the global addon premium
              addonTotal += Math.round(addon.premium * (partner.addonModifier ?? 1.0));
            }
          }
          const adjustedBasePremium = Math.round(result.basePremium * partner.modifier);
          const adjustedTotalBeforeDiscount = adjustedBasePremium + addonTotal;
          const adjustedDiscountAmount = Math.round(adjustedTotalBeforeDiscount * (result.discountPercent / 100));
          const partnerAdminFee = partner.adminFee ?? result.adminFee;
          const estimatedPremium = adjustedTotalBeforeDiscount - adjustedDiscountAmount + partnerAdminFee + result.policyFee;

          // Build per-partner addon breakdown (with overrides applied, filter bengkel if excluded)
          const partnerAddons = result.addons
            .filter((addon) => !(addon.key === "bengkelAuthorized" && bengkelExcluded))
            .map((addon) => {
            const override = overrideMap.get(addon.key);
            if (override && override.rate > 0) {
              // Partner-specific rate override — update both premium AND rate field
              return {
                ...addon,
                premium: Math.round(result.vehicleValue * override.rate),
                rate: override.rate,
              };
            }
            return { ...addon, premium: Math.round(addon.premium * (partner.addonModifier ?? 1.0)) };
          });

          // Expose bengkelResmiRate at top-level for UI (when override exists)
          const bengkelOverride = overrideMap.get("bengkelAuthorized");

          return {
            name: partner.name,
            modifier: partner.modifier,
            addonModifier: partner.addonModifier ?? 1.0,
            adminFee: partnerAdminFee,
            bengkelAuthorizedExcluded: bengkelExcluded,
            bengkelResmiRate: bengkelOverride?.rate,
            estimatedPremium,
            benefits: partner.benefits,
            facilities: partner.facilities,
            availableAddOns: partner.availableAddOns,
            breakdown: {
              basePremium: adjustedBasePremium,
              addOnPremium: addonTotal,
              addons: partnerAddons,
              totalPremiumBeforeDiscount: adjustedTotalBeforeDiscount,
              discountPercent: result.discountPercent,
              discountAmount: adjustedDiscountAmount,
              adminFee: partnerAdminFee,
              policyFee: result.policyFee,
            },
          };
        });
      } else {
        // Fallback: use hardcoded PARTNERS with rateSettings modifiers
        let partnerModifiers: Array<{ key: string; value: number }> = [];
        try {
          partnerModifiers = await db.rateSettings.findMany({
            where: {
              category: "partner_modifier",
              isActive: true,
            },
          });
        } catch {
          // DB partner modifiers not available — use defaults
        }

        const modifierMap = new Map<string, number>();
        for (const setting of partnerModifiers) {
          modifierMap.set(setting.key, setting.value);
        }

        const defaultModifiers: Record<string, number> = {
          partnerSinarmasModifier: 1.0,
          partnerMultiArthaGlobalModifier: 1.0,
          partnerACAModifier: 1.0,
          partnerMegaInsuranceModifier: 1.0,
          partnerZurichsyariahModifier: 1.0,
          partnerTuguModifier: 1.0,
          partnerSahabatModifier: 1.0,
          partnerOonaModifier: 1.0,
        };

        partners = PARTNERS.map((partner) => {
          const modifier = modifierMap.get(partner.key) ?? defaultModifiers[partner.key] ?? 1.0;
          // Filter bengkelAuthorized if vehicle age exceeds partner's max
          const vehicleAge = result.vehicleAge ?? 0;
          const bengkelExcluded = partner.bengkelResmiMaxYears != null && vehicleAge > partner.bengkelResmiMaxYears;
          const filteredAddons = bengkelExcluded
            ? result.addons.filter(a => a.key !== "bengkelAuthorized")
            : result.addons;
          const addonTotal = filteredAddons.reduce((sum, a) => sum + a.premium, 0);
          const adjustedBasePremium = Math.round(result.basePremium * modifier);
          const adjustedTotalBeforeDiscount = adjustedBasePremium + addonTotal;
          const adjustedDiscountAmount = Math.round(adjustedTotalBeforeDiscount * (result.discountPercent / 100));
          const estimatedPremium = adjustedTotalBeforeDiscount - adjustedDiscountAmount + result.adminFee + result.policyFee;
          return {
            name: partner.name,
            modifier,
            addonModifier: 1.0,
            adminFee: result.adminFee,
            bengkelAuthorizedExcluded: bengkelExcluded,
            estimatedPremium,
            benefits: partner.benefits,
            facilities: partner.facilities,
            availableAddOns: partner.availableAddOns,
            breakdown: {
              basePremium: adjustedBasePremium,
              addOnPremium: addonTotal,
              addons: filteredAddons,
              totalPremiumBeforeDiscount: adjustedTotalBeforeDiscount,
              discountPercent: result.discountPercent,
              discountAmount: adjustedDiscountAmount,
              adminFee: result.adminFee,
              policyFee: result.policyFee,
            },
          };
        });
      }

      return NextResponse.json({
        dataAvailable: true,
        source: input.vehicleValue ? "manual_override" : "static_json_db_rates",

        vehicleValue: result.vehicleValue,
        vehicleAge: result.vehicleAge,
        vehicleTypeCategory: result.vehicleTypeCategory,
        wilayah: result.wilayah,
        wilayahName: result.wilayah === 1 ? "Wilayah 1 (Sumatera — Rate Tertinggi)" : result.wilayah === 2 ? "Wilayah 2 (Jabodetabek & Bandung)" : "Wilayah 3 (Wilayah Lainnya)",
        plateCity: result.plateCity,

        isEligible: result.isEligible,
        ineligibilityReason: result.ineligibilityReason,

        otrRange: result.otrRange,

        coverageType: normalizedCoverage,
        baseRate: result.baseRate,
        loadingRate: result.loadingRate,
        effectiveRate: result.effectiveRate,
        basePremium: result.basePremium,

        addOns: result.addons,
        addOnPremium: result.addons.reduce((sum, a) => sum + a.premium, 0),

        totalPremiumBeforeDiscount: result.totalPremiumBeforeDiscount,
        discountPercent: result.discountPercent,
        discountAmount: result.discountAmount,
        adminFee: result.adminFee,
        policyFee: result.policyFee,
        totalPremium: result.totalPremium,

        partners,
      });
    } catch (dbError) {
      console.error("DB calculation failed, falling back to static:", dbError instanceof Error ? dbError.message : String(dbError));
      // Fall through to static calculation below
    }

    // ─── Static Fallback Calculation (when DB is unavailable) ───
    console.log("Using static fallback for premium calculation");
    const staticResult = calculateStaticPremium({
      brand,
      modelDescription,
      vehicleYear: Number(vehicleYear),
      coverageType: normalizedCoverage,
      plateCode: plateCode || "B",
      addOns: Array.isArray(addOns) ? addOns : [],
      vehicleValueOverride,
      vehicleTypeCategory: vehicleTypeCategory || undefined,
      tplCoverageAmount,
      paDriverAmount,
      paPassengerCount,
    });

    if (!staticResult.success) {
      return NextResponse.json(
        { error: staticResult.error, dataAvailable: false },
        { status: 404 }
      );
    }

    return NextResponse.json(staticResult);

  } catch (error) {
    const errorDetail = error instanceof Error ? error.message : String(error);
    console.error("POST /api/vehicles/premium error:", errorDetail);
    return NextResponse.json(
      { error: "Gagal menghitung premi. Silakan coba lagi atau hubungi kami.", detail: process.env.NODE_ENV === "development" ? errorDetail : undefined },
      { status: 500 }
    );
  }
}
