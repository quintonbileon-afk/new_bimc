import React, { useState, useEffect, useRef } from 'react';

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

  const initialDaysRef = useRef<number>(30);

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        if (initialDaysRef.current === 30 && days > 0) {
          initialDaysRef.current = Math.max(days, 30);
        }

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const daysProgress = Math.min(100, Math.max(0, (timeLeft.days / initialDaysRef.current) * 100));
  const hoursProgress = Math.min(100, Math.max(0, (timeLeft.hours / 24) * 100));
  const minutesProgress = Math.min(100, Math.max(0, (timeLeft.minutes / 60) * 100));
  const secondsProgress = Math.min(100, Math.max(0, (timeLeft.seconds / 60) * 100));

  return (
    <div className={`w-full py-1 flex flex-col items-start justify-start ${className}`}>
      {/* Small uppercase label */}
      <div className="flex items-center gap-2 mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#D81B60]" />
        <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#B8C2D6] font-semibold">
          CONVENES IN
        </span>
      </div>

      {/* Row of four tiles with thin colon separators */}
      <div className="flex flex-row flex-nowrap items-center justify-start gap-1.5 sm:gap-2.5 mb-1">
        {/* Days Tile */}
        <div className="w-[56px] sm:w-[72px] bg-[#132238] border border-[#2F6DB5]/30 rounded-lg p-2 text-center relative overflow-hidden shadow-md flex flex-col items-center justify-center">
          <div className="text-[22px] sm:text-[30px] font-bold font-mono text-white tabular-nums leading-none mb-0.5">
            {String(timeLeft.days).padStart(2, '0')}
          </div>
          <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-[#B8C2D6] font-medium">
            Days
          </div>
          <div 
            className="absolute bottom-0 left-0 h-[2px] bg-[#2F6DB5] transition-all duration-500"
            style={{ width: `${daysProgress}%` }}
          />
        </div>

        <span className="text-slate-600 text-base sm:text-xl font-mono font-bold select-none">:</span>

        {/* Hours Tile */}
        <div className="w-[56px] sm:w-[72px] bg-[#132238] border border-[#2F6DB5]/30 rounded-lg p-2 text-center relative overflow-hidden shadow-md flex flex-col items-center justify-center">
          <div className="text-[22px] sm:text-[30px] font-bold font-mono text-white tabular-nums leading-none mb-0.5">
            {String(timeLeft.hours).padStart(2, '0')}
          </div>
          <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-[#B8C2D6] font-medium">
            Hours
          </div>
          <div 
            className="absolute bottom-0 left-0 h-[2px] bg-[#2F6DB5] transition-all duration-500"
            style={{ width: `${hoursProgress}%` }}
          />
        </div>

        <span className="text-slate-600 text-base sm:text-xl font-mono font-bold select-none">:</span>

        {/* Minutes Tile */}
        <div className="w-[56px] sm:w-[72px] bg-[#132238] border border-[#2F6DB5]/30 rounded-lg p-2 text-center relative overflow-hidden shadow-md flex flex-col items-center justify-center">
          <div className="text-[22px] sm:text-[30px] font-bold font-mono text-white tabular-nums leading-none mb-0.5">
            {String(timeLeft.minutes).padStart(2, '0')}
          </div>
          <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-[#B8C2D6] font-medium">
            Mins
          </div>
          <div 
            className="absolute bottom-0 left-0 h-[2px] bg-[#2F6DB5] transition-all duration-500"
            style={{ width: `${minutesProgress}%` }}
          />
        </div>

        <span className="text-slate-600 text-base sm:text-xl font-mono font-bold select-none">:</span>

        {/* Seconds Tile */}
        <div className="w-[56px] sm:w-[72px] bg-[#132238] border border-[#2F6DB5]/30 rounded-lg p-2 text-center relative overflow-hidden shadow-md flex flex-col items-center justify-center">
          <div className="text-[22px] sm:text-[30px] font-bold font-mono text-white tabular-nums leading-none mb-0.5">
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
          <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-[#B8C2D6] font-medium">
            Secs
          </div>
          <div 
            className="absolute bottom-0 left-0 h-[2px] bg-[#2F6DB5] transition-all duration-500"
            style={{ width: `${secondsProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
