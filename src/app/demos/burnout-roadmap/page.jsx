"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function BurnoutRoadmapDemo() {
  useEffect(() => {
    const navs = document.querySelectorAll('nav, header, footer, .sidebar, #navbar, #footer');
    navs.forEach(el => {
      if (el) el.style.display = 'none';
    });
    document.body.style.overflow = 'hidden';
  }, []);

  const phases = [
    { id: 1, title: "Survive", subtitle: "Immediate safety", color: "#222" },
    { id: 2, title: "Stabilise", subtitle: "Restoring capacity", color: "#262626" },
    { id: 3, title: "Rebuild", subtitle: "Sustainable systems", color: "#2a2a2a" }
  ];

  return (
    <div className="fixed inset-0 bg-[#121212] flex items-center justify-center overflow-hidden z-50">
      <div className="relative w-full max-w-4xl px-12 h-screen flex flex-col items-center justify-center">
        
        {/* Title */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h1 className="text-white text-4xl font-bold tracking-tight mb-3">Burnout Recovery Roadmap</h1>
          <p className="text-white/60 text-lg">Recovery, not productivity.</p>
        </motion.div>

        {/* The Route Line */}
        <div className="relative w-full max-w-3xl flex justify-between">
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2, delay: 1, ease: "easeInOut" }}
            className="absolute top-1/2 left-0 w-full h-[2px] bg-white/10 origin-left -translate-y-1/2 z-0"
          />

          {/* Phases */}
          {phases.map((phase, i) => (
            <div key={phase.id} className="relative z-10 flex flex-col items-center group">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 1.5 + (i * 0.8), ease: "easeOut" }}
                className="w-48 h-56 rounded-xl border border-white/5 p-6 flex flex-col shadow-2xl relative"
                style={{ backgroundColor: phase.color }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#121212] border-2 border-white/20 flex items-center justify-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 2 + (i * 0.8), type: 'spring' }}
                    className="w-3 h-3 rounded-full bg-[#ff007f]"
                  />
                </div>
                
                <h2 className="text-white font-medium text-xl mt-6 mb-2">{phase.title}</h2>
                <p className="text-white/50 text-sm mb-6">{phase.subtitle}</p>
                
                {/* Notion Style Abstract Blocks */}
                <div className="mt-auto space-y-3">
                  <div className="w-full h-2 bg-white/10 rounded-full" />
                  <div className="w-4/5 h-2 bg-white/10 rounded-full" />
                  <div className="w-full flex gap-2 pt-2 border-t border-white/5 mt-2">
                    <div className="w-4 h-4 rounded-sm bg-white/5" />
                    <div className="w-4 h-4 rounded-sm bg-white/5" />
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
