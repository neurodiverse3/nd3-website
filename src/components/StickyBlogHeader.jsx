"use client";
import React, { useState, useEffect } from 'react';

export function StickyBlogHeader({ title, readTime }) {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // 1. Show header after scrolling past ~400px (where main navbar slides out)
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // 2. Reading progress calculation through #blog-content container
      const element = document.getElementById('blog-content');
      if (element) {
        const rect = element.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        
        const bodyStart = rect.top + scrollTop;
        const bodyEnd = bodyStart + rect.height;
        const viewportHeight = window.innerHeight;
        
        const startOffset = 120; // Sync offset with TOC scroll offset
        const startPos = bodyStart - startOffset;
        const endPos = bodyEnd - viewportHeight;
        
        let pct = 0;
        if (scrollTop > startPos) {
          if (scrollTop < endPos) {
            pct = (scrollTop - startPos) / (endPos - startPos);
          } else {
            pct = 1;
          }
        }
        setProgress(pct * 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on load to establish state
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-50 bg-[var(--surface,var(--bg))]/98 backdrop-blur-md border-b-2 border-border-rule/90 shadow-[0_8px_30px_rgb(0,0,0,0.8)] transition-transform duration-300 ease-in-out select-none ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-20 lg:h-24 flex items-center justify-between gap-6 relative">
        {/* Left Side: Article Title */}
        <div className="flex-grow max-w-[70%] pr-4 md:pr-0">
          <span className="text-xs md:text-sm font-mono tracking-widest text-accent-pink uppercase block font-bold mb-1">
            CURRENTLY READING
          </span>
          <h2 className="text-sm md:text-base font-black uppercase tracking-wide text-fg-primary truncate font-display leading-tight">
            {title}
          </h2>
        </div>

        {/* Right Side: "↑ Top" obvious pill button */}
        <div className="flex items-center shrink-0">
          
          <button
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-4 py-2 border-2 border-accent-pink bg-accent-pink-soft text-accent-pink hover:bg-accent-pink hover:text-bg-primary font-mono text-xs md:text-sm font-black uppercase tracking-widest transition-all duration-200 select-none shadow-[2px_2px_0px_var(--accent)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 focus-ring cursor-pointer"
            aria-label="Scroll back to top of the article"
          >
            ↑ TOP
          </button>
        </div>
      </div>

      {/* Dynamic reading progress bar - full viewport width (outside max-width container) */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-border-rule/50 overflow-hidden">
        <div 
          className="h-full transition-all duration-75 ease-out origin-left" 
          style={{ width: `${progress}%`, background: 'var(--grad-progress)' }}
        />
      </div>
    </div>
  );
}

export default StickyBlogHeader;
