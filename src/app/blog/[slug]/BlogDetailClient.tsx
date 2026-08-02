"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Container } from "@/components/site/primitives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft, BookOpen, User } from "lucide-react";
import { useSiteSettings } from "@/lib/ServerDataContext";

interface ArticleCategory {
  id: string;
  name: string;
  slug: string;
}

interface Author {
  id: string;
  name: string;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  coverImage: string | null;
  status: string;
  publishedAt: string | null;
  createdAt: string;
  category: ArticleCategory | null;
  categoryId: string | null;
  author: Author | null;
  authorId: string | null;
}

interface BlogDetailClientProps {
  article: Article;
  relatedArticles: Article[];
}

export default function BlogDetailClient({
  article,
  relatedArticles,
}: BlogDetailClientProps) {
  const { settings, loading } = useSiteSettings();
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <SiteHeader />
      <main className="flex-1">
        {/* Back bar */}
        <div className="bg-[#F1F5F9] border-b border-[#E2E8F0]">
          <Container className="py-3">
            <Link href="/blog">
              <Button variant="ghost" size="sm" className="text-[#64748B] hover:text-[#0F766E] min-h-[44px]">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Blog
              </Button>
            </Link>
          </Container>
        </div>

        {/* Article Content */}
        <article className="py-8 lg:py-12">
          <Container>
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              {/* Main Content */}
              <div className="flex-1 min-w-0">
                {/* Category & Date */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  {article.category && (
                    <Badge className="bg-[#0F766E]/10 text-[#0F766E] border border-[#A7F3D0] hover:bg-[#0F766E]/10">
                      {article.category.name}
                    </Badge>
                  )}
                  <div className="flex items-center gap-1.5 text-sm text-[#94A3B8]">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                  </div>
                  {article.author && (
                    <div className="flex items-center gap-1.5 text-sm text-[#94A3B8]">
                      <User className="h-3.5 w-3.5" />
                      <span>{article.author.name}</span>
                    </div>
                  )}
                </div>

                {/* Title */}
                <h1 className="ds-h1 mb-6">
                  {article.title}
                </h1>

                {/* Cover Image */}
                {article.coverImage && (
                  <div className="relative rounded-2xl overflow-hidden mb-8 aspect-video">
                    <Image
                      src={article.coverImage}
                      alt={article.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      priority
                    />
                  </div>
                )}

                {/* Excerpt */}
                {article.excerpt && (
                  <p className="text-lg text-[#475569] leading-relaxed mb-8 font-medium border-l-4 border-[#0F766E] pl-4">
                    {article.excerpt}
                  </p>
                )}

                {/* Content */}
                <div className="prose prose-slate prose-lg max-w-none">
                  {article.content ? (
                    article.content.split("\n").map((paragraph, index) => {
                      if (!paragraph.trim()) return <br key={index} />;
                      // Simple heading detection (lines starting with #)
                      if (paragraph.startsWith("### ")) {
                        return (
                          <h3 key={index} className="ds-h3 mt-6 mb-3">
                            {paragraph.replace("### ", "")}
                          </h3>
                        );
                      }
                      if (paragraph.startsWith("## ")) {
                        return (
                          <h2 key={index} className="ds-h2 mt-8 mb-4">
                            {paragraph.replace("## ", "")}
                          </h2>
                        );
                      }
                      return (
                        <p key={index} className="text-[#475569] leading-relaxed mb-4">
                          {paragraph}
                        </p>
                      );
                    })
                  ) : (
                    <p className="text-[#94A3B8]">Belum ada konten.</p>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <aside className="w-full lg:w-80 shrink-0">
                <div className="lg:sticky lg:top-24 space-y-6">
                  {/* Related Articles */}
                  {relatedArticles.length > 0 && (
                    <div className="bg-[#F1F5F9] rounded-2xl p-5">
                      <h3 className="text-sm font-semibold text-[#0F172A] uppercase tracking-wider mb-4">
                        Artikel Terkait
                      </h3>
                      <div className="space-y-4">
                        {relatedArticles.map((related) => (
                          <Link
                            key={related.id}
                            href={`/blog/${related.slug}`}
                            className="group block"
                          >
                            <div className="flex gap-3">
                              {related.coverImage ? (
                                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-[#E2E8F0] relative">
                                  <Image
                                    src={related.coverImage}
                                    alt={related.title}
                                    fill
                                    className="object-cover"
                                    sizes="64px"
                                  />
                                </div>
                              ) : (
                                <div className="w-16 h-16 rounded-lg bg-[#ECFDF5] flex items-center justify-center shrink-0">
                                  <BookOpen className="h-6 w-6 text-[#A7F3D0]" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-[#0F172A] group-hover:text-[#0F766E] transition-colors line-clamp-2">
                                  {related.title}
                                </p>
                                <p className="text-xs text-[#94A3B8] mt-1">
                                  {formatDate(related.publishedAt || related.createdAt)}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <div className="bg-gradient-to-br from-[#0F766E] to-[#0B5C55] rounded-2xl p-5 text-white">
                    <h3 className="font-bold text-lg mb-2">Butuh Bantuan?</h3>
                    <p className="text-[#A7F3D0] text-sm mb-4">
                      Konsultasi gratis dengan ahli asuransi kami
                    </p>
                    <a
                      href={settings.whatsapp ? `https://wa.me/${settings.whatsapp}` : "#"}
                      target={settings.whatsapp ? "_blank" : undefined}
                      rel={settings.whatsapp ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-white text-[#0F766E] rounded-xl font-semibold text-sm hover:bg-[#ECFDF5] transition-colors"
                    >
                      Hubungi via WhatsApp
                    </a>
                  </div>
                </div>
              </aside>
            </div>
          </Container>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
