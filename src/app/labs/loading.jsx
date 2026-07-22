"use client";
import React from 'react';
import { Skeleton } from '../../components/Skeleton';

export default function LabsLoading() {
  return (
    <div className="min-h-screen pt-[112px] md:pt-[120px] pb-16 md:pb-24 px-6 md:px-24 max-w-7xl mx-auto flex flex-col justify-start text-left font-sans">
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

      {/* Grid of labs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mt-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="border-2 border-border-rule p-6 bg-surface/40 space-y-4 shadow-[4px_4px_0px_var(--rule)]">
            {/* Category / Icon */}
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8" />
            </div>
            {/* Title */}
            <Skeleton className="h-8 w-3/4" />
            {/* Description */}
            <Skeleton className="h-16 w-full" />
            {/* Button */}
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
