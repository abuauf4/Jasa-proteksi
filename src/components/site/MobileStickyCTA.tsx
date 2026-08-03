"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Calculator, MessageCircle } from "lucide-react";
import { Button } from "./Button";
import { useSiteSettings } from "@/lib/ServerDataContext";
import { buildWhatsAppLink } from "@/lib/format";
import { trackEvent, openWhatsAppWithConversion } from "@/lib/analytics-events";

/**
 * Mobile sticky bottom CTA — only shows on info pages (not on calculator section).
 * Two buttons: "Hitung Premi" (scrolls to /#kalkulator) + "WhatsApp".
 */
export function MobileStickyCTA() {
  const pathname = usePathname();
  const { settings } = useSiteSettings();
  const [visible, setVisible] = useState(false);

  // Show after user scrolls past hero (~600px) but hide when in calculator section
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const calc = document.getElementById("kalkulator");
      let inCalculator = false;
      if (calc) {
        const rect = calc.getBoundingClientRect();
        // If calculator is in the viewport, hide the sticky CTA
        inCalculator = rect.top < window.innerHeight && rect.bottom > 0;
      }
      setVisible(y > 600 && !inCalculator);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  const whatsappLink = settings.whatsapp
    ? buildWhatsAppLink(
        settings.whatsapp,
        "Halo Jasa Proteksi, saya ingin bertanya tentang asuransi mobil."
      )
    : null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-white border-t border-[#E2E8F0] shadow-[0_-4px_12px_rgba(15,23,42,0.08)] safe-bottom"
      role="region"
      aria-label="Aksi cepat"
    >
      <div className="grid grid-cols-2 gap-2 p-3">
        <Button
          as="link"
          href="/#kalkulator"
          variant="primary"
          size="md"
          onClick={() => trackEvent("apply_click", {})}
          className="!h-12"
        >
          <Calculator className="h-4 w-4" aria-hidden />
          Hitung Premi
        </Button>
        {whatsappLink ? (
          <Button
            as="external"
            href={whatsappLink}
            variant="secondary"
            size="md"
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              openWhatsAppWithConversion(whatsappLink, { method: "mobile_sticky_cta" });
            }}
            className="!h-12"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            WhatsApp
          </Button>
        ) : null}
      </div>
    </div>
  );
}
