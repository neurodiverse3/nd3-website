"use client";
import React from 'react';
import { Skeleton } from '../../../components/Skeleton';

export default function MemoirChapterLoading() {
  return (
    <div className="min-h-screen pt-[96px] md:pt-[120px] pb-16 md:pb-24 px-6 md:px-24 max-w-3xl mx-auto flex flex-col justify-start text-left font-sans">
      {/* Back link placeholder */}
      <div className="mb-12">
        <Skeleton className="h-4 w-40" />
      </div>

      <div className="space-y-8 w-full">
        {/* Header section */}
        <div className="space-y-4 border-b border-[var(--rule)] pb-8 mb-8">
          {/* Metadata */}
          <div className="flex gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
          {/* Title */}
          <Skeleton className="h-14 w-full" />
          {/* Excerpt */}
          <Skeleton className="h-16 w-full" />
        </div>

        {/* Body prose content placeholders */}
        <div className="space-y-6">
          <Skeleton className="h-6 w-full" count={8} />
          <Skeleton className="h-6 w-5/6" />
          <Skeleton className="h-6 w-3/4" />
        </div>
      </div>
    </div>
  );
}
