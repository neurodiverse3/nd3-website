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
            // FULLSCREEN MODE — PRESS ESC OR F TO EXIT
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
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-widest">
          // INTERACTIVE WORKSPACE
        </span>
        <button
          onClick={toggleFullscreen}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--rule)] hover:border-[var(--accent)] text-[var(--muted)] hover:text-[var(--fg)] text-[9px] font-mono font-bold uppercase tracking-wider cursor-pointer transition-all rounded-none"
          aria-label="Enter fullscreen"
        >
          <Maximize2 size={10} /> FULLSCREEN (F)
        </button>
      </div>
      <div className="w-full border border-[var(--rule)] bg-bg-primary/40 p-1 shadow-[4px_4px_0px_var(--rule)]">
        <LabEmbedder slug={slug} />
      </div>
    </div>
  );
}
