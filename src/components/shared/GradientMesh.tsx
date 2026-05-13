"use client";

import { motion } from "framer-motion";

const variants = {
  "gold-aurora": [
    { color: "rgba(201, 168, 76, 0.08)", x: "20%", y: "20%", size: "600px" },
    { color: "rgba(201, 168, 76, 0.05)", x: "70%", y: "60%", size: "500px" },
    { color: "rgba(30, 30, 60, 0.1)", x: "50%", y: "40%", size: "700px" },
  ],
  "midnight-bloom": [
    { color: "rgba(26, 26, 46, 0.15)", x: "30%", y: "30%", size: "500px" },
    { color: "rgba(201, 168, 76, 0.04)", x: "60%", y: "70%", size: "600px" },
    { color: "rgba(60, 60, 120, 0.08)", x: "80%", y: "20%", size: "400px" },
  ],
  "deep-ocean": [
    { color: "rgba(20, 40, 80, 0.12)", x: "40%", y: "30%", size: "600px" },
    { color: "rgba(201, 168, 76, 0.04)", x: "20%", y: "70%", size: "500px" },
    { color: "rgba(10, 20, 60, 0.1)", x: "70%", y: "50%", size: "700px" },
  ],
  "ember-glow": [
    { color: "rgba(201, 168, 76, 0.1)", x: "50%", y: "50%", size: "600px" },
    { color: "rgba(180, 80, 20, 0.06)", x: "30%", y: "70%", size: "400px" },
    { color: "rgba(201, 168, 76, 0.04)", x: "70%", y: "30%", size: "500px" },
  ],
};

type Variant = keyof typeof variants;

interface GradientMeshProps {
  variant?: Variant;
  className?: string;
}

export default function GradientMesh({ variant = "gold-aurora", className = "" }: GradientMeshProps) {
  const blobs = variants[variant] || variants["gold-aurora"];

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-[100px]"
          style={{
            background: blob.color,
            left: blob.x,
            top: blob.y,
            width: blob.size,
            height: blob.size,
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 30, 0],
          }}
          transition={{
            duration: 15 + i * 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
