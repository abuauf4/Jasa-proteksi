"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";

interface AnimatedFormInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  className?: string;
}

export default function AnimatedFormInput({
  label,
  type = "text",
  value,
  onChange,
  multiline = false,
  rows = 4,
  required = false,
  className = "",
}: AnimatedFormInputProps) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const isActive = focused || value.length > 0;

  const InputComponent = multiline ? "textarea" : "input";

  return (
    <div className={`relative ${className}`}>
      <InputComponent
        ref={inputRef as never}
        type={multiline ? undefined : type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        rows={multiline ? rows : undefined}
        className="w-full bg-transparent border-b border-white/20 focus:border-[#2E7D6F] py-3 pt-6 text-white text-sm outline-none transition-colors duration-300 resize-none placeholder-transparent peer"
        placeholder={label}
      />
      {/* Floating label */}
      <motion.label
        className="absolute left-0 text-white/40 pointer-events-none transition-all duration-300"
        animate={{
          top: isActive ? "0px" : "18px",
          fontSize: isActive ? "10px" : "14px",
          color: focused ? "#2E7D6F" : "rgba(255,255,255,0.4)",
        }}
        transition={{ duration: 0.2 }}
      >
        {label}
      </motion.label>
      {/* Emerald underline animation */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] bg-[#2E7D6F]"
        initial={{ width: "0%" }}
        animate={{ width: focused ? "100%" : "0%" }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
