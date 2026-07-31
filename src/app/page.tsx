import { Metadata } from "next";
import { db } from "@/lib/db";
import HomePage from "./HomePage";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jasaproteksi.com";

// ISR — regenerate page in background every 5 minutes.
export const revalidate = 300;

const FALLBACK_METADATA: Metadata = {
  title: "Hitung Premi Asuransi Mobil Secara Online | Jasa Proteksi",
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
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "Hitung Premi Asuransi Mobil Secara Online | Jasa Proteksi",
    description:
      "Platform simulasi premi asuransi mobil All Risk dan TLO online. Dapatkan estimasi otomatis berdasarkan data kendaraan dan wilayah penggunaan.",
    url: SITE_URL,
    siteName: "Jasa Proteksi",
    locale: "id_ID",
    type: "website",
    images: [{ url: "/og-image.webp", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hitung Premi Asuransi Mobil Secara Online | Jasa Proteksi",
    description:
      "Platform simulasi premi asuransi mobil All Risk dan TLO online. Estimasi otomatis berdasarkan data kendaraan.",
    images: ["/og-image.webp"],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  try {
    const seo = await db.seoMeta.findUnique({
      where: { page: "homepage" },
    });

    if (seo) {
      const fallbackTitle = FALLBACK_METADATA.title as string;
      const fallbackDescription = FALLBACK_METADATA.description as string;
      const fallbackKeywords = FALLBACK_METADATA.keywords as string[];

      return {
        title: seo.metaTitle || fallbackTitle,
        description: seo.metaDescription || fallbackDescription,
        keywords: seo.keywords
          ? seo.keywords.split(",").map((k) => k.trim())
          : fallbackKeywords,
        alternates: { canonical: SITE_URL },
        openGraph: {
          title: seo.metaTitle || fallbackTitle,
          description: seo.metaDescription || fallbackDescription,
          url: SITE_URL,
          siteName: "Jasa Proteksi",
          locale: "id_ID",
          type: "website",
          images: seo.ogImage
            ? [{ url: seo.ogImage, width: 1200, height: 630 }]
            : [{ url: "/og-image.webp", width: 1200, height: 630 }],
        },
        twitter: {
          card: "summary_large_image",
          title: seo.metaTitle || fallbackTitle,
          description: seo.metaDescription || fallbackDescription,
          images: seo.ogImage ? [seo.ogImage] : ["/og-image.webp"],
        },
      };
    }
  } catch (error) {
    console.error("Error fetching SEO metadata:", error);
  }

  return FALLBACK_METADATA;
}

interface ArticlePreviewItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: string | null;
}

export default async function Page() {
  // Fetch site settings & hero content server-side.
  let initialSettings = {
    whatsapp: "",
    whatsapp2: "",
    phone: "",
    email: "",
    address: "",
    googleAnalyticsId: "",
    metaPixelId: "",
    gtmId: "",
    maintenanceMode: false,
  };
  let initialHero: {
    tagline: string;
    subtext: string;
    ctaText: string;
    ctaLink: string;
    backgroundImage: string | null;
  } | null = null;

  try {
    const [settingsRows, heroRow] = await Promise.all([
      db.siteSetting.findMany(),
      db.heroContent.findFirst(),
    ]);

    const map: Record<string, string> = {};
    for (const s of settingsRows) {
      map[s.key] = s.value;
    }

    initialSettings = {
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

    if (heroRow) {
      initialHero = {
        tagline: heroRow.tagline,
        subtext: heroRow.subtext,
        ctaText: heroRow.ctaText,
        ctaLink: heroRow.ctaLink,
        backgroundImage: heroRow.backgroundImage,
      };
    }
  } catch (error) {
    console.error("Server data fetch error:", error);
    // Continue with empty defaults — client will fetch via API
  }

  return (
    <HomePage
      initialSettings={initialSettings}
      initialHero={initialHero}
    />
  );
}
