"use client";
import React from 'react';
import { Skeleton } from '../../components/Skeleton';

export default function MemoirLoading() {
  return (
    <div className="min-h-screen pt-[112px] md:pt-[120px] pb-16 md:pb-24 px-6 md:px-24 max-w-7xl mx-auto flex flex-col justify-start text-left font-sans">
      {/* Eyebrow placeholder */}
      <div className="mb-4">
        <Skeleton className="h-4 w-48" />
      </div>
      
      {/* Title placeholder */}
      <div className="mb-6">
        <Skeleton className="h-12 w-3/4" />
      </div>
      
      {/* Subtitle placeholder */}
      <div className="mb-12">
        <Skeleton className="h-6 w-1/2" />
      </div>

      {/* Two columns layout skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 w-full mt-6">
        {/* Main column */}
        <div className="space-y-8">
          <Skeleton className="h-32 w-full" />
          <div className="space-y-6">
            <Skeleton className="h-20 w-full" count={3} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 hidden lg:block">
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  );
}
