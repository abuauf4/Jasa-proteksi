"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          // Positioned bottom-LEFT to avoid clashing with FloatingWhatsApp (bottom-right)
          // bottom-20 clears StickyCTABar (mobile, ~70-90px tall) + safe-area
          className="fixed left-4 sm:left-6 bottom-20 sm:bottom-24 z-50 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#0F172A] border border-[#1E293B] flex items-center justify-center text-[#14B8A6] hover:bg-[#14B8A6] hover:text-white transition-all duration-800 shadow-lg min-h-[44px] safe-px"
          aria-label="Back to top"
        >
          <ChevronUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
