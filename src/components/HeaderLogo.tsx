import React from 'react';
import { BmicLogo } from './BmicLogo';

interface HeaderLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const HeaderLogo: React.FC<HeaderLogoProps> = ({ className = '', size = 'sm' }) => {
  return <BmicLogo className={className} size={size} />;
};
