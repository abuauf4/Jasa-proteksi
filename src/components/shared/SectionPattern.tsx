"use client";

import { useEffect, useRef } from "react";

export const patternTypes = [
  "geometric-diamonds", "hexagon-tech", "circuit-lines", "art-deco-fan",
  "arabesque", "chevron-luxury", "dots-luxury", "damask-ornate",
  "waves-elegant", "morpho-grid", "lattice-squares", "cross-hatch",
  "herringbone", "triangles-abstract",
] as const;

export type PatternType = (typeof patternTypes)[number];

interface SectionPatternProps {
  pattern?: PatternType;
  className?: string;
}

export default function SectionPattern({ pattern, className = "" }: SectionPatternProps) {
  if (!pattern) return null;

  return (
    <div
      className={`absolute inset-0 pointer-events-none z-0 ${className}`}
      style={{
        opacity: 0.04,
        maskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
      }}
    >
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={`p-${pattern}`} x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            {getPatternSvg(pattern)}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#p-${pattern})`} />
      </svg>
    </div>
  );
}

function getPatternSvg(pattern: PatternType): React.ReactNode {
  const stroke = "#c9a84c";
  const sw = 0.5;
  const common = { stroke, strokeWidth: sw, fill: "none" };

  switch (pattern) {
    case "geometric-diamonds":
      return <path d="M30 0 L60 30 L30 60 L0 30Z" {...common} />;
    case "hexagon-tech":
      return <path d="M30 5 L55 17.5 L55 42.5 L30 55 L5 42.5 L5 17.5Z" {...common} />;
    case "circuit-lines":
      return <>
        <line x1="0" y1="30" x2="60" y2="30" {...common} />
        <line x1="30" y1="0" x2="30" y2="60" {...common} />
        <circle cx="30" cy="30" r="3" {...common} />
      </>;
    case "art-deco-fan":
      return <>
        <path d="M0 60 Q30 0 60 60" {...common} />
        <path d="M0 60 Q30 15 60 60" {...common} />
      </>;
    case "arabesque":
      return <path d="M0 30 Q15 0 30 30 Q45 60 60 30" {...common} />;
    case "chevron-luxury":
      return <path d="M0 30 L30 10 L60 30" {...common} />;
    case "dots-luxury":
      return <circle cx="30" cy="30" r="2" fill={stroke} stroke="none" />;
    case "damask-ornate":
      return <>
        <path d="M0 30 Q15 15 30 30 Q45 45 60 30" {...common} />
        <circle cx="30" cy="30" r="4" {...common} />
      </>;
    case "waves-elegant":
      return <path d="M0 30 Q15 15 30 30 Q45 45 60 30" {...common} />;
    case "morpho-grid":
      return <>
        <rect x="5" y="5" width="50" height="50" {...common} />
        <rect x="15" y="15" width="30" height="30" {...common} />
      </>;
    case "lattice-squares":
      return <>
        <rect x="5" y="5" width="25" height="25" {...common} />
        <rect x="30" y="30" width="25" height="25" {...common} />
      </>;
    case "cross-hatch":
      return <>
        <line x1="0" y1="0" x2="60" y2="60" {...common} />
        <line x1="60" y1="0" x2="0" y2="60" {...common} />
      </>;
    case "herringbone":
      return <>
        <line x1="0" y1="0" x2="30" y2="30" {...common} />
        <line x1="30" y1="30" x2="60" y2="0" {...common} />
        <line x1="30" y1="30" x2="0" y2="60" {...common} />
        <line x1="30" y1="30" x2="60" y2="60" {...common} />
      </>;
    case "triangles-abstract":
      return <path d="M30 5 L55 50 L5 50Z" {...common} />;
    default:
      return <circle cx="30" cy="30" r="1.5" fill={stroke} stroke="none" />;
  }
}
