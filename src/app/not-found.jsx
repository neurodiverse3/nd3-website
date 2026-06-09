"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw } from 'lucide-react';

export default function NotFound() {
  const [glitchText, setGlitchText] = useState("404");

  // Subtle aesthetic glitch effect on page load
  useEffect(() => {
    const chars = "404☠ND3✖";
    let interval;
    
    const triggerGlitch = () => {
      let iterations = 0;
      clearInterval(interval);
      
      interval = setInterval(() => {
        setGlitchText(() => 
          "404".split("").map((char, index) => {
            if (index < iterations) {
              return "404"[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          }).join("")
        );
        
        if (iterations >= 3) {
          clearInterval(interval);
          setGlitchText("404");
        }
        iterations += 1/3;
      }, 50);
    };

    triggerGlitch();
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <section className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-20 text-center bg-bg-primary text-fg-primary select-none animate-in fade-in duration-500">
      <div className="max-w-xl flex flex-col items-center">
        {/* Massive Glitched 404 Heading */}
        <h1 
          className="text-[120px] md:text-[180px] font-black tracking-tighter text-accent-pink leading-none select-none glitch-text force-glitch font-display mb-4"
          data-text="404"
        >
          {glitchText}
        </h1>

        {/* Themed Badge */}
        <div className="border border-border-rule px-4 py-1.5 text-[10px] font-mono tracking-[0.25em] text-text-muted mb-8 bg-bg-primary/50 uppercase">
          ERROR_CODE: 404 • CONTEXT_LOST
        </div>

        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-4 text-fg-primary">
          This page does not exist.
        </h2>
        
        <p className="text-text-muted leading-relaxed font-normal mb-12 max-w-md">
          The page you're looking for doesn't exist — it may have been moved or removed.
        </p>

        {/* Back Home Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-3 px-8 py-5 bg-accent-pink text-bg-primary border-2 border-fg-primary font-black rounded-none shadow-[4px_4px_0px_var(--fg)] hover:-translate-y-1 hover:translate-x-1 active:translate-y-0 active:translate-x-0 hover:shadow-none transition-all duration-200 uppercase tracking-widest text-sm"
        >
          <ArrowLeft size={16} strokeWidth={2.5} /> Return home
        </Link>
      </div>
    </section>
  );
}
