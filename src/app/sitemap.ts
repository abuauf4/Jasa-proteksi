import { MetadataRoute } from "next";
import { db } from "@/lib/db";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jasaproteksi.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all published articles for dynamic blog routes
  let publishedArticles: { slug: string; updatedAt: Date }[] = [];
  try {
    publishedArticles = await db.article.findMany({
      where: { status: "published" },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    });
  } catch (error) {
    console.error("Sitemap: failed to fetch articles:", error);
  }

  // Fetch all active products for dynamic /produk/[slug] routes
  let activeProducts: { slug: string; updatedAt: Date }[] = [];
  try {
    activeProducts = await db.product.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    });
  } catch (error) {
    console.error("Sitemap: failed to fetch products:", error);
  }

  // Static pages — homepage + SEO pillar articles
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date("2026-08-03"),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/cek-premi`,
      lastModified: new Date("2026-08-03"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/asuransi-mobil`,
      lastModified: new Date("2026-07-01"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/asuransi-mobil-all-risk`,
      lastModified: new Date("2026-07-01"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/asuransi-mobil-tlo`,
      lastModified: new Date("2026-07-01"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/artikel`,
      lastModified: new Date("2026-08-03"),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    // SEO pillar articles
    {
      url: `${SITE_URL}/perbedaan-all-risk-dan-tlo`,
      lastModified: new Date("2026-08-03"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/cara-menghitung-premi-asuransi-mobil`,
      lastModified: new Date("2026-08-01"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/biaya-asuransi-mobil`,
      lastModified: new Date("2026-08-01"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/faktor-premi-asuransi-mobil`,
      lastModified: new Date("2026-08-03"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/asuransi-mobil-bekas`,
      lastModified: new Date("2026-08-03"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/perluasan-asuransi-mobil`,
      lastModified: new Date("2026-08-01"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/tentang-kami`,
      lastModified: new Date("2026-08-03"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/kebijakan-privasi`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/syarat-ketentuan`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Dynamic product pages (/produk/[slug])
  const productPages: MetadataRoute.Sitemap = activeProducts.map(
    (product) => ({
      url: `${SITE_URL}/produk/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })
  );

  // Dynamic artikel pages (/artikel/[slug])
  const articlePages: MetadataRoute.Sitemap = publishedArticles.map(
    (article) => ({
      url: `${SITE_URL}/artikel/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })
  );

  return [...staticPages, ...productPages, ...articlePages];
}
