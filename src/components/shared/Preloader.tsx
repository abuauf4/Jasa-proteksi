"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 400);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-[100] bg-[#00001f] flex flex-col items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12"
          >
            <div className="flex items-center gap-4">
              {/* Three diamonds representing Mitsubishi */}
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-[#c9a84c] rotate-45 transform origin-center" />
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2">
                  <div className="w-5 h-5 bg-[#c9a84c] rotate-45 transform origin-center" />
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                  <div className="w-5 h-5 bg-[#c9a84c] rotate-45 transform origin-center" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold font-[family-name:var(--font-montserrat)] text-white tracking-wider">
                  MITSUBISHI
                </h1>
                <p className="text-[10px] tracking-[0.4em] text-[#c9a84c] uppercase">Authorized Dealer</p>
              </div>
            </div>
          </motion.div>

          {/* Progress bar */}
          <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden">
            <motion.div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#c9a84c] to-[#dfc06f]"
              initial={{ width: "0%" }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Progress text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-[10px] tracking-[0.3em] text-white/30 uppercase"
          >
            Loading Experience
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
