"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  once?: boolean;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  staggerDelay?: number;
}

export default function TextReveal({
  text,
  className = "",
  delay = 0,
  once = true,
  as: Tag = "h2",
  staggerDelay = 0.03,
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-60px" });

  const words = text.split(" ");

  return (
    <Tag ref={ref as React.Ref<HTMLHeadingElement & HTMLParagraphElement & HTMLSpanElement>} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
          <motion.span
            className="inline-block"
            initial={{ y: "100%", opacity: 0 }}
            animate={isInView ? { y: "0%", opacity: 1 } : { y: "100%", opacity: 0 }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
              delay: delay + i * staggerDelay,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
