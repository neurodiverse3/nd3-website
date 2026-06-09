"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft, RefreshCw, Cpu, Layers } from 'lucide-react';
import { PostCover } from '../../../components/PostCover';

export default function CoverPlayground() {
  const [title, setTitle] = useState('47 Tabs: A Love Story');
  const [accentWord, setAccentWord] = useState('Love');
  const [pillar, setPillar] = useState('unmasked-life');
  const [brainState, setBrainState] = useState('hyperfocus');
  const [aspect, setAspect] = useState('21:9');

  const concepts = [
    { id: 'diagnostic', name: 'Concept A: Brain State Diagnostic', desc: 'Resembles a retro-medical read-out of a wired-different brain, with SVG dopamine gauges and focus meters.' },
    { id: 'abstract', name: 'Concept B: Deterministic SVG Art', desc: 'Deterministic vector artwork matching categories and mood (neon golden spirals, focused ray vectors, or melting crimson blobs).' },
    { id: 'split', name: 'Concept C: Split-Panel Brutalist Grid', desc: 'High-intensity, colorful 50/50 graphic panel with a vibrant mesh and dense monospaced typographic logs.' },
    { id: 'typographic', name: 'Concept D: Original Typographic', desc: 'Original blueprint design with faint structural vertical/horizontal dividers and monospaced technical tags.' }
  ];

  const handleRandomize = () => {
    const titles = [
      { t: 'The Day the Mask Cracked', w: 'Mask', p: 'unmasked-life', s: 'burned-out' },
      { t: '47 Tabs: A Love Story', w: 'Tabs', p: 'glitchwork', s: 'hyperfocus' },
      { t: 'Late Diagnosis Grief', w: 'Grief', p: 'unmasked-life', s: 'spiraling' },
      { t: 'Building a Restartable Life', w: 'Restartable', p: 'tiny-systems', s: 'on-a-roll' },
      { t: 'Sensory Overload Checklist', w: 'Sensory', p: 'tiny-systems', s: 'burned-out' }
    ];
    const rand = titles[Math.floor(Math.random() * titles.length)];
    setTitle(rand.t);
    setAccentWord(rand.w);
    setPillar(rand.p);
    setBrainState(rand.s);
  };

  return (
    <main id="main" className="min-h-screen pt-[96px] md:pt-[120px] pb-24 px-6 md:px-24 max-w-7xl mx-auto flex flex-col justify-start text-left select-none bg-bg-primary text-fg-primary">
      {/* Header Block */}
      <div className="mb-12 border-b-4 border-fg-primary pb-8 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 w-full mt-4">
        <div>
          <Link
            href="/labs"
            className="inline-flex items-center gap-2 text-text-muted hover:text-accent-pink transition-colors uppercase font-black text-[10px] tracking-widest mb-6 focus-ring"
          >
            <ArrowLeft size={12} /> Back to Labs
          </Link>
          <div className="inline-block text-[11px] font-mono tracking-[0.25em] text-accent-pink bg-accent-pink-soft px-3 py-1 uppercase border border-border-rule mb-4 select-none animate-pulse-slow">
            INTERACTIVE LAB PROTOTYPE
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-fg-primary leading-none font-display">
            POST COVER PLAYGROUND<span className="text-accent-pink inline-block ml-0.5">.</span>
          </h1>
          <p className="text-text-muted text-sm md:text-base font-normal mt-4 max-w-2xl leading-relaxed">
            Test and preview all four dynamic, React-powered generative art cover concepts in real-time side-by-side using your own text.
          </p>
        </div>

        <button
          onClick={handleRandomize}
          className="flex items-center gap-2 px-4 py-2 bg-accent-pink text-black text-xs font-black uppercase tracking-wider border border-white hover:opacity-90 transition-all rounded-none cursor-pointer shadow-[3px_3px_0px_#ffffff] shrink-0"
        >
          <RefreshCw size={12} /> Randomize Post
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-12 items-start w-full relative">
        {/* Sandbox controls panel */}
        <aside className="border-2 border-border-rule bg-[#09090b] p-6 shadow-[4px_4px_0px_var(--rule)] flex flex-col gap-6 text-left">
          <div className="flex items-center gap-2 border-b border-border-rule pb-3">
            <Cpu className="text-accent-pink shrink-0 animate-pulse-slow" size={16} />
            <h3 className="font-mono text-xs font-black uppercase tracking-wider text-white">PLAYGROUND CONTROLS</h3>
          </div>

          {/* Title input */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[9px] text-[#8A8A93] tracking-widest uppercase font-bold">ARTICLE TITLE:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-10 bg-black border border-border-rule focus:border-accent-pink px-3 py-1 text-xs text-white outline-none rounded-none font-sans font-medium focus-ring"
            />
          </div>

          {/* Accent Word input */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[9px] text-[#8A8A93] tracking-widest uppercase font-bold">HIGHLIGHT WORD:</label>
            <input
              type="text"
              value={accentWord}
              onChange={(e) => setAccentWord(e.target.value)}
              className="w-full h-10 bg-black border border-border-rule focus:border-accent-pink px-3 py-1 text-xs text-white outline-none rounded-none font-sans font-medium focus-ring"
            />
          </div>

          {/* Category Pillar */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[9px] text-[#8A8A93] tracking-widest uppercase font-bold">CATEGORY PILLAR:</label>
            <select
              value={pillar}
              onChange={(e) => setPillar(e.target.value)}
              className="w-full h-10 bg-black border border-border-rule focus:border-accent-pink px-3 py-1 text-xs text-white outline-none rounded-none font-mono focus-ring cursor-pointer"
            >
              <option value="unmasked-life">Unmasked Life (Pink)</option>
              <option value="tiny-systems">Tools & Templates (Cream)</option>
              <option value="glitchwork">Digital Life (Cyan)</option>
            </select>
          </div>

          {/* Brain State */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[9px] text-[#8A8A93] tracking-widest uppercase font-bold">BRAIN STATE / MOOD:</label>
            <select
              value={brainState}
              onChange={(e) => setBrainState(e.target.value)}
              className="w-full h-10 bg-black border border-border-rule focus:border-accent-pink px-3 py-1 text-xs text-white outline-none rounded-none font-mono focus-ring cursor-pointer"
            >
              <option value="burned-out">Burned Out</option>
              <option value="hyperfocus">Hyperfocused</option>
              <option value="masking">Masking</option>
              <option value="spiraling">Spiralling</option>
              <option value="on-a-roll">On a Roll</option>
            </select>
          </div>

          {/* Aspect Ratio */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[9px] text-[#8A8A93] tracking-widest uppercase font-bold">ASPECT RATIO CROP:</label>
            <div className="flex gap-2 font-mono text-[10px]">
              {['21:9', '16:9', '1:1', '4:5'].map(r => (
                <button
                  key={r}
                  onClick={() => setAspect(r)}
                  className={`flex-1 py-1.5 border-2 text-center font-black cursor-pointer rounded-none uppercase transition-all ${
                    aspect === r 
                      ? 'bg-accent-pink border-white text-black' 
                      : 'border-border-rule text-text-muted hover:border-white hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Real-time Side-by-Side concepts view */}
        <div className="flex flex-col gap-12 w-full">
          {concepts.map(c => (
            <div 
              key={c.id} 
              className="border-2 border-border-rule bg-[#050508] p-6 hover:border-fg-primary transition-colors shadow-[6px_6px_0px_var(--rule)] flex flex-col gap-4 text-left"
            >
              <div className="flex flex-col gap-1.5">
                <span className="font-mono text-[10px] font-black uppercase text-accent-pink tracking-widest block select-none">
                  {c.name}
                </span>
                <p className="text-xs text-text-muted font-sans font-normal leading-relaxed">
                  {c.desc}
                </p>
              </div>

              {/* Mounted generative visual component */}
              <div className="w-full border border-[#1F1F22] relative overflow-hidden select-none bg-black">
                <PostCover 
                  title={title} 
                  pillar={pillar} 
                  brainState={brainState}
                  accentWord={accentWord}
                  aspect={aspect}
                  concept={c.id}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
