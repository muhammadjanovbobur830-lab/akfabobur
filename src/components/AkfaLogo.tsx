import React from 'react';

interface AkfaLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AkfaLogo: React.FC<AkfaLogoProps> = ({ className = '', size = 'md' }) => {
  const iconSize = size === 'sm' ? 26 : size === 'lg' ? 40 : 32;
  const textClass =
    size === 'sm'
      ? 'text-base sm:text-lg font-extrabold tracking-tight'
      : size === 'lg'
        ? 'text-xl sm:text-2xl font-extrabold tracking-tight'
        : 'text-base sm:text-xl font-extrabold tracking-tight';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none whitespace-nowrap shrink-0 ${className}`}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="36" height="36" rx="8" fill="#D91E2A" />
        {/* Architectural window cross-section motif */}
        <rect x="7" y="7" width="22" height="22" rx="2.5" stroke="#FFFFFF" strokeWidth="2.4" />
        <line x1="18" y1="7" x2="18" y2="29" stroke="#FFFFFF" strokeWidth="2.2" />
        <line x1="7" y1="18" x2="18" y2="18" stroke="#FFFFFF" strokeWidth="2" />
        {/* Opening triangle hint */}
        <path
          d="M20 9.5L26.5 18L20 26.5"
          stroke="#FFFFFF"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.85"
        />
      </svg>
      <span className={`${textClass} text-[#0F172A]`}>AKFI Deraza</span>
    </div>
  );
};
