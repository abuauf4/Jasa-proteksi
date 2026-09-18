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

  // Static pages — homepage + SEO pillar articles
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/cek-premi`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/asuransi-mobil`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/asuransi-mobil-all-risk`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/asuransi-mobil-tlo`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/artikel`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    // SEO pillar articles
    {
      url: `${SITE_URL}/perbedaan-all-risk-dan-tlo`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/cara-menghitung-premi-asuransi-mobil`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/biaya-asuransi-mobil`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/faktor-premi-asuransi-mobil`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/asuransi-mobil-bekas`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/perluasan-asuransi-mobil`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/tentang-kami`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/kebijakan-privasi`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/syarat-ketentuan`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Dynamic artikel pages
  const articlePages: MetadataRoute.Sitemap = publishedArticles.map(
    (article) => ({
      url: `${SITE_URL}/artikel/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })
  );

  return [...staticPages, ...articlePages];
}
