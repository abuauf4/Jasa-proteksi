import { db } from "@/lib/db";
import { getCached } from "@/lib/ttl-cache";

const SITE_SETTINGS_TTL_MS = 5 * 60_000;

export interface CachedSiteSettings {
  whatsapp: string;
  whatsapp2: string;
  phone: string;
  email: string;
  address: string;
  googleAnalyticsId: string;
  metaPixelId: string;
  gtmId: string;
  maintenanceMode: boolean;
}

/**
 * Shared server-side cache for public site settings.
 * This keeps page rendering independent from repeated Supabase round-trips.
 * Admin changes become visible after at most 5 minutes.
 */
export async function getCachedSiteSettings(): Promise<CachedSiteSettings> {
  return getCached(
    "public-site-settings",
    "all",
    SITE_SETTINGS_TTL_MS,
    async () => {
      const rows = await db.siteSetting.findMany();
      const map: Record<string, string> = {};

      for (const row of rows) {
        map[row.key] = row.value;
      }

      return {
        whatsapp: map.whatsapp || "",
        whatsapp2: map.whatsapp2 || "",
        phone: map.phone || "",
        email: map.email || "",
        address: map.address || "",
        googleAnalyticsId: map.googleAnalyticsId || "",
        metaPixelId: map.metaPixelId || "",
        gtmId: map.gtmId || "",
        maintenanceMode: map.maintenanceMode === "true",
      };
    },
  );
}
