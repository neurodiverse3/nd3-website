"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WhichToolDemo() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const navs = document.querySelectorAll('nav, header, footer, .sidebar, #navbar, #footer');
    navs.forEach(el => {
      if (el) el.style.display = 'none';
    });
    document.body.style.overflow = 'hidden';

    // Sequence timing
    const timers = [
      setTimeout(() => setStep(1), 1000), // Intro
      setTimeout(() => setStep(2), 3500), // Need help starting?
      setTimeout(() => setStep(3), 6500), // Need help recovering?
      setTimeout(() => setStep(4), 9500), // Want the full set?
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  const startingTools = [
    { id: 1, title: "Dopamine Menu", tag: "Template" },
    { id: 2, title: "Weekly Planner", tag: "System" },
    { id: 3, title: "Comms Bundle", tag: "Swipe File" }
  ];

  const recoveringTools = [
    { id: 1, title: "Burnout Roadmap", tag: "Workspace" },
    { id: 2, title: "Masking Recovery", tag: "Tracker" },
    { id: 3, title: "Sensory Audit", tag: "Workbook" }
  ];

  return (
    <div className="fixed inset-0 bg-[#121212] flex items-center justify-center overflow-hidden z-50">
      <div className="relative w-full max-w-sm h-[800px] flex flex-col items-center justify-center px-6">
        
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.h1 
              key="q1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-white text-3xl font-bold text-center"
            >
              Which tool should<br />I start with?
            </motion.h1>
          )}

          {step === 1 && (
            <motion.div key="seq1" className="w-full flex flex-col items-center">
              <motion.h2 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-[#ff007f] font-mono text-sm tracking-widest uppercase mb-8"
              >
                Need help starting?
              </motion.h2>
              <div className="flex flex-col gap-4 w-full">
                {startingTools.map((tool, i) => (
                  <motion.div 
                    key={tool.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: i * 0.2 }}
                    className="w-full p-5 rounded-lg bg-[#1a1a1a] border border-white/5 flex justify-between items-center"
                  >
                    <span className="text-white font-medium">{tool.title}</span>
                    <span className="text-white/30 text-xs uppercase tracking-wider">{tool.tag}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="seq2" className="w-full flex flex-col items-center">
              <motion.h2 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-[#ff007f] font-mono text-sm tracking-widest uppercase mb-8"
              >
                Need help recovering?
              </motion.h2>
              <div className="flex flex-col gap-4 w-full">
                {recoveringTools.map((tool, i) => (
                  <motion.div 
                    key={tool.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: i * 0.2 }}
                    className="w-full p-5 rounded-lg bg-[#1a1a1a] border border-white/5 flex justify-between items-center"
                  >
                    <span className="text-white font-medium">{tool.title}</span>
                    <span className="text-white/30 text-xs uppercase tracking-wider">{tool.tag}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="seq3" className="w-full flex flex-col items-center text-center">
              <motion.h2 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="text-[#ff007f] font-mono text-sm tracking-widest uppercase mb-6"
              >
                Want the full set?
              </motion.h2>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="w-full p-8 rounded-xl bg-[#222] border border-white/10 flex flex-col items-center shadow-2xl"
              >
                <div className="w-16 h-16 rounded-lg bg-[#111] border border-white/5 flex items-center justify-center mb-6">
                  <div className="w-4 h-4 rounded-full bg-[#ff007f] shadow-[0_0_15px_#ff007f]" />
                </div>
                <h3 className="text-white text-2xl font-bold mb-2">The Toolkit</h3>
                <p className="text-white/50 text-sm">All six launch products.</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
