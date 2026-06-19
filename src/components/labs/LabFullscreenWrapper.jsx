"use client";
import React, { useState, useCallback, useEffect } from 'react';
import { Maximize2, Minimize2, X } from 'lucide-react';
import LabEmbedder from './LabEmbedder';

export default function LabFullscreenWrapper({ slug }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
      if (e.key === 'f' && !isFullscreen && !e.ctrlKey && !e.metaKey) {
        const active = document.activeElement;
        const isInput = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);
        if (!isInput) {
          setIsFullscreen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#050505] flex flex-col">
        {/* Fullscreen Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--rule)] bg-black/80">
          <span className="text-[10px] font-mono text-[var(--accent)] uppercase tracking-widest">
            // FULLSCREEN MODE · PRESS ESC OR F TO EXIT
          </span>
          <button
            onClick={toggleFullscreen}
            className="p-2 border border-[var(--rule)] hover:border-[var(--accent)] text-[var(--muted)] hover:text-[var(--fg)] cursor-pointer transition-colors rounded-none"
            aria-label="Exit fullscreen"
          >
            <X size={14} />
          </button>
        </div>
        {/* Fullscreen Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <LabEmbedder slug={slug} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <span className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-widest">
          // INTERACTIVE WORKSPACE
        </span>
        <button
          onClick={toggleFullscreen}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 border-2 border-fg-primary bg-[var(--accent)] text-[var(--accent-text,var(--bg))] text-[10px] font-mono font-bold uppercase tracking-wider cursor-pointer transition-all rounded-none hover:-translate-y-0.5 hover:translate-x-0.5 hover:shadow-[3px_3px_0px_var(--fg)] active:translate-x-0 active:translate-y-0 active:shadow-none self-start sm:self-auto"
          aria-label="Enter fullscreen"
        >
          <Maximize2 size={12} /> FULLSCREEN MODE (F)
        </button>
      </div>
      <div 
        className="w-full border-2 border-[var(--fg)] bg-bg-primary p-6 md:p-8 shadow-[6px_6px_0px_var(--fg)] hover:shadow-[8px_8px_0px_var(--accent)] transition-all relative overflow-hidden"
        style={{
          backgroundImage: 'linear-gradient(var(--rule) 1px, transparent 1px), linear-gradient(90deg, var(--rule) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      >
        <div className="absolute top-2 right-2 font-mono text-[8px] text-[var(--muted)] opacity-40 select-none" aria-hidden="true">· GRID CALIBRATED ·</div>
        <LabEmbedder slug={slug} />
      </div>
    </div>
  );
}
