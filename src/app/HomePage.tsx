"use client";

import * as React from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import {
  HeroSection,
  ShortcutMenu,
  PromoBanner,
  CoverageCards,
  AppSteps,
  ArticleCards,
  InfoModule,
} from "@/components/site/sections";
import { ServerDataProvider, type SiteSettings, type HeroData } from "@/lib/ServerDataContext";
import { captureAttribution } from "@/lib/analytics-events";

interface HomePageProps {
  initialSettings: SiteSettings;
  initialHero: HeroData | null;
}

export default function HomePage({ initialSettings, initialHero }: HomePageProps) {
  React.useEffect(() => {
    captureAttribution();
  }, []);

  return (
    <ServerDataProvider initialSettings={initialSettings} initialHero={initialHero}>
      <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
        <SiteHeader />
        <main className="flex-1">
          <HeroSection />
          <ShortcutMenu />
          <PromoBanner />
          <CoverageCards />
          <AppSteps />
          <ArticleCards />
          <InfoModule />
        </main>
        <SiteFooter />
      </div>
    </ServerDataProvider>
  );
}
