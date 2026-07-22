"use client";
import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export const ZeroTelemetryBanner = () => {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if the user has already acknowledged the privacy notice
    const acknowledged = localStorage.getItem('nd3_telemetry_acknowledged');
    if (!acknowledged) {
      // Small visual entry delay for snappiness
      const timer = setTimeout(() => setShow(true), 3500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (allowAnalytics) => {
    localStorage.setItem('nd3_consent_analytics', allowAnalytics ? 'true' : 'false');
    localStorage.setItem('nd3_telemetry_acknowledged', 'true');
    // Dispatch a custom event to notify the analytics wrapper
    window.dispatchEvent(new Event('nd3_consent_changed'));
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
              Privacy & Preferences
            </span>
          </div>
          <p className="text-xs text-fg-primary leading-relaxed font-normal mb-3 font-mono">
            We use lightweight, cookieless analytics to count page views and improve the site. We also use browser local storage to save your theme, accessibility preferences, and cart. No tracking cookies are set.
          </p>
          <p className="text-[10px] text-fg-primary/80 mb-5 font-mono">
            Read our <Link href="/privacy" className="underline text-fg-primary hover:text-accent-pink transition-colors">Privacy Policy</Link> for details.
          </p>

          {/* Action Trigger Buttons */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleConsent(true)}
              className="w-full py-2.5 bg-accent-pink text-black hover:bg-transparent hover:text-accent-pink border-2 border-accent-pink flex items-center justify-center gap-2 font-black uppercase tracking-widest text-xs md:text-sm transition-all focus-ring rounded-none cursor-pointer"
            >
              <span>Accept Analytics</span>
              <ArrowRight size={10} />
            </button>
            <button
              onClick={() => handleConsent(false)}
              className="w-full py-2.5 bg-transparent hover:bg-accent-pink-soft border-2 border-border-rule hover:border-accent-pink text-fg-primary hover:text-accent-pink flex items-center justify-center gap-2 font-black uppercase tracking-widest text-xs md:text-sm transition-all focus-ring rounded-none cursor-pointer"
            >
              <span>Necessary Only</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ZeroTelemetryBanner;
