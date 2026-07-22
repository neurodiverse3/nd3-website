"use client";
import React from 'react';

export function Skeleton({ className = "", count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`bg-border-rule animate-pulse border border-border-rule rounded-none ${className}`}
          style={{
            backgroundImage: 'linear-gradient(90deg, transparent, var(--accent-soft), transparent)',
            backgroundSize: '200% 100%',
          }}
          aria-hidden="true"
        />
      ))}
    </>
  );
}
