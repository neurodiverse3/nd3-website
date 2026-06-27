"use client";
import React from 'react';
import { Skeleton } from '../../../components/Skeleton';

export default function ProductDetailLoading() {
  return (
    <main className="mx-auto max-w-6xl px-6 pb-24 pt-[96px] md:pt-[120px] text-left font-sans">
      {/* Back button */}
      <div className="mb-6">
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Header */}
      <div className="mt-8 space-y-4">
        <div className="flex gap-3">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-14 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
      </div>

      {/* 2-Column layout */}
      <div className="mt-10 flex flex-col min-[920px]:flex-row gap-12 items-start w-full">
        {/* Left Column */}
        <div className="flex-1 space-y-12 w-full">
          {/* Cover image showcase */}
          <Skeleton className="aspect-square w-full border-2 border-fg-primary" />
          {/* Intro */}
          <Skeleton className="h-6 w-full" count={3} />
          {/* Checklist */}
          <div className="space-y-4">
            <Skeleton className="h-4 w-24" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Skeleton className="h-5 w-full" count={4} />
            </div>
          </div>
        </div>

        {/* Right Column (Sticky Buy Panel) */}
        <aside className="hidden min-[920px]:block w-[360px] shrink-0 space-y-6">
          <div className="border-2 border-fg-primary p-6 md:p-8 space-y-6 bg-surface/40 shadow-[6px_6px_0px_var(--fg)]">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-16 w-full" />
          </div>
        </aside>
      </div>
    </main>
  );
}
