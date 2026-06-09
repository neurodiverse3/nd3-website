"use client";
import React, { useState, useEffect } from 'react';
import { Sliders, Eye, EyeOff, RotateCcw, Type, Move, ToggleLeft, ToggleRight, Moon, Sun, Sprout } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

// Custom toggle switch for premium look & feel
const ToggleSwitch = ({ checked, onChange, ariaLabel }) => {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus-ring items-center px-0.5 ${
        checked ? 'bg-accent' : 'bg-text-muted/20 border-border-rule'
      }`}
      aria-label={ariaLabel}
    >
      <span
        className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
          checked ? 'translate-x-[18px]' : 'translate-x-0'
        }`}
      />
    </button>
  );
};

// Reusable row for accessibility helper options
const ToggleRow = ({ icon: Icon, title, description, checked, onChange, ariaLabel }) => {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-1.5">
          <Icon size={13} className="text-accent shrink-0" />
          <span className="font-sans text-[11px] text-fg-primary font-black tracking-wider uppercase">
            {title}
          </span>
        </div>
        <p className="text-[11px] text-text-muted leading-relaxed font-sans font-medium">
          {description}
        </p>
      </div>
      <div className="flex items-center h-5 shrink-0 pt-0.5">
        <ToggleSwitch checked={checked} onChange={onChange} ariaLabel={ariaLabel} />
      </div>
    </div>
  );
};

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
            ? `relative p-2 text-fg-primary hover:text-accent cursor-pointer ${isOpen ? 'text-accent' : ''}`
            : `relative p-2.5 text-fg-primary hover:text-accent bg-transparent transition-all group cursor-pointer focus-ring rounded-none flex items-center gap-1.5 border border-transparent hover:border-border-rule px-3 shrink-0 ${isOpen ? 'text-accent border-border-rule' : ''}`
          }
          title="Open Sensory & Site Accessibility Controls"
          aria-expanded={isOpen}
          aria-label="Preferences"
        >
          <Sliders size={mobile ? 22 : 16} className="group-hover:rotate-90 transition-transform" />
          {!mobile && <span className="text-[11px] font-black uppercase tracking-widest hidden xl:inline-block">PREFERENCES</span>}
        </button>

        {/* 3. Dropdown Accessible Controls Drawer */}
        {isOpen && (
          <div className={`absolute top-full mt-2 ${mobile ? '-right-16 md:right-0' : 'right-0'} w-[340px] sidebar-card p-5 text-left transition-all duration-300 animate-in fade-in slide-in-from-top-2 duration-300 z-[100]`}>
            
            {/* Header branding */}
            <div className="flex items-center justify-between border-b border-border-rule pb-3 mb-4">
              <span className="font-sans text-xs text-accent font-black tracking-widest uppercase">PREFERENCES</span>
              <button 
                onClick={resetAllSettings}
                className="text-[10px] font-sans font-black px-2 py-1 border border-red-500/25 text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-1 cursor-pointer focus-ring rounded-none bg-transparent"
                title="Reset accessibility overrides"
              >
                <RotateCcw size={10} className="shrink-0" /> RESET
              </button>
            </div>

            <div className="space-y-4">
              {/* Category 1: Appearance */}
              <div>
                <span className="font-sans text-[10px] text-text-muted/60 font-black tracking-widest uppercase block mb-3">
                  APPEARANCE
                </span>
                
                <div className="space-y-4">
                  {/* Site Theme */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <Sun size={13} className="text-accent shrink-0" />
                      <span className="font-sans text-[11px] text-fg-primary font-black tracking-wider uppercase">
                        SITE THEME:
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 select-none font-sans mt-1">
                      {[
                        { id: 'void', label: 'VOID', dotColor: 'bg-[#FF2E88]' },
                        { id: 'parchment', label: 'PARCHMENT', dotColor: 'bg-[#221E1A] border border-[#DDD7CD]' },
                        { id: 'incubation', label: 'INCUBATION', dotColor: 'bg-[#5A8A60]' }
                      ].map((preset) => {
                        const isActive = theme === preset.id;
                        return (
                          <button
                            key={preset.id}
                            onClick={() => setTheme(preset.id)}
                            className={`py-2 px-1 text-[10px] font-black border transition-all cursor-pointer rounded-none uppercase focus-ring flex items-center justify-center gap-1.5 ${
                              isActive
                                ? 'border-accent text-accent bg-[var(--accent-soft)]'
                                : 'border-border-rule text-text-muted hover:border-fg-primary hover:text-fg-primary bg-transparent'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${preset.dotColor}`} />
                            {preset.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Option A: Global Font Scale */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <Type size={13} className="text-accent shrink-0" />
                      <span className="font-sans text-[11px] text-fg-primary font-black tracking-wider uppercase">
                        GLOBAL TEXT SIZE:
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5 select-none font-sans mt-1">
                      {[
                        { id: 'normal', label: '100%', style: 'text-[9px]' },
                        { id: 'large', label: '112%', style: 'text-[10px]' },
                        { id: 'xlarge', label: '125%', style: 'text-[11px]' },
                        { id: 'xxlarge', label: '137%', style: 'text-[12px]' }
                      ].map((preset) => {
                        const isActive = fontScale === preset.id;
                        return (
                          <button
                            key={preset.id}
                            onClick={() => handleScaleChange(preset.id)}
                            className={`py-2 text-center font-black border transition-all cursor-pointer rounded-none uppercase focus-ring ${preset.style} ${
                              isActive
                                ? 'border-accent text-accent bg-[var(--accent-soft)]'
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
                <span className="font-sans text-[10px] text-text-muted/60 font-black tracking-widest uppercase block mb-3">
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
                  <ToggleRow
                    icon={Move}
                    title="FOCUS READING RULER"
                    description="Line tracking guide tracks cursor"
                    checked={readingRuler}
                    onChange={handleRulerToggle}
                    ariaLabel="Toggle Focus Reading Ruler"
                  />

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
            
          </div>
        )}
      </div>
    </>
  );
}
