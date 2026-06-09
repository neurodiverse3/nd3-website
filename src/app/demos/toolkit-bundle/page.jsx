"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ToolkitBundleDemo() {
  useEffect(() => {
    const navs = document.querySelectorAll('nav, header, footer, .sidebar, #navbar, #footer');
    navs.forEach(el => {
      if (el) el.style.display = 'none';
    });
    document.body.style.overflow = 'hidden';
  }, []);

  const covers = [
    { id: 1, title: "Dopamine Menu", type: "pdf", color: "#1a1a1a", z: 10 },
    { id: 2, title: "Weekly Planner", type: "notion", color: "#222222", z: 20 },
    { id: 3, title: "Burnout Roadmap", type: "notion", color: "#1c1c1c", z: 30 },
    { id: 4, title: "Masking Pack", type: "pdf", color: "#1e1e1e", z: 40 },
    { id: 5, title: "Sensory Audit", type: "pdf", color: "#252525", z: 50 },
    { id: 6, title: "Comms Bundle", type: "zip", color: "#2a2a2a", z: 60 },
  ];

  return (
    <div className="fixed inset-0 bg-[#121212] flex items-center justify-center overflow-hidden z-50">
      <div className="relative w-full max-w-2xl h-[600px] flex items-center justify-center">
        {covers.map((cover, index) => {
          // Calculate destination for stack
          const destY = -10 * index;
          const destX = 10 * index;
          
          return (
            <motion.div
              key={cover.id}
              initial={{ 
                x: (Math.random() - 0.5) * 800, 
                y: (Math.random() - 0.5) * 600 + 400, 
                rotate: (Math.random() - 0.5) * 45,
                opacity: 0
              }}
              animate={{ 
                x: destX, 
                y: destY, 
                rotate: 0,
                opacity: 1
              }}
              transition={{
                duration: 1.5,
                delay: index * 0.4 + 0.5,
                ease: [0.16, 1, 0.3, 1] // Custom ease-out
              }}
              className="absolute w-80 h-96 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.8)] border border-white/10 p-6 flex flex-col"
              style={{
                backgroundColor: cover.color,
                zIndex: cover.z
              }}
            >
              <div className="w-12 h-3 bg-white/20 rounded-sm mb-8" />
              <div className="text-white/80 font-semibold text-xl tracking-tight leading-snug">
                {cover.title}
              </div>
              <div className="mt-4 w-3/4 h-2 bg-white/10 rounded-full" />
              <div className="mt-2 w-1/2 h-2 bg-white/10 rounded-full" />
              
              <div className="mt-auto flex justify-between items-end">
                <div className="text-xs text-white/40 tracking-widest uppercase">
                  // {cover.type} //
                </div>
                {index === covers.length - 1 && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: covers.length * 0.4 + 1.5, type: 'spring' }}
                    className="w-3 h-3 rounded-full bg-[#ff007f] shadow-[0_0_10px_#ff007f]"
                  />
                )}
              </div>
            </motion.div>
          );
        })}
        
        {/* The Toolkit Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: covers.length * 0.4 + 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
        >
          <h1 className="text-white text-3xl font-bold tracking-tight mb-2">The Toolkit</h1>
          <p className="text-white/50 text-sm">All six launch products</p>
          <div className="mt-4 px-3 py-1 border border-[#ff007f]/50 text-[#ff007f] rounded-sm text-xs font-mono">
            Launch special · £19
          </div>
        </motion.div>
      </div>
    </div>
  );
}
