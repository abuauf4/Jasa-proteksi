"use client";

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";

// ─── Types ───

interface SiteSettings {
  whatsapp: string;
  whatsapp2: string;
  phone: string;
  email: string;
  address: string;
  googleAnalyticsId: string;
  metaPixelId: string;
  gtmId: string;
  adsenseId: string;
  maintenanceMode: boolean;
}

interface HeroData {
  tagline: string;
  subtext: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage: string | null;
}

interface ServerData {
  settings: SiteSettings;
  hero: HeroData | null;
  ctaWhatsApp: string;
}

// ─── Context ───

const ServerDataContext = createContext<ServerData | null>(null);

// ─── CTA WhatsApp rotation helper ───
// Picks WA1 or WA2 with 50/50 random split, persisted in sessionStorage
// so the user always chats with the same number within a browser session.
function pickCtaWhatsApp(wa1: string, wa2: string): string {
  // If only one number exists, use it
  if (!wa1) return wa2;
  if (!wa2) return wa1;

  // Check session storage for previous assignment
  try {
    const stored = sessionStorage.getItem("cta_wa");
    if (stored === wa1 || stored === wa2) return stored;
  } catch {
    // sessionStorage unavailable — fall through
  }

  // Random 50/50 assignment
  const chosen = Math.random() < 0.5 ? wa1 : wa2;
  try { sessionStorage.setItem("cta_wa", chosen); } catch {}
  return chosen;
}

// ─── Provider ───

export function ServerDataProvider({
  children,
  initialSettings,
  initialHero,
}: {
  children: ReactNode;
  initialSettings: SiteSettings;
  initialHero: HeroData | null;
}) {
  // Compute ctaWhatsApp once at the Provider level — shared by all consumers.
  // On the server (SSR), sessionStorage is unavailable so we fall back to WA1.
  // On the client, useEffect re-runs the pick with sessionStorage access.
  const [ctaWhatsApp, setCtaWhatsApp] = useState(() => {
    // On server / first render, pick WA1 as default (no sessionStorage yet)
    return initialSettings.whatsapp || "";
  });

  useEffect(() => {
    // On client, re-pick with sessionStorage access
    const chosen = pickCtaWhatsApp(initialSettings.whatsapp, initialSettings.whatsapp2);
    setCtaWhatsApp(chosen);
  }, [initialSettings.whatsapp, initialSettings.whatsapp2]);

  const value: ServerData = {
    settings: initialSettings,
    hero: initialHero,
    ctaWhatsApp,
  };

  return (
    <ServerDataContext.Provider value={value}>
      {children}
    </ServerDataContext.Provider>
  );
}

// ─── Hooks ───

// Empty settings used during loading — never shows stale/hardcoded data
const EMPTY_SETTINGS: SiteSettings = {
  whatsapp: "",
  whatsapp2: "",
  phone: "",
  email: "",
  address: "",
  googleAnalyticsId: "",
  metaPixelId: "",
  gtmId: "",
  adsenseId: "",
  maintenanceMode: false,
};

// Default settings used as fallback when DB/API fails
const DEFAULT_SETTINGS: SiteSettings = {
  whatsapp: "6285282297399",
  whatsapp2: "6288972252907",
  phone: "",
  email: "jasaglobalproteksi@gmail.com",
  address: "Jl. Jalur Sutera Tim., RT.001/RW.015, Kunciran, Kec. Pinang, Kota Tangerang, Banten 15143",
  googleAnalyticsId: "",
  metaPixelId: "",
  gtmId: "",
  adsenseId: "",
  maintenanceMode: false,
};

// Module-level cache for API-fetched settings (used when server data not available)
let cachedSettings: SiteSettings | null = null;
let fetchPromise: Promise<SiteSettings> | null = null;

async function fetchSettings(): Promise<SiteSettings> {
  if (cachedSettings) return cachedSettings;
  if (fetchPromise) return fetchPromise;

  fetchPromise = fetch("/api/site-settings")
    .then((res) => res.json())
    .then((data) => {
      const map = data.map || {};
      cachedSettings = {
        whatsapp: map.whatsapp || DEFAULT_SETTINGS.whatsapp,
        whatsapp2: map.whatsapp2 || "6288972252907",
        phone: map.phone || "",
        email: map.email || DEFAULT_SETTINGS.email,
        address: map.address || DEFAULT_SETTINGS.address,
        googleAnalyticsId: map.googleAnalyticsId || "",
        metaPixelId: map.metaPixelId || "",
        gtmId: map.gtmId || "",
        adsenseId: map.adsenseId || "",
        maintenanceMode: map.maintenanceMode === "true",
      };
      return cachedSettings;
    })
    .catch(() => DEFAULT_SETTINGS)
    .finally(() => {
      fetchPromise = null;
    });

  return fetchPromise;
}

/**
 * useSiteSettings — Returns site settings with NO flash of hardcoded data.
 *
 * Priority:
 * 1. Server-provided data (from ServerDataContext) → instant, no API call needed
 * 2. Module-level cache → instant, no API call needed
 * 3. Client-side API fetch → async, brief loading state
 *
 * During loading, returns EMPTY_SETTINGS (all empty strings).
 * Components should check `loading` or `settings.whatsapp` before rendering.
 */
export function useSiteSettings() {
  const serverData = useContext(ServerDataContext);
  const [settings, setSettings] = useState<SiteSettings | null>(() => {
    // If server provided data, use it immediately — no flash!
    if (serverData?.settings?.whatsapp) return serverData.settings;
    // If module cache exists, use it — no flash!
    if (cachedSettings) return cachedSettings;
    return null;
  });
  const [loading, setLoading] = useState(() => {
    // Already have data? Not loading.
    if (serverData?.settings?.whatsapp || cachedSettings) return false;
    return true;
  });

  useEffect(() => {
    // Skip API call if server already provided settings (whatsapp present).
    // This is the critical fix — previously the guard checked the local
    // `settings` state which could be null on first render even when server
    // data was available, causing duplicate /api/site-settings fetches.
    if (serverData?.settings?.whatsapp) return;
    if (cachedSettings) return;
    if (settings && settings.whatsapp) return;

    fetchSettings().then((data) => {
      setSettings(data);
      setLoading(false);
    });
  }, [serverData, settings]);

  // Read ctaWhatsApp from context (computed once by Provider)
  const ctaWhatsApp = serverData?.ctaWhatsApp || settings?.whatsapp || "";

  // During loading, return EMPTY settings (no hardcoded values leak)
  return { settings: settings ?? EMPTY_SETTINGS, loading, ctaWhatsApp };
}

/**
 * useHeroData — Returns hero content with NO flash.
 *
 * Priority:
 * 1. Server-provided data (from ServerDataContext) → instant
 * 2. Client-side API fetch → async
 */
export function useHeroData() {
  const serverData = useContext(ServerDataContext);
  const [heroData, setHeroData] = useState<HeroData | null>(() => {
    return serverData?.hero ?? null;
  });
  const [heroLoading, setHeroLoading] = useState(() => {
    return !serverData?.hero;
  });

  useEffect(() => {
    // Skip API call if server already provided hero data
    if (serverData?.hero) {
      setHeroLoading(false);
      return;
    }
    if (heroData) {
      setHeroLoading(false);
      return;
    }

    const fetchHero = async () => {
      try {
        const res = await fetch("/api/hero");
        if (res.ok) {
          const data = await res.json();
          setHeroData(data);
        }
      } catch {
        // Use translation defaults on error
      }
      setHeroLoading(false);
    };
    fetchHero();
  }, [serverData, heroData]);

  return { heroData, heroLoading };
}

// For server-side or one-off usage
export { fetchSettings, DEFAULT_SETTINGS };
export type { SiteSettings, HeroData };
