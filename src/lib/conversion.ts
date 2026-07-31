/**
 * Conversion tracking utility for Google Analytics & Meta Pixel.
 *
 * Usage:
 *   import { trackEvent } from "@/lib/conversion";
 *   trackEvent("lead", { method: "whatsapp" });
 *   trackEvent("contact", { form: "contact_form" });
 *
 * All events are pushed to both gtag (GA4) and fbq (Meta Pixel)
 * when their respective scripts are loaded.
 */

export type ConversionEvent =
  | "lead"
  | "contact"
  | "whatsapp_click"
  | "generate_lead"
  | "submit_application";

export interface ConversionParams {
  method?: string;
  value?: number;
  currency?: string;
  partner?: string;
  coverage?: string;
  vehicle?: string;
  [key: string]: string | number | undefined;
}

export function trackEvent(event: ConversionEvent, params?: ConversionParams) {
  if (typeof window === "undefined") return;

  // ─── DataLayer (GTM) ───
  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push({ event, ...params });

  // ─── Google Analytics 4 (gtag) ───
  if (typeof (window as any).gtag === "function") {
    const gtag = (window as any).gtag;
    switch (event) {
      case "lead":
      case "generate_lead":
        gtag("event", "generate_lead", {
          currency: params?.currency || "IDR",
          value: params?.value || 0,
          method: params?.method || "unknown",
          partner: params?.partner || "",
          coverage: params?.coverage || "",
          vehicle: params?.vehicle || "",
        });
        break;
      case "contact":
        gtag("event", "contact", {
          method: params?.method || "form",
          form_type: params?.form || "contact_form",
        });
        break;
      case "whatsapp_click":
        gtag("event", "whatsapp_click", {
          method: "whatsapp",
          event_category: "engagement",
          event_label: params?.method || "cta",
        });
        break;
      case "submit_application":
        gtag("event", "submit_application", {
          currency: params?.currency || "IDR",
          value: params?.value || 0,
          partner: params?.partner || "",
          coverage: params?.coverage || "",
        });
        break;
      default:
        gtag("event", event, params || {});
    }
  }

  // ─── Meta Pixel (fbq) ───
  if (typeof (window as any).fbq === "function") {
    const fbq = (window as any).fbq;
    switch (event) {
      case "lead":
      case "generate_lead":
        fbq("track", "Lead", {
          currency: params?.currency || "IDR",
          value: params?.value || 0,
          content_name: params?.partner || "",
          content_category: params?.coverage || "",
        });
        break;
      case "contact":
        fbq("track", "Contact", { content_name: params?.method || "form" });
        break;
      case "whatsapp_click":
        fbq("track", "Contact", { content_name: "WhatsApp", content_category: "CTA" });
        break;
      case "submit_application":
        fbq("track", "SubmitApplication", {
          currency: params?.currency || "IDR",
          value: params?.value || 0,
          content_name: params?.partner || "",
          content_category: params?.coverage || "",
        });
        break;
      default:
        fbq("trackCustom", event, params || {});
    }
  }
}
