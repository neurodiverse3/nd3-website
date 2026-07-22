"use client";
import React from 'react';
import { Skeleton } from '../../components/Skeleton';

export default function StoreLoading() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-[112px] md:pt-[120px] text-left font-sans">
      {/* Header section */}
      <div className="mb-4">
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="mb-6">
        <Skeleton className="h-12 w-1/2" />
      </div>
      <div className="mb-12">
        <Skeleton className="h-6 w-2/3" />
      </div>

      {/* Grid of products */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="border-2 border-fg-primary bg-surface/40 p-6 flex flex-col justify-between h-full shadow-[6px_6px_0px_var(--rule)] space-y-4">
            {/* Aspect-square cover image placeholder */}
            <Skeleton className="aspect-square w-full border border-border-rule/50" />
            
            {/* Title & Price */}
            <div className="space-y-2">
              <div className="flex justify-between items-start gap-4">
                <Skeleton className="h-7 w-2/3" />
                <Skeleton className="h-7 w-12" />
              </div>
              <Skeleton className="h-4 w-24" />
            </div>

            {/* Description */}
            <Skeleton className="h-16 w-full" />

            {/* CTA Button */}
            <Skeleton className="h-12 w-full mt-4" />
          </div>
        ))}
      </div>
    </div>
  );
}
