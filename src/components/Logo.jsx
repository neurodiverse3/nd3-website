import React from 'react';

export const LogoWordmark = ({ className = "" }) => {
  const hasHeight = /\b(h-\d+|h-\[.*?\])\b/.test(className);
  const defaultHeight = hasHeight ? "" : "h-8 md:h-10";

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 300 70" 
      className={`${defaultHeight} aspect-[300/70] select-none ${className}`}
      role="img"
      aria-label="neurodivers three"
    >
      <text 
        x="0" 
        y="54" 
        fontFamily="var(--font-display), system-ui, -apple-system, sans-serif" 
        fontSize="48" 
        fontWeight="900" 
        fill="currentColor" 
        letterSpacing="-0.02em"
      >
        neurodivers<tspan dx="2" dy="-14" fontSize="34" fontWeight="900" fill="var(--accent-label, var(--accent))">3</tspan>
      </text>
    </svg>
  );
};

export const LogoPrimaryFlat = ({ className = "" }) => {
  const hasHeight = /\b(h-\d+|h-\[.*?\])\b/.test(className);
  const defaultHeight = hasHeight ? "" : "h-12";

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 360 80" 
      className={`${defaultHeight} aspect-[360/80] select-none ${className}`}
      role="img"
      aria-label="neurodivers three"
    >
      <text 
        x="0" 
        y="60" 
        fontFamily="var(--font-display), system-ui, -apple-system, sans-serif" 
        fontSize="56" 
        fontWeight="900" 
        fill="currentColor" 
        letterSpacing="-0.02em"
      >
        neurodivers<tspan dx="2" dy="-16" fontSize="40" fontWeight="900" fill="var(--accent-label, var(--accent))">3</tspan>
      </text>
    </svg>
  );
};
