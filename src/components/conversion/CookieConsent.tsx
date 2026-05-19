"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-[55] p-4"
      >
        <div className="max-w-5xl mx-auto glass-dark rounded-xl p-5 flex flex-col sm:flex-row items-center gap-4 border border-white/5">
          <Cookie className="w-6 h-6 text-[#2E7D6F] flex-shrink-0" />
          <p className="text-white/60 text-sm flex-1 text-center sm:text-left">
            Kami menggunakan cookies untuk meningkatkan pengalaman Anda. Dengan melanjutkan, Anda menyetujui penggunaan cookies kami.
          </p>
          <div className="flex gap-3 flex-shrink-0">
            <button
              onClick={() => setVisible(false)}
              className="px-5 py-2 text-sm font-medium tracking-wider bg-[#2E7D6F] text-[#0D0D0D] hover:bg-[#3A9B8A] transition-colors duration-300 rounded-md"
            >
              Terima
            </button>
            <button
              onClick={() => setVisible(false)}
              className="px-5 py-2 text-sm text-white/40 hover:text-white/60 transition-colors duration-300"
            >
              Tolak
            </button>
          </div>
          <button
            onClick={() => setVisible(false)}
            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-white/30 hover:text-white/60 transition-colors"
            aria-label="Close cookie consent"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
