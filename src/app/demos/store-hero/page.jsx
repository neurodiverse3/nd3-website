"use client";

import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

export default function StoreHeroDemo() {
  const controls = useAnimation();

  useEffect(() => {
    // We want the global Navbar and Footer to be hidden during recording.
    // The Playwright script will also attempt to hide them, but we can do it here for good measure.
    const hideElements = () => {
      const navs = document.querySelectorAll('nav, header, footer, .sidebar, #navbar, #footer');
      navs.forEach(el => {
        if (el) el.style.display = 'none';
      });
      document.body.style.overflow = 'hidden';
    };
    hideElements();
    
    // Start animation loop
    controls.start({
      scale: [1, 1.05, 1],
      transition: { duration: 20, repeat: Infinity, ease: "linear" }
    });
  }, [controls]);

  // Abstract shapes
  const shapes = [
    { id: 1, type: 'pdf', width: 200, height: 280, x: -300, y: -100, rotate: -5, opacity: 0.8 },
    { id: 2, type: 'card', width: 240, height: 160, x: 200, y: -150, rotate: 3, opacity: 0.9 },
    { id: 3, type: 'notion', width: 300, height: 200, x: 100, y: 150, rotate: -2, opacity: 0.85 },
    { id: 4, type: 'folder', width: 220, height: 140, x: -250, y: 180, rotate: 6, opacity: 0.75 },
    { id: 5, type: 'card', width: 180, height: 180, x: -50, y: -250, rotate: -8, opacity: 0.6 },
    { id: 6, type: 'pdf', width: 220, height: 300, x: 350, y: 50, rotate: 4, opacity: 0.8 },
  ];

  return (
    <div className="fixed inset-0 bg-[#1a1a1a] flex items-center justify-center overflow-hidden z-50">
      <motion.div 
        animate={controls}
        className="relative w-full h-full flex items-center justify-center"
      >
        {shapes.map((shape) => (
          <motion.div
            key={shape.id}
            initial={{ x: shape.x, y: shape.y, rotate: shape.rotate, opacity: 0 }}
            animate={{ 
              y: [shape.y, shape.y - 15, shape.y],
              opacity: shape.opacity
            }}
            transition={{
              y: { duration: 6 + Math.random() * 4, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 2 }
            }}
            className="absolute rounded-md shadow-2xl flex flex-col p-4 gap-3 border border-white/5"
            style={{
              width: shape.width,
              height: shape.height,
              backgroundColor: shape.type === 'notion' ? '#222' : '#2a2a2a',
            }}
          >
            {/* Abstract UI Elements inside the shapes */}
            <div className="w-1/3 h-2 bg-white/20 rounded-full" />
            <div className="w-2/3 h-2 bg-white/10 rounded-full" />
            <div className="w-1/2 h-2 bg-white/10 rounded-full" />
            
            {shape.type === 'folder' && (
               <div className="mt-auto self-end w-4 h-4 rounded-full bg-[#ff007f] opacity-80 shadow-[0_0_15px_#ff007f]" />
            )}
            {shape.type === 'notion' && (
              <div className="mt-4 flex gap-2">
                 <div className="w-8 h-8 rounded-sm bg-white/5" />
                 <div className="w-8 h-8 rounded-sm bg-white/5" />
                 <div className="w-8 h-8 rounded-sm bg-[#ff007f]/40" />
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
