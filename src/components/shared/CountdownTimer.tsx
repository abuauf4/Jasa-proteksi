"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetDate: Date;
  className?: string;
  compact?: boolean;
}

export default function CountdownTimer({ targetDate, className = "", compact = false }: CountdownTimerProps) {
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

  if (compact) {
    return (
      <div className={`flex gap-2 ${className}`}>
        {timeUnits.map((unit, i) => (
          <div key={unit.label} className="flex items-center gap-2">
            <div className="flex flex-col items-center bg-white/5 backdrop-blur-sm rounded-md px-2.5 py-1.5 min-w-[48px] border border-white/10">
              <span className="text-lg font-bold font-[family-name:var(--font-montserrat)] text-white">
                {String(unit.value).padStart(2, "0")}
              </span>
              <span className="text-[10px] text-white/50 uppercase tracking-widest">{unit.label}</span>
            </div>
            {i < timeUnits.length - 1 && (
              <span className="text-[#2E7D6F] font-bold text-lg">:</span>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex gap-3 ${className}`}>
      {timeUnits.map((unit) => (
        <div
          key={unit.label}
          className="flex flex-col items-center bg-white/10 backdrop-blur-md rounded-lg px-4 py-3 min-w-[64px] border border-white/10"
        >
          <span className="text-2xl font-bold font-[family-name:var(--font-montserrat)] text-white">
            {String(unit.value).padStart(2, "0")}
          </span>
          <span className="text-[10px] text-white/60 uppercase tracking-widest mt-1">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}
