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
   Unified WhatsApp Click Tracking + Google Ads Conversion
   ─────────────────────────────────────────────────────── */

export interface WhatsAppClickParams extends AnalyticsParams {
  /** Where the click originated — e.g. "floating_button", "premium_result", "hero_cta" */
  method?: string;
}

/* ───────────────────────────────────────────────────────
   Google Ads Conversion — hardcoded configuration
   Works without admin panel / database.
   ─────────────────────────────────────────────────────── */

/** Google Ads conversion ID — hardcoded so it always works. */
const GOOGLE_ADS_CONVERSION_ID = "AW-16916570758";
/** Google Ads conversion label. */
const GOOGLE_ADS_CONVERSION_LABEL = "gibwCN7d_9ocEIbFuYI_";
/** Full send_to string for gtag conversion event. */
const GOOGLE_ADS_SEND_TO = `${GOOGLE_ADS_CONVERSION_ID}/${GOOGLE_ADS_CONVERSION_LABEL}`;
/** Fallback timeout (ms) — opens WhatsApp if gtag event_callback never fires. */
const CONVERSION_FALLBACK_MS = 1000;

/**
 * Unified helper for ALL WhatsApp click tracking.
 *
 * This function:
 *  1. Fires `trackEvent("whatsapp_click", params)` → dataLayer + GA4 + Meta Pixel
 *  2. Fires `gtag('event', 'conversion', { send_to: 'AW-XXXXX/LABEL' })` for Google Ads
 *
 * The Google Ads conversion uses hardcoded ID/label — it does NOT depend on
 * site settings or the database. It fires on EVERY WhatsApp click.
 *
 * IMPORTANT: This function is synchronous and does NOT handle navigation.
 * Use `openWhatsAppWithConversion()` instead for the full pattern that
 * fires conversion with event_callback before opening WhatsApp.
 */
export function trackWhatsAppClick(params: WhatsAppClickParams = {}): void {
  if (typeof window === "undefined") return;

  // 1. Fire standard analytics event
  trackEvent("whatsapp_click", params);

  // 2. Fire Google Ads conversion (hardcoded — always active)
  if (typeof window.gtag === "function") {
    window.gtag("event", "conversion", {
      send_to: GOOGLE_ADS_SEND_TO,
    });

    if (process.env.NODE_ENV === "development") {
      console.debug("[analytics] google_ads_conversion", GOOGLE_ADS_SEND_TO);
    }
  }
}

/**
 * Open WhatsApp URL with Google Ads conversion tracking.
 *
 * Fires `gtag('event', 'conversion', { send_to, event_callback })` where the
 * callback opens WhatsApp. A fallback timeout (1 s) ensures WhatsApp still
 * opens if gtag never calls back (ad blocker, network error).
 *
 * Guarantees:
 * - Conversion request is queued BEFORE WhatsApp navigation.
 * - Exactly one navigation per call (one-shot guard).
 * - No PII sent to Google — only the conversion ID + label.
 * - Does NOT fire on page load — only on explicit user click.
 *
 * Callers MUST call `e.preventDefault()` on the click event to prevent
 * the `<a href>` from navigating directly.
 */
export function openWhatsAppWithConversion(
  url: string,
  params: WhatsAppClickParams = {},
): void {
  if (typeof window === "undefined") return;

  // 1. Fire standard analytics event (dataLayer + GA4 + Meta Pixel)
  trackEvent("whatsapp_click", params);

  // 2. One-shot navigation guard — prevents double open
  let navigated = false;
  const navigate = (): void => {
    if (navigated) return;
    navigated = true;
    const w = window.open(url, "_blank", "noopener,noreferrer");
    // If popup blocked, fall back to location.href
    if (!w || w.closed) {
      window.location.href = url;
    }
  };

  // 3. Fire Google Ads conversion with event_callback
  if (typeof window.gtag === "function") {
    const fallbackTimer = setTimeout(navigate, CONVERSION_FALLBACK_MS);
    window.gtag("event", "conversion", {
      send_to: GOOGLE_ADS_SEND_TO,
      event_callback: () => {
        clearTimeout(fallbackTimer);
        navigate();
      },
    });

    if (process.env.NODE_ENV === "development") {
      console.debug(
        "[analytics] google_ads_conversion → event_callback set",
        GOOGLE_ADS_SEND_TO,
      );
    }
  } else {
    // gtag not loaded (ad blocker, script error) — navigate directly
    navigate();
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
