"use client";
import React, { useState, useEffect } from 'react';
import { Sliders, Eye, EyeOff, RotateCcw, Type, Move, ToggleLeft, ToggleRight, Moon, Sun, Sprout } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

// Reusable row for accessibility helper options (entire row is clickable to satisfy mobile target sizes and accessibility)
const ToggleRow = ({ icon: Icon, title, description, checked, onChange, ariaLabel }) => {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className="w-full flex items-start justify-between gap-4 text-left cursor-pointer focus-ring rounded-none bg-transparent border-0 p-0"
      aria-label={ariaLabel}
    >
      <div className="space-y-1 pr-2">
        <div className="flex items-center gap-1.5">
          <Icon size={13} className="text-accent shrink-0" />
          <span className="font-sans text-sm md:text-base text-fg-primary font-black tracking-wider uppercase">
            {title}
          </span>
        </div>
        <p className="text-sm md:text-base text-text-muted leading-relaxed font-sans font-medium">
          {description}
        </p>
      </div>
      <div className="flex items-center h-5 shrink-0 pt-0.5">
        {/* ToggleSwitch visual representation */}
        <div
          className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border border-transparent transition-colors duration-200 ease-in-out items-center px-0.5 ${
            checked ? 'bg-accent' : 'bg-text-muted/20 border-border-rule'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
              checked ? 'translate-x-[18px]' : 'translate-x-0'
            }`}
          />
        </div>
      </div>
    </button>
  );
};

export default function AccessibilityPanel({ mobile }) {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = React.useRef(null);
  const panelRef = React.useRef(null);
  const isFirstRender = React.useRef(true);
  
  // Accessibility preferences state
  const [fontScale, setFontScale] = useState("normal"); // "normal", "large", "xlarge", "xxlarge"
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [readingRuler, setReadingRuler] = useState(false);
  const [rulerHeight, setRulerHeight] = useState("28");
  const [rulerColor, setRulerColor] = useState("theme");

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
    const savedRulerHeight = localStorage.getItem('nd3-a11y-ruler-height') || '28';
    const savedRulerColor = localStorage.getItem('nd3-a11y-ruler-color') || 'theme';

    setFontScale(savedScale);
    setDyslexicFont(savedDyslexic);
    setHighContrast(savedContrast);
    setReducedMotion(savedMotion);
    setReadingRuler(savedRuler);
    setRulerHeight(savedRulerHeight);
    setRulerColor(savedRulerColor);

    applyFontScale(savedScale);
    applyDyslexicFont(savedDyslexic);
    applyHighContrast(savedContrast);
    applyReducedMotion(savedMotion);
  }, []);

  // Keyboard accessibility: Escape to close, Focus Trap, and restore focus to trigger
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        return;
      }

      if (e.key === 'Tab' && panelRef.current) {
        const focusableElements = panelRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex="0"]'
        );
        if (focusableElements.length === 0) return;
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Restore focus to trigger when panel closes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!isOpen && triggerRef.current) {
      triggerRef.current.focus();
    }
  }, [isOpen]);

  // Lock background scroll on mobile when open
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      if (window.innerWidth < 768) {
        document.body.style.overflow = 'hidden';
      }
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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

  const handleRulerHeightChange = (height) => {
    setRulerHeight(height);
    localStorage.setItem('nd3-a11y-ruler-height', height);
  };

  const handleRulerColorChange = (color) => {
    setRulerColor(color);
    localStorage.setItem('nd3-a11y-ruler-color', color);
  };

  const resetAllSettings = () => {
    setFontScale("normal");
    setDyslexicFont(false);
    setHighContrast(false);
    setReducedMotion(false);
    setReadingRuler(false);
    setRulerHeight("28");
    setRulerColor("theme");

    localStorage.setItem('nd3-a11y-font-scale', 'normal');
    localStorage.setItem('nd3-a11y-dyslexic', 'false');
    localStorage.setItem('nd3-a11y-contrast', 'false');
    localStorage.setItem('nd3-a11y-reduced-motion', 'false');
    localStorage.setItem('nd3-a11y-reading-ruler', 'false');
    localStorage.setItem('nd3-a11y-ruler-height', '28');
    localStorage.setItem('nd3-a11y-ruler-color', 'theme');

    applyFontScale("normal");
    applyDyslexicFont(false);
    applyHighContrast(false);
    applyReducedMotion(false);
  };
  const panelContent = (
    <>
      <div className="flex items-center justify-between border-b border-border-rule pb-3 mb-4">
        <span className="font-sans text-xs text-accent font-black tracking-widest uppercase">PREFERENCES</span>
        <div className="flex items-center gap-3">
          <button 
            onClick={resetAllSettings}
            className="text-xs font-sans font-black px-2 py-1 border border-red-500/30 text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-1 cursor-pointer focus-ring rounded-none bg-transparent"
            title="Reset accessibility overrides"
          >
            <RotateCcw size={11} className="shrink-0" /> RESET
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="h-[24px] w-[24px] text-text-muted hover:text-fg-primary cursor-pointer focus-ring rounded-none bg-transparent border-0 flex items-center justify-center p-0"
            aria-label="Close preferences panel"
          >
            <Sliders size={12} className="rotate-90 text-accent shrink-0" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Category 1: Appearance */}
        <div>
          <span className="font-sans text-xs text-text-muted font-black tracking-widest uppercase block mb-3 select-none">
            APPEARANCE
          </span>
          
          <div className="space-y-4">
            {/* Site Theme */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Sun size={13} className="text-accent shrink-0" />
                <span className="font-sans text-xs md:text-sm text-fg-primary font-black tracking-wider uppercase">
                  SITE THEME:
                </span>
              </div>
              <div className="flex flex-col gap-1.5 select-none font-sans mt-1">
                {[
                  { id: 'void', label: 'VOID', dotColor: 'bg-[#FF2E88]' },
                  { id: 'parchment', label: 'PARCHMENT', dotColor: 'bg-[#A8005A]' },
                  { id: 'incubation', label: 'INCUBATION', dotColor: 'bg-[#5A8A60]' }
                ].map((preset) => {
                  const isActive = theme === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => setTheme(preset.id)}
                      className={`w-full py-2.5 px-3 text-xs md:text-sm font-black border transition-all cursor-pointer rounded-none uppercase focus-ring flex items-center justify-between ${
                        isActive
                          ? 'border-accent bg-accent/10 text-fg-primary font-black'
                          : 'border-border-rule text-text-muted hover:border-fg-primary hover:text-fg-primary bg-transparent font-bold'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${preset.dotColor}`} />
                        <span>{preset.label}</span>
                      </span>
                      {isActive && <span className="text-[10px] font-black tracking-wider text-accent">ACTIVE</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Option A: Global Font Scale */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Type size={13} className="text-accent shrink-0" />
                <span className="font-sans text-xs md:text-sm text-fg-primary font-black tracking-wider uppercase">
                  GLOBAL TEXT SIZE:
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1 select-none font-sans mt-1">
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
                      className={`py-2 text-center text-xs md:text-sm font-black border transition-all cursor-pointer rounded-none uppercase focus-ring ${
                        isActive
                          ? 'border-accent bg-accent text-[var(--accent-btn-text)]'
                          : 'border-border-rule text-text-muted hover:border-fg-primary hover:text-fg-primary bg-transparent'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Category 2: Assistive Tools */}
        <div className="border-t border-border-rule/60 pt-4">
          <span className="font-sans text-xs text-text-muted font-black tracking-widest uppercase block mb-3 select-none">
            ASSISTIVE TOOLS
          </span>
          
          <div className="space-y-4">
            {/* Option B: Dyslexia Friendly text override */}
            <ToggleRow
              icon={Type}
              title="DYSLEXIC FRIENDLY"
              description="Enlarge letter gaps & line spaces"
              checked={dyslexicFont}
              onChange={handleDyslexicToggle}
              ariaLabel="Toggle Dyslexic Font spacing"
            />

            {/* Option C: Contrast filter scale overlay */}
            <ToggleRow
              icon={Eye}
              title="HIGH CONTRAST TEXT"
              description="Maximize text/background contrast"
              checked={highContrast}
              onChange={handleContrastToggle}
              ariaLabel="Toggle High Contrast Mode"
            />

            {/* Option D: Focus Reading Ruler */}
            <div className="space-y-2">
              <ToggleRow
                icon={Move}
                title="FOCUS READING RULER"
                description="Line tracking guide tracks cursor"
                checked={readingRuler}
                onChange={handleRulerToggle}
                ariaLabel="Toggle Focus Reading Ruler"
              />
              
              {readingRuler && (
                <div className="pl-6 pt-2 pb-2 space-y-3 border-l-2 border-accent/30 ml-2.5 mt-1 animate-in slide-in-from-left-2 duration-200">
                  {/* Ruler Height */}
                  <div className="space-y-1">
                    <span className="text-xs font-sans font-black text-text-muted uppercase tracking-wider block mb-1 select-none">
                      RULER HEIGHT
                    </span>
                    <div className="grid grid-cols-4 gap-1 select-none font-sans">
                      {[
                        { id: '18', label: 'Thin' },
                        { id: '28', label: 'Medium' },
                        { id: '38', label: 'Thick' },
                        { id: '48', label: 'Wide' }
                      ].map((h) => {
                        const isActive = rulerHeight === h.id;
                        return (
                          <button
                            key={h.id}
                            onClick={() => handleRulerHeightChange(h.id)}
                            className={`py-1 text-xs md:text-sm text-center font-bold border transition-all cursor-pointer rounded-none uppercase focus-ring ${
                              isActive
                                ? 'border-accent bg-accent text-[var(--accent-btn-text)]'
                                : 'border-border-rule text-text-muted hover:border-fg-primary hover:text-fg-primary bg-transparent'
                            }`}
                          >
                            {h.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Ruler Color */}
                  <div className="space-y-1">
                    <span className="text-xs font-sans font-black text-text-muted uppercase tracking-wider block mb-1.5 select-none">
                      RULER COLOR
                    </span>
                    <div className="flex flex-wrap gap-1.5 select-none font-sans">
                      {[
                        { id: 'theme', label: 'Theme', colorClass: 'bg-accent' },
                        { id: 'pink', label: 'Pink', colorClass: 'bg-[#FF2E88]' },
                        { id: 'amber', label: 'Amber', colorClass: 'bg-[#F59E0B]' },
                        { id: 'green', label: 'Green', colorClass: 'bg-[#10B981]' },
                        { id: 'blue', label: 'Blue', colorClass: 'bg-[#3B82F6]' }
                      ].map((c) => {
                        const isActive = rulerColor === c.id;
                        return (
                          <button
                            key={c.id}
                            onClick={() => handleRulerColorChange(c.id)}
                            className={`flex-grow px-2.5 py-1 text-xs text-center font-bold border transition-all cursor-pointer rounded-none uppercase focus-ring flex items-center justify-center gap-1.5 ${
                              isActive
                                ? 'border-accent bg-accent text-[var(--accent-btn-text)]'
                                : 'border-border-rule text-text-muted hover:border-fg-primary hover:text-fg-primary bg-transparent'
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full shrink-0 ${c.colorClass}`} />
                            <span>{c.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Option E: Site animations reduced motion */}
            <ToggleRow
              icon={EyeOff}
              title="FORCE REDUCED MOTION"
              description="Halt marquees and visual shakes"
              checked={reducedMotion}
              onChange={handleMotionToggle}
              ariaLabel="Toggle Reduced Motion Override"
            />
          </div>
        </div>
      </div>
    </>
  );

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      {/* 1. Mouse-Tracking Focus Reading Ruler */}
      {readingRuler && !mounted && (
        <div 
          className={`fixed left-0 right-0 pointer-events-none z-[99999] transition-[top] duration-75 select-none border-y-2 ${
            rulerColor === 'theme' ? 'bg-[var(--accent)]/15 border-[var(--accent)]/45' : ''
          }`}
          style={{
            top: `${rulerY - (parseInt(rulerHeight) || 28) / 2}px`,
            height: `${rulerHeight}px`,
            ...(rulerColor !== 'theme' && {
              backgroundColor: rulerColor === 'pink' ? '#FF2E8826' : 
                               rulerColor === 'amber' ? '#F59E0B26' : 
                               rulerColor === 'green' ? '#10B98126' : '#3B82F626',
              borderColor: rulerColor === 'pink' ? '#FF2E8873' : 
                           rulerColor === 'amber' ? '#F59E0B73' : 
                           rulerColor === 'green' ? '#10B98173' : '#3B82F673',
            })
          }}
        />
      )}

      {/* 2. Toggle Button for Navbar */}
      <div className="relative inline-block font-sans no-print select-none">
        <button
          ref={triggerRef}
          onClick={() => setIsOpen(!isOpen)}
          className={mobile 
            ? `relative h-11 w-11 flex items-center justify-center text-fg-primary hover:text-accent cursor-pointer p-0 ${isOpen ? 'text-accent' : ''}`
            : `relative p-2.5 text-fg-primary hover:text-accent bg-transparent transition-all group cursor-pointer focus-ring rounded-none flex items-center gap-1.5 border border-transparent hover:border-border-rule px-3 shrink-0 ${isOpen ? 'text-accent border-border-rule' : ''}`
          }
          title="Open Sensory & Site Accessibility Controls"
          aria-expanded={isOpen}
          aria-label="Preferences"
        >
          <Sliders size={mobile ? 22 : 16} className="group-hover:rotate-90 transition-transform" />
          {!mobile && <span className="text-xs md:text-sm font-black uppercase tracking-widest hidden xl:inline-block">PREFERENCES</span>}
        </button>

        {/* 3. Dropdown Accessible Controls Drawer */}
        {isOpen && mounted && (
          <>
            {/* Desktop popup (inline relative to button) */}
            <div className="hidden md:block">
              <div 
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label="Sensory and Accessibility Preferences"
                className="absolute right-0 top-full w-[340px] mt-2 max-h-[calc(100vh-100px)] overflow-y-auto sidebar-card p-5 pb-10 text-left transition-all duration-300 z-[100] bg-black border border-border-rule rounded-none animate-in slide-in-from-top-2"
              >
                {panelContent}
              </div>
            </div>

            {/* Mobile modal (portaled) */}
            {require('react-dom').createPortal(
              <div className="md:hidden">
                <div 
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]"
                  onClick={() => setIsOpen(false)}
                />
                <div 
                  ref={panelRef}
                  role="dialog"
                  aria-modal="true"
                  aria-label="Sensory and Accessibility Preferences"
                  className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-3rem)] max-w-sm max-h-[80vh] overflow-y-auto sidebar-card p-6 pb-20 text-left transition-all duration-300 z-[160] bg-black border-2 border-accent animate-in fade-in zoom-in-95 duration-200"
                >
                  {panelContent}
                </div>
              </div>,
              document.body
            )}
          </>
        )}
      </div>
    </>
  );
}
