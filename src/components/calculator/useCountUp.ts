"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animate a number from 0 (or previous value) to target with ease-out.
 * Used for premium reveal animation — more memorable than static number.
 *
 * Respects prefers-reduced-motion: returns target instantly.
 */
export function useCountUp(target: number, durationMs: number = 800): number {
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Respect reduced motion
    if (typeof window !== "undefined") {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mq.matches) {
        setDisplay(target);
        prevRef.current = target;
        return;
      }
    }

    const start = prevRef.current;
    prevRef.current = target;

    if (start === target) {
      setDisplay(target);
      return;
    }

    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (target - start) * eased);
      setDisplay(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, durationMs]);

  return display;
}
