import { Metadata } from "next";
import { db } from "@/lib/db";
import { ServerDataProvider, type SiteSettings, type HeroData } from "@/lib/ServerDataContext";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Container, Section, SectionHeader, Card } from "@/components/site/primitives";

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jasaproteksi.com";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description:
    "Kebijakan privasi Jasa Proteksi menjelaskan bagaimana data pengguna dikumpulkan, digunakan, dan dilindungi saat menggunakan platform simulasi premi asuransi mobil.",
  alternates: { canonical: `${SITE_URL}/kebijakan-privasi` },
  robots: { index: true, follow: true },
};

async function getSettings() {
  let initialSettings: SiteSettings = {
    whatsapp: "", whatsapp2: "", phone: "", email: "", address: "",
    googleAnalyticsId: "", metaPixelId: "", gtmId: "", adsenseId: "",
    googleAdsId: "", maintenanceMode: false,
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

export default async function PrivacyPage() {
  const { initialSettings, initialHero } = await getSettings();

  const sections: Array<{ title: string; body: string[] }> = [
    {
      title: "1. Pendahuluan",
      body: [
        "Kebijakan privasi ini menjelaskan bagaimana Jasa Proteksi mengumpulkan, menggunakan, dan melindungi data pribadi pengguna saat menggunakan platform simulasi premi asuransi mobil.",
        "Dengan menggunakan layanan ini, Anda menyetujui praktik yang dijelaskan dalam kebijakan ini. Jika Anda tidak setuju, mohon untuk tidak menggunakan layanan.",
      ],
    },
    {
      title: "2. Data yang Dikumpulkan",
      body: [
        "Pada tahap simulasi, kami mengumpulkan data kendaraan (merek, tipe, tahun, wilayah penggunaan), pilihan perlindungan (All Risk atau TLO), dan perluasan jaminan yang dipilih.",
        "Pada tahap pengajuan, kami meminta nama dan nomor WhatsApp untuk menghubungi Anda. Email bersifat opsional. Dokumen sensitif seperti KTP, STNK, atau dokumen lainnya hanya diminta pada tahap pengajuan resmi melalui alur yang aman.",
        "Kami juga mengumpulkan parameter atribusi seperti utm_source, utm_medium, utm_campaign, utm_term, utm_content, dan gclid untuk keperluan analisis kampanye pemasaran.",
      ],
    },
    {
      title: "3. Penggunaan Data",
      body: [
        "Data simulasi digunakan untuk menghitung estimasi premi berdasarkan tarif resmi. Data pengajuan digunakan untuk menghubungi Anda dan melanjutkan proses pengajuan kepada perusahaan asuransi terkait.",
        "Data atribusi kampanye digunakan untuk mengukur efektivitas iklan dan tidak dikaitkan dengan identitas pribadi Anda kecuali saat lead dikirim.",
      ],
    },
    {
      title: "4. Penyimpanan dan Keamanan",
      body: [
        "Data disimpan di infrastruktur cloud yang aman. Akses ke data dibatasi untuk personel yang berwenang. Kami menerapkan kontrol keamanan teknis dan organisasi yang wajar untuk melindungi data.",
        "Meskipun demikian, tidak ada metode transmisi atau penyimpanan elektronik yang sepenuhnya aman. Kami tidak dapat menjamin keamanan absolut.",
      ],
    },
    {
      title: "5. Pembagian Data kepada Pihak Ketiga",
      body: [
        "Data pengajuan dapat dibagikan kepada perusahaan asuransi terkait untuk keperluan penerbitan polis. Kami tidak menjual data pribadi Anda kepada pihak ketiga.",
        "Kami menggunakan layanan pihak ketiga seperti Google Analytics, Google Tag Manager, dan Meta Pixel untuk analisis. Layanan ini memiliki kebijakan privasi masing-masing.",
      ],
    },
    {
      title: "6. Hak Pengguna",
      body: [
        "Anda berhak untuk meminta akses, perbaikan, atau penghapusan data pribadi yang telah Anda berikan. Hubungi kami melalui informasi kontak yang tersedia untuk menggunakan hak ini.",
        "Anda dapat menolak pengumpulan data atribusi kampanye dengan menonaktifkan cookie di browser Anda.",
      ],
    },
    {
      title: "7. Perubahan Kebijakan",
      body: [
        "Kebijakan ini dapat diperbarui sewaktu-waktu. Perubahan akan dipublikasikan di halaman ini. Penggunaan layanan setelah perubahan dianggap sebagai persetujuan terhadap kebijakan yang diperbarui.",
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
                title="Kebijakan Privasi"
                description="Bagaimana Jasa Proteksi mengumpulkan, menggunakan, dan melindungi data pengguna."
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
                  Kebijakan ini terakhir diperbarui pada {new Date().getFullYear()}.
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
