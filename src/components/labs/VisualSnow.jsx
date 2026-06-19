"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Eye, Clock, ShieldAlert, Sparkles, RefreshCw, Layers } from 'lucide-react';
import { useLabLocalStorage } from '../../lib/useLabStorage';

export default function VisualSnow({ noWrapper = false, fullPage = false }) {
  const { value: savedGrain, setValue: setSavedGrain } = useLabLocalStorage('nd3-visual-grain', 0.06);
  const { value: savedWash, setValue: setSavedWash } = useLabLocalStorage('nd3-visual-wash', 0.04);
  const { value: savedColor, setValue: setSavedColor } = useLabLocalStorage('nd3-visual-color', 'void');
  const { value: savedSitewide, setValue: setSavedSitewide } = useLabLocalStorage('nd3-visual-snow-sitewide', false);

  const [timerSeconds, setTimerSeconds] = useState(300);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef(null);

  const [grainOpacity, setGrainOpacity] = useState(savedGrain);
  const [washOpacity, setWashOpacity] = useState(savedWash);
  const [shieldColor, setShieldColor] = useState(savedColor);
  const [sitewideActive, setSitewideActive] = useState(savedSitewide);

  const [reducedMotion, setReducedMotion] = useState(false);

  const triggerUpdateEvent = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('nd3-visual-snow-update'));
    }
  };

  useEffect(() => {
    if (savedGrain !== undefined) setGrainOpacity(savedGrain);
    if (savedWash !== undefined) setWashOpacity(savedWash);
    if (savedColor) setShieldColor(savedColor);
    if (savedSitewide) setSitewideActive(savedSitewide);

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(motionQuery.matches);
    const handleMotionChange = (e) => setReducedMotion(e.matches);
    motionQuery.addEventListener('change', handleMotionChange);
    return () => motionQuery.removeEventListener('change', handleMotionChange);
  }, []);

  const savePreferences = (grain, wash, color, sitewide = sitewideActive) => {
    setSavedGrain(grain);
    setSavedWash(wash);
    setSavedColor(color);
    setSavedSitewide(sitewide);
    triggerUpdateEvent();
  };

  const handleGrainChange = (val) => {
    setGrainOpacity(val);
    savePreferences(val, washOpacity, shieldColor);
  };

  const handleWashChange = (val) => {
    setWashOpacity(val);
    savePreferences(grainOpacity, val, shieldColor);
  };

  const handleColorChange = (color) => {
    setShieldColor(color);
    savePreferences(grainOpacity, washOpacity, color);
  };

  const handleSitewideToggle = () => {
    const nextVal = !sitewideActive;
    setSitewideActive(nextVal);
    savePreferences(grainOpacity, washOpacity, shieldColor, nextVal);
  };

  // Focus Timer Logic
  const startTimer = () => {
    if (timerRunning) return;
    setTimerRunning(true);
    timerRef.current = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setTimerRunning(false);
          triggerComfortAlarm();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
    setTimerRunning(false);
  };

  const resetTimer = (secs) => {
    clearInterval(timerRef.current);
    setTimerRunning(false);
    setTimerSeconds(secs);
  };

  const triggerComfortAlarm = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(330, ctx.currentTime); // Comforting E4 alert
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch(e){}
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const resetShieldSliders = () => {
    setGrainOpacity(0.06);
    setWashOpacity(0.04);
    setShieldColor("void");
    setSitewideActive(false);
    savePreferences(0.06, 0.04, "void", false);
  };

  // Determine actual color hex code for full screen wash overlay
  const getWashColorHex = () => {
    switch (shieldColor) {
      case 'cream':
        return '#EFEAD8'; // Warm cream
      case 'sage':
        return '#0B130F'; // Sage green deep
      case 'void':
      default:
        return '#050505'; // Void black
    }
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const content = (
    <div className="space-y-6 select-none font-sans text-left relative z-10">
      
      {/* Dynamic Environmental Overlays applied directly inside the component viewport */}
      {/* 1. Grain overlay */}
      {grainOpacity > 0 && (
        <div 
          className="pointer-events-none mix-blend-overlay transition-opacity duration-300 absolute inset-0 z-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            opacity: reducedMotion ? 0.03 : grainOpacity
          }}
        />
      )}

      {/* 2. Color Wash overlay */}
      {washOpacity > 0 && (
        <div 
          className="pointer-events-none absolute inset-0 z-0 transition-all duration-300"
          style={{
            backgroundColor: getWashColorHex(),
            opacity: washOpacity
          }}
        />
      )}

      <div className="space-y-6 relative z-10">
        
        {/* Brand Header */}
        <div className="flex items-center justify-between border-b border-[var(--rule)] pb-4">
          <h3 className="text-lg font-black uppercase tracking-wider text-[var(--fg)] flex items-center gap-2">
            <Eye size={18} className="text-[var(--accent)]" /> VISUAL SNOW SHIELD
          </h3>
          <span className="text-xs font-mono text-[var(--muted)] uppercase border border-[var(--rule)] px-2 py-0.5 tracking-wider">
            VISUAL · COGNITIVE SHIELD
          </span>
        </div>

        <p className="text-sm text-[var(--muted)] leading-relaxed">
          High screen contrasts and sharp glare are silent sensory drains. The Visual Snow Shield overlays an adjustable, organic fine-grain noise layer to absorb screen spikes, paired with a solid dark/cream wash layer to dim your environment.
        </p>

        {/* Dynamic Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Box 1: Sensory Wave & Wash Controls */}
          <div className="space-y-4 border border-[var(--rule)] bg-black/20 p-4 shadow-sm">
            <span className="text-xs font-mono text-[var(--muted)] uppercase tracking-widest flex items-center gap-1.5 font-bold">
              <Layers size={12} className="text-[var(--accent)]" /> SHIELD OVERLAY CONFIGURATION
            </span>

            {/* Slider 1: Grain Noise Intensity */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-mono text-[var(--muted)]">
                <span>FINE-GRAIN FRACTAL TEXTURE</span>
                <span className="font-bold text-[var(--fg)]">{Math.round(grainOpacity * 100)}%</span>
              </div>
              <input 
                type="range" min="0" max="0.25" step="0.01" value={grainOpacity}
                onChange={(e) => handleGrainChange(parseFloat(e.target.value))}
                className="w-full accent-[var(--accent)] h-1.5 bg-[var(--rule)] cursor-pointer rounded-none outline-none"
              />
            </div>

            {/* Slider 2: Wash Overlay Opacity */}
            <div className="space-y-1 pt-2 border-t border-[var(--rule)]/60">
              <div className="flex justify-between items-center text-xs font-mono text-[var(--muted)]">
                <span>SOLID COMFORT TINT WASH</span>
                <span className="font-bold text-[var(--fg)]">{Math.round(washOpacity * 100)}%</span>
              </div>
              <input 
                type="range" min="0" max="0.5" step="0.01" value={washOpacity}
                onChange={(e) => handleWashChange(parseFloat(e.target.value))}
                className="w-full accent-[var(--accent)] h-1.5 bg-[var(--rule)] cursor-pointer rounded-none outline-none"
              />
            </div>

            {/* Button 3: Wash Tint Color Selections */}
            <div className="space-y-2 pt-2 border-t border-[var(--rule)]/60">
              <span className="text-xs font-mono text-[var(--muted)] uppercase tracking-wider block font-bold">
                WASH TINT SPECTRUM:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'void', label: 'VOID BLACK', bg: 'bg-[#050505] border-[#FF2E88]' },
                  { id: 'cream', label: 'WARM CREAM', bg: 'bg-[#EFEAD8] border-[#2E62FF]' },
                  { id: 'sage', label: 'SAGE GREEN', bg: 'bg-[#0B130F] border-[#5A8A60]' }
                ].map((color) => {
                  const isActive = shieldColor === color.id;
                  return (
                    <button
                      key={color.id}
                      onClick={() => handleColorChange(color.id)}
                      className={`px-2 py-1.5 text-xs font-mono font-bold border cursor-pointer select-none transition-all rounded-none uppercase ${
                        isActive 
                          ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-soft)] shadow-[1px_1px_0px_var(--accent)]' 
                          : 'border-[var(--rule)] text-[var(--muted)] hover:border-white hover:text-white bg-transparent'
                      }`}
                    >
                      {color.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Global Sitewide Toggle */}
            <div className="pt-2 border-t border-[var(--rule)]/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[var(--muted)] uppercase tracking-wider block font-bold">
                  GLOBAL VIEWPORT OVERLAY:
                </span>
                <button
                  onClick={handleSitewideToggle}
                  className={`px-3 py-1 text-xs font-mono font-bold border cursor-pointer select-none transition-all rounded-none uppercase ${
                    sitewideActive 
                      ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-soft)] shadow-[1px_1px_0px_var(--accent)]' 
                      : 'border-[var(--rule)] text-[var(--muted)] hover:border-white hover:text-white bg-transparent'
                  }`}
                >
                  {sitewideActive ? 'ACTIVE SITE-WIDE' : 'APPLY SITE-WIDE'}
                </button>
              </div>
              <p className="text-xs md:text-sm text-[var(--muted)] leading-relaxed font-sans mt-1">
                If enabled, the fractal grain and wash tint will cover the entire site viewport (including all other pages) as you browse.
              </p>
            </div>

            {/* Reset presets button */}
            <button
              onClick={resetShieldSliders}
              className="text-xs font-mono font-bold text-red-500 hover:text-red-400 bg-transparent flex items-center gap-1 cursor-pointer pt-2 border-t border-[var(--rule)]/30 w-full justify-start"
            >
              <RefreshCw size={10} /> REVERT SHIELD TO SAFE DEFAULTS
            </button>
          </div>

          {/* Box 2: Sensory Focus Timebox */}
          <div className="space-y-4 border border-[var(--rule)] bg-black/20 p-4 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-mono text-[var(--muted)] uppercase tracking-widest flex items-center gap-1.5 font-bold">
                <Clock size={12} className="text-[var(--accent)]" /> SENSORY FOCUS TIMEBOX
              </span>
              
              <div className="flex items-center justify-between bg-black/45 border border-[var(--rule)] px-4 py-2.5 shadow-inner">
                <span className="text-3xl font-black font-display text-white tracking-tight leading-none">
                  {formatTime(timerSeconds)}
                </span>
                
                <div className="flex gap-1.5">
                  <button 
                    onClick={() => resetTimer(300)} 
                    disabled={timerRunning}
                    className="px-2 py-1 text-xs font-mono border border-[var(--rule)] hover:border-[var(--accent)] text-[var(--muted)] hover:text-white cursor-pointer bg-transparent rounded-none disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    5m
                  </button>
                  <button 
                    onClick={() => resetTimer(900)} 
                    disabled={timerRunning}
                    className="px-2 py-1 text-xs font-mono border border-[var(--rule)] hover:border-[var(--accent)] text-[var(--muted)] hover:text-white cursor-pointer bg-transparent rounded-none disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    15m
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-4 border-t border-[var(--rule)]/60">
              {timerRunning ? (
                <button 
                  onClick={stopTimer}
                  className="py-3 border border-red-500 text-red-500 hover:bg-red-500/5 bg-transparent text-xs font-black uppercase tracking-widest transition-all cursor-pointer rounded-none active:scale-[0.99]"
                >
                  PAUSE TIMEBOX
                </button>
              ) : (
                <button 
                  onClick={startTimer}
                  disabled={timerSeconds === 0}
                  className="py-3 border border-[var(--accent)] text-[var(--bg)] bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-xs font-black uppercase tracking-widest transition-all cursor-pointer rounded-none active:scale-[0.99] disabled:opacity-35 disabled:cursor-not-allowed"
                >
                  START FOCUS
                </button>
              )}
              
              <button 
                onClick={() => resetTimer(300)}
                className="py-3 border border-[var(--rule)] hover:border-white text-[var(--muted)] hover:text-white bg-transparent text-xs font-black uppercase tracking-widest transition-all cursor-pointer rounded-none active:scale-[0.99]"
              >
                RESET TIMEBOX
              </button>
            </div>
          </div>

        </div>

        {/* Global instructions badge */}
        {fullPage && (
          <div className="border border-[var(--rule)] bg-black/45 p-4 flex gap-3 text-left">
            <ShieldAlert size={16} className="text-[var(--accent)] shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <span className="text-xs font-mono font-bold text-[var(--accent)] uppercase tracking-widest block font-bold leading-none">
                FULL-PAGE COMFORT BACKGROUND SHIELD MODE ACTIVE
              </span>
              <p className="text-sm text-[var(--muted)] leading-relaxed font-sans">
                You have launched the standalone Full-Page Shield. Position this browser tab in a separate window directly behind your active work environment. The screen grain and dim wash settings are applied across the entire viewport to absorb visual screen luminance spikes. Your sliders are saved automatically in localStorage.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );

  // If in full page mode, we inject full viewport backing overlays
  if (fullPage) {
    return (
      <div className="w-full min-h-screen bg-[#050505] p-6 md:p-12 flex flex-col justify-start relative select-none">
        {/* Full screen overlays */}
        {/* 1. Grain overlay */}
        {grainOpacity > 0 && (
          <div 
            className="fixed inset-0 pointer-events-none z-0 mix-blend-overlay transition-opacity duration-300"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              opacity: reducedMotion ? 0.03 : grainOpacity
            }}
          />
        )}

        {/* 2. Solid Wash overlay */}
        {washOpacity > 0 && (
          <div 
            className="fixed inset-0 pointer-events-none z-0 transition-all duration-300"
            style={{
              backgroundColor: getWashColorHex(),
              opacity: washOpacity
            }}
          />
        )}

        {/* Centered Brutalist Control Dashboard Card */}
        <div className="max-w-3xl w-full mx-auto bg-black/80 border-2 border-black p-6 md:p-10 shadow-[8px_8px_0px_var(--rule)] relative z-10 mt-[20px]">
          {content}
        </div>
      </div>
    );
  }

  if (noWrapper) {
    return (
      <div className="flex flex-col justify-between h-full relative">
        {content}
      </div>
    );
  }

  return (
    <div className="bg-bg-primary/40 border border-[var(--rule)] p-6 md:p-8 shadow-[4px_4px_0px_var(--rule)] max-w-4xl mx-auto relative overflow-hidden">
      {content}
    </div>
  );
}
