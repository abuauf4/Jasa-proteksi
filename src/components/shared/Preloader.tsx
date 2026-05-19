"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 600);
          return 100;
        }
        return prev + Math.random() * 8 + 2;
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-[100] bg-[#0D0D0D] flex flex-col items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Logo — slow cinematic reveal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2.0, ease: [0.25, 0.1, 0.25, 1] }}
            className="mb-10 flex flex-col items-center"
          >
            <div className="relative w-20 h-20 lg:w-24 lg:h-24 mb-8">
              <Image
                src="/logo-jasa-proteksi.webp"
                alt="Jasa Proteksi Logo"
                width={96}
                height={96}
                className="object-contain"
                priority
              />
            </div>

            {/* Brand name */}
            <h1 className="text-2xl lg:text-3xl font-light font-[family-name:var(--font-montserrat)] text-[#F5F5F0] tracking-[0.35em] uppercase">
              Jasa Proteksi
            </h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
              className="mt-3 text-[11px] tracking-[0.5em] text-[#2E7D6F] uppercase font-medium"
            >
              Insurtech Terpercaya
            </motion.p>
          </motion.div>

          {/* Progress bar — thin emerald line */}
          <div className="w-52 h-[1px] bg-white/[0.06] relative overflow-hidden">
            <motion.div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#2E7D6F] to-[#3A9B8A]"
              initial={{ width: "0%" }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          {/* Minimal loading text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="mt-6 text-[9px] tracking-[0.4em] text-white/20 uppercase font-light"
          >
            Loading
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
