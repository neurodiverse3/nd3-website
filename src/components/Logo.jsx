import React from 'react';

export const LogoWordmark = ({ className = "" }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 300 70" 
      className={`h-8 md:h-10 w-auto select-none ${className}`}
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
        neurodivers
      </text>
      <text 
        x="274" 
        y="38" 
        fontFamily="var(--font-display), system-ui, -apple-system, sans-serif" 
        fontSize="34" 
        fontWeight="900" 
        fill="var(--accent)"
      >
        3
      </text>
    </svg>
  );
};

export const LogoPrimaryFlat = ({ className = "" }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 360 80" 
      className={`h-12 w-auto select-none ${className}`}
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
        neurodivers
      </text>
      <text 
        x="320" 
        y="44" 
        fontFamily="var(--font-display), system-ui, -apple-system, sans-serif" 
        fontSize="40" 
        fontWeight="900" 
        fill="var(--accent)"
      >
        3
      </text>
    </svg>
  );
};

