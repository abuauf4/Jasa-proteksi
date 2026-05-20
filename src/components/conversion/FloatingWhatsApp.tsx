"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function FloatingWhatsApp() {
  const { t } = useLanguage();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.9 }}
            className="absolute right-14 top-1/2 -translate-y-1/2 bg-white dark:bg-[#0A0F1E] text-foreground text-sm px-4 py-2 rounded-lg shadow-lg whitespace-nowrap border border-border"
          >
            {t("conversion.floatingWhatsApp")}
          </motion.div>
        )}
      </AnimatePresence>

      <a
        href="https://wa.me/6281379290494"
        target="_blank"
        rel="noopener noreferrer"
        className="relative block w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-[#25D366]/30 hover:scale-105 transition-transform duration-800"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label="Chat via WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
        {/* Subtle emerald pulse ring */}
        <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-[#2E7D6F]" style={{ animationDuration: '2s' }} />
      </a>
    </div>
  );
}
