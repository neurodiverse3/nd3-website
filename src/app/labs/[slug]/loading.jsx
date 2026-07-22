"use client";
import React from 'react';
import { Skeleton } from '../../../components/Skeleton';

export default function LabDetailLoading() {
  return (
    <div className="min-h-screen pt-[96px] md:pt-[120px] pb-16 md:pb-24 px-6 md:px-24 max-w-4xl mx-auto flex flex-col justify-start text-left font-sans">
      {/* Back button placeholder */}
      <div className="mb-8">
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="space-y-6 w-full">
        {/* Lab info header */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-6 w-3/4" />
        </div>

        {/* Huge Interactive App Sandbox placeholder */}
        <div className="my-8">
          <Skeleton className="h-[450px] w-full border-2 border-border-rule" />
        </div>

        {/* Documentation / Description block */}
        <div className="space-y-4 pt-4 border-t border-border-rule/50">
          <Skeleton className="h-5 w-40 mb-2" />
          <Skeleton className="h-4 w-full" count={4} />
        </div>
      </div>
    </div>
  );
}
