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
          ? "bg-[#00001f] dark:bg-[#00001f] text-white"
          : "bg-background dark:bg-[#0a0a2e] text-foreground"
      } ${className}`}
    >
      {pattern && <SectionPattern pattern={pattern} />}
      {children}
    </section>
  );
}
