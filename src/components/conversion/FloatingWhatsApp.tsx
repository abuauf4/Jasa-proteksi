"use client";

import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useSiteSettings } from "@/lib/ServerDataContext";
import { openWhatsAppWithConversion } from "@/lib/analytics-events";

export default function FloatingWhatsApp() {
  const { t } = useLanguage();
  const { settings, loading, ctaWhatsApp } = useSiteSettings();
  const [showTooltip, setShowTooltip] = useState(false);
  const [ctaBarVisible, setCtaBarVisible] = useState(false);

  useEffect(() => {
    const checkCTABar = () => {
      const bar = document.querySelector('[data-cta-bar]');
      setCtaBarVisible(!!bar);
    };
    const observer = new MutationObserver(checkCTABar);
    observer.observe(document.body, { childList: true, subtree: true });
    checkCTABar();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setCtaBarVisible(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const waHref = ctaWhatsApp ? `https://wa.me/${ctaWhatsApp}` : "#";

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // 🔔 Track conversion with event_callback, then open WhatsApp
    openWhatsAppWithConversion(waHref, { method: "floating_button" });
    setShowTooltip(false);
  };

  // Don't render until rotating WhatsApp number is loaded
  if (loading || !ctaWhatsApp) return null;

  return (
    <div className={`hidden sm:block fixed right-4 z-50 transition-all duration-300 ${ctaBarVisible ? "bottom-20" : "bottom-6"}`}>
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            className="absolute bottom-16 right-0 bg-white text-[#0F172A] text-sm px-4 py-2 rounded-lg shadow-lg border border-[#E2E8F0] max-w-[220px] text-wrap pointer-events-none"
          >
            {t("conversion.floatingWhatsApp")}
          </motion.div>
        )}
      </AnimatePresence>

      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleWhatsAppClick}
        className="relative block w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-[#25D366]/30 hover:scale-105 sm:hover:scale-110 transition-transform duration-300 min-h-[48px]"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label="Chat via WhatsApp"
      >
        <MessageCircle className="w-5 h-5 sm:w-7 sm:h-7" />
        {/* Green pulse ring */}
        <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-[#25D366]" style={{ animationDuration: '2s' }} />
      </a>
    </div>
  );
}
