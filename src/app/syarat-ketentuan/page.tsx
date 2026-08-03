import { Metadata } from "next";
import { db } from "@/lib/db";
import { ServerDataProvider, type SiteSettings, type HeroData } from "@/lib/ServerDataContext";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Container, Section, SectionHeader, Card } from "@/components/site/primitives";

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jasaproteksi.com";

export const metadata: Metadata = {
  title: "Syarat dan Ketentuan",
  description:
    "Syarat dan ketentuan penggunaan platform simulasi premi asuransi mobil Jasa Proteksi.",
  alternates: { canonical: `${SITE_URL}/syarat-ketentuan` },
  robots: { index: true, follow: true },
};

async function getSettings() {
  let initialSettings: SiteSettings = {
    whatsapp: "", whatsapp2: "", phone: "", email: "", address: "",
    googleAnalyticsId: "", metaPixelId: "", gtmId: "", adsenseId: "",
    googleAdsId: "",
    googleAdsLabel: "", maintenanceMode: false,
  };
  let initialHero: HeroData | null = null;
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

export default async function TermsPage() {
  const { initialSettings, initialHero } = await getSettings();

  const sections: Array<{ title: string; body: string[] }> = [
    {
      title: "1. Penerimaan Ketentuan",
      body: [
        "Dengan mengakses dan menggunakan platform Jasa Proteksi, Anda menyetujui untuk terikat oleh syarat dan ketentuan ini. Jika Anda tidak menyetujui, mohon untuk tidak menggunakan layanan.",
      ],
    },
    {
      title: "2. Definisi Layanan",
      body: [
        "Jasa Proteksi adalah platform simulasi premi dan pengajuan asuransi mobil All Risk atau TLO secara online. Layanan mencakup kalkulator estimasi premi dan bantuan proses pengajuan kepada perusahaan asuransi terkait.",
        "Jasa Proteksi bukan perusahaan asuransi dan tidak menerbitkan polis. Polis, manfaat, dan ketentuan pertanggungan diterbitkan oleh perusahaan asuransi terkait.",
      ],
    },
    {
      title: "3. Estimasi Premi",
      body: [
        "Hasil simulasi premi merupakan estimasi awal yang dihitung berdasarkan data kendaraan, wilayah penggunaan, jenis perlindungan, dan perluasan jaminan yang dipilih. Estimasi ini bukan harga final.",
        "Premi, manfaat, syarat, dan ketentuan akhir mengikuti proses verifikasi serta quotation dari perusahaan asuransi penerbit polis.",
      ],
    },
    {
      title: "4. Tanggung Jawab Pengguna",
      body: [
        "Anda bertanggung jawab atas keakuratan data yang dimasukkan dalam simulasi. Data yang tidak akurat dapat menghasilkan estimasi premi yang tidak sesuai.",
        "Anda setuju untuk menggunakan layanan ini secara sah dan tidak menyalahgunakan untuk tujuan yang melanggar hukum.",
      ],
    },
    {
      title: "5. Batasan Tanggung Jawab",
      body: [
        "Jasa Proteksi tidak bertanggung jawab atas perbedaan antara estimasi premi hasil simulasi dengan premi final yang ditetapkan oleh perusahaan asuransi penerbit polis.",
        "Jasa Proteksi tidak menjamin penerimaan pengajuan. Keputusan penerimaan dan penentuan premi final berada pada perusahaan asuransi penerbit polis.",
      ],
    },
    {
      title: "6. Perubahan Layanan",
      body: [
        "Jasa Proteksi berhak mengubah, menangguhkan, atau menghentikan layanan sewaktu-waktu tanpa pemberitahuan terlebih dahulu. Perubahan syarat dan ketentuan akan dipublikasikan di halaman ini.",
      ],
    },
    {
      title: "7. Hukum yang Berlaku",
      body: [
        "Syarat dan ketentuan ini diatur oleh hukum Republik Indonesia. Setiap perselisihan akan diselesaikan berdasarkan hukum yang berlaku.",
      ],
    },
  ];

  return (
    <ServerDataProvider initialSettings={initialSettings} initialHero={initialHero}>
      <div className="flex min-h-screen flex-col bg-white">
        <SiteHeader />
        <main className="flex-1">
          <Section tone="white">
            <Container className="max-w-3xl">
              <SectionHeader
                eyebrow="Legal"
                title="Syarat dan Ketentuan"
                description="Ketentuan penggunaan platform simulasi premi asuransi mobil Jasa Proteksi."
              />

              <div className="mt-8 flex flex-col gap-5">
                {sections.map((section) => (
                  <Card key={section.title}>
                    <h2 className="ds-h4 mb-2">{section.title}</h2>
                    <div className="flex flex-col gap-3">
                      {section.body.map((para, idx) => (
                        <p key={idx} className="text-sm text-[#475569] leading-relaxed">
                          {para}
                        </p>
                      ))}
                    </div>
                  </Card>
                ))}

                <p className="text-xs text-[#64748B] text-center mt-4">
                  Syarat dan ketentuan ini terakhir diperbarui pada {new Date().getFullYear()}.
                </p>
              </div>
            </Container>
          </Section>
        </main>
        <SiteFooter />
      </div>
    </ServerDataProvider>
  );
}
