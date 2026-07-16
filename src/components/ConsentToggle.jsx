"use client";
import React, { useState, useEffect } from 'react';
import { ShieldCheck, ToggleLeft, ToggleRight } from 'lucide-react';

export default function ConsentToggle() {
  const [consent, setConsent] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedConsent = localStorage.getItem('nd3_consent_analytics');
    setConsent(storedConsent === 'true');

    const handleConsentChange = () => {
      const updatedConsent = localStorage.getItem('nd3_consent_analytics');
      setConsent(updatedConsent === 'true');
    };

    window.addEventListener('nd3_consent_changed', handleConsentChange);
    return () => {
      window.removeEventListener('nd3_consent_changed', handleConsentChange);
    };
  }, []);

  const handleToggle = () => {
    const nextVal = !consent;
    localStorage.setItem('nd3_consent_analytics', nextVal ? 'true' : 'false');
    localStorage.setItem('nd3_telemetry_acknowledged', 'true');
    window.dispatchEvent(new Event('nd3_consent_changed'));
    setConsent(nextVal);
  };

  if (!mounted) return null;

  return (
    <div className="bg-bg-primary border border-accent p-6 shadow-[4px_4px_0px_var(--accent)] flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="font-sans text-sm md:text-base text-fg-primary font-black tracking-wider uppercase flex items-center gap-2">
            <ShieldCheck size={16} className="text-accent" />
            Vercel Web Analytics Consent
          </h4>
          <p className="text-sm text-[var(--muted)] mt-1 leading-relaxed font-normal">
            Toggle whether you want to allow us to gather anonymous page view statistics. We never collect personal data or cookies.
          </p>
        </div>
        <button
          onClick={handleToggle}
          className="text-[var(--accent)] hover:text-accent-pink shrink-0 focus-ring rounded-none cursor-pointer border-0 bg-transparent p-0"
          aria-label="Toggle Vercel Web Analytics"
        >
          {consent ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
        </button>
      </div>
      <div className="text-xs font-mono font-normal">
        Status: <span className={consent ? "text-[var(--accent)] font-bold" : "text-[var(--muted)] font-bold"}>
          {consent ? "ACCEPTED (Active)" : "DECLINED (Inactive)"}
        </span>
      </div>
    </div>
  );
}
