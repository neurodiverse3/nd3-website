"use client";
import React, { useState, useEffect } from 'react';

export default function GlobalVisualSnow() {
  const [enabled, setEnabled] = useState(false);
  const [grainOpacity, setGrainOpacity] = useState(0.06);
  const [washOpacity, setWashOpacity] = useState(0.04);
  const [shieldColor, setShieldColor] = useState("void");
  const [reducedMotion, setReducedMotion] = useState(false);

  const loadPreferences = () => {
    const isSitewide = localStorage.getItem('nd3-visual-snow-sitewide') === 'true';
    setEnabled(isSitewide);

    const savedGrain = localStorage.getItem('nd3-visual-grain');
    const savedWash = localStorage.getItem('nd3-visual-wash');
    const savedColor = localStorage.getItem('nd3-visual-color');

    if (savedGrain) setGrainOpacity(parseFloat(savedGrain));
    if (savedWash) setWashOpacity(parseFloat(savedWash));
    if (savedColor) setShieldColor(savedColor);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Defer preferences loading to idle time to preserve initial paint main-thread performance
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => loadPreferences());
    } else {
      setTimeout(loadPreferences, 1000);
    }

    // Check system reduced motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(motionQuery.matches);
    const handleMotionChange = (e) => setReducedMotion(e.matches);
    motionQuery.addEventListener('change', handleMotionChange);

    // Listen to local changes (same tab)
    const handleLocalUpdate = () => {
      loadPreferences();
    };
    window.addEventListener('nd3-visual-snow-update', handleLocalUpdate);

    // Listen to storage changes (cross tabs)
    window.addEventListener('storage', handleLocalUpdate);

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      window.removeEventListener('nd3-visual-snow-update', handleLocalUpdate);
      window.removeEventListener('storage', handleLocalUpdate);
    };
  }, []);

  if (!enabled) return null;

  const getWashColorHex = () => {
    switch (shieldColor) {
      case 'cream':
        return '#EFEAD8'; // Warm cream
      case 'sage':
        return '#0B130F'; // Sage green deep
      case 'void':
      default:
        return '#050505'; // Void black
    }
  };

  return (
    <>
      {/* 1. Global Grain overlay */}
      {grainOpacity > 0 && (
        <div 
          className="fixed inset-0 pointer-events-none z-[9999] mix-blend-overlay transition-opacity duration-300"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            opacity: reducedMotion ? 0.03 : grainOpacity
          }}
        />
      )}

      {/* 2. Global Color Wash overlay */}
      {washOpacity > 0 && (
        <div 
          className="fixed inset-0 pointer-events-none z-[9998] transition-all duration-300"
          style={{
            backgroundColor: getWashColorHex(),
            opacity: washOpacity
          }}
        />
      )}
    </>
  );
}
