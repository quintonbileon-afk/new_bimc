import React from 'react';

interface HeaderDotsProps {
  className?: string;
  dotSize?: 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark';
  fading?: boolean;
}

export const HeaderDots: React.FC<HeaderDotsProps> = ({
  className = '',
  dotSize = 'md',
  theme = 'dark',
  fading = true,
}) => {
  const baseSizes = {
    sm: [5, 4.5, 4, 3.5, 3],
    md: [7, 6.2, 5.5, 4.7, 4],
    lg: [9, 8, 7, 6, 5],
  };

  const currentSizes = baseSizes[dotSize];

  return (
    <div
      className={`inline-flex items-center gap-1.5 ${className}`}
      aria-hidden="true"
    >
      {/* 5 Magenta dots with subtle fade */}
      {currentSizes.map((size, i) => (
        <span
          key={`magenta-${i}`}
          style={{
            width: fading ? `${size}px` : dotSize === 'sm' ? '5px' : dotSize === 'lg' ? '9px' : '7px',
            height: fading ? `${size}px` : dotSize === 'sm' ? '5px' : dotSize === 'lg' ? '9px' : '7px',
            backgroundColor: '#FF2A7A',
            boxShadow: theme === 'dark' ? '0 0 8px rgba(255, 42, 122, 0.4)' : 'none',
          }}
          className="rounded-full shrink-0 transition-transform duration-300"
        />
      ))}

      {/* Subtle separator space */}
      <span className="w-1" />

      {/* 5 Light Blue dots with network progression */}
      {currentSizes.map((size, i) => (
        <span
          key={`blue-${i}`}
          style={{
            width: fading ? `${size}px` : dotSize === 'sm' ? '5px' : dotSize === 'lg' ? '9px' : '7px',
            height: fading ? `${size}px` : dotSize === 'sm' ? '5px' : dotSize === 'lg' ? '9px' : '7px',
            backgroundColor: '#82B4EE',
            boxShadow: theme === 'dark' ? '0 0 8px rgba(130, 180, 238, 0.4)' : 'none',
          }}
          className="rounded-full shrink-0 transition-transform duration-300"
        />
      ))}
    </div>
  );
};
