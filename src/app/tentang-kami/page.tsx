import { Metadata } from "next";
import { db } from "@/lib/db";
import { ServerDataProvider, type SiteSettings, type HeroData } from "@/lib/ServerDataContext";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { MobileStickyCTA } from "@/components/site/MobileStickyCTA";
import { Container, Section, SectionHeader, Card } from "@/components/site/primitives";
import { Button } from "@/components/site/Button";
import { Mail, MessageCircle, Phone, MapPin, Calculator, BookOpen, Database, ShieldCheck } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/format";

export const revalidate = 300;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jasaproteksi.com";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Jasa Proteksi adalah platform simulasi premi dan pengajuan asuransi mobil All Risk atau TLO secara online. Pelajari posisi dan ruang lingkup layanan kami.",
  alternates: { canonical: `${SITE_URL}/tentang-kami` },
  openGraph: {
    title: "Tentang Kami — Jasa Proteksi",
    description: "Platform simulasi premi dan pengajuan asuransi mobil All Risk atau TLO secara online.",
    url: `${SITE_URL}/tentang-kami`,
    siteName: "Jasa Proteksi",
    locale: "id_ID",
    type: "website",
  },
};

async function getSettings() {
  let initialSettings: SiteSettings = {
    whatsapp: "", whatsapp2: "", phone: "", email: "", address: "",
    googleAnalyticsId: "", metaPixelId: "", gtmId: "", maintenanceMode: false,
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
      gtmId: map.gtmId || "", maintenanceMode: map.maintenanceMode === "true",
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

export default async function TentangKamiPage() {
  const { initialSettings, initialHero } = await getSettings();
  const settings = initialSettings;

  const contactItems: Array<{ icon: typeof Mail; label: string; value: string; href?: string }> = [];
  if (settings.whatsapp) {
    contactItems.push({
      icon: MessageCircle,
      label: "WhatsApp",
      value: settings.whatsapp,
      href: buildWhatsAppLink(settings.whatsapp, "Halo Jasa Proteksi, saya ingin bertanya."),
    });
  }
  if (settings.email) contactItems.push({ icon: Mail, label: "Email", value: settings.email, href: `mailto:${settings.email}` });
  if (settings.phone) contactItems.push({ icon: Phone, label: "Telepon", value: settings.phone, href: `tel:${settings.phone}` });
  if (settings.address) contactItems.push({ icon: MapPin, label: "Alamat", value: settings.address });

  return (
    <ServerDataProvider initialSettings={initialSettings} initialHero={initialHero}>
      <div className="flex min-h-screen flex-col bg-white">
        <SiteHeader />
        <main className="flex-1">
          <Section tone="white">
            <Container className="max-w-3xl">
              <SectionHeader
                eyebrow="Tentang Kami"
                title="Kenali Layanan Jasa Proteksi"
                description="Posisi dan ruang lingkup layanan Jasa Proteksi dijelaskan secara transparan."
              />

              <Card variant="lg" className="mt-8">
                <p className="ds-body-lg leading-relaxed">
                  Jasa Proteksi menyediakan layanan simulasi premi dan membantu pengguna
                  memahami serta melanjutkan proses pengajuan asuransi mobil. Polis, manfaat,
                  dan ketentuan pertanggungan diterbitkan oleh perusahaan asuransi terkait.
                </p>
              </Card>

              <section id="editorial" className="mt-10 scroll-mt-24">
                <SectionHeader
                  eyebrow="Editorial"
                  title="Cara Kami Menyajikan Informasi"
                  description="Kami berusaha membuat informasi simulasi dan panduan tetap jelas, transparan, dan sesuai dengan data yang digunakan pada platform."
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                  <Card className="flex flex-col gap-2">
                    <span className="w-9 h-9 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#0F766E]">
                      <Database className="h-4 w-4" aria-hidden />
                    </span>
                    <h2 className="text-sm font-semibold text-[#0F172A]">Berbasis Data Platform</h2>
                    <p className="text-xs text-[#64748B] leading-relaxed">
                      Panduan menjelaskan produk, faktor premi, dan fitur yang tersedia berdasarkan
                      informasi serta data yang digunakan pada platform Jasa Proteksi.
                    </p>
                  </Card>

                  <Card className="flex flex-col gap-2">
                    <span className="w-9 h-9 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#0F766E]">
                      <BookOpen className="h-4 w-4" aria-hidden />
                    </span>
                    <h2 className="text-sm font-semibold text-[#0F172A]">Tanggal Pembaruan Jelas</h2>
                    <p className="text-xs text-[#64748B] leading-relaxed">
                      Artikel panduan menampilkan waktu pembaruan agar pembaca dapat melihat
                      kapan materi terakhir diperbarui pada website.
                    </p>
                  </Card>

                  <Card className="flex flex-col gap-2">
                    <span className="w-9 h-9 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#0F766E]">
                      <ShieldCheck className="h-4 w-4" aria-hidden />
                    </span>
                    <h2 className="text-sm font-semibold text-[#0F172A]">Batas Layanan Transparan</h2>
                    <p className="text-xs text-[#64748B] leading-relaxed">
                      Simulasi merupakan estimasi awal. Premi, manfaat, syarat, dan ketentuan akhir
                      mengikuti quotation serta polis perusahaan asuransi terkait.
                    </p>
                  </Card>
                </div>
              </section>

              {contactItems.length > 0 && (
                <div className="mt-8">
                  <h2 className="ds-h3 mb-4">Kontak</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {contactItems.map((item) => (
                      <Card key={item.label} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#0F766E]">
                          <item.icon className="h-4 w-4" aria-hidden />
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs text-[#64748B]">{item.label}</p>
                          {item.href ? (
                            <a
                              href={item.href}
                              target={item.href.startsWith("http") ? "_blank" : undefined}
                              rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                              className="text-sm font-semibold text-[#0F172A] hover:text-[#0F766E] break-words"
                            >
                              {item.value}
                            </a>
                          ) : (
                            <p className="text-sm font-semibold text-[#0F172A] break-words">{item.value}</p>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-10 text-center">
                <Button as="link" href="/#kalkulator" variant="primary" size="lg">
                  <Calculator className="h-4 w-4" aria-hidden />
                  Mulai Hitung Premi
                </Button>
              </div>
            </Container>
          </Section>
        </main>
        <SiteFooter />
        <MobileStickyCTA />
      </div>
    </ServerDataProvider>
  );
}
