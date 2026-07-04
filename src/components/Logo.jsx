import React from 'react';

export const LogoWordmark = ({ className = "" }) => {
  const hasTextSize = /\btext-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl)\b/.test(className);
  const sizeClass = hasTextSize ? "" : "text-2xl md:text-3xl";

  return (
    <span 
      className={`font-display font-black tracking-tight select-none inline-block ${sizeClass} ${className}`}
      role="img"
      aria-label="neurodivers three"
    >
      neurodivers<span className="text-accent ml-0.5" style={{ fontSize: '0.65em', verticalAlign: '0.35em', lineHeight: 0 }}>3</span>
    </span>
  );
};

export const LogoPrimaryFlat = ({ className = "" }) => {
  const hasTextSize = /\btext-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl)\b/.test(className);
  const sizeClass = hasTextSize ? "" : "text-3xl md:text-4xl";

  return (
    <span 
      className={`font-display font-black tracking-tight select-none inline-block ${sizeClass} ${className}`}
      role="img"
      aria-label="neurodivers three"
    >
      neurodivers<span className="text-accent ml-0.5" style={{ fontSize: '0.65em', verticalAlign: '0.35em', lineHeight: 0 }}>3</span>
    </span>
  );
};
