import { Metadata } from "next";
import { ServerDataProvider } from "@/lib/ServerDataContext";
import { getCachedSiteSettings } from "@/lib/site-data-cache";
import PengajuanClient from "./PengajuanClient";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jasaproteksi.com";

export const metadata: Metadata = {
  title: "Pengajuan Asuransi Mobil",
  description: "Form pengajuan asuransi mobil setelah simulasi premi.",
  alternates: { canonical: `${SITE_URL}/pengajuan` },
  robots: { index: false, follow: false },
};

export default async function PengajuanPage() {
  const initialSettings = await getCachedSiteSettings();

  return (
    <ServerDataProvider initialSettings={initialSettings} initialHero={null}>
      <PengajuanClient />
    </ServerDataProvider>
  );
}
