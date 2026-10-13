import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string;
  className?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, className = '' }) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className={`w-full border-y border-white/[0.08] bg-[#0A1428]/80 backdrop-blur-sm py-3 px-4 text-center ${className}`}>
      <div className="max-w-[1200px] mx-auto flex items-center justify-center gap-3 sm:gap-6 text-xs text-[#B8C2D6]">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#2F6DB5] font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D81B60] animate-pulse" />
          Convenes In
        </span>

        <div className="font-mono text-xs sm:text-sm font-semibold text-white tabular-nums tracking-wider flex items-center gap-1">
          <span>{timeLeft.days}<span className="text-white/40 text-[10px] ml-0.5 mr-1.5">d</span></span>
          <span>{String(timeLeft.hours).padStart(2, '0')}<span className="text-white/40 text-[10px] ml-0.5 mr-1.5">h</span></span>
          <span>{String(timeLeft.minutes).padStart(2, '0')}<span className="text-white/40 text-[10px] ml-0.5 mr-1.5">m</span></span>
          <span className="text-[#D81B60]">{String(timeLeft.seconds).padStart(2, '0')}<span className="text-[#D81B60]/60 text-[10px] ml-0.5">s</span></span>
        </div>

        <span className="text-white/10 hidden sm:inline select-none">|</span>
        <span className="text-[11px] text-[#B8C2D6] hidden md:inline font-normal">
          Royal Aria Conference Centre · Plenary Hall
        </span>
      </div>
    </div>
  );
};
