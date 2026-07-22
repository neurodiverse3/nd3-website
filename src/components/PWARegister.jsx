"use client";
import { useEffect } from 'react';

export const PWARegister = () => {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('🔌 [PWA Loader] Service Worker registered successfully! Scope:', registration.scope);
          })
          .catch((err) => {
            console.warn('⚠️ [PWA Loader] Service Worker registration failed:', err);
          });
      });
    }
  }, []);

  return null;
};

export default PWARegister;
