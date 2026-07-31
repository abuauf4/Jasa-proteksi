"use client";

import { useRouter } from "next/navigation";
import Navigation from "@/components/sections/Navigation";
import Footer from "@/components/sections/Footer";
import BackToTop from "@/components/conversion/BackToTop";
import FloatingWhatsApp from "@/components/conversion/FloatingWhatsApp";
import CookieConsent from "@/components/conversion/CookieConsent";
import StickyCTABar from "@/components/conversion/StickyCTABar";
import LeadFlowModal from "@/components/flow/LeadFlowModal";
import { ServerDataProvider } from "@/lib/ServerDataContext";
import type { SiteSettings, HeroData } from "@/lib/ServerDataContext";
import type { InsuranceProduct } from "@/lib/products";

interface ProductFlowClientProps {
  product: InsuranceProduct;
}

/**
 * Client wrapper for /produk/[slug] page.
 *
 * Fetches site settings + hero data on the client (lightweight — these are
 * cached in ServerDataContext module-level cache after first load).
 *
 * Renders the LeadFlowModal in `embedded` mode so the lead-generation flow
 * (vehicle selection → premium simulation → personal data → result) appears
 * as inline page content rather than a modal overlay.
 */
export default function ProductFlowClient({ product }: ProductFlowClientProps) {
  const router = useRouter();

  // Empty settings — ServerDataProvider will fetch on mount via useSiteSettings
  const emptySettings: SiteSettings = {
    whatsapp: "",
    whatsapp2: "",
    phone: "",
    email: "",
    address: "",
    googleAnalyticsId: "",
    metaPixelId: "",
    gtmId: "",
    maintenanceMode: false,
  };

  return (
    <ServerDataProvider initialSettings={emptySettings} initialHero={null}>
      <div className="min-h-screen flex flex-col overflow-x-hidden bg-[#F8FAFC]">
        <Navigation />
        <main className="flex-1 pt-14 lg:pt-[72px]">
          {/* Back link */}
          <div className="ds-container safe-px py-4">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-sm text-[#64748B] hover:text-[#0D9488] transition-colors duration-300 min-h-[40px]"
            >
              <span aria-hidden>←</span>
              <span>Kembali</span>
            </button>
          </div>

          {/* The actual lead flow — embedded (no modal chrome) */}
          <LeadFlowModal
            isOpen={true}
            embedded
            product={product}
            onClose={() => router.push("/")}
          />
        </main>
        <Footer />
        <BackToTop />
        <FloatingWhatsApp />
        <CookieConsent />
        <StickyCTABar />
      </div>
    </ServerDataProvider>
  );
}
