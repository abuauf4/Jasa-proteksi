import { Metadata } from "next";
import { db } from "@/lib/db";
import BlogPageClient from "@/app/artikel/BlogPageClient";

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

  const totalPages = Math.ceil(total / limit);

  const serializedArticles = articles.map((article) => ({
    ...article,
    publishedAt: article.publishedAt?.toISOString() || null,
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
  }));

  return (
    <BlogPageClient
      articles={serializedArticles}
      currentPage={page}
      totalPages={totalPages}
      total={total}
    />
  );
}
