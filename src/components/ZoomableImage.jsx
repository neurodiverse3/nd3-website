"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

export const ZoomableImage = ({ src, alt, caption }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Close lightbox on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Disable scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Full-Bleed In-Article Image Wrapper */}
      <figure className="w-full max-w-none my-12 relative group cursor-zoom-in">
        <div 
          onClick={() => setIsOpen(true)}
          className="w-full overflow-hidden border border-border-rule/60 bg-black/20"
        >
          <Image 
            src={src} 
            alt={alt || 'Article Image'} 
            width={1200}
            height={800}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 900px, 1200px"
            className="w-full h-auto object-cover max-h-[70vh] transition-transform duration-500 hover:scale-[1.01]"
            loading="lazy"
          />
        </div>
        {caption && (
          <figcaption className="text-center text-xs text-text-muted mt-4 italic font-mono uppercase tracking-widest px-6">
            {caption}
          </figcaption>
        )}
      </figure>

      {/* Premium Lightbox Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200 cursor-zoom-out"
          onClick={() => setIsOpen(false)}
        >
          {/* Close button */}
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 p-2 text-white/70 hover:text-white hover:bg-white/10 transition-all rounded-none cursor-pointer border border-white/20"
            aria-label="Close image zoom"
          >
            <X size={20} />
          </button>

          <div className="relative max-w-7xl max-h-[85vh] flex flex-col items-center">
            <Image 
              src={src} 
              alt={alt || 'Zoomed Image'} 
              width={1920}
              height={1080}
              sizes="100vw"
              className="max-w-full max-h-[80vh] w-auto h-auto object-contain select-none shadow-2xl border-2 border-border-rule"
            />
            {caption && (
              <p className="text-white/80 text-xs md:text-sm text-center mt-4 italic font-mono uppercase tracking-widest max-w-3xl">
                {caption}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};
