"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Phone, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function StickyCTABar() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (dismissed) return;
      setVisible(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dismissed]);

  const handleDismiss = () => {
    setDismissed(true);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-[45] border-t border-[#2E7D6F]/20"
        >
          <div className="glass-dark py-3 px-4">
            <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
              <div className="hidden sm:flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#2E7D6F]" />
                <span className="text-white/60 text-sm">+6221 5088-6381</span>
              </div>
              <div className="flex items-center gap-3 flex-1 sm:flex-none justify-center">
                <a
                  href="#kontak"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2E7D6F] text-[#0D0D0D] font-semibold tracking-wider text-xs hover:bg-[#3A9B8A] transition-colors duration-300 rounded-md"
                >
                  <Shield className="w-3.5 h-3.5" />
                  {t("conversion.stickyCTA")}
                </a>
              </div>
              <button
                onClick={handleDismiss}
                className="text-white/30 hover:text-white/60 transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
