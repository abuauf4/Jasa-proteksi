"use client";

import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Single button system for the entire public site.
 * - All variants hit minimum 44px touch target on touch devices (via globals.css).
 * - Primary = teal background (used for the main "Hitung Premi" CTAs).
 * - Secondary = white background, navy border.
 * - Ghost = transparent (used for back buttons).
 * - Navy = navy background (used for high-contrast CTA on light backgrounds).
 */

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] hover:scale-[1.01]",
  {
    variants: {
      variant: {
        primary:
          "bg-[#0F766E] text-white hover:bg-[#0B5C55] active:bg-[#094A44] shadow-sm",
        secondary:
          "bg-white text-[#0F172A] border border-[#E2E8F0] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] active:bg-[#F1F5F9]",
        navy:
          "bg-[#132238] text-white hover:bg-[#0F172A] active:bg-[#0B1322] shadow-sm",
        ghost:
          "bg-transparent text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] active:bg-[#E2E8F0]",
        outline:
          "bg-transparent text-[#0F766E] border border-[#0F766E] hover:bg-[#ECFDF5] active:bg-[#A7F3D0]",
        danger:
          "bg-[#B91C1C] text-white hover:bg-[#991B1B] active:bg-[#7F1D1D] shadow-sm",
      },
      size: {
        sm: "h-9 px-3 text-sm min-h-[44px]",
        md: "h-11 px-5 text-sm min-h-[44px]",
        lg: "h-12 px-6 text-base min-h-[48px]",
        xl: "h-12 px-8 text-base min-h-[48px]",
        icon: "h-11 w-11 min-h-[44px] min-w-[44px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface BaseProps {
  className?: string;
}

interface ButtonAsButton
  extends Omit<BaseProps, "children">,
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  as?: "button";
  href?: never;
  children: React.ReactNode;
}

interface ButtonAsLink
  extends Omit<BaseProps, "children">,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "children">,
    VariantProps<typeof buttonVariants> {
  as: "link";
  href: string;
  children: React.ReactNode;
}

interface ButtonAsExternalLink
  extends Omit<BaseProps, "children">,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "children">,
    VariantProps<typeof buttonVariants> {
  as: "external";
  href: string;
  children: React.ReactNode;
}

type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsExternalLink;

export function Button(props: ButtonProps) {
  const { variant, size, className, children, ...rest } = props;
  const classes = cn(buttonVariants({ variant, size }), className);

  if (props.as === "link") {
    const { as: _as, href, ...anchorRest } = rest as ButtonAsLink;
    void _as;
    return (
      <Link href={href} className={classes} {...anchorRest}>
        {children}
      </Link>
    );
  }

  if (props.as === "external") {
    const { as: _as, href, target = "_blank", rel = "noopener noreferrer", ...anchorRest } =
      rest as ButtonAsExternalLink;
    void _as;
    return (
      <a href={href} target={target} rel={rel} className={classes} {...anchorRest}>
        {children}
      </a>
    );
  }

  const { as: _as, ...buttonRest } = rest as ButtonAsButton;
  void _as;
  return (
    <button className={classes} {...buttonRest}>
      {children}
    </button>
  );
}

export { buttonVariants };
