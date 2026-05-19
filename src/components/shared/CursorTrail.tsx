"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";

interface TrailDot {
  id: number;
  x: number;
  y: number;
}

export default function CursorTrail() {
  const [dots, setDots] = useState<TrailDot[]>([]);
  const [isDesktop, setIsDesktop] = useState(false);
  const counterRef = useRef(0);

  useEffect(() => {
    setIsDesktop(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    let timeout: NodeJS.Timeout;
    const move = (e: MouseEvent) => {
      const id = counterRef.current++;
      setDots((prev) => [...prev.slice(-15), { id, x: e.clientX, y: e.clientY }]);
      clearTimeout(timeout);
      timeout = setTimeout(() => setDots([]), 500);
    };

    document.addEventListener("mousemove", move);
    return () => {
      document.removeEventListener("mousemove", move);
      clearTimeout(timeout);
    };
  }, [isDesktop]);

  if (!isDesktop) return null;

  return (
    <>
      {dots.map((dot, i) => (
        <motion.div
          key={dot.id}
          className="fixed top-0 left-0 w-1 h-1 rounded-full bg-[#2E7D6F] pointer-events-none z-[9998]"
          initial={{ opacity: 0.4, scale: 1 }}
          animate={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ left: dot.x, top: dot.y }}
        />
      ))}
    </>
  );
}
