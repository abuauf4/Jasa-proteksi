import { Metadata } from "next";
import { db } from "@/lib/db";
import HasilSimulasiClient from "./HasilSimulasiClient";

export const revalidate = 0; // Always dynamic — result is user-specific

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jasaproteksi.com";

export const metadata: Metadata = {
  title: "Hasil Simulasi Premi",
  description: "Estimasi premi asuransi mobil berdasarkan data kendaraan dan wilayah penggunaan.",
  alternates: { canonical: `${SITE_URL}/hasil-simulasi` },
  robots: { index: false, follow: false }, // Noindex — user-specific result page
};

async function getSettings() {
  let initialSettings = {
    whatsapp: "", whatsapp2: "", phone: "", email: "", address: "",
    googleAnalyticsId: "", metaPixelId: "", gtmId: "", adsenseId: "", maintenanceMode: false,
  };
  let initialHero: any = null;
  try {
    const [settingsRows, heroRow] = await Promise.all([
      db.siteSetting.findMany(),
      db.heroContent.findFirst(),
    ]);
    const map: Record<string, string> = {};
    for (const s of settingsRows) map[s.key] = s.value;
    initialSettings = {
      whatsapp: map.whatsapp || "", whatsapp2: map.whatsapp2 || "",
      phone: map.phone || "", email: map.email || "", address: map.address || "",
      googleAnalyticsId: map.googleAnalyticsId || "", metaPixelId: map.metaPixelId || "",
      gtmId: map.gtmId || "", adsenseId: map.adsenseId || "", maintenanceMode: map.maintenanceMode === "true",
    };
    if (heroRow) {
      initialHero = {
        tagline: heroRow.tagline, subtext: heroRow.subtext,
        ctaText: heroRow.ctaText, ctaLink: heroRow.ctaLink,
        backgroundImage: heroRow.backgroundImage,
      };
    }
  } catch { /* defaults */ }
  return { initialSettings, initialHero };
}

export default async function HasilSimulasiPage() {
  const { initialSettings, initialHero } = await getSettings();
  return <HasilSimulasiClient initialSettings={initialSettings} initialHero={initialHero} />;
}
