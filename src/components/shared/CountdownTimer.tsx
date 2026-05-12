"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetDate: Date;
  className?: string;
}

export function CountdownTimer({ targetDate, className = "" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const timeUnits = [
    { label: "Hari", value: timeLeft.days },
    { label: "Jam", value: timeLeft.hours },
    { label: "Menit", value: timeLeft.minutes },
    { label: "Detik", value: timeLeft.seconds },
  ];

  return (
    <div className={`flex gap-3 ${className}`}>
      {timeUnits.map((unit) => (
        <div
          key={unit.label}
          className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[60px]"
        >
          <span className="text-2xl font-bold font-[family-name:var(--font-montserrat)] text-white">
            {String(unit.value).padStart(2, "0")}
          </span>
          <span className="text-xs text-white/70 uppercase tracking-wider">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}
