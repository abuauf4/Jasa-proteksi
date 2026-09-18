import { Metadata } from "next";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import BlogDetailClient from "@/app/artikel/[slug]/BlogDetailClient";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jasaproteksi.com";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await db.article.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!article || article.status !== "published") {
    return {
      title: "Artikel Tidak Ditemukan",
      robots: { index: false, follow: false },
    };
  }

  const metaTitle = article.metaTitle?.trim();
  const resolvedTitle: Metadata["title"] = metaTitle
    ? /jasa proteksi/i.test(metaTitle)
      ? { absolute: metaTitle }
      : metaTitle
    : article.title;

  return {
    title: resolvedTitle,
    description: article.metaDescription || article.excerpt || undefined,
    alternates: { canonical: `${SITE_URL}/artikel/${slug}` },
    openGraph: {
      title: article.metaTitle || article.title,
      description: article.metaDescription || article.excerpt || undefined,
      url: `${SITE_URL}/artikel/${slug}`,
      images: article.coverImage ? [{ url: article.coverImage }] : undefined,
      type: "article",
      publishedTime: article.publishedAt?.toISOString() || undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.metaTitle || article.title,
      description: article.metaDescription || article.excerpt || undefined,
      images: article.coverImage ? [article.coverImage] : undefined,
    },
  };
}

export default async function ArtikelDetailPage({ params }: Props) {
  const { slug } = await params;

  const article = await db.article.findUnique({
    where: { slug },
    include: {
      category: true,
      author: { select: { id: true, name: true } },
    },
  });

  if (!article || article.status !== "published") {
    notFound();
  }

  const relatedArticles = article.categoryId
    ? await db.article.findMany({
        where: {
          categoryId: article.categoryId,
          status: "published",
          id: { not: article.id },
        },
        include: { category: true },
        orderBy: { publishedAt: "desc" },
        take: 3,
      })
    : [];

  const serializedArticle = {
    ...article,
    publishedAt: article.publishedAt?.toISOString() || null,
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
  };

  const serializedRelated = relatedArticles.map((a) => ({
    ...a,
    publishedAt: a.publishedAt?.toISOString() || null,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  }));

  const articleUrl = `${SITE_URL}/artikel/${slug}`;
  const coverImage = article.coverImage
    ? article.coverImage.startsWith("http")
      ? article.coverImage
      : `${SITE_URL}${article.coverImage.startsWith("/") ? "" : "/"}${article.coverImage}`
    : `${SITE_URL}/og-image.webp`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription || article.excerpt || undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    url: articleUrl,
    image: [coverImage],
    datePublished: article.publishedAt?.toISOString() || article.createdAt.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: article.author?.name || "Tim Jasa Proteksi",
    },
    publisher: {
      "@type": "Organization",
      name: "Jasa Proteksi",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo-jasa-proteksi.webp`,
      },
    },
    inLanguage: "id-ID",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <BlogDetailClient
        article={serializedArticle}
        relatedArticles={serializedRelated}
      />
    </>
  );
}
