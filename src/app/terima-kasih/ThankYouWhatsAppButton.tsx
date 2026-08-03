"use client";

import { MessageCircle } from "lucide-react";
import { trackWhatsAppClick } from "@/lib/analytics-events";

export function ThankYouWhatsAppButton({ whatsappNumber }: { whatsappNumber: string }) {
  return (
    <a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsAppClick({ method: "thank_you_page" })}
      className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#25D366] text-[#25D366] font-semibold tracking-wider text-sm rounded-full hover:bg-[#25D366] hover:text-white transition-all duration-300"
    >
      <MessageCircle className="w-4 h-4" />
      Chat WhatsApp
    </a>
  );
}
