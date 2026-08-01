"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Calculator } from "lucide-react";
import { Button } from "./Button";
import { trackEvent } from "@/lib/analytics-events";

/**
 * Mobile sticky bottom CTA — single "Hitung Premi Mobil" button.
 * Hides when user is filling the calculator (kalkulator in viewport)
 * or viewing the result.
 */
export function MobileStickyCTA() {
  const [visible, setVisible] = useState(false);

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
      // Also hide if we haven't scrolled past hero
      setVisible(y > 400 && !inCalculator);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white border-t border-[#E2E8F0] shadow-[0_-4px_12px_rgba(15,23,42,0.08)] safe-bottom"
      role="region"
      aria-label="Aksi cepat"
    >
      <div className="p-3">
        <Button
          as="link"
          href="/#kalkulator"
          variant="primary"
          size="lg"
          onClick={() => trackEvent("apply_click", {})}
          className="w-full !h-12"
        >
          <Calculator className="h-4 w-4" aria-hidden />
          Hitung Premi Mobil
        </Button>
      </div>
    </div>
  );
}
