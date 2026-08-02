"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animate a number from previous value to target with ease-out.
 * Used for premium reveal animation — more memorable than static number.
 *
 * When `animate` is false (initial result mount), returns target instantly
 * without animation — prevents the "counting up from small number" flash.
 *
 * Respects prefers-reduced-motion: returns target instantly.
 */
export function useCountUp(target: number, durationMs: number = 800, animate: boolean = true): number {
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  // Track if this is the first call with a real target (initial mount)
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    // On initial mount with a target, skip animation if `animate` is false
    // or if this is the first time we see a non-zero target.
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      if (!animate) {
        // Show final value directly, no animation
        setDisplay(target);
        prevRef.current = target;
        return;
      }
    }

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

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (target - start) * eased);
      setDisplay(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, durationMs, animate]);

  return display;
}
