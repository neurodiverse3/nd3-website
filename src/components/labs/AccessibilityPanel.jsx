"use client";
import React, { useState, useEffect } from 'react';
import { Sliders, Eye, EyeOff, RotateCcw, Type, Move, ToggleLeft, ToggleRight, Moon, Sun, Sprout } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function AccessibilityPanel({ mobile }) {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  
  // Accessibility preferences state
  const [fontScale, setFontScale] = useState("normal"); // "normal", "large", "xlarge", "xxlarge"
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [readingRuler, setReadingRuler] = useState(false);

  // Ruler vertical position tracking
  const [rulerY, setRulerY] = useState(0);

  // Load preferences from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedScale = localStorage.getItem('nd3-a11y-font-scale') || 'normal';
    const savedDyslexic = localStorage.getItem('nd3-a11y-dyslexic') === 'true';
    const savedContrast = localStorage.getItem('nd3-a11y-contrast') === 'true';
    const savedMotion = localStorage.getItem('nd3-a11y-reduced-motion') === 'true';
    const savedRuler = localStorage.getItem('nd3-a11y-reading-ruler') === 'true';

    setFontScale(savedScale);
    setDyslexicFont(savedDyslexic);
    setHighContrast(savedContrast);
    setReducedMotion(savedMotion);
    setReadingRuler(savedRuler);

    applyFontScale(savedScale);
    applyDyslexicFont(savedDyslexic);
    applyHighContrast(savedContrast);
    applyReducedMotion(savedMotion);
  }, []);

  // Tracking mouse move for reading ruler
  useEffect(() => {
    if (!readingRuler) return;

    const handleMouseMove = (e) => {
      setRulerY(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [readingRuler]);

  // CSS Class Application Helpers
  const applyFontScale = (scale) => {
    const html = document.documentElement;
    html.classList.remove('font-scale-large', 'font-scale-xlarge', 'font-scale-xxlarge');
    if (scale === 'large') html.classList.add('font-scale-large');
    if (scale === 'xlarge') html.classList.add('font-scale-xlarge');
    if (scale === 'xxlarge') html.classList.add('font-scale-xxlarge');
  };

  const applyDyslexicFont = (active) => {
    const html = document.documentElement;
    if (active) html.classList.add('dyslexic-friendly-active');
    else html.classList.remove('dyslexic-friendly-active');
  };

  const applyHighContrast = (active) => {
    const html = document.documentElement;
    if (active) html.classList.add('high-contrast-active');
    else html.classList.remove('high-contrast-active');
  };

  const applyReducedMotion = (active) => {
    // If user forces reduced motion, update class on HTML
    const html = document.documentElement;
    if (active) {
      html.classList.add('prefers-reduced-motion-override');
    } else {
      html.classList.remove('prefers-reduced-motion-override');
    }
  };

  // State update & storage sync handlers
  const handleScaleChange = (scale) => {
    setFontScale(scale);
    localStorage.setItem('nd3-a11y-font-scale', scale);
    applyFontScale(scale);
  };

  const handleDyslexicToggle = () => {
    const nextVal = !dyslexicFont;
    setDyslexicFont(nextVal);
    localStorage.setItem('nd3-a11y-dyslexic', nextVal.toString());
    applyDyslexicFont(nextVal);
  };

  const handleContrastToggle = () => {
    const nextVal = !highContrast;
    setHighContrast(nextVal);
    localStorage.setItem('nd3-a11y-contrast', nextVal.toString());
    applyHighContrast(nextVal);
  };

  const handleMotionToggle = () => {
    const nextVal = !reducedMotion;
    setReducedMotion(nextVal);
    localStorage.setItem('nd3-a11y-reduced-motion', nextVal.toString());
    applyReducedMotion(nextVal);
  };

  const handleRulerToggle = () => {
    const nextVal = !readingRuler;
    setReadingRuler(nextVal);
    localStorage.setItem('nd3-a11y-reading-ruler', nextVal.toString());
  };

  const resetAllSettings = () => {
    setFontScale("normal");
    setDyslexicFont(false);
    setHighContrast(false);
    setReducedMotion(false);
    setReadingRuler(false);

    localStorage.setItem('nd3-a11y-font-scale', 'normal');
    localStorage.setItem('nd3-a11y-dyslexic', 'false');
    localStorage.setItem('nd3-a11y-contrast', 'false');
    localStorage.setItem('nd3-a11y-reduced-motion', 'false');
    localStorage.setItem('nd3-a11y-reading-ruler', 'false');

    applyFontScale("normal");
    applyDyslexicFont(false);
    applyHighContrast(false);
    applyReducedMotion(false);
  };

  return (
    <>
      {/* 1. Mouse-Tracking Focus Reading Ruler */}
      {readingRuler && (
        <div 
          className="fixed left-0 right-0 h-[28px] bg-[var(--accent)]/15 border-y-2 border-[var(--accent)]/45 pointer-events-none z-[9990] transition-[top] duration-75 select-none"
          style={{ top: `${rulerY - 14}px` }}
        />
      )}

      {/* 2. Toggle Button for Navbar */}
      <div className="relative inline-block font-sans no-print select-none">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={mobile 
            ? `relative p-2 text-fg-primary hover:text-[var(--accent)] cursor-pointer ${isOpen ? 'text-[var(--accent)]' : ''}`
            : `relative p-2.5 text-fg-primary hover:text-[var(--accent)] bg-transparent transition-all group cursor-pointer focus-ring rounded-none flex items-center gap-1.5 border border-transparent hover:border-border-rule px-3 shrink-0 ${isOpen ? 'text-[var(--accent)] border-border-rule' : ''}`
          }
          title="Open Sensory & Site Accessibility Controls"
          aria-expanded={isOpen}
          aria-label="Sensory and Accessibility Settings"
        >
          <Sliders size={mobile ? 22 : 16} className="group-hover:rotate-90 transition-transform" />
          {!mobile && <span className="text-[11px] font-black uppercase tracking-widest hidden xl:inline-block">PREFERENCES</span>}
        </button>

        {/* 3. Dropdown Accessible Controls Drawer */}
        {isOpen && (
          <div className={`absolute top-full mt-2 ${mobile ? '-right-16 md:right-0' : 'right-0'} w-[320px] bg-black border-2 border-[var(--rule)] p-5 text-left shadow-[6px_6px_0px_rgba(0,0,0,0.9)] animate-in fade-in slide-in-from-top-2 duration-300 z-[100]`}>
            
            {/* Header branding */}
            <div className="flex items-center justify-between border-b border-[var(--rule)] pb-3 mb-4">
              <span className="font-sans text-base text-[var(--accent)] font-black tracking-wide uppercase">PREFERENCES</span>
              <button 
                onClick={resetAllSettings}
                className="text-xs font-sans font-black text-red-500 hover:text-red-400 bg-transparent flex items-center gap-1 cursor-pointer"
                title="Reset accessibility overrides"
              >
                <RotateCcw size={12} /> CLEAR
              </button>
            </div>

            <div className="space-y-4">
              {/* Site Theme */}
              <div className="space-y-2">
                <span className="font-sans text-sm text-fg-primary font-black uppercase tracking-wide block flex items-center gap-1.5">
                  <Sun size={14} className="text-[var(--accent)]" /> SITE THEME:
                </span>
                <div className="grid grid-cols-3 gap-1 select-none font-sans">
                  {[
                    { id: 'void', label: 'VOID' },
                    { id: 'parchment', label: 'PARCHMENT' },
                    { id: 'incubation', label: 'INCUBATION' }
                  ].map((preset) => {
                    const isActive = theme === preset.id;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => setTheme(preset.id)}
                        className={`py-1.5 text-xs font-black border transition-all cursor-pointer rounded-none uppercase ${
                          isActive
                            ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-soft)]/10'
                            : 'border-[var(--rule)] text-[var(--muted)] hover:border-white hover:text-white bg-transparent'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Option A: Global Font Scale */}
              <div className="space-y-2 border-t border-[var(--rule)]/60 pt-4">
                <span className="font-sans text-sm text-fg-primary font-black uppercase tracking-wide block flex items-center gap-1.5">
                  <Type size={14} className="text-[var(--accent)]" /> GLOBAL TEXT SIZE:
                </span>
                <div className="grid grid-cols-4 gap-1 select-none font-sans">
                  {[
                    { id: 'normal', label: '100%' },
                    { id: 'large', label: '112%' },
                    { id: 'xlarge', label: '125%' },
                    { id: 'xxlarge', label: '137%' }
                  ].map((preset) => {
                    const isActive = fontScale === preset.id;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => handleScaleChange(preset.id)}
                        className={`py-1.5 text-xs font-black border transition-all cursor-pointer rounded-none uppercase ${
                          isActive
                            ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-soft)]/10'
                            : 'border-[var(--rule)] text-[var(--muted)] hover:border-white hover:text-white bg-transparent'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Option B: Dyslexia Friendly text override */}
              <div className="flex items-center justify-between border-t border-[var(--rule)]/60 pt-4">
                <div className="space-y-0.5 pr-2">
                  <span className="font-sans text-sm text-fg-primary font-black uppercase tracking-wide block flex items-center gap-1.5">
                    <Type size={14} className="text-[var(--accent)]" /> DYSLEXIC FRIENDLY:
                  </span>
                  <span className="text-xs text-text-muted leading-tight block font-sans">Enlarge letter gaps & line spaces</span>
                </div>
                <button
                  onClick={handleDyslexicToggle}
                  className="text-[var(--muted)] hover:text-white cursor-pointer transition-colors bg-transparent border-none outline-none"
                  aria-label="Toggle Dyslexic Font spacing"
                >
                  {dyslexicFont ? (
                    <ToggleRight size={24} className="text-[var(--accent)]" />
                  ) : (
                    <ToggleLeft size={24} className="text-[var(--muted)]/50" />
                  )}
                </button>
              </div>

              {/* Option C: Contrast filter scale overlay */}
              <div className="flex items-center justify-between border-t border-[var(--rule)]/60 pt-4">
                <div className="space-y-0.5 pr-2">
                  <span className="font-sans text-sm text-fg-primary font-black uppercase tracking-wide block flex items-center gap-1.5">
                    <Eye size={14} className="text-[var(--accent)]" /> HIGH CONTRAST TEXT:
                  </span>
                  <span className="text-xs text-text-muted leading-tight block font-sans">Maximize text/background contrast</span>
                </div>
                <button
                  onClick={handleContrastToggle}
                  className="text-[var(--muted)] hover:text-white cursor-pointer transition-colors bg-transparent border-none outline-none"
                  aria-label="Toggle High Contrast Mode"
                >
                  {highContrast ? (
                    <ToggleRight size={24} className="text-[var(--accent)]" />
                  ) : (
                    <ToggleLeft size={24} className="text-[var(--muted)]/50" />
                  )}
                </button>
              </div>

              {/* Option D: Focus Reading Ruler */}
              <div className="flex items-center justify-between border-t border-[var(--rule)]/60 pt-4">
                <div className="space-y-0.5 pr-2">
                  <span className="font-sans text-sm text-fg-primary font-black uppercase tracking-wide block flex items-center gap-1.5">
                    <Move size={14} className="text-[var(--accent)]" /> FOCUS READING RULER:
                  </span>
                  <span className="text-xs text-text-muted leading-tight block font-sans">Line tracking guide tracks cursor</span>
                </div>
                <button
                  onClick={handleRulerToggle}
                  className="text-[var(--muted)] hover:text-white cursor-pointer transition-colors bg-transparent border-none outline-none"
                  aria-label="Toggle Focus Reading Ruler"
                >
                  {readingRuler ? (
                    <ToggleRight size={24} className="text-[var(--accent)]" />
                  ) : (
                    <ToggleLeft size={24} className="text-[var(--muted)]/50" />
                  )}
                </button>
              </div>

              {/* Option E: Site animations reduced motion */}
              <div className="flex items-center justify-between border-t border-[var(--rule)]/60 pt-4">
                <div className="space-y-0.5 pr-2">
                  <span className="font-sans text-sm text-fg-primary font-black uppercase tracking-wide block flex items-center gap-1.5">
                    <EyeOff size={14} className="text-[var(--accent)]" /> FORCE REDUCED MOTION:
                  </span>
                  <span className="text-xs text-text-muted leading-tight block font-sans">Halt marquees and visual shakes</span>
                </div>
                <button
                  onClick={handleMotionToggle}
                  className="text-[var(--muted)] hover:text-white cursor-pointer transition-colors bg-transparent border-none outline-none"
                  aria-label="Toggle Reduced Motion Override"
                >
                  {reducedMotion ? (
                    <ToggleRight size={24} className="text-[var(--accent)]" />
                  ) : (
                    <ToggleLeft size={24} className="text-[var(--muted)]/50" />
                  )}
                </button>
              </div>
            </div>
            
          </div>
        )}
      </div>
    </>
  );
}
