"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft, BookOpen, User } from "lucide-react";
import { useSiteSettings } from "@/lib/ServerDataContext";
import { openWhatsAppWithConversion } from "@/lib/analytics-events";

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
    <div className="min-h-screen bg-white">
      {/* Back bar */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link href="/artikel">
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-teal-600 min-h-[44px]">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Blog
            </Button>
          </Link>
        </div>
      </div>

      {/* Article Content */}
      <article className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Category & Date */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {article.category && (
                  <Badge className="bg-teal-500/10 text-teal-700 border border-teal-200 hover:bg-teal-500/10">
                    {article.category.name}
                  </Badge>
                )}
                <div className="flex items-center gap-1.5 text-sm text-slate-400">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                </div>
                {article.author && (
                  <div className="flex items-center gap-1.5 text-sm text-slate-400">
                    <User className="h-3.5 w-3.5" />
                    <span>{article.author.name}</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-4xl font-bold  text-slate-900 mb-6 leading-tight">
                {article.title}
              </h1>

              {/* Cover Image */}
              {article.coverImage && (
                <div className="relative rounded-xl overflow-hidden mb-8 aspect-video">
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
                <p className="text-lg text-slate-600 leading-relaxed mb-8 font-medium border-l-4 border-teal-400 pl-4">
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
                        <h3 key={index} className="text-xl font-bold text-slate-800 mt-6 mb-3">
                          {paragraph.replace("### ", "")}
                        </h3>
                      );
                    }
                    if (paragraph.startsWith("## ")) {
                      return (
                        <h2 key={index} className="text-2xl font-bold text-slate-800 mt-8 mb-4">
                          {paragraph.replace("## ", "")}
                        </h2>
                      );
                    }
                    return (
                      <p key={index} className="text-slate-600 leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    );
                  })
                ) : (
                  <p className="text-slate-400">Belum ada konten.</p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="w-full lg:w-80 shrink-0">
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* Related Articles */}
                {relatedArticles.length > 0 && (
                  <div className="bg-slate-50 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">
                      Artikel Terkait
                    </h3>
                    <div className="space-y-4">
                      {relatedArticles.map((related) => (
                        <Link
                          key={related.id}
                          href={`/artikel/${related.slug}`}
                          className="group block"
                        >
                          <div className="flex gap-3">
                            {related.coverImage ? (
                              <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-200 relative">
                                <Image
                                  src={related.coverImage}
                                  alt={related.title}
                                  fill
                                  className="object-cover"
                                  sizes="64px"
                                />
                              </div>
                            ) : (
                              <div className="w-16 h-16 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                                <BookOpen className="h-6 w-6 text-teal-300" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-slate-700 group-hover:text-teal-600 transition-colors line-clamp-2">
                                {related.title}
                              </p>
                              <p className="text-xs text-slate-400 mt-1">
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
                <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-5 text-white">
                  <h3 className="font-bold text-lg mb-2">Butuh Bantuan?</h3>
                  <p className="text-teal-100 text-sm mb-4">
                    Konsultasi gratis dengan ahli asuransi kami
                  </p>
                  <a
                    href={settings.whatsapp ? `https://wa.me/${settings.whatsapp}` : "#"}
                    target={settings.whatsapp ? "_blank" : undefined}
                    rel={settings.whatsapp ? "noopener noreferrer" : undefined}
                    onClick={(e: React.MouseEvent) => { e.preventDefault(); openWhatsAppWithConversion(settings.whatsapp ? `https://wa.me/${settings.whatsapp}` : "#", { method: "blog_cta" }); }}
                    className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-white text-teal-600 rounded-lg font-semibold text-sm hover:bg-teal-50 transition-colors"
                  >
                    Hubungi via WhatsApp
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </article>
    </div>
  );
}
