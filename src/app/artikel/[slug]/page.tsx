import { Metadata } from "next";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import BlogDetailClient from "@/app/blog/[slug]/BlogDetailClient";

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

  if (!article) {
    return { title: "Artikel Tidak Ditemukan - Jasa Proteksi" };
  }

  return {
    title: article.metaTitle || `${article.title} - Jasa Proteksi`,
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

  return (
    <BlogDetailClient
      article={serializedArticle}
      relatedArticles={serializedRelated}
    />
  );
}
