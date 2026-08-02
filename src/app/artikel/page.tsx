import { Metadata } from "next";
import { db } from "@/lib/db";
import BlogPageClient from "@/app/artikel/BlogPageClient";
import { PILLAR_ARTICLES } from "@/lib/pillar-articles";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jasaproteksi.com";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Artikel Asuransi Mobil — Jasa Proteksi",
  description:
    "Artikel, tips, dan panduan asuransi mobil dari Jasa Proteksi. Pelajari All Risk, TLO, perluasan, klaim, dan cara menghitung premi.",
  alternates: { canonical: `${SITE_URL}/artikel` },
  openGraph: {
    title: "Artikel Asuransi Mobil — Jasa Proteksi",
    description: "Artikel, tips, dan panduan asuransi mobil dari Jasa Proteksi.",
    url: `${SITE_URL}/artikel`,
    images: [{ url: "/og-image.webp", width: 1200, height: 630 }],
  },
};

export default async function ArtikelPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const limit = 12;
  const skip = (page - 1) * limit;

  const where = { status: "published" };

  // Fetch CMS articles; wrap in try/catch so DB failure doesn't blank the page
  let dbArticles: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    coverImage: string | null;
    status: string;
    publishedAt: string | null;
    createdAt: string;
    category: { id: string; name: string; slug: string } | null;
    categoryId: string | null;
    href?: string;
  }> = [];
  let dbTotal = 0;

  try {
    const [articles, total] = await Promise.all([
      db.article.findMany({
        where,
        include: { category: true },
        orderBy: { publishedAt: "desc" },
        skip,
        take: limit,
      }),
      db.article.count({ where }),
    ]);
    dbTotal = total;
    dbArticles = articles.map((article) => ({
      ...article,
      publishedAt: article.publishedAt?.toISOString() || null,
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
    }));
  } catch {
    // Database unavailable — pillar articles still render
  }

  // Map pillar articles to the same shape as CMS articles
  const pillarMapped = PILLAR_ARTICLES.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    coverImage: p.coverImage,
    status: "published",
    publishedAt: p.publishedAt,
    createdAt: p.publishedAt,
    category: { id: "pillar", name: p.category, slug: p.category.toLowerCase() },
    categoryId: "pillar",
    href: p.href,
  }));

  // Merge: pillar articles first, then CMS articles
  // Deduplicate by slug (CMS article with same slug takes precedence)
  const cmsSlugs = new Set(dbArticles.map((a) => a.slug));
  const uniquePillar = pillarMapped.filter((p) => !cmsSlugs.has(p.slug));
  const allArticles = [...uniquePillar, ...dbArticles];

  // Sort by publishedAt descending
  allArticles.sort((a, b) => {
    const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return dateB - dateA;
  });

  const total = uniquePillar.length + dbTotal;
  const totalPages = Math.ceil(total / limit);

  return (
    <BlogPageClient
      articles={allArticles}
      currentPage={page}
      totalPages={totalPages}
      total={total}
    />
  );
}
