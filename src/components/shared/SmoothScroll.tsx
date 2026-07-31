"use client";

import { useEffect } from "react";

// Native scroll with smooth anchor navigation.
// Lenis removed — it adds ~3KB + continuous rAF loop that hurts mobile responsiveness.
// CSS scroll-behavior: smooth handles the rest natively (GPU-accelerated).

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Smooth scroll for anchor links (#href) — lightweight replacement for Lenis.scrollTo
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a[href^='#']");
      if (anchor) {
        e.preventDefault();
        const href = anchor.getAttribute("href");
        if (href) {
          const el = document.querySelector(href);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
            // Offset for fixed navbar
            const offset = 80;
            const top = el.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: "smooth" });
          }
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return <>{children}</>;
}
