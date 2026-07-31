import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import AnalyticsScripts from "@/components/AnalyticsScripts";
import MaintenanceGuard from "@/components/shared/MaintenanceGuard";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { db } from "@/lib/db";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jasaproteksi.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Hitung Premi Asuransi Mobil Secara Online | Jasa Proteksi",
    template: "%s | Jasa Proteksi",
  },
  description:
    "Platform simulasi premi asuransi mobil All Risk dan TLO online. Dapatkan estimasi otomatis berdasarkan data kendaraan dan wilayah penggunaan. Gratis, tanpa biaya.",
  keywords: [
    "asuransi mobil",
    "premi asuransi mobil",
    "cek premi mobil",
    "simulasi asuransi mobil",
    "asuransi mobil All Risk",
    "asuransi mobil TLO",
    "hitung premi asuransi mobil",
    "estimasi premi asuransi mobil",
    "asuransi mobil online",
    "Jasa Proteksi",
  ],
  authors: [{ name: "Jasa Proteksi" }],
  creator: "Jasa Proteksi",
  publisher: "Jasa Proteksi",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Hitung Premi Asuransi Mobil Secara Online | Jasa Proteksi",
    description:
      "Platform simulasi premi asuransi mobil All Risk dan TLO online. Estimasi otomatis berdasarkan data kendaraan dan wilayah penggunaan.",
    type: "website",
    url: SITE_URL,
    siteName: "Jasa Proteksi",
    locale: "id_ID",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Jasa Proteksi — Platform Simulasi Premi Asuransi Mobil",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hitung Premi Asuransi Mobil Secara Online | Jasa Proteksi",
    description:
      "Platform simulasi premi asuransi mobil All Risk dan TLO online. Estimasi otomatis berdasarkan data kendaraan.",
    images: ["/og-image.webp"],
  },
  icons: {
    icon: "/logo-jasa-proteksi.webp",
    apple: "/logo-jasa-proteksi.webp",
  },
  category: "insurance",
  manifest: "/manifest.webmanifest",
};

/**
 * JSON-LD Structured Data.
 *
 * NOTE: We use Organization (general) instead of InsuranceAgency because the
 * business status (broker license / OJK registration) has not been verified.
 * Once verified with documentation, this can be upgraded to InsuranceAgency.
 * We also avoid Review/AggregateRating/Product pricing schemas per the spec.
 */
async function JsonLd() {
  let whatsapp = "";
  let email = "";
  let address = "";
  try {
    const settings = await db.siteSetting.findMany();
    const map: Record<string, string> = {};
    for (const s of settings) {
      map[s.key] = s.value;
    }
    whatsapp = map.whatsapp || "";
    email = map.email || "";
    address = map.address || "";
  } catch {
    // Use empty defaults on DB error
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Jasa Proteksi",
        url: SITE_URL,
        logo: `${SITE_URL}/logo-jasa-proteksi.webp`,
        image: `${SITE_URL}/og-image.webp`,
        description:
          "Platform simulasi premi dan pengajuan asuransi mobil All Risk atau TLO secara online.",
        ...(whatsapp ? { telephone: `+${whatsapp}` } : {}),
        ...(email ? { email } : {}),
        ...(address ? { address: { "@type": "PostalAddress", streetAddress: address } } : {}),
        areaServed: { "@type": "Country", name: "Indonesia" },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Jasa Proteksi",
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "id",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Service",
        "@id": `${SITE_URL}/#service`,
        name: "Simulasi Premi Asuransi Mobil",
        serviceType: "Simulasi premi asuransi mobil",
        provider: { "@id": `${SITE_URL}/#organization` },
        areaServed: { "@type": "Country", name: "Indonesia" },
        description:
          "Platform simulasi premi asuransi mobil All Risk atau TLO berdasarkan data kendaraan dan wilayah penggunaan.",
        offers: {
          "@type": "Offer",
          availability: "https://schema.org/InStock",
          priceSpecification: {
            "@type": "PriceSpecification",
            priceCurrency: "IDR",
            price: 0,
          },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Beranda",
            item: SITE_URL,
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="overflow-x-hidden">
      <head>
        <JsonLd />
      </head>
      <body
        className={`${plusJakarta.variable} antialiased bg-white text-[#475569] font-[family-name:var(--font-plus-jakarta)] overflow-x-hidden`}
      >
        <LanguageProvider>
          <MaintenanceGuard>{children}</MaintenanceGuard>
          <Toaster />
          <AnalyticsScripts />
        </LanguageProvider>
      </body>
    </html>
  );
}
