"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useCallback } from "react";

interface RateInputProps {
  /** The current value as a decimal (e.g. 0.0382 for 3.82%) */
  value: number | null | undefined;
  /** Called with the new decimal value when the user changes the percentage */
  onChange: (decimalValue: number | null) => void;
  /** Label text displayed above the input */
  label?: string;
  /** Step for the number input (default: 0.01) */
  step?: number;
  /** Minimum percentage value (default: 0) */
  min?: number;
  /** Maximum percentage value (default: 100) */
  max?: number;
  /** Placeholder text */
  placeholder?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Additional CSS classes for the input */
  className?: string;
  /** Whether to show the decimal helper text (default: true) */
  showDecimalHelper?: boolean;
  /** Whether the input is disabled */
  disabled?: boolean;
}

/**
 * Reusable rate input component that:
 * - Accepts percentage input from the user (e.g. "3.82" for 3.82%)
 * - Converts to/from decimal internally (3.82% = 0.0382)
 * - Shows a "%" suffix label
 * - Has a helper text showing the decimal equivalent
 */
export default function RateInput({
  value,
  onChange,
  label,
  step = 0.01,
  min = 0,
  max = 100,
  placeholder = "0.00",
  required = false,
  className = "",
  showDecimalHelper = true,
  disabled = false,
}: RateInputProps) {
  // Local state for the displayed percentage value
  const [displayValue, setDisplayValue] = useState<string>("");

  // Convert decimal to percentage for display
  const decimalToPercent = useCallback(
    (decimal: number | null | undefined): string => {
      if (decimal === null || decimal === undefined || isNaN(decimal))
        return "";
      const percent = decimal * 100;
      // Remove trailing zeros for cleaner display
      return parseFloat(percent.toFixed(6)).toString();
    },
    []
  );

  // Sync display value when external value changes
  useEffect(() => {
    setDisplayValue(decimalToPercent(value));
  }, [value, decimalToPercent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setDisplayValue(raw);

    if (raw === "" || raw === "-") {
      onChange(null);
      return;
    }

    const percent = parseFloat(raw);
    if (isNaN(percent)) return;

    // Convert percentage to decimal
    const decimal = percent / 100;
    onChange(decimal);
  };

  const currentDecimal =
    value !== null && value !== undefined && !isNaN(value) ? value : null;
  const decimalDisplay =
    currentDecimal !== null ? currentDecimal.toFixed(6) : "";

  return (
    <div className="space-y-2">
      {label && (
        <Label>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <div className="relative">
        <Input
          type="number"
          step={step}
          min={min}
          max={max}
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`pr-8 ${className}`}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 pointer-events-none">
          %
        </span>
      </div>
      {showDecimalHelper && decimalDisplay && (
        <p className="text-xs text-slate-400">
          Nilai desimal: {decimalDisplay}
        </p>
      )}
    </div>
  );
}
