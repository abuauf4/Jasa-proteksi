import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Container — max-width 1200px wrapper with mobile-first horizontal padding (20px).
 */
export function Container({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("ds-container", className)} {...props}>
      {children}
    </div>
  );
}

/**
 * Section — page section with vertical padding (72px mobile, 96px desktop).
 * Use `tone` to alternate background colors.
 */
interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  tone?: "white" | "soft" | "slate" | "navy";
  as?: "section" | "div" | "header" | "footer" | "main" | "nav" | "aside";
}

export function Section({
  className,
  children,
  tone = "white",
  as: Tag = "section",
  ...props
}: SectionProps) {
  const toneClass =
    tone === "soft"
      ? "ds-bg-soft"
      : tone === "slate"
      ? "ds-bg-slate"
      : tone === "navy"
      ? "ds-bg-navy"
      : "ds-bg-white";
  return (
    <Tag className={cn("ds-section", toneClass, className)} {...props}>
      {children}
    </Tag>
  );
}

/**
 * SectionHeader — consistent section title block with optional eyebrow label.
 */
interface SectionHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" ? "items-center text-center mx-auto max-w-2xl" : "items-start text-left",
        className
      )}
    >
      {eyebrow && (
        <span className="ds-label inline-flex items-center gap-2">
          <span className="ds-accent-line" aria-hidden />
          {eyebrow}
        </span>
      )}
      <h2 className="ds-h2">{title}</h2>
      {description && (
        <p className="ds-body-lg max-w-xl text-[#475569]">{description}</p>
      )}
    </div>
  );
}

/**
 * Card — unified card component with the standard design system padding & radius.
 */
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "lg" | "calc";
}

export function Card({ className, children, variant = "default", ...props }: CardProps) {
  const cls =
    variant === "lg" ? "ds-card-lg" : variant === "calc" ? "ds-card-calc" : "ds-card";
  return (
    <div className={cn(cls, className)} {...props}>
      {children}
    </div>
  );
}

/**
 * Badge — small pill label.
 */
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "teal" | "navy";
}

export function Badge({ className, children, variant = "teal", ...props }: BadgeProps) {
  const cls = variant === "navy" ? "ds-badge-navy" : "ds-badge";
  return (
    <span className={cn(cls, className)} {...props}>
      {children}
    </span>
  );
}
