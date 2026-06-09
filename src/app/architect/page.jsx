"use client";
import React from 'react';
import PrintableArchitect from '../../components/labs/PrintableArchitect';

export default function ArchitectPage() {
  return (
    <div className="min-h-screen pt-[96px] md:pt-[120px] pb-24 px-4 md:px-12 lg:px-24 bg-bg-primary text-fg-primary select-none w-full max-w-7xl mx-auto flex flex-col justify-start text-left">
      {/* Header Admin Block */}
      <div className="mb-12 border-b-4 border-fg-primary pb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 w-full mt-4 no-print">
        <div>
          <div className="inline-flex items-center gap-2 text-text-muted hover:text-accent-pink transition-colors uppercase font-black text-[10px] tracking-widest mb-6 focus-ring cursor-pointer select-none">
            EST. 2026 · STANDALONE CREATOR APP
          </div>
          <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-fg-primary leading-none font-display">
            PRINTABLE ARCHITECT<span className="text-accent-pink inline-block ml-0.5">.</span>
          </h1>
          <p className="text-text-muted text-sm md:text-base font-normal mt-4 max-w-2xl leading-relaxed">
            Research, design, generate, and tweak premium branded digital products (ADHD planners, visual checklists, and sensory audits) to list on the <span className="text-white font-bold">neurodivers³ store</span>.
          </p>
        </div>
      </div>

      <PrintableArchitect />
    </div>
  );
}
