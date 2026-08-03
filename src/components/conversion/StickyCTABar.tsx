"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { useSiteSettings } from "@/lib/ServerDataContext";
import { trackWhatsAppClick } from "@/lib/analytics-events";

const DISMISS_KEY = "jp_sticky_cta_dismissed_at";
const DISMISS_COOLDOWN_MS = 1000 * 60 * 60 * 6;

export default function StickyCTABar() {
  const { ctaWhatsApp } = useSiteSettings();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(DISMISS_KEY);
      if (stored) {
        const ts = parseInt(stored, 10);
        if (!Number.isNaN(ts) && Date.now() - ts < DISMISS_COOLDOWN_MS) {
          setDismissed(true);
        } else {
          localStorage.removeItem(DISMISS_KEY);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (dismissed) return;
      setVisible(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dismissed]);

  const handleDismiss = () => {
    setDismissed(true);
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {}
  };

  const waHref = ctaWhatsApp ? `https://wa.me/${ctaWhatsApp}` : "#";

  if (!visible || dismissed) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[45] bg-[#0B1F3A]/95 backdrop-blur-xl border-t border-[#DDE4EC]/20 shadow-lg safe-pb"
      data-cta-bar
    >
      <div className="hidden sm:block py-3 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-end gap-4">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick({ method: "sticky_bar" })}
            className="inline-flex items-center gap-2 px-6 py-3 min-h-[48px] bg-[#0F766E] hover:bg-[#0B5F59] text-white font-semibold tracking-wide text-xs rounded-xl shadow-lg transition-colors duration-300"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Konsultasi via WhatsApp
          </a>
          <button
            onClick={handleDismiss}
            className="w-10 h-10 flex items-center justify-center text-[#94A3B8] hover:text-white transition-colors min-h-[44px]"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="sm:hidden py-2.5 px-3">
        <div className="flex gap-2.5">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick({ method: "sticky_bar" })}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 min-h-[52px] bg-[#0F766E] text-white font-semibold text-sm rounded-xl hover:bg-[#0B5F59] transition-colors duration-300"
          >
            <MessageCircle className="w-4 h-4" />
            Konsultasi via WhatsApp
          </a>
          <button
            onClick={handleDismiss}
            className="w-12 flex items-center justify-center text-[#94A3B8] hover:text-white transition-colors min-h-[52px] flex-shrink-0"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
