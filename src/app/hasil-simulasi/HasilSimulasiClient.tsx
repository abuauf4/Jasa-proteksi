"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, RotateCcw, Pencil } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Container, Section } from "@/components/site/primitives";
import { PremiumResult } from "@/components/calculator/PremiumResult";
import { useCalculator, type UseCalculatorReturn } from "@/components/calculator/useCalculator";
import { ServerDataProvider, type SiteSettings, type HeroData } from "@/lib/ServerDataContext";

interface HasilSimulasiPageProps {
  initialSettings: SiteSettings;
  initialHero: HeroData | null;
}

export default function HasilSimulasiClient({ initialSettings, initialHero }: HasilSimulasiPageProps) {
  const router = useRouter();
  const calc = useCalculator({ trackViewOnMount: false });

  // Load calculator state from sessionStorage on mount
  React.useEffect(() => {
    try {
      const saved = sessionStorage.getItem("jp_calc_state");
      if (!saved) {
        // No saved state — redirect back to homepage calculator
        router.replace("/#kalkulator");
        return;
      }
      const parsed = JSON.parse(saved);
      // Restore state via internal setState — we need to expose a restore function
      // For simplicity, we just check if premium exists; if not, redirect
      if (!parsed.premium) {
        router.replace("/#kalkulator");
        return;
      }
    } catch {
      router.replace("/#kalkulator");
    }
  }, [router]);

  // "Ubah Data" — go back to calculator with existing data preserved
  const handleUbahData = React.useCallback(() => {
    // Update sessionStorage step to "vehicle" so the homepage calculator
    // restores to the first step (not the result page) with data preserved
    try {
      const saved = sessionStorage.getItem("jp_calc_state");
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed.step = "vehicle";
        parsed.premium = null;
        parsed.selectedPartnerIndex = null;
        parsed.lead = null;
        sessionStorage.setItem("jp_calc_state", JSON.stringify(parsed));
      }
    } catch { /* silent */ }
    router.push("/#kalkulator");
  }, [router]);

  // "Mulai Ulang" — full reset, clear everything, replace history
  const handleMulaiUlang = React.useCallback(() => {
    // Clear sessionStorage FIRST so stale data can't return via restore
    try {
      sessionStorage.removeItem("jp_calc_state");
    } catch { /* silent */ }
    // Reset calculator state completely (sets premium=null, step=vehicle, etc.)
    calc.reset();
    // Navigate back to calculator with replace so result page is not in history
    // Scroll to top immediately to avoid flash of old premium result
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    router.replace("/#kalkulator");
  }, [calc, router]);

  // Check if premium loaded
  if (!calc.state.premium) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-[#64748B]">Memuat hasil simulasi...</p>
            <Link href="/#kalkulator" className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[#0F766E]">
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Kembali ke kalkulator
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <ServerDataProvider initialSettings={initialSettings} initialHero={initialHero}>
      <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
        <SiteHeader />
        <main className="flex-1">
          <Section tone="soft" className="!pt-6 !pb-10">
            <Container className="max-w-2xl lg:max-w-3xl">
              {/* Action buttons: Ubah Data + Mulai Ulang */}
              <div className="flex items-center gap-2 mb-4">
                <button
                  type="button"
                  onClick={handleUbahData}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F766E] hover:text-[#0B5C55] transition-colors"
                >
                  <Pencil className="h-4 w-4" aria-hidden />
                  Ubah Data
                </button>
                <span className="text-[#CBD5E1]" aria-hidden>|</span>
                <button
                  type="button"
                  onClick={handleMulaiUlang}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden />
                  Mulai Ulang
                </button>
              </div>

              {/* Result */}
              <PremiumResult calc={calc} />
            </Container>
          </Section>
        </main>
        <SiteFooter />
      </div>
    </ServerDataProvider>
  );
}
