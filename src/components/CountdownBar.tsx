import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

interface CountdownBarProps {
  onDownloadIcs: () => void;
}

export const CountdownBar: React.FC<CountdownBarProps> = ({ onDownloadIcs }) => {
  // Target: 30 October 2026, 08:00 CAT (UTC+2)
  const targetEpoch = new Date('2026-10-30T08:00:00+02:00').getTime();

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
  }>({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const now = Date.now();
      const diff = Math.max(0, targetEpoch - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);

      setTimeLeft({ days, hours, minutes });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 60000);
    return () => clearInterval(interval);
  }, [targetEpoch]);

  return (
    <div className="bg-[#F7F8FA] border-b border-slate-200 text-[#0A1428] py-3.5 px-6">
      <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-medium">
        <div className="flex items-center gap-2 text-slate-700">
          <span className="w-2 h-2 rounded-full bg-[#D81B60]" aria-hidden="true" />
          <span>
            Congress convenes in{' '}
            <strong className="text-[#0A1428] font-semibold font-mono">
              {timeLeft.days} days {timeLeft.hours} hrs {timeLeft.minutes} min
            </strong>
          </span>
        </div>

        <button
          type="button"
          onClick={onDownloadIcs}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2F6DB5] hover:text-[#0A1428] hover:underline transition-colors ml-auto"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Save to calendar (.ics)</span>
        </button>
      </div>
    </div>
  );
};
