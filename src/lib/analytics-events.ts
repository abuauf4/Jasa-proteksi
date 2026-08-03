/**
 * Analytics events helper for Google Ads / GTM / GA4 / Meta Pixel readiness.
 *
 * Events are pushed to dataLayer (GTM), gtag (GA4), and fbq (Meta Pixel) if present.
 * Events are NEVER auto-marked as conversions — conversion flags must be wired
 * in GTM/GA4 admin separately.
 *
 * Required events per the spec:
 *   view_calculator, calculator_start, calculator_step_complete, calculator_error,
 *   calculation_complete, view_result, lead_form_start, lead_submit,
 *   whatsapp_click, phone_click, apply_click
 *
 * IMPORTANT: lead_submit only fires AFTER server confirms the lead was stored.
 *            calculation_complete only fires AFTER the engine returns a result.
 */

export type AnalyticsEventName =
  | "view_calculator"
  | "calculator_start"
  | "calculator_step_complete"
  | "calculator_error"
  | "calculation_complete"
  | "view_result"
  | "lead_form_start"
  | "lead_submit"
  | "whatsapp_click"
  | "phone_click"
  | "apply_click";

export interface AnalyticsParams {
  step?: number;
  step_name?: string;
  coverage_type?: "AllRisk" | "TLO" | "Comprehensive";
  vehicle_brand?: string;
  vehicle_year?: number;
  wilayah?: number;
  estimated_premium?: number;
  error_message?: string;
  lead_id?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  [key: string]: string | number | boolean | undefined;
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    /** Google Ads conversion config set by AnalyticsScripts */
    __googleAdsConversion?: { id: string; label: string };
  }
}

/**
 * Track a single event across all configured analytics providers.
 * Safe to call on the server (no-op) and during SSR (no-op).
 */
export function trackEvent(name: AnalyticsEventName, params: AnalyticsParams = {}): void {
  if (typeof window === "undefined") return;

  // Merge in UTM/gclid session params so every event carries attribution.
  const attribution = getAttribution();
  const merged: AnalyticsParams = { ...attribution, ...params };

  // 1. GTM dataLayer
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: name, ...merged });
  }

  // 2. GA4 gtag
  if (typeof window.gtag === "function") {
    window.gtag("event", name, merged);
  }

  // 2b. Google Ads Conversion — fire on whatsapp_click / apply_click
  if (
    (name === "whatsapp_click" || name === "apply_click") &&
    typeof window.gtag === "function" &&
    window.__googleAdsConversion?.id
  ) {
    const conv = window.__googleAdsConversion;
    const sendTo = conv.label ? `${conv.id}/${conv.label}` : conv.id;
    window.gtag("event", "conversion", { send_to: sendTo });
  }

  // 3. Meta Pixel fbq (trackCustom for non-standard events)
  if (typeof window.fbq === "function") {
    window.fbq("trackCustom", name, merged);
  }

  // 4. Debug in dev
  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", name, merged);
  }
}

/* ───────────────────────────────────────────────────────
   UTM / gclid session persistence
   ─────────────────────────────────────────────────────── */

const ATTRIBUTION_KEY = "jp_attribution";
const ATTRIBUTION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

interface AttributionData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  captured_at: number;
}

/**
 * Capture UTM and gclid params from the current URL into session storage.
 * Call this once on page load (top of layout or analytics script).
 * - Only overwrites existing values when new ones are present.
 * - Persists across navigation within the same session.
 */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    const url = new URL(window.location.href);
    const params = url.searchParams;

    const incoming: Partial<Record<keyof AttributionData, string>> = {};
    const keys: (keyof AttributionData)[] = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "gclid",
    ];
    let hasNew = false;
    for (const k of keys) {
      const v = params.get(k);
      if (v) {
        incoming[k] = v;
        hasNew = true;
      }
    }

    if (!hasNew) return;

    const existing = readAttribution();
    const merged: AttributionData = {
      ...existing,
      ...incoming,
      captured_at: Date.now(),
    };

    sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(merged));
  } catch {
    // sessionStorage might be unavailable (private mode) — fail silently.
  }
}

function readAttribution(): AttributionData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(ATTRIBUTION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AttributionData;
    if (Date.now() - parsed.captured_at > ATTRIBUTION_TTL_MS) {
      sessionStorage.removeItem(ATTRIBUTION_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Get the current attribution for sending with lead submissions and events.
 */
export function getAttribution(): Partial<AttributionData> {
  const data = readAttribution();
  if (!data) return {};
  return {
    utm_source: data.utm_source,
    utm_medium: data.utm_medium,
    utm_campaign: data.utm_campaign,
    utm_term: data.utm_term,
    utm_content: data.utm_content,
    gclid: data.gclid,
  };
}
