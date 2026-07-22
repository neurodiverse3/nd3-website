"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowLeft, 
  RefreshCw, 
  Cpu, 
  Code, 
  Sliders, 
  Copy, 
  Check, 
  Info
} from 'lucide-react';

const THEME_DEFS = {
  void: {
    '--bg': '#121212',
    '--fg': '#F4F4F2',
    '--muted': '#A1A1AA',
    '--rule': '#1F1F22',
    '--accent-pink': '#FF2E88',
    '--accent-soft': 'rgba(255, 46, 136, 0.12)',
    '--grad-hero': 'linear-gradient(135deg, #FF2E88 0%, #C026D3 55%, #7C3AED 100%)',
    '--grad-progress': 'linear-gradient(90deg, #FF2E88 0%, #C026D3 55%, #7C3AED 100%)',
    cardBg: {
      'unmasked-life': '#2A0A19',  
      'tiny-systems': '#2F1A00',   
      'glitchwork': '#00252C'      
    },
    name: 'Void (Soft Dark)'
  },
  parchment: {
    '--bg': '#ECE7DA',
    '--fg': '#221E1A',
    '--muted': '#6B635A',
    '--rule': '#DDD7CD',
    '--accent-pink': '#FF2D87',
    '--accent-soft': 'rgba(255, 45, 135, 0.12)',
    '--grad-hero': 'linear-gradient(135deg, #FF2D87 0%, #C71F63 100%)',
    '--grad-progress': 'linear-gradient(90deg, #FF2D87 0%, #C71F63 100%)',
    cardBg: {
      'unmasked-life': '#BB1B57',  
      'tiny-systems': '#A6690B',   
      'glitchwork': '#0B7285'      
    },
    name: 'Parchment (Warm Cream)'
  },
  incubation: {
    '--bg': '#0B130F',
    '--fg': '#F4F4F2',
    '--muted': '#839788',
    '--rule': '#1A2E22',
    '--accent-pink': '#5A8A60',
    '--accent-soft': 'rgba(90, 138, 96, 0.12)',
    '--grad-hero': 'linear-gradient(135deg, #5A8A60 0%, #3FB07C 55%, #2DD4BF 100%)',
    '--grad-progress': 'linear-gradient(90deg, #5A8A60 0%, #3FB07C 55%, #2DD4BF 100%)',
    cardBg: {
      'unmasked-life': '#3A1626',
      'tiny-systems': '#5C3A08',
      'glitchwork': '#10333B'
    },
    name: 'Incubation (Dark Sage)'
  }
};

const PILLAR_COLORS = {
  'unmasked-life': '#FF2D87',
  'tiny-systems': '#FFAC1C',
  'glitchwork': '#00F0FF'
};

const PILLAR_LABELS = {
  'unmasked-life': 'UNMASKED LIFE',
  'tiny-systems': 'TOOLS & TEMPLATES',
  'glitchwork': 'DIGITAL LIFE'
};

const BRAIN_STATE_LABELS = {
  'burned-out': 'BURNED OUT',
  'hyperfocus': 'HYPERFOCUS',
  'masking': 'MASKING',
  'spiraling': 'SPIRALLING',
  'on-a-roll': 'ON A ROLL'
};

export default function BannerShowcase() {
  const [title, setTitle] = useState('Late Diagnosis Grief (and other stories we tell in private)');
  const [pillar, setPillar] = useState('unmasked-life');
  const [brainState, setBrainState] = useState('hyperfocus');
  const [selectedTheme, setSelectedTheme] = useState('void');
  
  const [modifyEyebrowLine, setModifyEyebrowLine] = useState(true);
  const [modifyBackgroundGrid, setModifyBackgroundGrid] = useState(true);

  const [openInspectors, setOpenInspectors] = useState({ A: false, B: false, C: false, D: false });
  const [copiedStates, setCopiedStates] = useState({ A: false, B: false, C: false, D: false });

  const toggleInspector = (concept) => {
    setOpenInspectors(prev => ({ ...prev, [concept]: !prev[concept] }));
  };

  const copyToClipboard = (concept, codeText) => {
    navigator.clipboard.writeText(codeText);
    setCopiedStates(prev => ({ ...prev, [concept]: true }));
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [concept]: false }));
    }, 2000);
  };

  const handleRandomize = () => {
    const titles = [
      { t: 'Sensory Overload Recovery Protocol', p: 'tiny-systems', b: 'burned-out' },
      { t: 'Glitchy Systems: Embracing Retro Tech', p: 'glitchwork', b: 'hyperfocus' },
      { t: 'AuDHD Double-Empathy Realities', p: 'unmasked-life', b: 'on-a-roll' },
      { t: 'Weeding the Executive Garden', p: 'tiny-systems', b: 'masking' },
      { t: 'Static and Noise: Auditory Shields', p: 'glitchwork', b: 'spiraling' }
    ];
    const rand = titles[Math.floor(Math.random() * titles.length)];
    setTitle(rand.t);
    setPillar(rand.p);
    setBrainState(rand.b);
  };

  const themeObj = THEME_DEFS[selectedTheme];
  const activePillarColor = PILLAR_COLORS[pillar];
  const cardBackgroundColor = themeObj.cardBg[pillar];
  const eyebrowLabel = `${PILLAR_LABELS[pillar]} · ${BRAIN_STATE_LABELS[brainState]}`;
  const words = title ? title.trim().split(/\s+/) : [];
  const accentIndex = words.length > 0 ? words.length - 1 : -1;

  const codes = {
    A: `/* Concept A: Tapered Glow */
{/* Eyebrow Divider */}
<div className="w-full h-[1px] my-3 md:my-5 z-10" style={{
  background: 'linear-gradient(90deg, transparent 0%, var(--accent) 50%, transparent 100%)',
  boxShadow: '0 0 10px 1px var(--accent-soft)'
}} />

{/* Background Grid */}
<div className="absolute top-[28%] left-0 right-0 h-[1px] z-0" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)' }} />
<div className="absolute left-[28%] top-0 bottom-0 w-[1px] z-0" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)' }} />`,

    B: `/* Concept B: Glassmorphic Etches */
{/* Eyebrow Divider */}
<div className="w-full h-[2px] my-3 md:my-5 z-10 backdrop-blur-sm bg-white/5 border-t border-b border-black/20 shadow-[0_1px_0_rgba(255,255,255,0.1)]" />

{/* Background Grid */}
<div className="absolute top-[28%] left-0 right-0 h-[4px] z-0 backdrop-blur-md bg-white/[0.02] border-t border-b border-black/10 shadow-[0_1px_0_rgba(255,255,255,0.05)]" />
<div className="absolute left-[28%] top-0 bottom-0 w-[4px] z-0 backdrop-blur-md bg-white/[0.02] border-l border-r border-black/10 shadow-[1px_0_0_rgba(255,255,255,0.05)]" />`,

    C: `/* Concept C: Animated Light Sweep */
{/* Add these to your global css or tailwind config:
@keyframes sweep { 0% { transform: translateX(-100%); } 100% { transform: translateX(300%); } }
@keyframes sweep-vertical { 0% { transform: translateY(-100%); } 100% { transform: translateY(300%); } }
*/

{/* Eyebrow Divider */}
<div className="w-full h-[1px] bg-white/10 my-3 md:my-5 z-10 relative overflow-hidden group">
  <div className="absolute top-0 bottom-0 left-0 w-[30%] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-70" style={{ animation: 'sweep 3s infinite linear' }} />
</div>

{/* Background Grid */}
<div className="absolute top-[28%] left-0 right-0 h-[1px] bg-white/10 z-0 overflow-hidden">
  <div className="absolute top-0 bottom-0 left-0 w-[30%] bg-gradient-to-r from-transparent via-white to-transparent opacity-30" style={{ animation: 'sweep 8s infinite linear' }} />
</div>
<div className="absolute left-[28%] top-0 bottom-0 w-[1px] bg-white/10 z-0 overflow-hidden">
  <div className="absolute top-0 bottom-0 left-0 h-[30%] w-full bg-gradient-to-b from-transparent via-white to-transparent opacity-30" style={{ animation: 'sweep-vertical 8s infinite linear' }} />
</div>`,

    D: `/* Concept D: Architectural Blueprint */
{/* Eyebrow Divider */}
<div className="w-full h-[1px] my-3 md:my-5 z-10" style={{
  backgroundImage: 'linear-gradient(to right, var(--accent) 50%, transparent 50%)',
  backgroundSize: '120px 100%',
  backgroundRepeat: 'repeat-x'
}} />

{/* Background Grid */}
<div className="absolute top-[28%] left-0 right-0 h-[1px] z-0 opacity-20" style={{
  backgroundImage: 'linear-gradient(to right, white 50%, transparent 50%)',
  backgroundSize: '120px 100%',
  backgroundRepeat: 'repeat-x'
}} />
<div className="absolute left-[28%] top-0 bottom-0 w-[1px] z-0 opacity-20" style={{
  backgroundImage: 'linear-gradient(to bottom, white 50%, transparent 50%)',
  backgroundSize: '100% 120px',
  backgroundRepeat: 'repeat-y'
}} />`
  };

  const renderCardWrapper = (conceptId, dividerComponent, gridLinesOverride = null) => {
    return (
      <div 
        className="relative w-full aspect-[16/9] overflow-hidden text-[#F4F4F2] font-sans select-none border border-white/10 flex flex-col justify-between p-6 md:p-10 select-none max-w-[700px] shadow-2xl transition-all duration-300"
        style={{ backgroundColor: cardBackgroundColor }}
      >
        <div className="absolute bottom-0 right-0 translate-x-[10%] translate-y-[15%] font-black font-display leading-none text-white/[0.04] text-[15rem] md:text-[20rem] pointer-events-none select-none z-0">
          ³
        </div>

        {modifyBackgroundGrid ? (
          gridLinesOverride ? gridLinesOverride : (
            <>
              <div className="absolute top-[28%] left-0 right-0 h-[1px] bg-white/10 z-0" />
              <div className="absolute left-[28%] top-0 bottom-0 w-[1px] bg-white/10 z-0" />
            </>
          )
        ) : (
          <>
            <div className="absolute top-[28%] left-0 right-0 h-[1px] bg-white/10 z-0" />
            <div className="absolute left-[28%] top-0 bottom-0 w-[1px] bg-white/10 z-0" />
          </>
        )}

        <div className="relative z-10 flex flex-row justify-between items-center w-full select-none gap-2">
          <div className="font-mono text-xs md:text-sm text-white/70 uppercase font-black tracking-widest text-left whitespace-nowrap overflow-hidden text-ellipsis">
            {eyebrowLabel}
          </div>
          <div className="flex justify-end items-center ml-auto text-right font-display font-black text-xs tracking-tight opacity-90">
            neurodivers<span className="font-bold">³</span>
          </div>
        </div>

        {modifyEyebrowLine ? dividerComponent : (
          <div className="w-full h-[1px] bg-white/15 my-3 md:my-5 z-10" />
        )}

        <div className="flex-grow flex items-center justify-start text-left mt-3 select-none z-10">
          <h1 className="font-black uppercase font-display leading-[0.98] tracking-tighter text-left w-full break-words text-lg sm:text-2xl md:text-3xl lg:text-4xl max-w-[94%]">
            {words.map((word, idx) => {
              const isAccented = idx === accentIndex;
              return (
                <span key={idx} style={isAccented ? { color: activePillarColor } : undefined} className={idx > 0 ? 'ml-[0.25em]' : ''}>
                  {word}
                </span>
              );
            })}
          </h1>
        </div>
      </div>
    );
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        @keyframes sweep-vertical {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(300%); }
        }
      `}} />
      <div id="banner-showcase-container" className="min-h-screen pt-[96px] md:pt-[120px] pb-24 px-6 md:px-24 max-w-7xl mx-auto flex flex-col justify-start text-left select-none bg-bg-primary text-fg-primary">
        
        <div className="mb-12 border-b-4 border-fg-primary pb-8 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 w-full mt-4">
          <div>
            <Link href="/labs" className="inline-flex items-center gap-2 text-text-muted hover:text-accent-pink transition-colors uppercase font-black text-xs md:text-sm tracking-widest mb-6 focus-ring">
              <ArrowLeft size={12} /> Back to Labs
            </Link>
            <div className="inline-block text-xs md:text-sm font-mono tracking-[0.25em] text-accent-pink bg-accent-pink-soft px-3 py-1 uppercase border border-border-rule mb-4 select-none animate-pulse-slow">
              PREMIUM DESIGNS SANDBOX
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-fg-primary leading-none font-display">
              POST COVER BACKGROUND LINES<span className="text-accent-pink inline-block ml-0.5">.</span>
            </h1>
            <p className="text-text-muted text-sm md:text-base font-normal mt-4 max-w-2xl leading-relaxed">
              Audit our <b>four new premium structural line concepts</b>.
            </p>
          </div>
          <button onClick={handleRandomize} className="flex items-center gap-2 px-4 py-2 bg-accent-pink text-black text-xs font-black uppercase tracking-wider border border-white hover:opacity-90 transition-all rounded-none cursor-pointer shadow-[3px_3px_0px_#ffffff] shrink-0">
            <RefreshCw size={12} /> Randomize Post
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-12 items-start w-full relative">
          
          <aside aria-label="Playground Controls" className="border-2 border-border-rule bg-[#09090b] p-6 shadow-[4px_4px_0px_var(--rule)] flex flex-col gap-6 text-left">
            <div className="flex items-center gap-2 border-b border-border-rule pb-3">
              <Sliders className="text-accent-pink shrink-0" size={16} />
              <h3 className="font-mono text-xs font-black uppercase tracking-wider text-white">PLAYGROUND CONTROLS</h3>
            </div>

            <div className="flex flex-col gap-2">
              <div className="font-mono text-xs md:text-sm text-[#8A8A93] tracking-widest uppercase font-bold">THEME EMULATOR:</div>
              <div className="grid grid-cols-3 gap-1 font-mono text-xs md:text-sm tracking-wide">
                {Object.keys(THEME_DEFS).map((tKey) => (
                  <button key={tKey} onClick={() => setSelectedTheme(tKey)} className={`py-2 px-1 border-2 text-center font-black cursor-pointer rounded-none uppercase transition-all ${selectedTheme === tKey ? 'bg-accent-pink border-white text-black' : 'border-border-rule text-text-muted bg-black/40 hover:border-white hover:text-white'}`}>
                    {tKey}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="cover-title-input" className="font-mono text-xs md:text-sm text-[#8A8A93] tracking-widest uppercase font-bold">COVER TITLE:</label>
              <textarea id="cover-title-input" rows={3} value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-black border border-border-rule focus:border-accent-pink px-3 py-2 text-xs text-white outline-none rounded-none font-sans font-medium focus-ring resize-y" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="pillar-select" className="font-mono text-xs md:text-sm text-[#8A8A93] tracking-widest uppercase font-bold">PILLAR BRAND CARD COLOR:</label>
              <select id="pillar-select" value={pillar} onChange={(e) => setPillar(e.target.value)} className="w-full h-10 bg-black border border-border-rule focus:border-accent-pink px-3 py-1 text-xs text-white outline-none rounded-none font-mono focus-ring cursor-pointer">
                <option value="unmasked-life">Unmasked Life (Garnet Dark Rose)</option>
                <option value="tiny-systems">Tools & Templates (Bronze Amber)</option>
                <option value="glitchwork">Digital Life (Petrol Teal Azure)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="brain-state-select" className="font-mono text-xs md:text-sm text-[#8A8A93] tracking-widest uppercase font-bold">BRAIN STATE TAG:</label>
              <select id="brain-state-select" value={brainState} onChange={(e) => setBrainState(e.target.value)} className="w-full h-10 bg-black border border-border-rule focus:border-accent-pink px-3 py-1 text-xs text-white outline-none rounded-none font-mono focus-ring cursor-pointer">
                <option value="burned-out">Burned Out</option>
                <option value="hyperfocus">Hyperfocused</option>
                <option value="masking">Masking</option>
                <option value="spiraling">Spiralling</option>
                <option value="on-a-roll">On a Roll</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 pt-3 border-t border-border-rule/60">
              <div className="font-mono text-xs md:text-sm text-[#8A8A93] tracking-widest uppercase font-bold">LINES TO AUDIT / SWAP:</div>
              <label htmlFor="eyebrow-line-checkbox" className="flex items-center gap-2 text-xs text-text-muted hover:text-white cursor-pointer select-none font-mono">
                <input id="eyebrow-line-checkbox" type="checkbox" checked={modifyEyebrowLine} onChange={() => setModifyEyebrowLine(!modifyEyebrowLine)} className="accent-accent-pink cursor-pointer" />
                <span>Eyebrow Hairline Divider</span>
              </label>
              <label htmlFor="bg-grid-checkbox" className="flex items-center gap-2 text-xs text-text-muted hover:text-white cursor-pointer select-none font-mono">
                <input id="bg-grid-checkbox" type="checkbox" checked={modifyBackgroundGrid} onChange={() => setModifyBackgroundGrid(!modifyBackgroundGrid)} className="accent-accent-pink cursor-pointer" />
                <span>Background Gridlines (28%)</span>
              </label>
            </div>

          </aside>

          <div className="flex flex-col gap-12 w-full">
            
            {/* Concept 1 */}
            <section className="border-2 border-border-rule bg-[#09090b] shadow-[4px_4px_0px_var(--rule)] relative">
              <div className="px-6 py-4 bg-black/40 border-b border-border-rule flex justify-between items-center select-none flex-wrap gap-4">
                <div>
                  <span className="font-mono text-xs font-black uppercase text-accent-pink tracking-widest block">
                    CONCEPT 1 - TAPERED GLOW
                  </span>
                  <span className="text-xs md:text-sm font-sans text-text-muted mt-1 block">
                    Lines fade to transparency at the edges with a soft neon glow in the center. Elegant and premium.
                  </span>
                </div>
                <button onClick={() => toggleInspector('A')} className="flex items-center gap-1.5 px-3 py-1 border border-border-rule hover:border-accent-pink hover:text-accent-pink transition-all font-mono text-xs md:text-sm font-bold uppercase rounded-none cursor-pointer">
                  <Code size={11} /> {openInspectors.A ? 'HIDE CODE' : 'INSPECT'}
                </button>
              </div>
              <div className="p-6 bg-bg-primary/20 border-b border-border-rule select-none relative overflow-hidden flex items-center justify-center">
                {renderCardWrapper('A', 
                  <div className="w-full h-[1px] my-3 md:my-5 z-10" style={{
                    background: `linear-gradient(90deg, transparent 0%, ${activePillarColor} 50%, transparent 100%)`,
                    boxShadow: `0 0 10px 1px ${themeObj['--accent-soft']}`
                  }} />,
                  modifyBackgroundGrid ? (
                    <>
                      <div className="absolute top-[28%] left-0 right-0 h-[1px] z-0" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)' }} />
                      <div className="absolute left-[28%] top-0 bottom-0 w-[1px] z-0" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)' }} />
                    </>
                  ) : null
                )}
              </div>
              {openInspectors.A && (
                <div className="border-t border-border-rule bg-black p-5 font-mono text-xs md:text-sm text-zinc-400 overflow-x-auto relative">
                  <div className="absolute right-4 top-4 z-10 flex gap-2">
                    <button onClick={() => copyToClipboard('A', codes.A)} className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 border border-zinc-700 text-white hover:bg-white hover:text-black transition-colors rounded-none font-bold cursor-pointer">
                      {copiedStates.A ? <Check size={11} className="text-green-500" /> : <Copy size={11} />}
                      <span>{copiedStates.A ? 'COPIED' : 'COPY'}</span>
                    </button>
                  </div>
                  <pre className="text-left select-text whitespace-pre-wrap pr-16">{codes.A}</pre>
                </div>
              )}
            </section>

            {/* Concept 2 */}
            <section className="border-2 border-border-rule bg-[#09090b] shadow-[4px_4px_0px_var(--rule)] relative">
              <div className="px-6 py-4 bg-black/40 border-b border-border-rule flex justify-between items-center select-none flex-wrap gap-4">
                <div>
                  <span className="font-mono text-xs font-black uppercase text-accent-pink tracking-widest block">
                    CONCEPT 2 - GLASSMORPHIC ETCHES
                  </span>
                  <span className="text-xs md:text-sm font-sans text-text-muted mt-1 block">
                    Uses backdrop-blur and borders to look like a frosted glass ridge etched into the layout. Minimalist depth.
                  </span>
                </div>
                <button onClick={() => toggleInspector('B')} className="flex items-center gap-1.5 px-3 py-1 border border-border-rule hover:border-accent-pink hover:text-accent-pink transition-all font-mono text-xs md:text-sm font-bold uppercase rounded-none cursor-pointer">
                  <Code size={11} /> {openInspectors.B ? 'HIDE CODE' : 'INSPECT'}
                </button>
              </div>
              <div className="p-6 bg-bg-primary/20 border-b border-border-rule select-none relative overflow-hidden flex items-center justify-center">
                {renderCardWrapper('B', 
                  <div className="w-full h-[2px] my-3 md:my-5 z-10 backdrop-blur-sm bg-white/5 border-t border-b border-black/20 shadow-[0_1px_0_rgba(255,255,255,0.1)]" />,
                  modifyBackgroundGrid ? (
                    <>
                      <div className="absolute top-[28%] left-0 right-0 h-[4px] z-0 backdrop-blur-md bg-white/[0.02] border-t border-b border-black/10 shadow-[0_1px_0_rgba(255,255,255,0.05)]" />
                      <div className="absolute left-[28%] top-0 bottom-0 w-[4px] z-0 backdrop-blur-md bg-white/[0.02] border-l border-r border-black/10 shadow-[1px_0_0_rgba(255,255,255,0.05)]" />
                    </>
                  ) : null
                )}
              </div>
              {openInspectors.B && (
                <div className="border-t border-border-rule bg-black p-5 font-mono text-xs md:text-sm text-zinc-400 overflow-x-auto relative">
                  <div className="absolute right-4 top-4 z-10 flex gap-2">
                    <button onClick={() => copyToClipboard('B', codes.B)} className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 border border-zinc-700 text-white hover:bg-white hover:text-black transition-colors rounded-none font-bold cursor-pointer">
                      {copiedStates.B ? <Check size={11} className="text-green-500" /> : <Copy size={11} />}
                      <span>{copiedStates.B ? 'COPIED' : 'COPY'}</span>
                    </button>
                  </div>
                  <pre className="text-left select-text whitespace-pre-wrap pr-16">{codes.B}</pre>
                </div>
              )}
            </section>

            {/* Concept 3 */}
            <section className="border-2 border-border-rule bg-[#09090b] shadow-[4px_4px_0px_var(--rule)] relative">
              <div className="px-6 py-4 bg-black/40 border-b border-border-rule flex justify-between items-center select-none flex-wrap gap-4">
                <div>
                  <span className="font-mono text-xs font-black uppercase text-accent-pink tracking-widest block">
                    CONCEPT 3 - ANIMATED LIGHT SWEEP
                  </span>
                  <span className="text-xs md:text-sm font-sans text-text-muted mt-1 block">
                    Clean 1px line with a very slow, ambient glowing lens flare sweeping across it. Alive and interactive.
                  </span>
                </div>
                <button onClick={() => toggleInspector('C')} className="flex items-center gap-1.5 px-3 py-1 border border-border-rule hover:border-accent-pink hover:text-accent-pink transition-all font-mono text-xs md:text-sm font-bold uppercase rounded-none cursor-pointer">
                  <Code size={11} /> {openInspectors.C ? 'HIDE CODE' : 'INSPECT'}
                </button>
              </div>
              <div className="p-6 bg-bg-primary/20 border-b border-border-rule select-none relative overflow-hidden flex items-center justify-center">
                {renderCardWrapper('C', 
                  <div className="w-full h-[1px] bg-white/10 my-3 md:my-5 z-10 relative overflow-hidden group">
                    <div className="absolute top-0 bottom-0 left-0 w-[30%] opacity-70" style={{ background: `linear-gradient(to right, transparent, ${activePillarColor}, transparent)`, animation: 'sweep 3s infinite linear' }} />
                  </div>,
                  modifyBackgroundGrid ? (
                    <>
                      <div className="absolute top-[28%] left-0 right-0 h-[1px] bg-white/10 z-0 overflow-hidden">
                        <div className="absolute top-0 bottom-0 left-0 w-[30%] bg-gradient-to-r from-transparent via-white to-transparent opacity-30" style={{ animation: 'sweep 8s infinite linear' }} />
                      </div>
                      <div className="absolute left-[28%] top-0 bottom-0 w-[1px] bg-white/10 z-0 overflow-hidden">
                        <div className="absolute top-0 bottom-0 left-0 h-[30%] w-full bg-gradient-to-b from-transparent via-white to-transparent opacity-30" style={{ animation: 'sweep-vertical 8s infinite linear' }} />
                      </div>
                    </>
                  ) : null
                )}
              </div>
              {openInspectors.C && (
                <div className="border-t border-border-rule bg-black p-5 font-mono text-xs md:text-sm text-zinc-400 overflow-x-auto relative">
                  <div className="absolute right-4 top-4 z-10 flex gap-2">
                    <button onClick={() => copyToClipboard('C', codes.C)} className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 border border-zinc-700 text-white hover:bg-white hover:text-black transition-colors rounded-none font-bold cursor-pointer">
                      {copiedStates.C ? <Check size={11} className="text-green-500" /> : <Copy size={11} />}
                      <span>{copiedStates.C ? 'COPIED' : 'COPY'}</span>
                    </button>
                  </div>
                  <pre className="text-left select-text whitespace-pre-wrap pr-16">{codes.C}</pre>
                </div>
              )}
            </section>

            {/* Concept 4 */}
            <section className="border-2 border-border-rule bg-[#09090b] shadow-[4px_4px_0px_var(--rule)] relative">
              <div className="px-6 py-4 bg-black/40 border-b border-border-rule flex justify-between items-center select-none flex-wrap gap-4">
                <div>
                  <span className="font-mono text-xs font-black uppercase text-accent-pink tracking-widest block">
                    CONCEPT 4 - ARCHITECTURAL BLUEPRINT
                  </span>
                  <span className="text-xs md:text-sm font-sans text-text-muted mt-1 block">
                    Very sparse, wide-set dashed lines that feel like clean technical blueprints.
                  </span>
                </div>
                <button onClick={() => toggleInspector('D')} className="flex items-center gap-1.5 px-3 py-1 border border-border-rule hover:border-accent-pink hover:text-accent-pink transition-all font-mono text-xs md:text-sm font-bold uppercase rounded-none cursor-pointer">
                  <Code size={11} /> {openInspectors.D ? 'HIDE CODE' : 'INSPECT'}
                </button>
              </div>
              <div className="p-6 bg-bg-primary/20 border-b border-border-rule select-none relative overflow-hidden flex items-center justify-center">
                {renderCardWrapper('D', 
                  <div className="w-full h-[1px] my-3 md:my-5 z-10" style={{
                    backgroundImage: `linear-gradient(to right, ${activePillarColor} 50%, transparent 50%)`,
                    backgroundSize: '120px 100%',
                    backgroundRepeat: 'repeat-x'
                  }} />,
                  modifyBackgroundGrid ? (
                    <>
                      <div className="absolute top-[28%] left-0 right-0 h-[1px] z-0 opacity-20" style={{
                        backgroundImage: 'linear-gradient(to right, white 50%, transparent 50%)',
                        backgroundSize: '120px 100%',
                        backgroundRepeat: 'repeat-x'
                      }} />
                      <div className="absolute left-[28%] top-0 bottom-0 w-[1px] z-0 opacity-20" style={{
                        backgroundImage: 'linear-gradient(to bottom, white 50%, transparent 50%)',
                        backgroundSize: '100% 120px',
                        backgroundRepeat: 'repeat-y'
                      }} />
                    </>
                  ) : null
                )}
              </div>
              {openInspectors.D && (
                <div className="border-t border-border-rule bg-black p-5 font-mono text-xs md:text-sm text-zinc-400 overflow-x-auto relative">
                  <div className="absolute right-4 top-4 z-10 flex gap-2">
                    <button onClick={() => copyToClipboard('D', codes.D)} className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 border border-zinc-700 text-white hover:bg-white hover:text-black transition-colors rounded-none font-bold cursor-pointer">
                      {copiedStates.D ? <Check size={11} className="text-green-500" /> : <Copy size={11} />}
                      <span>{copiedStates.D ? 'COPIED' : 'COPY'}</span>
                    </button>
                  </div>
                  <pre className="text-left select-text whitespace-pre-wrap pr-16">{codes.D}</pre>
                </div>
              )}
            </section>

          </div>
        </div>

        <div className="mt-16 bg-[#09090b] border-2 border-border-rule p-8 shadow-[4px_4px_0px_var(--rule)] max-w-4xl text-left select-text">
          <h4 className="text-xs font-mono text-accent-pink tracking-widest uppercase font-black mb-3 flex items-center gap-2">
            <Info size={14} /> PREMIUM CONCEPT SUMMARY
          </h4>
          <div className="text-xs text-text-muted font-sans leading-relaxed space-y-4">
            <p>
              These new concepts focus on premium, modern web design aesthetics, avoiding raw patterns in favor of lighting and depth.
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li><b>Tapered Glow</b>: Feels extremely sleek and high-end, resembling neon or led strips.</li>
              <li><b>Glassmorphism</b>: Uses blur to create physical depth rather than drawing a colored line.</li>
              <li><b>Animation</b>: Uses micro-animations to make the interface feel alive without being overwhelming.</li>
              <li><b>Structure</b>: Uses blueprint dashes to lean into the technical nature of the site cleanly.</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
