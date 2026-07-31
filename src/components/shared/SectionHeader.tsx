"use client";

type AccentColor = "primary" | "dark" | "emerald";
type Align = "left" | "center";

interface SectionHeaderProps {
  label: string;
  heading: string;
  subheading?: string;
  accent?: AccentColor;
  align?: Align;
  headingColor?: string;
  subheadingColor?: string;
  className?: string;
}

const ACCENT_TEXT: Record<AccentColor, string> = {
  primary: "text-[#0F766E]",
  dark: "text-[#0B5F59]",
  emerald: "text-[#15803D]",
};

/**
 * Unified section header — label + accent line + heading + optional subheading.
 */
export default function SectionHeader({
  label,
  heading,
  subheading,
  accent = "primary",
  align = "center",
  headingColor = "text-[#172033]",
  subheadingColor = "text-[#64748B]",
  className = "",
}: SectionHeaderProps) {
  const isCenter = align === "center";

  return (
    <div
      className={`${isCenter ? "text-center" : "text-left"} mb-12 lg:mb-16 ${className}`}
    >
      <div className={`flex ${isCenter ? "justify-center" : "justify-start"} mb-4`}>
        <div className="ds-accent-line" />
      </div>
      <span className={`ds-label ${ACCENT_TEXT[accent]}`}>{label}</span>
      <h2 className={`ds-h2 font-bold ${headingColor} mt-3 sm:mt-4`}>
        {heading}
      </h2>
      {subheading && (
        <p
          className={`ds-body-lg ${subheadingColor} mt-4 sm:mt-6 ${isCenter ? "max-w-2xl mx-auto" : "max-w-md"}`}
        >
          {subheading}
        </p>
      )}
    </div>
  );
}
