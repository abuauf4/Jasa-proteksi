"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const COOKIE_KEY = "jp_cookie_consent";

export default function CookieConsent() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  // Hide cookie banner when sticky CTA bar is shown to avoid overlap at bottom of screen
  const [stickyCtaVisible, setStickyCtaVisible] = useState(false);

  // Show after a small delay if user hasn't consented yet
  useEffect(() => {
    try {
      const stored = localStorage.getItem(COOKIE_KEY);
      if (stored === "accepted" || stored === "rejected") {
        return; // Don't show
      }
    } catch {
      // localStorage unavailable — proceed to show
    }
    const timer = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Observe whether StickyCTABar is currently mounted (data-cta-bar attribute)
  // and also use scroll position as fallback (StickyCTABar shows at >80% viewport)
  useEffect(() => {
    const checkCtaBar = () => {
      const bar = document.querySelector("[data-cta-bar]");
      const scrolledFar = window.scrollY > window.innerHeight * 0.8;
      setStickyCtaVisible(!!bar && scrolledFar);
    };

    const observer = new MutationObserver(checkCtaBar);
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("scroll", checkCtaBar, { passive: true });
    checkCtaBar();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", checkCtaBar);
    };
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(COOKIE_KEY, "accepted");
    } catch {
      // ignore
    }
    setVisible(false);
  };

  const handleReject = () => {
    try {
      localStorage.setItem(COOKIE_KEY, "rejected");
    } catch {
      // ignore
    }
    setVisible(false);
  };

  // Don't render if user already consented, OR if sticky CTA bar is showing
  // (avoid overlap at bottom of screen)
  if (!visible || stickyCtaVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-40 p-3 sm:p-4 safe-px safe-pb"
      >
        <div className="max-w-5xl mx-auto bg-white/95 backdrop-blur-xl rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 border border-[#E2E8F0] shadow-lg relative">
          <Cookie className="w-6 h-6 text-[#0EA5E9] flex-shrink-0" />
          <p className="text-[#64748B] text-sm flex-1 text-center sm:text-left leading-relaxed">
            {t("conversion.cookieMessage")}
          </p>
          <div className="flex gap-3 flex-shrink-0 w-full sm:w-auto">
            <button
              onClick={handleAccept}
              className="flex-1 sm:flex-initial px-5 py-2.5 text-sm font-medium tracking-wider bg-[#0EA5E9] text-white hover:bg-[#0284C7] transition-colors duration-300 rounded-md min-h-[44px]"
            >
              {t("conversion.cookieAccept")}
            </button>
            <button
              onClick={handleReject}
              className="flex-1 sm:flex-initial px-5 py-2.5 text-sm text-[#94A3B8] hover:text-[#64748B] transition-colors duration-300 min-h-[44px]"
            >
              {t("conversion.cookieReject")}
            </button>
          </div>
          <button
            onClick={handleReject}
            className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center text-[#CBD5E1] hover:text-[#64748B] transition-colors"
            aria-label="Close cookie consent"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
