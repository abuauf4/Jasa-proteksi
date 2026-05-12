"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StickyCTABar() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (dismissed) return;
      setVisible(window.scrollY > window.innerHeight);
    };
    window.addEventListener("scroll", handleScroll);
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
          className="fixed bottom-0 left-0 right-0 z-30 bg-background/95 backdrop-blur-md border-t border-border shadow-lg"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
            <div className="hidden sm:block">
              <p className="font-semibold text-foreground text-sm">
                Tertarik dengan Mitsubishi?
              </p>
              <p className="text-muted-foreground text-xs">Booking test drive sekarang!</p>
            </div>
            <div className="flex items-center gap-3 flex-1 sm:flex-initial justify-center sm:justify-end">
              <Button
                asChild
                size="sm"
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
              >
                <a href="#kontak">
                  <Phone className="w-4 h-4 mr-2" />
                  Book Test Drive
                </a>
              </Button>
              <a
                href="tel:021800123"
                className="text-sm font-medium text-foreground hover:text-accent transition-colors"
              >
                021-800123
              </a>
            </div>
            <button
              onClick={handleDismiss}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
