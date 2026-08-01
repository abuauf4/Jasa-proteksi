"use client";

import * as React from "react";

interface HeroCarouselProps {
  images: string[];
  alt: string;
  className?: string;
  interval?: number; // ms between slides
  onSlideChange?: (index: number) => void;
}

/**
 * Lightweight hero carousel — auto-rotating, no library dependency.
 * - Crossfade transition between images
 * - Dot indicators at bottom
 * - Respects prefers-reduced-motion (no auto-rotate)
 * - Calls onSlideChange when slide changes
 */
export function HeroCarousel({ images, alt, className = "", interval = 5000, onSlideChange }: HeroCarouselProps) {
  const [current, setCurrent] = React.useState(0);
  const [reducedMotion, setReducedMotion] = React.useState(false);

  // Notify parent of slide changes
  React.useEffect(() => {
    onSlideChange?.(current);
  }, [current, onSlideChange]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Auto-rotate
  React.useEffect(() => {
    if (reducedMotion || images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [reducedMotion, images.length, interval]);

  if (images.length === 0) return null;
  if (images.length === 1) {
    return (
      <img
        src={images[0]}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover ${className}`}
        priority
      />
    );
  }

  return (
    <>
      {images.map((src, idx) => (
        <img
          key={idx}
          src={src}
          alt={alt}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            idx === current ? "opacity-100" : "opacity-0"
          } ${className}`}
          priority={idx === 0}
          loading={idx === 0 ? "eager" : "lazy"}
        />
      ))}

      {/* Dot indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
        {images.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrent(idx)}
            className={`h-1.5 rounded-full transition-all ${
              idx === current ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Gambar ${idx + 1}`}
            aria-pressed={idx === current}
          />
        ))}
      </div>
    </>
  );
}
