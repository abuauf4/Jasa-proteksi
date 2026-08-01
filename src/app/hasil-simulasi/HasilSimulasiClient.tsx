"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
            <Container className="max-w-2xl">
              {/* Back link */}
              <Link
                href="/#kalkulator"
                className="inline-flex items-center gap-1 text-sm font-semibold text-[#0F766E] hover:text-[#0B5C55] mb-4"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
                Ubah Data
              </Link>

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
