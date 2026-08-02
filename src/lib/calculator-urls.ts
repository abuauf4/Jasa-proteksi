import type { CoverageType } from "@/components/calculator/types";

/**
 * Centralized calculator URL builder.
 * All CTA buttons that link to All Risk or TLO must use this helper.
 */
export type CoverageParam = "all-risk" | "tlo";

/**
 * Map URL param → internal engine CoverageType value.
 * Engine uses: "AllRisk" | "TLO" (NOT "all-risk" or "comprehensive")
 */
const coverageParamMap: Record<CoverageParam, CoverageType> = {
  "all-risk": "AllRisk",
  "tlo": "TLO",
};

export function buildCalculatorUrl(coverage?: CoverageParam): string {
  if (!coverage) return "/cek-premi";
  return `/cek-premi?coverage=${coverage}`;
}

/**
 * Parse URL searchParams and return internal CoverageType or null.
 * Returns null for empty/invalid params (no error thrown).
 */
export function parseCoverageParam(param: string | null | undefined): CoverageType | null {
  if (!param) return null;
  if (param === "all-risk") return coverageParamMap["all-risk"];
  if (param === "tlo") return coverageParamMap["tlo"];
  return null;
}
