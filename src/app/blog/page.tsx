import { Metadata } from "next";
import { db } from "@/lib/db";
import BlogPageClient from "./BlogPageClient";

const SITE_URL = "https://jasaproteksi.com";

const BLOG_FALLBACK_METADATA: Metadata = {
  title: "Blog Asuransi - Jasa Proteksi",
  description:
    "Artikel, tips, dan panduan asuransi kendaraan dari Jasa Proteksi. Dapatkan informasi terkini seputar asuransi mobil dan motor.",
  openGraph: {
    title: "Blog Asuransi - Jasa Proteksi",
    description:
      "Artikel, tips, dan panduan asuransi kendaraan dari Jasa Proteksi.",
    images: [{ url: "/og-image.webp", width: 1200, height: 630, alt: "Blog Jasa Proteksi" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog Asuransi - Jasa Proteksi",
    description: "Artikel, tips, dan panduan asuransi kendaraan dari Jasa Proteksi.",
    images: ["/og-image.webp"],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  try {
    const seo = await db.seoMeta.findUnique({
      where: { page: "blog" },
    });

    if (seo) {
      const fallbackTitle = BLOG_FALLBACK_METADATA.title as string;
      const fallbackDescription = BLOG_FALLBACK_METADATA.description as string;

      return {
        title: seo.metaTitle || fallbackTitle,
        description: seo.metaDescription || fallbackDescription,
        keywords: seo.keywords
          ? seo.keywords.split(",").map((k) => k.trim())
          : undefined,
        openGraph: {
          title: seo.metaTitle || fallbackTitle,
          description: seo.metaDescription || fallbackDescription,
          images: seo.ogImage
            ? [{ url: seo.ogImage, width: 1200, height: 630 }]
            : [{ url: "/og-image.webp", width: 1200, height: 630, alt: "Blog Jasa Proteksi" }],
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
    console.error("Error fetching blog SEO metadata:", error);
  }

  return BLOG_FALLBACK_METADATA;
}

export default async function BlogPage({
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

  // Serialize dates
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
