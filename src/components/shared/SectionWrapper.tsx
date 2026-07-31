"use client";

import SectionPattern, { type PatternType } from "./SectionPattern";

interface SectionWrapperProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  dark?: boolean;
  pattern?: PatternType;
}

export default function SectionWrapper({ children, id, className = "", dark = false, pattern }: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`section-padding relative overflow-hidden ${
        dark
          ? "bg-[#0D0D0D] text-white"
          : "text-[#0F172A]"
      } ${className}`}
    >
      {pattern && <SectionPattern pattern={pattern} />}
      {children}
    </section>
  );
}
