"use client";

import { MessageCircle } from "lucide-react";
import { useSiteSettings } from "@/lib/ServerDataContext";
import { trackEvent } from "@/lib/conversion";

export default function FinalCTA() {
  const { ctaWhatsApp } = useSiteSettings();

  return (
    <section className="bg-[#0B1F3A] ds-section">
      <div className="ds-container text-center">
        <h2 className="ds-h2 text-white mb-4">
          Belum Tahu Proteksi yang Anda Butuhkan?
        </h2>
        <p className="ds-body-lg text-[#94A3B8] max-w-lg mx-auto mb-8">
          Ceritakan kebutuhan Anda dan biarkan kami membantu menemukan
          perlindungan yang tepat. Tanpa biaya, tanpa tekanan.
        </p>
        <a
          href={ctaWhatsApp ? `https://wa.me/${ctaWhatsApp}` : "#"}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackEvent("whatsapp_click", { method: "final_cta" })
          }
          className="inline-flex items-center justify-center gap-2.5 px-8 py-4 min-h-[52px] bg-[#0F766E] hover:bg-[#0B5F59] text-white font-semibold text-[15px] rounded-xl transition-colors duration-300"
        >
          <MessageCircle className="w-5 h-5" />
          Bicara dengan Konsultan
        </a>
      </div>
    </section>
  );
}
