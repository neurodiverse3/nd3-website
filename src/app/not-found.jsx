"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import PageHeader from '../components/PageHeader';

export default function NotFound() {
  useEffect(() => {
    document.title = "Page not found · neurodivers³";
  }, []);

  return (
    <div className="min-h-screen pt-[96px] md:pt-[120px] pb-16 md:pb-24 px-6 md:px-24 max-w-7xl mx-auto flex flex-col justify-start">
      <PageHeader
        variant="section"
        eyebrow="404"
        titleLabel="Lost"
        titleAccent="The Plot"
        subtitle="The page you're looking for doesn't exist - it may have been moved or removed."
      />

      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-start">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-3 px-8 py-5 bg-[var(--accent)] text-[var(--accent-text,var(--bg))] border-2 border-[var(--fg)] font-black rounded-none shadow-[4px_4px_0px_var(--fg)] hover:-translate-y-1 hover:translate-x-1 active:translate-y-0 active:translate-x-0 hover:shadow-none transition-all duration-200 uppercase tracking-widest text-sm focus-ring"
        >
          <ArrowLeft size={16} strokeWidth={2.5} /> Return home
        </Link>
        <Link
          href="/blog"
          className="inline-flex items-center justify-center gap-3 px-8 py-5 bg-transparent text-[var(--fg)] border-2 border-[var(--fg)]/30 hover:border-[var(--fg)] font-black rounded-none shadow-[4px_4px_0px_var(--fg)] hover:shadow-none hover:-translate-y-1 hover:translate-x-1 active:translate-y-0 active:translate-x-0 transition-all duration-200 uppercase tracking-widest text-sm focus-ring"
        >
          Browse Blog
        </Link>
      </div>

      <div className="mt-16 p-8 border-2 border-dashed border-[var(--fg)]/30 text-left space-y-4 w-full">
        <span className="font-mono text-xs font-bold text-accent tracking-wider uppercase block">Suggested starting points:</span>
        <ul className="space-y-3 font-sans text-base text-text-muted">
          <li>• Looking for late-diagnosed AuDHD essays? Check the <Link href="/blog" className="text-fg-primary underline hover:text-accent font-bold">Blog</Link></li>
          <li>• Want to browse our sensory tools and active projects? Explore <Link href="/labs" className="text-fg-primary underline hover:text-accent font-bold">Labs</Link></li>
          <li>• Recovering from burnout or sensory overload? Check the <Link href="/store" className="text-fg-primary underline hover:text-accent font-bold">Digital Store</Link></li>
        </ul>
      </div>
    </div>
  );
}
