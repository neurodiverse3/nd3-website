"use client";
import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ZeroTelemetryBanner = () => {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if the user has already acknowledged the privacy notice
    const acknowledged = localStorage.getItem('nd3_telemetry_acknowledged');
    if (!acknowledged) {
      // Small visual entry delay for snappiness
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcknowledge = () => {
    localStorage.setItem('nd3_telemetry_acknowledged', 'true');
    setShow(false);
  };

  // Prevent server-side hydration discrepancy
  if (!mounted) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-6 z-50 max-w-sm w-[calc(100vw-3rem)] border-2 border-fg-primary p-6 shadow-[6px_6px_0px_var(--accent)] bg-bg-primary rounded-none text-left"
          role="status"
          aria-live="polite"
        >
          {/* Banner Header Accent */}
          <div className="flex items-start gap-3 mb-4">
            <div className="w-6 h-6 bg-accent-pink-soft border border-accent-pink/30 flex items-center justify-center text-accent-pink rounded-none shrink-0 mt-0.5">
              <ShieldCheck size={12} />
            </div>
            <span className="text-sm font-black uppercase tracking-[0.1em] text-accent-pink font-mono leading-tight">
              Private by default - no tracking, ever
            </span>
          </div>
          <p className="text-xs text-text-muted leading-relaxed font-normal mb-5 font-mono">
            We don't use tracking scripts, analytics pixels, or cookie consent pop-ups. Your browser only stores what's needed to use the site: your theme preference and your cart. That's it.
          </p>

          {/* Action Trigger Button */}
          <button
            onClick={handleAcknowledge}
            className="w-full py-3 bg-transparent hover:bg-accent-pink-soft border-2 border-border-rule hover:border-accent-pink text-fg-primary hover:text-accent-pink flex items-center justify-center gap-2 font-black uppercase tracking-widest text-xs md:text-sm transition-all focus-ring rounded-none cursor-pointer"
          >
            <span>Got it</span>
            <ArrowRight size={10} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ZeroTelemetryBanner;
