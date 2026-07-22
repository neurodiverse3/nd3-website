"use client";
import React, { useEffect } from 'react';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function BlogError({ error, reset }) {
  useEffect(() => {
    console.error('🔌 [Blog Route Error] Captured exception:', error);
  }, [error]);

  return (
    <div className="py-16 md:py-24 max-w-2xl mx-auto px-6 text-left font-sans min-h-[60vh] flex flex-col justify-center">
      <div className="border-4 border-fg-primary p-8 md:p-12 rounded-none bg-bg-primary shadow-[12px_12px_0px_var(--rule)] relative z-10">
        <div className="w-14 h-14 bg-accent-pink-soft border-4 border-fg-primary flex items-center justify-center mb-8 shadow-[4px_4px_0px_var(--fg)] text-accent-pink shrink-0">
          <AlertCircle size={28} strokeWidth={2.5} />
        </div>

        <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-accent-pink block mb-2">
          · SECTION ERROR ·
        </span>
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-fg-primary leading-none mb-6">
          The Blog <span className="italic font-light text-accent-pink">stumbled.</span>
        </h1>

        <p className="text-fg-primary text-base font-bold mb-4">
          There was an issue loading this part of the site.
        </p>

        <p className="text-text-muted text-sm leading-relaxed mb-8">
          This is often a temporary connection issue. You can try to reload just this section, or go back to the home page.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <button
            onClick={() => reset()}
            className="flex-1 py-3.5 bg-accent-pink text-bg-primary border-2 border-fg-primary font-black uppercase tracking-widest text-xs transition-colors flex items-center justify-center gap-2 group shadow-[3px_3px_0px_var(--fg)] hover:shadow-[2px_2px_0px_var(--fg)] hover:-translate-y-0.5 hover:translate-x-0.5 active:translate-y-0 active:translate-x-0 focus-ring rounded-none cursor-pointer"
          >
            <RefreshCw size={12} className="group-hover:rotate-180 transition-transform duration-500" />
            Try again
          </button>
          
          <Link
            href="/"
            className="flex-1 py-3.5 border-2 border-fg-primary text-fg-primary hover:bg-fg-primary hover:text-bg-primary font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 shadow-[3px_3px_0px_var(--rule)] hover:shadow-none focus-ring rounded-none cursor-pointer text-center"
          >
            <ArrowLeft size={12} />
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
