"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="max-w-4xl mx-auto bg-card border border-border rounded-2xl shadow-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Cookie className="w-6 h-6 text-accent shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Website ini menggunakan cookies untuk meningkatkan pengalaman Anda. Dengan
                melanjutkan, Anda menyetujui penggunaan cookies sesuai kebijakan privasi kami.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={decline}
                className="text-muted-foreground"
              >
                Tolak
              </Button>
              <Button
                size="sm"
                onClick={accept}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                Terima
              </Button>
            </div>
            <button
              onClick={decline}
              className="absolute top-3 right-3 sm:hidden text-muted-foreground hover:text-foreground"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
