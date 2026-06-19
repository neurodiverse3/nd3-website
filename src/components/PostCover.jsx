"use client";
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { LogoWordmark } from './Logo';


const getPillarLabel = (pillar) => {
  if (!pillar) return '';
  const p = pillar.toLowerCase();
  if (p === 'tiny-systems' || p === 'tools-templates' || p === 'tools & templates' || p === 'tools-and-templates' || p === 'tools') return 'TOOLS & TEMPLATES';
  if (p === 'glitchwork' || p === 'digital-life' || p === 'digital life' || p === 'digital') return 'DIGITAL LIFE';
  if (p === 'unmasked-life' || p === 'unmasked life' || p === 'unmasked') return 'UNMASKED LIFE';
  return pillar.toUpperCase();
};

const mapPillarKey = (pillar) => {
  if (!pillar) return 'unmasked';
  const p = pillar.toLowerCase();
  if (p === 'tiny-systems' || p === 'tools-templates' || p === 'tools & templates' || p === 'tools-and-templates' || p === 'tools') return 'tools';
  if (p === 'glitchwork' || p === 'digital-life' || p === 'digital life' || p === 'digital') return 'digital';
  return 'unmasked';
};

const getBrainStateLabel = (state) => {
  if (!state) return '';
  const s = state.toLowerCase().replace('_', '-');
  if (s === 'burned-out') return 'BURNED OUT';
  if (s === 'hyperfocus') return 'HYPERFOCUS';
  if (s === 'masking') return 'MASKING';
  if (s === 'spiraling' || s === 'spiralling') return 'SPIRALLING';
  if (s === 'on-a-roll') return 'ON A ROLL';
  return state.toUpperCase();
};

const getHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

export const PostCover = ({ 
  title = '', 
  pillar = '', 
  brainState = '', 
  accentWord = '', 
  accentOverride = '', 
  aspect = '16:9',
  concept = 'typographic', // 'typographic' | 'diagnostic' | 'abstract' | 'split'
  readTime = '',
  date = '',
  postNumber = '',
  maxW = ''
}) => {
  const titleLength = title ? title.trim().length : 0;

  // 1. Aspect sizing configs & typography scaling to prevent card visual overflows
  let aspectClass = 'aspect-[16/9]';
  let titleSizeClass = 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[0.95]';
  let paddingClass = 'p-6 md:p-12';
  let watermarkSizeClass = 'text-[18rem] md:text-[24rem]';
  
  if (aspect === '21:9') {
    aspectClass = 'aspect-[21/9] max-h-[220px] sm:max-h-[280px] md:max-h-[340px]';
    paddingClass = 'p-6 md:p-8';
    watermarkSizeClass = 'text-[12rem] md:text-[16rem]';
    if (titleLength > 75) {
      titleSizeClass = 'text-base sm:text-lg md:text-xl lg:text-2xl leading-snug';
    } else if (titleLength > 45) {
      titleSizeClass = 'text-lg sm:text-xl md:text-2xl lg:text-3xl leading-tight';
    } else {
      titleSizeClass = 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-[0.95]';
    }
  } else if (aspect === '3:2') {
    aspectClass = 'aspect-[3/2]';
    paddingClass = 'p-6 md:p-8';
    watermarkSizeClass = 'text-[14rem] md:text-[18rem]';
    if (titleLength > 75) {
      titleSizeClass = 'text-base sm:text-lg md:text-xl lg:text-2xl leading-snug';
    } else if (titleLength > 45) {
      titleSizeClass = 'text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight';
    } else {
      titleSizeClass = 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-[0.95]';
    }
  } else if (aspect === '4:3') {
    aspectClass = 'aspect-[4/3]';
    paddingClass = 'p-4 md:p-6';
    watermarkSizeClass = 'text-[12rem] md:text-[16rem]';
    if (titleLength > 48) {
      titleSizeClass = 'text-[15px] sm:text-[17px] md:text-[19px] lg:text-[21px] leading-snug';
    } else if (titleLength > 32) {
      titleSizeClass = 'text-base sm:text-lg md:text-xl lg:text-[23px] leading-tight';
    } else {
      titleSizeClass = 'text-lg sm:text-xl md:text-2xl lg:text-[26px] leading-[1.05]';
    }
  } else if (aspect === 'featured') {
    aspectClass = 'aspect-[4/3] lg:aspect-auto lg:h-full';
    paddingClass = 'p-6 md:p-10 lg:p-12';
    watermarkSizeClass = 'text-[15rem] md:text-[19rem] lg:text-[24rem]';
    if (titleLength > 75) {
      titleSizeClass = 'text-[15px] sm:text-lg md:text-xl lg:text-2xl leading-snug';
    } else if (titleLength > 45) {
      titleSizeClass = 'text-lg sm:text-xl md:text-2xl lg:text-3xl lg:text-4xl leading-tight';
    } else {
      titleSizeClass = 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl lg:text-6xl leading-[0.95]';
    }
  } else if (aspect === '1:1') {
    aspectClass = 'aspect-square';
    paddingClass = 'p-6 md:p-8';
    watermarkSizeClass = 'text-[14rem] md:text-[18rem]';
    if (titleLength > 75) {
      titleSizeClass = 'text-sm sm:text-base md:text-lg lg:text-xl leading-snug';
    } else if (titleLength > 45) {
      titleSizeClass = 'text-lg sm:text-xl md:text-2xl lg:text-3xl leading-tight';
    } else {
      titleSizeClass = 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-[0.95]';
    }
  } else if (aspect === '4:5') {
    aspectClass = 'aspect-[4/5]';
    paddingClass = 'p-6 md:p-10';
    watermarkSizeClass = 'text-[16rem] md:text-[20rem]';
    if (titleLength > 75) {
      titleSizeClass = 'text-base sm:text-lg md:text-xl lg:text-2xl leading-snug';
    } else if (titleLength > 45) {
      titleSizeClass = 'text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight';
    } else {
      titleSizeClass = 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-[0.95]';
    }
  } else if (aspect === '16:9') {
    aspectClass = 'aspect-[16/9]';
    paddingClass = 'p-4 sm:p-5';
    watermarkSizeClass = 'text-[12rem] md:text-[15rem]';
    if (titleLength > 75) {
      titleSizeClass = 'text-base sm:text-lg md:text-xl lg:text-2xl leading-snug';
    } else if (titleLength > 45) {
      titleSizeClass = 'text-lg sm:text-xl md:text-2xl lg:text-3xl leading-tight';
    } else {
      titleSizeClass = 'text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-[0.95]';
    }
  } else {
    // Default 16:9 Featured Cover
    aspectClass = 'aspect-[16/9]';
    paddingClass = 'p-6 md:p-12';
    watermarkSizeClass = 'text-[18rem] md:text-[24rem]';
    if (titleLength > 75) {
      titleSizeClass = 'text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-snug';
    } else if (titleLength > 45) {
      titleSizeClass = 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight';
    } else {
      titleSizeClass = 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[0.95]';
    }
  }

  // Parse title highlighting
  const words = title ? title.trim().split(/\s+/) : [];
  const cleanWord = (w) => w.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
  const target = accentWord ? cleanWord(accentWord) : '';
  
  let accentIndex = -1;
  if (target) {
    accentIndex = words.findIndex(w => cleanWord(w) === target);
  }
  if (accentIndex === -1 && words.length > 0) {
    accentIndex = words.length - 1;
  }

  let theme = 'void';
  try {
    const themeContext = useTheme();
    if (themeContext) {
      theme = themeContext.theme;
    }
  } catch (e) {
    // Graceful fallback for SSR / pre-render
  }

  const pillarKey = mapPillarKey(pillar);
  
  let pillarAccentColor = accentOverride;
  if (!pillarAccentColor) {
    if (theme === 'parchment') {
      pillarAccentColor = `var(--pillar-label-${pillarKey})`;
    } else if (pillarKey === 'tools') {
      pillarAccentColor = 'var(--pillar-card-text)'; // force white on tools or in Parchment
    } else {
      pillarAccentColor = `var(--pillar-${pillarKey})`; // keep dynamic identity color
    }
  }
  const pillarLabel = getPillarLabel(pillar);
  const stateLabel = getBrainStateLabel(brainState);
  const txId = `TX-${(getHash(title || '') % 10000).toString(16).toUpperCase()}`;

  const displayPostNumber = postNumber 
    ? `№ ${postNumber.toString().padStart(3, '0')}` 
    : `№ ${(getHash(title || '') % 100 + 1).toString().padStart(3, '0')}`;

  const eyebrow = `TRANSMISSION · ${displayPostNumber}`;

  // Deterministic seed for generative modes
  const seed = getHash(title || 'ND3');

  // RENDER CONCEPT 1: Brain State Diagnostic Dashboard
  if (concept === 'diagnostic') {
    // Metric scores keyed off brainState
    let dop = 50, foc = 50, ovr = 40, en = 50;
    const s = brainState?.toLowerCase() || '';
    if (s.includes('burn')) { dop = 12; foc = 18; ovr = 95; en = 8; }
    else if (s.includes('focus')) { dop = 95; foc = 100; ovr = 60; en = 90; }
    else if (s.includes('mask')) { dop = 35; foc = 55; ovr = 75; en = 25; }
    else if (s.includes('spiral')) { dop = 18; foc = 85; ovr = 90; en = 35; }
    else if (s.includes('roll')) { dop = 85; foc = 80; ovr = 30; en = 85; }

    const metrics = [
      { name: 'DOPAMINE', val: dop, color: '#FF2E88' },
      { name: 'FOCUS', val: foc, color: '#18D6D0' },
      { name: 'SENS_LOAD', val: ovr, color: '#FFB800' },
      { name: 'EF_ENERGY', val: en, color: '#00FF66' }
    ];

    return (
      <div 
        className={`relative w-full overflow-hidden post-cover text-[var(--pillar-card-text)] font-mono flex flex-col justify-between border border-border-rule ${aspectClass} ${paddingClass}`}
        data-pillar={pillarKey}
      >
        {/* Schematic Gridlines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(31,31,34,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(31,31,34,0.35)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none select-none z-0"></div>

        {/* Top Header details */}
        <div className="z-10 flex justify-between items-start w-full border-b border-[#1F1F22] pb-3 text-xs md:text-sm text-text-muted">
          <span>STATUS: ACTIVE DIAGNOSTIC</span>
          <span>DEV_MODE: V2.1</span>
        </div>

        {/* Middle Visual Section (Dials, Scans, Waves) */}
        <div className="z-10 flex-grow grid grid-cols-12 gap-4 items-center my-4 overflow-hidden select-none">
          {/* Dopamine circular dial gauge (left) */}
          <div className="col-span-4 flex flex-col items-center justify-center border-r border-[#1F1F22] h-full pr-2">
            <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-[0_0_8px_rgba(255,46,136,0.2)]">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#1F1F22" strokeWidth="6" />
              <circle cx="50" cy="50" r="40" fill="none" stroke={pillarAccentColor} strokeWidth="6" 
                strokeDasharray={`${(dop / 100) * 251.2} 251.2`} strokeLinecap="round" transform="rotate(-90 50 50)" />
              <text x="50" y="55" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="bold" fontFamily="monospace">
                {dop}%
              </text>
            </svg>
            <span className="text-xs md:text-sm text-text-muted mt-2 tracking-widest uppercase">SYS_LEVEL</span>
          </div>

          {/* Core metrics bar graphs (right) */}
          <div className="col-span-8 flex flex-col gap-2 pl-2 text-left justify-center h-full">
            {metrics.map(m => (
              <div key={m.name} className="flex items-center text-xs md:text-sm w-full">
                <span className="w-16 text-[#8A8A93] tracking-wider select-none font-bold">{m.name}:</span>
                <div className="flex-grow h-2 bg-[#1F1F22] relative overflow-hidden ml-2 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)] border border-[#1F1F22]">
                  <div className="h-full" style={{ width: `${m.val}%`, backgroundColor: m.color, filter: 'drop-shadow(0 0 4px currentColor)' }}></div>
                </div>
                <span className="w-8 text-right text-white font-bold ml-2">{m.val}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Title area (typeset cleanly in Outifit display but balanced, so it is a caption box!) */}
        <div className="z-10 bg-black/85 border border-[#1F1F22] p-4 flex flex-col gap-1 w-full text-left backdrop-blur-md">
          <h2 className="font-display font-black text-lg md:text-xl uppercase leading-tight tracking-tight text-white select-text">
            {words.map((word, idx) => {
              const isAccented = idx === accentIndex;
              return (
                <span key={idx} style={isAccented ? { color: pillarAccentColor } : undefined} className={idx > 0 ? 'ml-[0.25em]' : ''}>
                  {word}
                </span>
              );
            })}
          </h2>
        </div>
      </div>
    );
  }

  // RENDER CONCEPT 2: Generative SVG Abstract Art Poster
  if (concept === 'abstract') {
    const s = brainState?.toLowerCase() || '';
    
    // Abstract Art Canvas Generators based on brainState
    let generativeCanvas = null;

    if (s.includes('focus')) {
      // Intricate geometric data-vis style
      generativeCanvas = (
        <svg viewBox="0 0 400 200" className="absolute inset-0 w-full h-full opacity-80 z-0">
          <defs>
            <linearGradient id="focusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#18D6D0" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#9B5CFF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#050508" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="focusAccent" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FF2E88" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#18D6D0" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect width="400" height="200" fill="url(#focusGrad)" />
          {/* Concentric rings */}
          {[120, 100, 80, 60, 40, 20].map((r, i) => (
            <circle key={i} cx="200" cy="100" r={r} fill="none" stroke="#18D6D0" strokeWidth={i % 2 === 0 ? 1 : 0.2} strokeDasharray={i % 2 === 0 ? "4,4" : "none"} opacity="0.6" />
          ))}
          {/* Intersecting rays */}
          {[...Array(12)].map((_, i) => (
            <line key={i} x1="200" y1="100" x2={200 + 150 * Math.cos(i * Math.PI / 6)} y2={100 + 150 * Math.sin(i * Math.PI / 6)} stroke="url(#focusAccent)" strokeWidth="1.5" opacity="0.4" />
          ))}
          {/* Target box */}
          <rect x="150" y="50" width="100" height="100" fill="none" stroke="#FF2E88" strokeWidth="2" opacity="0.8" strokeDasharray="10,5" />
          <polygon points="200,60 240,100 200,140 160,100" fill="#18D6D0" opacity="0.1" />
        </svg>
      );
    } else if (s.includes('burn')) {
      // Overwhelming chaotic static/void
      generativeCanvas = (
        <svg viewBox="0 0 400 200" className="absolute inset-0 w-full h-full opacity-90 z-0">
          <defs>
            <radialGradient id="burnCore" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#050508" stopOpacity="1" />
              <stop offset="40%" stopColor="#1A0008" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FF2E88" stopOpacity="0.5" />
            </radialGradient>
            <linearGradient id="burnRays" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF2E88" stopOpacity="0" />
              <stop offset="50%" stopColor="#FF2E88" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FF2E88" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect width="400" height="200" fill="url(#burnCore)" />
          {/* Chaotic crossing lines */}
          {[...Array(30)].map((_, i) => {
            const y = 10 + (i * 6);
            return <line key={i} x1="0" y1={y} x2="400" y2={y + (Math.sin(i)*20)} stroke="url(#burnRays)" strokeWidth={0.5 + (i%3)} opacity={0.2 + (i%4)*0.1} />
          })}
          {/* Central void sphere */}
          <circle cx="200" cy="100" r="70" fill="#000" />
          <circle cx="200" cy="100" r="72" fill="none" stroke="#FF2E88" strokeWidth="1" strokeDasharray="1,4" />
          <circle cx="200" cy="100" r="85" fill="none" stroke="#FFB800" strokeWidth="0.5" strokeDasharray="10,20" opacity="0.5" />
        </svg>
      );
    } else if (s.includes('spiral')) {
      // Moire patterns / intersecting waves
      generativeCanvas = (
        <svg viewBox="0 0 400 200" className="absolute inset-0 w-full h-full opacity-80 z-0">
          <defs>
            <linearGradient id="spiralGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9B5CFF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FF2E88" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <rect width="400" height="200" fill="#050508" />
          {/* Array of overlapping expanding ellipses */}
          {[...Array(20)].map((_, i) => (
            <ellipse 
              key={i} 
              cx="200" 
              cy="100" 
              rx={10 + i * 12} 
              ry={5 + i * 8} 
              fill="none" 
              stroke="url(#spiralGrad1)" 
              strokeWidth="1.5" 
              transform={`rotate(${i * 15} 200 100)`} 
            />
          ))}
          <circle cx="200" cy="100" r="2" fill="#FFB800" />
        </svg>
      );
    } else if (s.includes('roll')) {
      // Smooth dynamic flowing ribbons
      generativeCanvas = (
        <svg viewBox="0 0 400 200" className="absolute inset-0 w-full h-full opacity-90 z-0">
          <defs>
            <linearGradient id="rollGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#18D6D0" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#9B5CFF" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#FF2E88" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="rollBg" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#050508" />
              <stop offset="100%" stopColor="#1a0b1f" />
            </linearGradient>
          </defs>
          <rect width="400" height="200" fill="url(#rollBg)" />
          {/* Multiple bezier curves forming a ribbon */}
          {[...Array(15)].map((_, i) => (
            <path 
              key={i}
              d={`M -50 ${100 + i * 5} C 100 ${20 - i * 10}, 300 ${180 + i * 10}, 450 ${100 - i * 5}`} 
              fill="none" 
              stroke="url(#rollGrad)" 
              strokeWidth={2 + (i % 3)} 
              opacity={0.3 + (i * 0.04)}
            />
          ))}
          {[...Array(8)].map((_, i) => (
            <path 
              key={`b${i}`}
              d={`M -50 ${120 - i * 8} C 150 ${200 + i * 5}, 250 ${0 - i * 5}, 450 ${80 + i * 8}`} 
              fill="none" 
              stroke="#18D6D0" 
              strokeWidth="1" 
              opacity="0.2"
              strokeDasharray="4,4"
            />
          ))}
        </svg>
      );
    } else {
      // Default abstract logic (e.g. isometric grid or layered shapes)
      generativeCanvas = (
        <svg viewBox="0 0 400 200" className="absolute inset-0 w-full h-full opacity-70 z-0">
           <defs>
            <linearGradient id="defGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={pillarAccentColor} stopOpacity="0.5" />
              <stop offset="100%" stopColor="#050508" stopOpacity="1" />
            </linearGradient>
          </defs>
          <rect width="400" height="200" fill="url(#defGrad)" />
          {[...Array(8)].map((_, i) => (
            <rect 
              key={i} 
              x={50 + (i * 20)} 
              y={50 - (i * 10)} 
              width={200} 
              height={100} 
              fill="none" 
              stroke={pillarAccentColor} 
              strokeWidth="1" 
              opacity={1 - (i * 0.1)} 
            />
          ))}
          {[...Array(20)].map((_, i) => (
            <line key={`l${i}`} x1={i * 20} y1="0" x2={i * 20 + 100} y2="200" stroke="#ffffff" strokeWidth="0.5" opacity="0.05" />
          ))}
        </svg>
      );
    }

    return (
      <div 
        className={`relative w-full overflow-hidden post-cover text-[var(--pillar-card-text)] flex flex-col justify-between border-2 border-border-rule ${aspectClass}`}
        data-pillar={pillarKey}
      >
        {/* Generative Vector Art Canvas */}
        {generativeCanvas}

        {/* Dense noise/grain overlay */}
        <div className="absolute inset-0 bg-[#000000] opacity-30 bg-[size:3px_3px] bg-[radial-gradient(#ffffff_0.5px,transparent_0.5px)] z-0 mix-blend-overlay"></div>

        <div className="relative z-10 w-full h-full flex flex-col justify-between p-6 md:p-10">
          {/* Top Header metadata */}
          <div className="flex justify-between items-center w-full pb-3 border-b border-white/20 text-xs md:text-sm font-mono tracking-widest text-white/70">
            <span>TX_GEN_ART</span>
            <span>SEED: #{seed.toString(16).toUpperCase()}</span>
          </div>

          {/* Floating title block with glassmorphism */}
          <div className="bg-black/80 backdrop-blur-md border border-white/20 p-6 md:p-8 flex flex-col gap-2 w-full max-w-[90%] mt-auto shadow-2xl">
            <h2 className="font-display font-black text-2xl md:text-4xl lg:text-5xl uppercase leading-[0.95] tracking-tight text-white select-text text-left">
              {words.map((word, idx) => {
                const isAccented = idx === accentIndex;
                return (
                  <span key={idx} style={isAccented ? { color: pillarAccentColor } : undefined} className={idx > 0 ? 'ml-[0.25em]' : ''}>
                    {word}
                  </span>
                );
              })}
            </h2>
          </div>
        </div>
      </div>
    );
  }

  // RENDER CONCEPT 3: Split-Panel Brutalist Grid (high intensity saturation, no empty voids)
  if (concept === 'split') {
    return (
      <div 
        className={`relative w-full overflow-hidden post-cover text-[var(--pillar-card-text)] border-2 border-border-rule flex flex-col sm:grid sm:grid-cols-12 ${aspectClass}`}
        data-pillar={pillarKey}
      >
        {/* Left Side (50%): High Intensity Colorful Gradient Mesh */}
        <div className="sm:col-span-6 relative overflow-hidden flex flex-col justify-between p-6 h-full min-h-[140px] select-none">
          {/* Dynamic Mesh */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent-pink via-[#9B5CFF] to-[#18D6D0] opacity-95 z-0 animate-pulse-slow"></div>
          {/* Glowing checkerboard layer */}
          <div className="absolute inset-0 bg-[linear-gradient(45deg,#000000_25%,transparent_25%,transparent_75%,#000000_75%,#000000),linear-gradient(45deg,#000000_25%,transparent_25%,transparent_75%,#000000_75%,#000000)] bg-[size:16px_16px] bg-[position:0_0,8px_8px] opacity-10 pointer-events-none select-none z-0"></div>

          {/* Cover number box removed */}

          <div className="z-10 flex flex-col select-none mt-auto">
            <span className="font-display font-black text-4xl text-black leading-none tracking-tighter drop-shadow-[2px_2px_0px_#ffffff]">
              ³
            </span>
            <span className="font-mono text-xs md:text-sm font-bold text-black uppercase tracking-widest mt-1">
              SYS: ND3_GRID
            </span>
          </div>
        </div>

        {/* Right Side (50%): Dense high-contrast text log */}
        <div className="sm:col-span-6 p-6 sm:p-8 flex flex-col justify-between bg-black border-t-2 sm:border-t-0 sm:border-l-2 border-border-rule h-full">
          <div>
            {/* Cover node label removed */}
            
            <h2 className="font-display font-black text-xl md:text-2xl uppercase leading-none tracking-tight text-white text-left break-words">
              {words.map((word, idx) => {
                const isAccented = idx === accentIndex;
                return (
                  <span key={idx} style={isAccented ? { color: pillarAccentColor } : undefined} className={idx > 0 ? 'ml-[0.2em] inline-block' : 'inline-block'}>
                    {word}
                  </span>
                );
              })}
            </h2>
          </div>

          <div className="mt-8 pt-4 border-t border-[#1F1F22] flex justify-between items-center text-xs md:text-sm font-mono text-text-muted">
            <span>TX_STATUS: OK</span>
            <span className="font-display font-black text-white" aria-label="neurodivers three">neurodivers³</span>
          </div>
        </div>
      </div>
    );
  }

  // RENDER CONCEPT 4: Refined Brutalist Typographic poster (Original fallback)
  const displayReadTime = readTime || '5 MIN';
  const displayDate = date || '24 MAY 2026';

  const themeTextColor = 'text-[var(--pillar-card-text)]';
  const watermarkColor = theme === 'parchment' ? 'text-[var(--fg)]/[0.04]' : 'text-white/[0.05]';
  const gridLineColor = theme === 'parchment' ? 'bg-[var(--fg)]/10' : 'bg-white/10';
  const textMutedColor = theme === 'parchment' ? 'text-[var(--fg)]/70' : 'text-white/70';
  const textMutedStrongColor = theme === 'parchment' ? 'text-[var(--fg)]/80' : 'text-white/80';
  const themeAccentColor = pillarAccentColor;



  const displayEyebrow = eyebrow ? eyebrow : 'TRANSMISSION';
  const displayEyebrow11 = eyebrow ? eyebrow : 'TRANSMISSION';

  const is11 = aspect === '1:1';
  
  // Sizing class selection for Eyebrow
  let eyebrowFontClass = '';
  if (is11) {
    const len = displayEyebrow11.length;
    if (len > 35) {
      eyebrowFontClass = 'text-xs md:text-sm tracking-wide';
    } else if (len > 28) {
      eyebrowFontClass = 'text-xs md:text-sm tracking-wide';
    } else if (len > 20) {
      eyebrowFontClass = 'text-xs md:text-sm tracking-wider';
    } else {
      eyebrowFontClass = 'text-xs tracking-widest';
    }
  } else {
    const len = displayEyebrow.length;
    if (len > 35) {
      eyebrowFontClass = 'text-xs tracking-[0.1em]';
    } else {
      eyebrowFontClass = 'text-xs md:text-sm tracking-[0.12em]';
    }
  }

  let postNumFontClass = is11 ? 'text-xs' : 'text-xs md:text-sm';
  let metaStripFontClass = is11 ? 'text-xs' : 'text-xs md:text-sm';

  return (
    <div 
      className={`relative w-full overflow-hidden post-cover ${themeTextColor} font-sans select-none ${aspectClass}`}
      data-pillar={pillarKey}
      style={{ contentVisibility: 'auto' }}
    >
      {/* Dynamic Faint ³ Background Watermark */}
      <div 
        className={`absolute bottom-0 right-0 translate-x-[10%] translate-y-[15%] font-black font-display leading-none pointer-events-none select-none z-0 ${watermarkColor} ${watermarkSizeClass}`}
      >
        ³
      </div>

      {/* Brutalist Grid Lines */}
      <div className={`absolute top-[28%] left-0 right-0 h-[1px] ${gridLineColor} z-0`}></div>
      <div className={`absolute left-[28%] top-0 bottom-0 w-[1px] ${gridLineColor} z-0`}></div>

      {/* Inner Centered Content Container */}
      <div className={`relative z-10 w-full h-full mx-auto flex flex-col justify-between ${paddingClass} ${maxW ? `${maxW} px-6 md:px-12` : ''}`}>
        {/* Top Header Row */}
        <div className="flex flex-row justify-between items-center w-full select-none gap-2">
          <div className="flex justify-end items-center ml-auto text-right shrink-0">
            <LogoWordmark className="logo h-5 md:h-6 w-auto opacity-90 text-[var(--pillar-card-text)]" />
          </div>
        </div>

        {/* The hairline rule - 1px horizontal rule between eyebrow and title */}
        <div className={`w-full h-[1px] ${gridLineColor} ${aspect === '4:3' ? 'my-2' : 'my-3 md:my-5'}`}></div>

        {/* Main Title Align Top-Left */}
        <div className={`flex-grow flex items-center justify-start text-left select-none ${aspect === '4:3' ? 'mt-2 mb-2' : 'mt-4 mb-4'}`}>
          <h2 
            className={`font-black uppercase font-display leading-[0.95] tracking-tighter text-left w-full break-words max-w-[92%] ${titleSizeClass}`}
          >
            {words.map((word, idx) => {
              const isAccented = idx === accentIndex;
              return (
                <React.Fragment key={idx}>
                  {idx > 0 && ' '}
                  <span style={isAccented ? { color: themeAccentColor } : undefined}>
                    {word}
                  </span>
                </React.Fragment>
              );
            })}
          </h2>
        </div>
      </div>
    </div>
  );
};
