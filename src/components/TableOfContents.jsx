"use client";
import React, { useState, useEffect } from 'react';
import { Menu, ChevronDown, ChevronUp } from 'lucide-react';

export const TableOfContents = ({ headings = [], isMobile = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState('');

  // Track which H2 heading is currently in the viewport
  useEffect(() => {
    if (headings.length === 0) return;

    const observers = [];
    const elements = headings.map(h => document.getElementById(h.id)).filter(Boolean);

    const handleIntersection = (entries) => {
      // Find the first intersecting heading
      const visible = entries.find(entry => entry.isIntersecting);
      if (visible) {
        setActiveId(visible.target.id);
      }
    };

    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: '-120px 0px -40% 0px', // slightly increased margin to match our offset scroll
      threshold: 0.1
    });

    elements.forEach(el => observer.observe(el));

    return () => {
      elements.forEach(el => observer.unobserve(el));
      observer.disconnect();
    };
  }, [headings]);

  if (headings.length === 0) return null;

  // Custom click handler for perfect smooth scrolling with offset
  const handleScrollTo = (e, id) => {
    e.preventDefault();
    if (isMobile) {
      setIsOpen(false);
    }
    
    const element = document.getElementById(id);
    if (element) {
      const offset = 120; // 120px offset perfectly clears the sticky article bar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Update browser location hash silently
      window.history.pushState(null, null, `#${id}`);
    }
  };

  if (isMobile) {
    return (
      <div className="block xl:hidden border-2 border-border-rule bg-bg-primary p-4 shadow-[4px_4px_0px_var(--rule)] mb-12 select-none">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between font-mono text-xs font-black uppercase tracking-wider text-fg-primary cursor-pointer bg-transparent border-none focus-ring"
        >
          <span className="flex items-center gap-2">
            <Menu size={14} className="text-accent-pink" /> Outline
          </span>
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {isOpen && (
          <nav className="mt-4 pt-4 border-t border-border-rule/60 flex flex-col gap-2.5 animate-in slide-in-from-top-2 duration-200">
            {headings.map((h) => (
              <a
                key={h.id}
                href={`#${h.id}`}
                onClick={(e) => handleScrollTo(e, h.id)}
                className={`text-base tracking-tight text-left transition-colors pl-2.5 py-1 border-l-2 flex flex-col gap-0.5 focus-ring ${
                  activeId === h.id
                    ? 'text-accent-pink border-accent-pink font-black'
                    : 'text-zinc-300 border-transparent hover:text-fg-primary hover:border-border-rule font-bold'
                }`}
              >
                <span>{h.text}</span>
              </a>
            ))}
          </nav>
        )}
      </div>
    );
  }

  // Desktop sticky sidebar
  return (
    <nav className="hidden xl:flex flex-col gap-4 w-full select-none text-left font-sans">
      <div className="text-xs font-black tracking-widest text-fg-primary uppercase mb-1 border-b border-border-rule pb-2">
        Outline
      </div>
      <div className="flex flex-col gap-2 font-sans text-[13px]">
        {headings.map((h) => (
          <a
            key={h.id}
            href={`#${h.id}`}
            onClick={(e) => handleScrollTo(e, h.id)}
            className={`transition-all pl-3 py-1.5 border-l-2 hover:translate-x-0.5 tracking-wide leading-relaxed uppercase font-bold text-left flex flex-col focus-ring ${
              activeId === h.id
                ? 'text-accent-pink border-accent-pink font-black pl-4'
                : 'text-zinc-400 border-border-rule/50 hover:text-fg-primary hover:border-fg-primary'
            }`}
          >
            <span>{h.text}</span>
          </a>
        ))}
      </div>
    </nav>
  );
};

export default TableOfContents;
