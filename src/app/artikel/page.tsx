import { Metadata } from "next";
import { db } from "@/lib/db";
import BlogPageClient from "@/app/artikel/BlogPageClient";
import { PILLAR_ARTICLES } from "@/lib/pillar-articles";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jasaproteksi.com";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Artikel Asuransi Mobil",
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
  const requestedPage = Math.max(1, parseInt(params.page || "1") || 1);
  const limit = 12;

  // Fetch only listing fields from CMS. We merge + paginate after combining
  // CMS records with static SEO articles so cards never repeat across pages.
  let dbArticles: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    coverImage: string | null;
    status: string;
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
    category: { id: string; name: string; slug: string } | null;
    categoryId: string | null;
    href?: string;
  }> = [];

  try {
    const articles = await db.article.findMany({
      where: { status: "published" },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        status: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        categoryId: true,
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: { publishedAt: "desc" },
    });

    dbArticles = articles.map((article) => ({
      ...article,
      publishedAt: article.publishedAt?.toISOString() || null,
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
    }));
  } catch {
    // Database unavailable — static SEO articles still render.
  }

  const pillarMapped = PILLAR_ARTICLES.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    coverImage: p.coverImage,
    status: "published",
    publishedAt: p.publishedAt,
    createdAt: p.publishedAt,
    updatedAt: p.publishedAt,
    category: { id: "pillar", name: p.category, slug: p.category.toLowerCase() },
    categoryId: "pillar",
    href: p.href,
  }));

  // Preserve the previous behavior: a CMS article with the same slug wins.
  const cmsSlugs = new Set(dbArticles.map((article) => article.slug));
  const uniquePillar = pillarMapped.filter((article) => !cmsSlugs.has(article.slug));

  const allArticles = [...uniquePillar, ...dbArticles].sort((a, b) => {
    const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return dateB - dateA;
  });

  const total = allArticles.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.min(requestedPage, totalPages);
  const offset = (currentPage - 1) * limit;
  const paginatedArticles = allArticles.slice(offset, offset + limit);

  return (
    <BlogPageClient
      articles={paginatedArticles}
      currentPage={currentPage}
      totalPages={totalPages}
      total={total}
    />
  );
}
