"use client";
import React, { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/next';

export default function VercelAnalyticsWrapper() {
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    // Check initial consent on mount
    const storedConsent = localStorage.getItem('nd3_consent_analytics');
    if (storedConsent === 'true') {
      setConsent(true);
    }

    // Listen for consent changes
    const handleConsentChange = () => {
      const updatedConsent = localStorage.getItem('nd3_consent_analytics');
      setConsent(updatedConsent === 'true');
    };

    window.addEventListener('nd3_consent_changed', handleConsentChange);
    return () => {
      window.removeEventListener('nd3_consent_changed', handleConsentChange);
    };
  }, []);

  if (!consent) return null;

  return <Analytics />;
}
