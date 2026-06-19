import React from 'react';

export default function PageHeader({
  variant = 'section',
  eyebrow,
  titleLabel,
  titleAccent,
  subtitle,
}) {
  if (variant === 'hero') {
    return (
      <header className="relative w-full flex flex-col items-start text-left pt-[100px] md:pt-[120px] pb-12 select-none z-10">
        {eyebrow && (
          <div className="inline-block text-[11px] font-mono tracking-[0.2em] text-[var(--accent-label,var(--accent))] bg-[var(--accent-soft)] px-[10px] py-[4px] uppercase border border-accent/15 rounded-[6px] mb-6 select-none">
            {eyebrow}
          </div>
        )}

        <h1 className="text-5xl md:text-[8rem] font-black leading-[1.05] tracking-[-0.02em] uppercase mb-4 md:mb-8 font-display">
          <div className="block">
            <span className="text-fg">UNMASKED</span>
            <span className="inline-block text-accent ml-0.5">.</span>
          </div>
          <div className="block italic home-hero-gradient">
            <span>UNFILTERED</span>
            <span className="inline-block ml-0.5 text-accent">.</span>
          </div>
          <div className="block">
            <span className="text-fg">UNAPOLOGETIC</span>
            <span className="inline-block text-accent ml-0.5">.</span>
          </div>
        </h1>

        {subtitle && (
          <p className="text-base md:text-2xl text-muted max-w-[48ch] leading-relaxed font-normal mt-4">
            {subtitle}
          </p>
        )}

        {/* Hero watermark: ghosted ³ glyph bottom-right */}
        <div 
          className="absolute bottom-24 right-24 text-[240px] sm:text-[360px] md:text-[480px] font-black leading-none text-accent select-none pointer-events-none z-0 hidden min-[480px]:block"
          style={{ opacity: 0.06 }}
          aria-hidden="true"
        >
          ³
        </div>
      </header>
    );
  }

  // Type 2 — Section header (every other page)
  return (
    <header className="relative w-full flex flex-col items-start text-left mt-4 mb-12 select-none">
      {eyebrow && (
        <div className="inline-block text-[11px] font-mono tracking-[0.2em] text-[var(--accent-label,var(--accent))] bg-[var(--accent-soft)] px-[10px] py-[4px] uppercase border border-accent/15 rounded-[6px] mb-3 select-none">
          {eyebrow}
        </div>
      )}

      <h1 className="text-4xl md:text-[4.5rem] font-extrabold uppercase leading-[0.95] tracking-tight font-display text-fg">
        {titleLabel}
        {titleAccent && (
          <>
            <span className="text-fg/30 font-normal"> · </span>
            <span className="italic font-light text-[var(--accent-label,var(--accent))]">{titleAccent}</span>
          </>
        )}
        <span className="text-accent">.</span>
      </h1>

      {subtitle && (
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted font-normal">
          {subtitle}
        </p>
      )}

      {/* 1px rule, white at ~12% opacity (white/12) */}
      <div className="w-full h-[1px] bg-white/12 mt-6" />
    </header>
  );
}
