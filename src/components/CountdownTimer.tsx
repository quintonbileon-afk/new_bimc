import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string; // ISO date
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
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

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <div className="inline-flex items-center gap-2 sm:gap-3 p-2 rounded-2xl glass-panel-dark border border-white/10 shadow-2xl">
      {units.map((unit, index) => (
        <React.Fragment key={unit.label}>
          <div className="flex flex-col items-center justify-center min-w-[56px] sm:min-w-[68px] py-2 px-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">
            <span className="font-mono text-xl sm:text-2xl font-extrabold text-white tracking-tight tabular-nums">
              {String(unit.value).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-[11px] font-medium tracking-wider text-slate-400 uppercase mt-0.5">
              {unit.label}
            </span>
          </div>
          {index < units.length - 1 && (
            <span className="text-slate-500 font-bold text-sm select-none" aria-hidden="true">
              :
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
