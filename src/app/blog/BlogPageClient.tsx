"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft, ArrowRight, BookOpen } from "lucide-react";

interface ArticleCategory {
  id: string;
  name: string;
  slug: string;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  status: string;
  publishedAt: string | null;
  createdAt: string;
  category: ArticleCategory | null;
  categoryId: string | null;
}

interface BlogPageClientProps {
  articles: Article[];
  currentPage: number;
  totalPages: number;
  total: number;
}

export default function BlogPageClient({
  articles,
  currentPage,
  totalPages,
  total,
}: BlogPageClientProps) {
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
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 mb-6">
              <BookOpen className="h-4 w-4 text-teal-400" />
              <span className="text-sm text-teal-300 font-medium">Blog & Artikel</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold  mb-4">
              Artikel & Tips Asuransi
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Panduan lengkap seputar asuransi kendaraan. Dapatkan tips, informasi terkini, dan saran dari ahli kami.
            </p>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {articles.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="h-16 w-16 text-slate-200 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-600 mb-2">Belum Ada Artikel</h2>
              <p className="text-slate-400">Artikel akan segera hadir. Nantikan tips dan panduan asuransi dari kami!</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {articles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/blog/${article.slug}`}
                    className="group rounded-xl border border-slate-200 bg-white overflow-hidden hover:border-teal-300 hover:shadow-lg transition-all duration-300"
                  >
                    {/* Cover Image */}
                    <div className="aspect-video bg-slate-100 relative overflow-hidden">
                      {article.coverImage ? (
                        <Image
                          src={article.coverImage}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-teal-50 to-slate-100">
                          <BookOpen className="h-12 w-12 text-slate-300" />
                        </div>
                      )}
                      {/* Category Badge */}
                      {article.category && (
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-teal-500/90 text-white text-xs backdrop-blur-sm hover:bg-teal-500">
                            {article.category.name}
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-teal-600 transition-colors line-clamp-2 ">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-3">
                          {article.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-12">
                  <div className="text-sm text-slate-500">
                    {total} artikel &middot; Halaman {currentPage} dari {totalPages}
                  </div>
                </div>
              )}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-4">
                  {currentPage > 1 ? (
                    <Link href={`/blog?page=${currentPage - 1}`}>
                      <Button variant="outline" className="min-h-[44px]">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Sebelumnya
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="outline" disabled className="min-h-[44px]">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Sebelumnya
                    </Button>
                  )}
                  {currentPage < totalPages ? (
                    <Link href={`/blog?page=${currentPage + 1}`}>
                      <Button className="bg-teal-500 hover:bg-teal-600 text-white min-h-[44px]">
                        Selanjutnya
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  ) : (
                    <Button className="bg-teal-500 hover:bg-teal-600 text-white min-h-[44px]" disabled>
                      Selanjutnya
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
