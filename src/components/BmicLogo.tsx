import React from 'react';

interface BmicLogoProps {
  className?: string;
  variant?: 'full' | 'mark-only' | 'stacked' | 'compact';
  theme?: 'light' | 'dark' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const BmicLogo: React.FC<BmicLogoProps> = ({
  className = '',
  variant = 'full',
  theme = 'dark',
  size = 'md',
}) => {
  // Dot matrix configuration from BMIC_logo_dark_lightblue.png
  // [col, row, type: 'magenta' | 'lightblue']
  // 7 columns (0..6) x 11 rows (0..10)
  const dots: [number, number, 'magenta' | 'lightblue'][] = [
    // Column 0 (Leftmost)
    [0, 0, 'magenta'],
    [0, 2, 'magenta'],
    [0, 3, 'magenta'],
    [0, 6, 'magenta'],
    [0, 7, 'magenta'],
    [0, 9, 'magenta'],
    [0, 10, 'magenta'],

    // Column 1
    [1, 0, 'magenta'],
    [1, 10, 'magenta'],

    // Column 2
    [2, 1, 'magenta'],
    [2, 4, 'magenta'],
    [2, 5, 'magenta'],
    [2, 9, 'magenta'],

    // Column 3
    [3, 0, 'lightblue'],
    [3, 1, 'lightblue'],
    [3, 2, 'magenta'],
    [3, 3, 'magenta'],
    [3, 5, 'magenta'],
    [3, 6, 'magenta'],
    [3, 7, 'magenta'],
    [3, 8, 'magenta'],
    [3, 9, 'lightblue'],
    [3, 10, 'lightblue'],

    // Column 4
    [4, 0, 'lightblue'],
    [4, 1, 'lightblue'],
    [4, 2, 'lightblue'],
    [4, 3, 'lightblue'],
    [4, 4, 'lightblue'],
    [4, 5, 'lightblue'],
    [4, 6, 'lightblue'],
    [4, 7, 'lightblue'],
    [4, 8, 'lightblue'],
    [4, 9, 'lightblue'],
    [4, 10, 'lightblue'],

    // Column 5
    [5, 0, 'lightblue'],
    [5, 1, 'lightblue'],
    [5, 2, 'lightblue'],
    [5, 3, 'lightblue'],
    [5, 6, 'lightblue'],
    [5, 7, 'lightblue'],
    [5, 8, 'lightblue'],
    [5, 9, 'lightblue'],
    [5, 10, 'lightblue'],

    // Column 6
    [6, 1, 'lightblue'],
    [6, 2, 'lightblue'],
    [6, 7, 'lightblue'],
    [6, 8, 'lightblue'],
  ];

  // Progressive shrinking dot radius from col 0 to col 6
  const getRadius = (col: number) => {
    const radii = [6.8, 6.2, 5.6, 5.0, 4.4, 3.8, 3.2];
    return radii[col] || 4.5;
  };

  // Exact brand colors from BMIC_logo_dark_lightblue.png
  const magentaColor = '#FF2A7A';
  const lightBlueColor = '#82B4EE';

  const markSizes = {
    sm: 'w-7 h-9',
    md: 'w-10 h-13',
    lg: 'w-14 h-18',
    xl: 'w-20 h-26',
  };

  const textSizes = {
    sm: 'text-[9px] leading-[10px] tracking-[0.14em]',
    md: 'text-[12px] leading-[13px] tracking-[0.14em]',
    lg: 'text-[16px] leading-[18px] tracking-[0.15em]',
    xl: 'text-[24px] leading-[26px] tracking-[0.16em]',
  };

  const renderMark = () => (
    <svg
      viewBox="0 0 115 170"
      className={`${markSizes[size]} shrink-0`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="BMIC Logo Emblem"
    >
      {dots.map(([col, row, type], idx) => {
        const cx = 10 + col * 15.5;
        const cy = 10 + row * 15;
        const r = getRadius(col);
        const fill = type === 'magenta' ? magentaColor : lightBlueColor;
        return (
          <circle
            key={idx}
            cx={cx}
            cy={cy}
            r={r}
            fill={fill}
          />
        );
      })}
    </svg>
  );

  if (variant === 'mark-only') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        {renderMark()}
      </div>
    );
  }

  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center text-center gap-3 ${className}`}>
        {renderMark()}
        <div className="font-serif uppercase font-bold select-none">
          <div style={{ color: lightBlueColor }} className={textSizes[size]}>BOTSWANA</div>
          <div style={{ color: magentaColor }} className={textSizes[size]}>MOBILE &amp;</div>
          <div style={{ color: magentaColor }} className={textSizes[size]}>INTERNET</div>
          <div style={{ color: lightBlueColor }} className={textSizes[size]}>CONGRESS</div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-3.5 ${className}`}>
        {renderMark()}
        <div className="flex flex-col justify-center font-serif uppercase font-bold select-none">
          <span style={{ color: lightBlueColor }} className={`${textSizes[size]} transition-colors`}>
            BOTSWANA
          </span>
          <span style={{ color: magentaColor }} className={`${textSizes[size]} transition-colors`}>
            MOBILE &amp; INTERNET
          </span>
          <span style={{ color: lightBlueColor }} className={`${textSizes[size]} transition-colors`}>
            CONGRESS
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3.5 ${className}`}>
      {renderMark()}
      <div className="flex flex-col justify-center font-serif uppercase font-bold select-none">
        <span style={{ color: lightBlueColor }} className={`${textSizes[size]} transition-colors`}>
          BOTSWANA
        </span>
        <span style={{ color: magentaColor }} className={`${textSizes[size]} transition-colors`}>
          MOBILE &amp;
        </span>
        <span style={{ color: magentaColor }} className={`${textSizes[size]} transition-colors`}>
          INTERNET
        </span>
        <span style={{ color: lightBlueColor }} className={`${textSizes[size]} transition-colors`}>
          CONGRESS
        </span>
      </div>
    </div>
  );
};
