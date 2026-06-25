"use client";
import React from 'react';

export const StatusLine = () => {
  const [statusLine, setStatusLine] = React.useState(null);

  // Removed client-side fetch to prevent 403 errors.

  const fallback = "IN PROGRESS · EST. 2026 · SUBSCRIBE FOR EARLY ACCESS";
  const content = (statusLine && (Array.isArray(statusLine) ? statusLine.join(' · ') : statusLine)) || fallback;
  if (!content || content.trim() === '') return null;

  return (
    <div 
      className="w-full h-10 md:h-[40px] bg-accent-pink text-bg-primary flex items-center overflow-hidden"
      aria-label="Site status"
    >
      <div className="max-w-7xl w-full mx-auto px-6 md:px-24">
        <p className="text-[13px] font-black uppercase tracking-[0.08em] truncate">
          {content}
        </p>
      </div>
    </div>
  );
};
