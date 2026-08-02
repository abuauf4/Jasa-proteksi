"use client";

import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Container } from "@/components/site/primitives";
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
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white py-14 lg:py-20">
          <Container>
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0F766E]/20 border border-[#0F766E]/30 mb-6">
                <BookOpen className="h-4 w-4 text-[#5EEAD4]" />
                <span className="text-sm text-[#5EEAD4] font-medium">Blog & Artikel</span>
              </div>
              <h1 className="ds-h1 !text-white mb-4">
                Artikel & Tips Asuransi
              </h1>
              <p className="ds-body-lg !text-[#94A3B8]">
                Panduan lengkap seputar asuransi kendaraan. Dapatkan tips, informasi terkini, dan saran dari ahli kami.
              </p>
            </div>
          </Container>
        </section>

        {/* Articles Grid */}
        <section className="py-10 lg:py-16">
          <Container>
            {articles.length === 0 ? (
              <div className="text-center py-20">
                <BookOpen className="h-16 w-16 text-[#E2E8F0] mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-[#64748B] mb-2">Belum Ada Artikel</h2>
                <p className="text-[#94A3B8]">Artikel akan segera hadir. Nantikan tips dan panduan asuransi dari kami!</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                  {articles.map((article) => (
                    <Link
                      key={article.id}
                      href={`/blog/${article.slug}`}
                      className="group rounded-2xl border border-[#E2E8F0] bg-white overflow-hidden hover:border-[#A7F3D0] hover:shadow-lg transition-all duration-300 flex flex-col"
                    >
                      {/* Cover Image */}
                      <div className="aspect-video bg-[#F1F5F9] relative overflow-hidden">
                        {article.coverImage ? (
                          <Image
                            src={article.coverImage}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-[#ECFDF5] to-[#F1F5F9]">
                            <BookOpen className="h-12 w-12 text-[#CBD5E1]" />
                          </div>
                        )}
                        {/* Category Badge */}
                        {article.category && (
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-[#0F766E]/90 text-white text-xs backdrop-blur-sm hover:bg-[#0F766E]">
                              {article.category.name}
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="text-lg font-bold text-[#0F172A] mb-2 group-hover:text-[#0F766E] transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        {article.excerpt && (
                          <p className="text-[#64748B] text-sm leading-relaxed line-clamp-2 mb-3">
                            {article.excerpt}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-[#94A3B8] mt-auto">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col items-center gap-3 mt-10 lg:mt-14">
                    <div className="text-sm text-[#64748B]">
                      {total} artikel &middot; Halaman {currentPage} dari {totalPages}
                    </div>
                    <div className="flex items-center gap-3">
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
                          <Button className="bg-[#0F766E] hover:bg-[#0B5C55] text-white min-h-[44px]">
                            Selanjutnya
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </Link>
                      ) : (
                        <Button className="bg-[#0F766E] hover:bg-[#0B5C55] text-white min-h-[44px]" disabled>
                          Selanjutnya
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </Container>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
