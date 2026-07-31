"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { MobileStickyCTA } from "@/components/site/MobileStickyCTA";
import {
  HeroSection,
  ProtectionComparison,
  HowItWorks,
  PremiumFactors,
  PlatformBenefits,
  BusinessIdentity,
  ArticlePreview,
  FAQSection,
  FinalCTA,
  LegalDisclaimer,
} from "@/components/site/sections";
import { ServerDataProvider, type SiteSettings, type HeroData } from "@/lib/ServerDataContext";
import { captureAttribution } from "@/lib/analytics-events";

interface ArticlePreviewItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: string | null;
}

interface HomePageProps {
  initialSettings: SiteSettings;
  initialHero: HeroData | null;
  articles?: ArticlePreviewItem[];
}

export default function HomePage({ initialSettings, initialHero, articles = [] }: HomePageProps) {
  const [resolvedArticles, setResolvedArticles] = useState<ArticlePreviewItem[]>(articles);

  // Capture UTM/gclid on first mount.
  React.useEffect(() => {
    captureAttribution();
  }, []);

  // If articles weren't passed from the server, fetch them client-side.
  useEffect(() => {
    if (articles.length > 0) return;
    let cancelled = false;
    fetch("/api/articles?status=published&limit=3")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data?.articles) return;
        setResolvedArticles(data.articles as ArticlePreviewItem[]);
      })
      .catch(() => {
        /* silent — section is hidden when empty */
      });
    return () => {
      cancelled = true;
    };
  }, [articles.length]);

  return (
    <ServerDataProvider initialSettings={initialSettings} initialHero={initialHero}>
      <div className="flex min-h-screen flex-col bg-white">
        <SiteHeader />
        <main className="flex-1">
          <HeroSection />
          <ProtectionComparison />
          <HowItWorks />
          <PremiumFactors />
          <PlatformBenefits />
          <BusinessIdentity />
          <ArticlePreview articles={resolvedArticles} />
          <FAQSection />
          <FinalCTA />
          <LegalDisclaimer className="ds-container mt-12 mb-12" />
        </main>
        <SiteFooter />
        <MobileStickyCTA />
      </div>
    </ServerDataProvider>
  );
}
