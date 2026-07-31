"use client";

import { useRef, useState, useCallback } from "react";

interface AnimatedBorderProps {
  children: React.ReactNode;
  className?: string;
  borderWidth?: number;
  borderRadius?: number;
  borderColor?: string;
}

export default function AnimatedBorder({
  children,
  className = "",
  borderWidth = 1,
  borderRadius = 12,
  borderColor = "#0D9488",
}: AnimatedBorderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{ borderRadius }}
    >
      {/* Animated gradient border */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          borderRadius,
          padding: borderWidth,
          opacity: isHovering ? 1 : 0,
          background: isHovering
            ? `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, ${borderColor}, transparent 50%)`
            : "transparent",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      {children}
    </div>
  );
}
