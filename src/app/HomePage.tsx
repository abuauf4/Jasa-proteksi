"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { MobileStickyCTA } from "@/components/site/MobileStickyCTA";
import {
  HeroSection,
  HowItWorks,
  CoverageComparison,
  FAQSection,
  FinalCTA,
  LegalDisclaimer,
} from "@/components/site/sections";
import { ServerDataProvider, type SiteSettings, type HeroData } from "@/lib/ServerDataContext";
import { captureAttribution } from "@/lib/analytics-events";

interface HomePageProps {
  initialSettings: SiteSettings;
  initialHero: HeroData | null;
}

export default function HomePage({ initialSettings, initialHero }: HomePageProps) {
  // Capture UTM/gclid on first mount.
  React.useEffect(() => {
    captureAttribution();
  }, []);

  return (
    <ServerDataProvider initialSettings={initialSettings} initialHero={initialHero}>
      <div className="flex min-h-screen flex-col bg-white">
        <SiteHeader />
        <main className="flex-1">
          <HeroSection />
          <HowItWorks />
          <CoverageComparison />
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
