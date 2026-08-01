/**
 * Currency & date formatting helpers — Indonesian locale.
 */

/**
 * Format a number as Indonesian Rupiah, e.g. 4250000 → "Rp4.250.000".
 * Uses Intl.NumberFormat for correct grouping separators.
 */
export function formatIDR(value: number | undefined | null): string {
  if (value === undefined || value === null || Number.isNaN(value)) return "Rp0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format a number with thousand separators but no currency symbol.
 */
export function formatNumber(value: number | undefined | null): string {
  if (value === undefined || value === null || Number.isNaN(value)) return "0";
  return new Intl.NumberFormat("id-ID").format(value);
}

/**
 * Format a percentage value (already in 0-100 scale), e.g. 25 → "25%".
 */
export function formatPercent(value: number | undefined | null): string {
  if (value === undefined || value === null || Number.isNaN(value)) return "0%";
  return `${value}%`;
}

/**
 * Format a rate value (decimal, e.g. 0.0250) as a percentage with 4 decimals.
 * e.g. 0.0250 → "2.5000%"
 */
export function formatRate(value: number | undefined | null): string {
  if (value === undefined || value === null || Number.isNaN(value)) return "0%";
  return `${(value * 100).toFixed(4)}%`;
}

/**
 * Format an ISO date string as a human-readable Indonesian date.
 */
export function formatDateID(iso: string | Date | null | undefined): string {
  if (!iso) return "";
  const d = typeof iso === "string" ? new Date(iso) : iso;
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

/**
 * Build a WhatsApp deep link with a pre-filled, URL-encoded message.
 */
export function buildWhatsAppLink(phone: string, message: string): string {
  // Strip non-digits from phone (handles "+62 852-xxx" etc.)
  const clean = (phone || "").replace(/[^\d]/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}
