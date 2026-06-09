import React from 'react';
import { Skeleton } from '../../components/Skeleton';

export default function BlogLoading() {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto min-h-screen">
      {/* Header Skeleton */}
      <div className="mb-16 border-b-4 border-border-rule pb-10">
        <Skeleton className="h-4 w-40 mb-4" />
        <Skeleton className="h-16 w-80 mb-6" />
        <Skeleton className="h-6 w-full max-w-xl" />
      </div>

      {/* Filter system skeleton */}
      <div className="mb-12 p-6 border-2 border-border-rule space-y-6 bg-bg-primary/50">
        <Skeleton className="h-5 w-48 mb-2" />
        <div className="space-y-2">
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-28" />
          </div>
        </div>
      </div>

      {/* Cards Grid Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-8 border-2 border-border-rule min-h-[320px] flex flex-col justify-between bg-bg-primary shadow-[6px_6px_0px_var(--rule)]">
            <div>
              <div className="flex gap-3 mb-6">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-28" />
              </div>
              <Skeleton className="h-8 w-4/5 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="h-5 w-28 mt-6" />
          </div>
        ))}
      </div>
    </section>
  );
}
