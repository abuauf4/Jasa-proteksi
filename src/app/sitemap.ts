import { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { PILLAR_ARTICLES } from "@/lib/pillar-articles";

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

  const pillarPages: MetadataRoute.Sitemap = PILLAR_ARTICLES.map((article) => ({
    url: `${SITE_URL}${article.href}`,
    lastModified: article.publishedAt,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Dynamic artikel pages
  const articlePages: MetadataRoute.Sitemap = publishedArticles.map(
    (article) => ({
      url: `${SITE_URL}/artikel/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })
  );

  return [...staticPages, ...pillarPages, ...articlePages];
}
