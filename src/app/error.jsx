"use client";
import React, { useEffect } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Log the error securely for diagnostics
    console.error('🔌 [System Error Boundary] Captured runtime exception:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-bg-primary text-fg-primary flex items-center justify-center p-6 font-sans">
      {/* Subtle sensory noise overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-[9999] mix-blend-overlay opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-xl w-full border-4 border-fg-primary p-8 md:p-12 rounded-none bg-bg-primary shadow-[12px_12px_0px_var(--rule)] text-left relative z-10">
        {/* Softened Icon Badge */}
        <div className="w-16 h-16 bg-accent-pink-soft border-4 border-fg-primary flex items-center justify-center mb-8 shadow-[4px_4px_0px_var(--fg)] text-accent-pink shrink-0">
          <AlertCircle size={32} strokeWidth={2.5} />
        </div>

        {/* Hero Casing Headers */}
        <span className="text-[11px] font-black uppercase tracking-[0.25em] text-accent-pink block mb-2 font-mono">
          · NOTICE ·
        </span>
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-fg-primary leading-none mb-6">
          Something <span className="italic font-light text-accent-pink">broke.</span>
        </h1>

        <p className="text-fg-primary text-lg font-bold mb-4">
          It's not you — something went wrong on our end.
        </p>

        <p className="text-text-muted text-base leading-relaxed mb-8">
          You can try reloading the page using the button below, or head back to the homepage. If this keeps happening, feel free to email <a href="mailto:ollie@neurodivers3.co.uk" className="text-accent-pink hover:underline font-bold">ollie@neurodivers3.co.uk</a> and I will get it sorted out.
        </p>

        {/* Action Triggers Stack */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <button
            onClick={() => reset()}
            className="flex-1 py-4 bg-accent-pink text-bg-primary border-2 border-fg-primary font-black uppercase tracking-widest text-xs transition-colors flex items-center justify-center gap-2 group shadow-[3px_3px_0px_var(--fg)] hover:shadow-[2px_2px_0px_var(--fg)] hover:-translate-y-0.5 hover:translate-x-0.5 active:translate-y-0 active:translate-x-0 focus-ring rounded-none cursor-pointer"
          >
            <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
            Try again
          </button>
          
          <Link
            href="/"
            className="flex-1 py-4 border-2 border-fg-primary text-fg-primary hover:bg-fg-primary hover:text-bg-primary font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 shadow-[3px_3px_0px_var(--rule)] hover:shadow-none focus-ring rounded-none cursor-pointer text-center"
          >
            <Home size={14} />
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
