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
    <div className="min-h-screen pt-[96px] md:pt-[120px] pb-16 md:pb-24 px-6 md:px-24 max-w-3xl mx-auto flex flex-col justify-start">
      <PageHeader
        variant="section"
        eyebrow="404"
        titleLabel="Lost"
        titleAccent="The Plot"
        subtitle="The page you're looking for doesn't exist - it may have been moved or removed."
      />

      <div className="mt-8 flex justify-start">
        <Link
          href="/"
          className="inline-flex items-center gap-3 px-8 py-5 bg-[#3FB07C] text-[#0B130F] border-2 border-fg-primary font-black rounded-none shadow-[4px_4px_0px_var(--fg)] hover:-translate-y-1 hover:translate-x-1 active:translate-y-0 active:translate-x-0 hover:shadow-none transition-all duration-200 uppercase tracking-widest text-sm focus-ring"
        >
          <ArrowLeft size={16} strokeWidth={2.5} /> Return home
        </Link>
      </div>
    </div>
  );
}
