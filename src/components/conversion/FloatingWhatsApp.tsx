"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp() {
  return (
    <motion.a
      href="https://wa.me/6281234567890"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#25D366] hover:bg-[#25D366]/90 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, duration: 0.3 }}
      aria-label="Hubungi via WhatsApp"
    >
      <MessageCircle className="w-6 h-6 text-white" />
      <span className="absolute inset-0 rounded-full animate-pulse-green" />
    </motion.a>
  );
}
