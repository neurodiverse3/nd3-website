"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function DopamineMenuDemo() {
  useEffect(() => {
    const navs = document.querySelectorAll('nav, header, footer, .sidebar, #navbar, #footer');
    navs.forEach(el => {
      if (el) el.style.display = 'none';
    });
    document.body.style.overflow = 'hidden';
  }, []);

  return (
    <div className="fixed inset-0 bg-[#121212] flex items-center justify-center overflow-hidden z-50">
      <div className="relative w-full max-w-2xl h-[600px] flex items-center justify-center">
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="w-[400px] h-[550px] bg-[#1a1a1a] rounded-lg shadow-2xl border border-white/10 p-6 flex flex-col"
        >
          <div className="w-full flex justify-between items-start mb-6 border-b border-white/5 pb-4">
            <div className="w-1/2">
               <div className="w-full h-3 bg-white/20 rounded-full mb-2" />
               <div className="w-3/4 h-2 bg-white/10 rounded-full" />
            </div>
            <div className="w-8 h-8 rounded bg-[#ff007f]/20 flex items-center justify-center border border-[#ff007f]/30">
               <div className="w-2 h-2 rounded-full bg-[#ff007f]" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 flex-grow">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + (i * 0.15) }}
                className="w-full h-full bg-[#222] rounded-md border border-white/5 p-3 flex flex-col gap-2"
              >
                <div className="w-1/2 h-2 bg-white/15 rounded-full" />
                <div className="w-full h-1 bg-white/5 rounded-full mt-2" />
                <div className="w-3/4 h-1 bg-white/5 rounded-full" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="absolute left-10 top-1/2 -translate-y-1/2"
        >
          <h2 className="text-white text-3xl font-bold tracking-tight leading-tight">
            1-Page<br />Dopamine<br />Menu
          </h2>
          <div className="mt-4 px-3 py-1 border border-white/20 text-white/60 rounded-sm text-xs font-mono inline-block">
            FREE DOWNLOAD
          </div>
        </motion.div>

      </div>
    </div>
  );
}
