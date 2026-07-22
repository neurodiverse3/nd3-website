import React from 'react';
import { Skeleton } from '../../../components/Skeleton';

export default function PostLoading() {
  return (
    <article className="relative min-h-screen bg-bg-primary text-fg-primary pb-32">
      <div className="max-w-3xl mx-auto px-6 pt-20">
        {/* Back Link Skeleton */}
        <Skeleton className="h-4 w-32 mb-16" />

        {/* Header Skeletons */}
        <header className="mb-16 border-b border-border-rule pb-10">
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="h-6 w-24 animate-pulse" />
            <Skeleton className="h-6 w-32 animate-pulse" />
          </div>
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-12 w-4/5 mb-8" />
          <Skeleton className="h-8 w-full border-l-4 border-accent-pink pl-6 bg-transparent" />
        </header>

        {/* Article Body Skeletons */}
        <div className="space-y-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          
          {/* Shimmer Image Block */}
          <Skeleton className="h-64 w-full my-10" />

          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </article>
  );
}
