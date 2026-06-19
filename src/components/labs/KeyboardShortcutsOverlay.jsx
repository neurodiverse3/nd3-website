"use client";
import React, { useState, useEffect } from 'react';
import { Keyboard, X } from 'lucide-react';

export default function KeyboardShortcutsOverlay({ shortcuts = {} }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (Object.keys(shortcuts).length === 0) return null;

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-24 z-50 p-3 border border-[var(--rule)] bg-black/80 hover:border-[var(--accent)] text-[var(--muted)] hover:text-[var(--accent)] cursor-pointer transition-all rounded-none shadow-[4px_4px_0px_var(--rule)]"
        aria-label="Show keyboard shortcuts"
        title="Press ? to show shortcuts"
      >
        <Keyboard size={16} />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[90] bg-black/80 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div className="border-2 border-[var(--rule)] bg-[#0a0a0e] max-w-md w-full p-6 space-y-5 shadow-[8px_8px_0px_var(--rule)] relative">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--rule)] pb-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-[var(--fg)] flex items-center gap-2">
                <Keyboard size={14} className="text-[var(--accent)]" />
                KEYBOARD SHORTCUTS
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:text-[var(--accent)] cursor-pointer transition-colors"
                aria-label="Close shortcuts"
              >
                <X size={14} />
              </button>
            </div>

            {/* Shortcuts List */}
            <div className="space-y-2">
              {Object.entries(shortcuts).map(([key, action]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-xs text-[var(--muted)] font-sans">{action}</span>
                  <kbd className="px-2 py-1 bg-black border border-[var(--rule)] text-xs md:text-sm font-mono text-[var(--accent)] uppercase tracking-wider">
                    {key}
                  </kbd>
                </div>
              ))}
            </div>

            {/* Global Shortcuts */}
            <div className="border-t border-[var(--rule)] pt-3 space-y-2">
              <span className="text-xs md:text-sm font-mono text-[var(--muted)] uppercase tracking-widest block font-bold">
                GLOBAL
              </span>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--muted)] font-sans">Show/hide this panel</span>
                <kbd className="px-2 py-1 bg-black border border-[var(--rule)] text-xs md:text-sm font-mono text-[var(--accent)] uppercase tracking-wider">
                  ?
                </kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--muted)] font-sans">Close panel</span>
                <kbd className="px-2 py-1 bg-black border border-[var(--rule)] text-xs md:text-sm font-mono text-[var(--accent)] uppercase tracking-wider">
                  ESC
                </kbd>
              </div>
            </div>

            {/* Footer */}
            <p className="text-xs md:text-sm font-mono text-[var(--muted)] uppercase tracking-wider text-center pt-2 border-t border-[var(--rule)]/40">
              PRESS ? TO TOGGLE THIS PANEL
            </p>
          </div>
        </div>
      )}
    </>
  );
}
