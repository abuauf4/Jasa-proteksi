/**
 * Calculator types — shared across all calculator step components.
 *
 * IMPORTANT: The request body shapes for /api/vehicles/premium and /api/leads
 * are preserved EXACTLY from the original LeadFlowModal. Only the UI is new.
 * Do NOT change these types without verifying the API contracts.
 */

export type CoverageType = "TLO" | "AllRisk";

export interface VehicleFormState {
  brand: string;
  model: string;
  year: string;
  vehicleValue: string; // displayed formatted IDR string
  vehicleValueSource: "database" | "manual"; // whether OTR came from JSON or manual entry
}

export interface RegionFormState {
  plate: string; // full label e.g. "B (Jakarta)"
}

export interface ProtectionFormState {
  coverageType: CoverageType;
}

export interface ExtensionFormState {
  addOns: string[];
}

export interface PersonalFormState {
  customerName: string;
  whatsappNumber: string;
  email?: string;
}

/** Mirror of /api/vehicles/premium add-on item. */
export interface PremiumAddOn {
  key: string;
  label: string;
  rate: number;
  premium: number;
  coverageAmount?: number;
}

/** Mirror of /api/vehicles/premium partner. */
export interface PremiumPartner {
  name: string;
  modifier: number;
  addonModifier: number;
  adminFee: number;
  bengkelAuthorizedExcluded?: boolean;
  bengkelResmiRate?: number;
  estimatedPremium: number;
  benefits: string[];
  facilities: string[];
  availableAddOns: string[];
  breakdown?: {
    basePremium: number;
    addOnPremium: number;
    addons: Array<{ key: string; label: string; premium: number; rate?: number }>;
    totalPremiumBeforeDiscount: number;
    discountPercent: number;
    discountAmount: number;
    adminFee: number;
    policyFee?: number;
  };
}

/** Mirror of /api/vehicles/premium response. */
export interface PremiumResponse {
  dataAvailable?: boolean;
  source?: string;
  vehicleValue: number;
  vehicleAge?: number;
  vehicleTypeCategory?: string;
  vehicleFound?: boolean;
  wilayah?: number;
  wilayahName?: string;
  plateCity?: string;
  coverageType: string;
  baseRate: number;
  loadingRate?: number;
  effectiveRate?: number;
  basePremium: number;
  addOnPremium: number;
  addOns: PremiumAddOn[];
  totalPremiumBeforeDiscount: number;
  discountPercent: number;
  discountAmount: number;
  adminFee: number;
  policyFee: number;
  totalPremium: number;
  isEligible?: boolean;
  ineligibilityReason?: string;
  otrRange?: { min: number; max: number; display: string };
  partners: PremiumPartner[];
}

/** Mirror of /api/leads POST response. */
export interface LeadResponse {
  id: string;
  customerName: string;
  whatsappNumber: string;
  productName: string;
  estimatedPrice: number;
  minimumOfferPrice: number;
  notes: string | null;
}

export type CalculatorStep = "vehicle" | "region" | "protection" | "extension" | "result";

/** All add-on keys supported by the engine. */
export const ALL_ADDON_KEYS = [
  "flood",
  "earthquake",
  "srcc",
  "terrorism",
  "bengkelAuthorized",
  "tpl",
  "paDriver",
  "paPassenger",
] as const;

/** Add-ons NOT available for TLO coverage (per engine spec). */
export const TLO_EXCLUDED_ADDONS = ["bengkelAuthorized"];

/** Human-readable add-on metadata. Labels are stable — DO NOT change wording
 *  without owner approval (the WhatsApp message uses these). */
export interface AddonMeta {
  key: string;
  label: string;
  description: string;
  defaultAmount?: number; // for TPL / PA addons — fixed amount in IDR
}

export const ADDON_META: Record<string, AddonMeta> = {
  flood: {
    key: "flood",
    label: "Banjir",
    description: "Perluasan kerugian akibat banjir.",
  },
  earthquake: {
    key: "earthquake",
    label: "Gempa Bumi",
    description: "Perluasan kerugian akibat gempa bumi.",
  },
  srcc: {
    key: "srcc",
    label: "Kerusuhan",
    description: "Perluasan kerugian akibat kerusuhan dan huru-hara.",
  },
  terrorism: {
    key: "terrorism",
    label: "Terorisme",
    description: "Perluasan kerugian akibat terorisme dan sabotase.",
  },
  bengkelAuthorized: {
    key: "bengkelAuthorized",
    label: "Bengkel Resmi",
    description: "Perbaikan di bengkel resmi merek kendaraan.",
  },
  tpl: {
    key: "tpl",
    label: "Tanggung Jawab Pihak Ketiga",
    description: "Ganti rugi atas kerugian pihak ketiga.",
    defaultAmount: 10000000,
  },
  paDriver: {
    key: "paDriver",
    label: "Kecelakaan Diri Pengemudi",
    description: "Perlindungan jiwa pengemudi akibat kecelakaan.",
    defaultAmount: 10000000,
  },
  paPassenger: {
    key: "paPassenger",
    label: "Kecelakaan Diri Penumpang",
    description: "Perlindungan jiwa penumpang akibat kecelakaan.",
    defaultAmount: 10000000,
  },
};

/** Plate options — same list as the original LeadFlowModal. */
export const PLATE_OPTIONS = [
  "B (Jakarta)", "D (Bandung)", "E (Cirebon)", "F (Bogor)",
  "G (Pekalongan)", "H (Semarang)", "K (Pati)", "L (Surabaya)",
  "M (Madura)", "N (Malang)", "P (Jember)", "S (Bojonegoro)",
  "T (Purwakarta)", "W (Sidoarjo)", "AA (Magelang)", "AB (Yogyakarta)",
  "AD (Surakarta)", "AE (Madiun)", "AG (Kediri)", "BA (Lampung)",
  "BB (Tanggamus)", "BD (Bengkulu)", "BE (Palembang)", "BG (Lahat)",
  "BH (Jambi)", "BK (Padang)", "BL (Batusangkar)", "BM (Riau)",
  "BN (Tanjung Pinang)", "BP (Batam)", "DB (Denpasar)", "DA (Mataram)",
  "DH (Lombok)", "DN (Bima)", "KB (Pontianak)", "KH (Sampit)",
  "KT (Ketapang)", "KU (Sintang)",
  "EA (Samarinda)", "EB (Balikpapan)", "PA (Makassar)", "PB (Bone)",
  "PC (Pare-Pare)", "RA (Manado)", "RB (Gorontalo)", "RC (Bitung)",
  "TA (Ambon)", "TB (Ternate)", "TL (Sorong)",
];

/** Extract the plate letter code from a label like "B (Jakarta)" → "B". */
export function plateCodeFromLabel(label: string): string {
  return label.split(" ")[0];
}

/**
 * Map partner display name to logo file slug.
 * Logo files live in /public/partners/{slug}.webp.
 */
export function partnerLogoSlug(partnerName: string): string | null {
  const map: Record<string, string> = {
    "Sinarmas": "sinarmas",
    "Multi Artha Guna": "mag",
    "ACA": "aca",
    "Mega Insurance": "mega-insurance",
    "Zurich Syariah": "zurich-syariah",
    "Tugu": "tugu",
    "Sahabat": "sahabat",
    "Oona": "oona",
  };
  return map[partnerName] ?? null;
}

/** Full path to partner logo, or null if no logo available. */
export function partnerLogoPath(partnerName: string): string | null {
  const slug = partnerLogoSlug(partnerName);
  return slug ? `/partners/${slug}.webp` : null;
}

/**
 * Per-partner visual scale to normalize logo sizes.
 * Different logo files have different amounts of internal whitespace.
 * This scale is applied to the IMG element only, not the card.
 * Value 1.0 = use default max-h/max-w constraints.
 * Lower value = smaller logo (for logos with little whitespace).
 */
export const partnerLogoScale: Record<string, number> = {
  sinarmas: 1.05,
  mag: 2.00,
  aca: 1.25,
  "mega-insurance": 1.55,
  "zurich-syariah": 1.25,
  tugu: 1.45,
  sahabat: 1.45,
  oona: 0.90,
};

/** Get scale factor for a partner name (returns 1.0 if not configured). */
export function getPartnerLogoScale(partnerName: string): number {
  const slug = partnerLogoSlug(partnerName);
  return slug ? (partnerLogoScale[slug] ?? 1.0) : 1.0;
}

/** The 4 input steps shown to the user as "Langkah X dari 4".
 *  Result is the 5th state but not counted as a user input step. */
export const STEP_FLOW: CalculatorStep[] = ["vehicle", "region", "protection", "extension"];

/** Display label for each step. */
export const STEP_LABELS: Record<CalculatorStep, string> = {
  vehicle: "Data Kendaraan",
  region: "Wilayah & Penggunaan",
  protection: "Jenis Perlindungan",
  extension: "Perluasan",
  result: "Hasil Simulasi",
};
