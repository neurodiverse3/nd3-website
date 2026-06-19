"use client";
import React, { useState } from 'react';
import { Share2, Copy, Check, ExternalLink, Code } from 'lucide-react';
import AcousticShield from './AcousticShield';
import DopamineMenu from './DopamineMenu';
import VisualSnow from './VisualSnow';
import PrintableArchitect from './PrintableArchitect';
import BrownNoiseLoop from './BrownNoiseLoop';
import DecisionCoin from './DecisionCoin';
import SpoonTracker from './SpoonTracker';
import SensoryAudit from './SensoryAudit';

const XIcon = ({ size = 12, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    fill="currentColor"
    className={`shrink-0 ${className}`}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const COMPONENTS = {
  'acoustic-shield': <AcousticShield />,
  'dopamine-menu': <DopamineMenu />,
  'visual-snow-shield': <VisualSnow />,
  'printable-architect': <PrintableArchitect />,
  'brown-noise-loop': <BrownNoiseLoop />,
  'decision-coin': <DecisionCoin />,
  'spoon-tracker': <SpoonTracker />,
  'sensory-audit': <SensoryAudit />
};

export default function LabEmbedder({ slug, hideChrome = false, inline = false }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [showSharePanel, setShowSharePanel] = useState(false);

  const activeComponent = COMPONENTS[slug] || null;

  if (!activeComponent) {
    return (
      <div className="border border-dashed border-[var(--rule)] p-8 text-center text-[var(--muted)] font-mono text-xs uppercase">
        Experiment tool "{slug}" not found in inline index.
      </div>
    );
  }

  const landingPageUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/labs/${slug}`
    : `https://neurodivers3.co.uk/labs/${slug}`;

  const embedUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/labs/${slug}/embed`
    : `https://neurodivers3.co.uk/labs/${slug}/embed`;

  const embedCode = `<iframe src="${embedUrl}" width="100%" height="680" style="border:3px solid #1f1f22; background-color:#050505; overflow:hidden;" allow="autoplay"></iframe>`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(landingPageUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  // Render pure embedded tool without any site borders or headers
  if (hideChrome) {
    return (
      <div className="w-full bg-[#050505] text-[#F4F4F2] p-4 flex flex-col justify-start select-none min-h-screen">
        {activeComponent}
      </div>
    );
  }

  return (
    <div className={`w-full flex flex-col gap-6 text-left ${inline ? 'border-2 border-border-rule bg-[#07070a]/60 p-6 md:p-8 shadow-[4px_4px_0px_var(--rule)] my-12' : ''}`}>
      
      {/* Tool Container */}
      <div className="w-full border-2 border-black bg-black relative shadow-[6px_6px_0px_var(--rule)] p-1">
        {activeComponent}
      </div>

      {/* Share / Embed administrative block */}
      <div className="w-full no-print flex flex-col gap-3 font-sans text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--rule)] pt-6">
          <span className="font-mono text-xs text-[var(--muted)] uppercase tracking-wider">
            Tactile Sharing & Embed Integration
          </span>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowSharePanel(!showSharePanel)}
              className="px-4 py-2.5 border-2 border-fg-primary bg-bg-primary hover:bg-[var(--accent)] hover:text-[var(--accent-text,var(--bg))] text-[var(--fg)] font-black uppercase text-xs md:text-sm tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-[3px_3px_0px_var(--fg)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-0 active:translate-y-0"
            >
              <Share2 size={12} className={showSharePanel ? 'animate-pulse text-[var(--accent)]' : ''} /> 
              {showSharePanel ? 'HIDE SHARE & EMBED' : 'SHARE & EMBED OPTIONS'}
            </button>
            {inline && (
              <a
                href={landingPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 border-2 border-fg-primary bg-bg-primary hover:bg-[var(--accent)] hover:text-[var(--accent-text,var(--bg))] text-[var(--fg)] font-black uppercase text-xs md:text-sm tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-[3px_3px_0px_var(--fg)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-0 active:translate-y-0"
              >
                <ExternalLink size={12} /> OPEN FULL LANDING PAGE
              </a>
            )}
          </div>
        </div>

        {/* Share Expandable control panel */}
        {showSharePanel && (
          <div className="border-2 border-[var(--fg)] bg-[#09090c] p-6 flex flex-col gap-4 animate-in fade-in duration-200 shadow-[6px_6px_0px_var(--accent-soft)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Copy Direct Link */}
              <div className="flex flex-col gap-1.5">
                <span className="font-mono text-xs md:text-sm text-[var(--muted)] uppercase tracking-widest block font-bold">DIRECT LANDING PAGE LINK:</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={landingPageUrl}
                    className="flex-1 bg-black border border-[var(--rule)] px-3 py-1.5 text-xs text-white outline-none font-mono"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-4 bg-white text-black font-black text-xs uppercase tracking-wider hover:bg-[var(--accent)] hover:text-[var(--accent-text,var(--bg))] cursor-pointer select-none transition-all flex items-center gap-1.5 shrink-0 border border-transparent hover:border-black"
                  >
                    {copiedLink ? <Check size={12} /> : <Copy size={12} />}
                    {copiedLink ? 'COPIED' : 'COPY'}
                  </button>
                </div>
              </div>

              {/* Social Tweet Quick Share */}
              <div className="flex flex-col gap-1.5 justify-end">
                <span className="font-mono text-xs md:text-sm text-[var(--muted)] uppercase tracking-widest block font-bold">QUICK SOCIAL TRANSMISSION:</span>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this amazing sensory-friendly neurodivergent tool: ${landingPageUrl} via @neurodivers3`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-[34px] border-2 border-fg-primary hover:border-[var(--accent)] bg-black text-white hover:text-[var(--accent)] text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all select-none hover:bg-[var(--accent-soft)]"
                >
                  <XIcon size={12} /> SHARE ON X / TWITTER
                </a>
              </div>

            </div>

            {/* Iframe Embed Code snippet */}
            <div className="flex flex-col gap-1.5 border-t border-[var(--rule)]/60 pt-4">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <span className="font-mono text-xs md:text-sm text-[var(--muted)] uppercase tracking-widest block font-bold">IFRAME EMBED CODE (PASTE ON YOUR BLOG):</span>
                <span className="text-xs md:text-sm font-mono text-[var(--accent)] bg-[var(--accent-soft)] border border-[var(--rule)] px-1.5 py-0.5">ALLOWS AUTOPLAY</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={embedCode}
                  className="flex-1 bg-black border border-[var(--rule)] px-3 py-1.5 text-xs text-[#8A8A93] outline-none font-mono overflow-x-auto"
                />
                <button
                  onClick={handleCopyEmbed}
                  className="px-4 bg-white text-black font-black text-xs uppercase tracking-wider hover:bg-[var(--accent)] hover:text-[var(--accent-text,var(--bg))] cursor-pointer select-none transition-all flex items-center gap-1.5 shrink-0 border border-transparent hover:border-black"
                >
                  {copiedEmbed ? <Check size={12} /> : <Copy size={12} />}
                  {copiedEmbed ? 'COPIED' : 'COPY CODE'}
                </button>
              </div>
              <p className="text-xs md:text-sm text-[var(--muted)] italic leading-relaxed font-sans mt-1">
                💡 Paste this code inside the HTML/Embed editor of your custom Wordpress, Squarespace, Ghost, or Medium blog post to display this interactive sensory tool right inline for your readers.
              </p>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
