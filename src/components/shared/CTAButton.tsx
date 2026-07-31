"use client";

import { ReactNode } from "react";

type Variant = "sm" | "md" | "lg";
type Color = "orange" | "teal" | "tealOutline" | "white" | "whiteOutline";
type ElementType = "button" | "a";

interface CTAButtonProps {
  variant?: Variant;
  color?: Color;
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  icon?: ReactNode;
  trailingIcon?: ReactNode;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  target?: string;
  rel?: string;
  ariaLabel?: string;
}

const SIZE: Record<Variant, string> = {
  // sm — card-level CTA (e.g. "Cek Harga" on product card)
  sm: "px-4 sm:px-5 py-2.5 text-[11px] gap-2 min-h-[40px] sm:min-h-0",
  // md — section-level CTA (e.g. FAQ contact link, advisor CTA, footer link)
  md: "px-5 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-sm gap-2 sm:gap-2.5 min-h-[44px] sm:min-h-0",
  // lg — Hero / closing CTA (highest emphasis, but still compact)
  lg: "px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm gap-2 sm:gap-2.5 min-h-[44px] sm:min-h-0",
};

const COLOR: Record<Color, string> = {
  orange:
    "bg-[#F97316] text-white font-semibold hover:bg-[#EA580C] shadow-lg hover:shadow-[#F97316]/25",
  teal:
    "bg-[#14B8A6] text-white font-semibold hover:bg-[#0D9488] shadow-lg hover:shadow-[#14B8A6]/20",
  tealOutline:
    "border-2 border-[#14B8A6] text-[#14B8A6] font-semibold hover:bg-[#14B8A6] hover:text-white",
  white:
    "bg-white text-[#0D9488] font-semibold hover:bg-[#F0FDFA] shadow-lg",
  whiteOutline:
    "border-2 border-white/70 text-white font-semibold hover:bg-white hover:text-[#0D9488]",
};

const BASE =
  "group/btn inline-flex items-center justify-center tracking-wider rounded-full transition-all duration-300";

/**
 * Unified CTA button — 3 sizes, 5 colors. Use this everywhere instead of
 * one-off button styles so visual hierarchy stays consistent.
 */
export default function CTAButton({
  variant = "md",
  color = "orange",
  href,
  onClick,
  children,
  icon,
  trailingIcon,
  className = "",
  type = "button",
  disabled = false,
  target,
  rel,
  ariaLabel,
}: CTAButtonProps) {
  const classes = `${BASE} ${SIZE[variant]} ${COLOR[color]} ${disabled ? "opacity-60 cursor-not-allowed" : ""} ${className}`;

  const content = (
    <>
      {icon}
      {children}
      {trailingIcon}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
        className={classes}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={classes}
    >
      {content}
    </button>
  );
}
