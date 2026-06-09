"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function DecisionCoinPreview({ isActive }) {
  const [coinSide, setCoinSide] = useState('A');
  const [rotation, setRotation] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setIsFlipping(true);
      const targetSide = Math.random() > 0.5 ? 'A' : 'B';
      const extraFlips = Math.floor(Math.random() * 3) + 4;
      const currentBase = Math.floor(rotation / 360) * 360;
      const addedDegrees = extraFlips * 180 + (targetSide === 'A' ? 0 : 180);
      setRotation(currentBase + addedDegrees);
      setTimeout(() => {
        setCoinSide(targetSide);
        setIsFlipping(false);
      }, 600);
    }, 2000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isActive, rotation]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-black/60 relative">
      <motion.div
        className="w-20 h-20 relative"
        style={{ perspective: '600px' }}
        animate={isActive ? { y: 0 } : { y: [0, -4, 0] }}
        transition={isActive ? { duration: 0.2 } : { repeat: Infinity, duration: 3, ease: "easeInOut" }}
      >
        <div
          className="w-full h-full relative rounded-full"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateY(${rotation}deg)`,
            transition: isFlipping ? 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'none',
          }}
        >
          <div
            className="absolute inset-0 rounded-full border-2 border-fg-primary bg-[#121215] flex items-center justify-center shadow-lg"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <span className="text-xs font-black text-white uppercase tracking-widest select-none">PUSH</span>
          </div>
          <div
            className="absolute inset-0 rounded-full border-2 border-accent bg-[#0c0c0e] flex items-center justify-center shadow-lg"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <span className="text-xs font-black text-accent uppercase tracking-widest select-none">REST</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function BrownNoisePreview({ isActive }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    ctx.clearRect(0, 0, w, h);
    
    const accentColor = getComputedStyle(canvas).getPropertyValue('--accent').trim() || '#FF2E88';
    const ruleColor = getComputedStyle(canvas).getPropertyValue('--rule').trim() || '#1F1F22';
    
    ctx.strokeStyle = isActive ? accentColor : ruleColor;
    ctx.lineWidth = isActive ? 3 : 1.5;
    if (isActive) {
      ctx.shadowColor = accentColor;
      ctx.shadowBlur = 6;
    } else {
      ctx.shadowBlur = 0;
    }
    
    ctx.beginPath();
    const time = Date.now() * 0.001;
    const speed = isActive ? 3.0 : 0.8;
    const amp1 = isActive ? h / 4 : h / 12;
    const amp2 = isActive ? h / 8 : h / 24;
    
    for (let x = 0; x < w; x++) {
      const y = h / 2 + Math.sin(x * 0.015 + time * speed) * amp1 + Math.sin(x * 0.035 + time * (speed * 1.3)) * amp2;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
    animRef.current = requestAnimationFrame(draw);
  }, [isActive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);

    draw();
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [isActive, draw]);

  return (
    <div className="w-full h-full bg-black/60 flex items-center justify-center p-1 relative">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}

export function SpoonTrackerPreview({ isActive }) {
  const [activeSpoons, setActiveSpoons] = useState(5);

  useEffect(() => {
    const intervalTime = isActive ? 1200 : 3500;
    const interval = setInterval(() => {
      setActiveSpoons(prev => {
        const next = prev + (Math.random() > 0.5 ? 1 : -1);
        return Math.max(1, Math.min(6, next));
      });
    }, intervalTime);
    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="w-full h-full bg-black/60 flex flex-col items-center justify-center p-3 gap-2 relative">
      <div className="flex gap-2">
        {Array.from({ length: 6 }).map((_, i) => {
          const isSpoonActive = i < activeSpoons;
          return (
            <motion.div
              key={i}
              className={`w-9 h-9 flex items-center justify-center border transition-all duration-300 ${
                isSpoonActive
                  ? 'border-accent bg-accent-pink-soft/20 text-accent'
                  : 'border-border-rule bg-transparent text-text-muted/20'
              }`}
              animate={isSpoonActive && !isActive ? { scale: [1, 1.05, 1] } : {}}
              transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 2c-1.85 0-3.35 1.5-3.35 3.35v6.59c0 1.55 1.05 2.87 2.5 3.23v5.83c0 .55.45 1 1 1s1-.45 1-1v-5.83c1.45-.36 2.5-1.68 2.5-3.23V5.35C15.35 3.5 13.85 2 12 2z" />
              </svg>
            </motion.div>
          );
        })}
      </div>
      <span className="font-mono text-[9px] text-text-muted uppercase tracking-widest mt-1 select-none">
        {activeSpoons} OF 6 SPOONS
      </span>
    </div>
  );
}

export function DopamineMenuPreview({ isActive }) {
  const snacks = [
    { title: "COLD SHOCK", icon: "❄" },
    { title: "SOLAR CHARGE", icon: "☀" },
    { title: "BILATERAL TAP", icon: "👋" },
    { title: "SONIC PURGE", icon: "🎧" },
    { title: "KINETIC SHAKE", icon: "💫" },
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalTime = isActive ? 1000 : 3000;
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % snacks.length);
    }, intervalTime);
    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="w-full h-full bg-black/60 flex items-center justify-center p-4 relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -4 }}
          transition={{ duration: 0.15 }}
          className="text-center space-y-2"
        >
          <span className="text-4xl block leading-none select-none">{snacks[index].icon}</span>
          <span className="text-[10px] font-mono font-black text-accent uppercase tracking-widest block select-none">
            {snacks[index].title}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function AcousticShieldPreview({ isActive }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    ctx.clearRect(0, 0, w, h);
    
    const accentColor = getComputedStyle(canvas).getPropertyValue('--accent').trim() || '#FF2E88';
    const ruleColor = getComputedStyle(canvas).getPropertyValue('--rule').trim() || '#1F1F22';
    const time = Date.now() * 0.001;
    const bars = 16;
    const barWidth = w / bars - 3;
    
    for (let i = 0; i < bars; i++) {
      const speed = isActive ? 3 : 1;
      const amp1 = isActive ? h * 0.3 : h * 0.1;
      const amp2 = isActive ? h * 0.15 : h * 0.05;
      const baseHeight = isActive ? h * 0.25 : h * 0.15;
      
      const barHeight = baseHeight + Math.sin(time * speed + i * 0.6) * amp1 + Math.sin(time * (speed * 1.5) + i * 0.9) * amp2;
      const x = i * (w / bars);
      const y = h - barHeight;
      
      ctx.fillStyle = isActive
        ? (i < 9 ? accentColor : ruleColor)
        : ruleColor;
      ctx.fillRect(x, y, barWidth, barHeight);
    }
    animRef.current = requestAnimationFrame(draw);
  }, [isActive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);

    draw();
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [isActive, draw]);

  return (
    <div className="w-full h-full bg-black/60 flex items-center justify-center p-3 relative">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}

export function VisualSnowPreview({ isActive }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    const imageData = ctx.createImageData(w, h);
    
    // Ambient noise has a lower opacity (15), hovered is higher contrast (45)
    const alpha = isActive ? 45 : 15;
    
    for (let i = 0; i < imageData.data.length; i += 4) {
      const v = Math.random() * 255;
      imageData.data[i] = v;
      imageData.data[i + 1] = v;
      imageData.data[i + 2] = v;
      imageData.data[i + 3] = alpha;
    }
    ctx.putImageData(imageData, 0, 0);
    animRef.current = requestAnimationFrame(draw);
  }, [isActive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const width = 180;
    const height = 100;
    canvas.width = width;
    canvas.height = height;

    draw();
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [draw]);

  return (
    <div className="w-full h-full bg-black/60 flex items-center justify-center relative overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block object-cover" style={{ imageRendering: 'pixelated' }} />
    </div>
  );
}

export function SensoryAuditPreview({ isActive }) {
  const [progress, setProgress] = useState(4);

  useEffect(() => {
    if (!isActive) {
      setProgress(4);
      return;
    }
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 7) return 0;
        return prev + 1;
      });
    }, 800);
    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="w-full h-full bg-black/60 flex flex-col items-center justify-center p-5 gap-3 relative">
      <div className="flex gap-2">
        {Array.from({ length: 7 }).map((_, i) => {
          const isCircleActive = i < progress;
          return (
            <div
              key={i}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-300 border ${
                isCircleActive
                  ? isActive
                    ? 'bg-accent border-accent shadow-[0_0_8px_var(--accent)] scale-110'
                    : 'bg-accent/70 border-accent/70 shadow-[0_0_4px_var(--accent)] animate-pulse'
                  : 'bg-transparent border-border-rule'
              }`}
            />
          );
        })}
      </div>
      <div className="w-2/3 h-1.5 bg-border-rule rounded-none overflow-hidden mt-1">
        <div
          className={`h-full bg-accent transition-all duration-300 ${!isActive && 'opacity-70 animate-pulse'}`}
          style={{ width: `${(progress / 7) * 100}%` }}
        />
      </div>
      <span className="font-mono text-[9px] text-text-muted uppercase tracking-widest mt-1 select-none">
        {!isActive || progress === 0 ? '7-DOMAIN AUDIT' : `${progress} OF 7 COMPLETED`}
      </span>
    </div>
  );
}

export function BannerShowcasePreview({ isActive }) {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const intervalTime = isActive ? 1200 : 3000;
    const interval = setInterval(() => {
      setPulse(prev => (prev + 1) % 4);
    }, intervalTime);
    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="w-full h-full bg-black/60 flex flex-col justify-center p-5 gap-2.5 text-left select-none overflow-hidden relative">
      <div className="absolute top-2 right-3 font-mono text-[8px] text-text-muted/50 uppercase tracking-widest">
        SANDBOX
      </div>

      <div className="w-1/4 h-1 bg-zinc-800 mb-0.5" />
      <div className="w-full h-3 bg-zinc-800" />
      <div className="w-4/5 h-3 bg-zinc-800 mb-1" />
      
      {/* Mini concept line representation */}
      <div className="w-full h-4 flex items-center justify-center mt-1">
        {pulse === 0 && (
          <div className="h-1 w-full bg-gradient-to-r from-accent via-[#C026D3] to-[#7C3AED]" />
        )}
        {pulse === 1 && (
          <div className="h-3.5 w-full border-t border-b border-dashed border-accent/40 overflow-hidden relative flex items-center justify-center bg-accent/5">
            <span className="text-[6px] font-mono text-accent whitespace-nowrap animate-pulse uppercase tracking-widest font-black">
              UNMASKED · TINY SYSTEMS · GLITCHWORK
            </span>
          </div>
        )}
        {pulse === 2 && (
          <div className="text-[8px] font-mono text-text-muted/60 tracking-wider">
            - - • - - • - - • - - • - - • - -
          </div>
        )}
        {pulse === 3 && (
          <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="w-full h-3" style={{ stroke: 'var(--accent)', fill: 'none' }}>
            <path d="M 0,5 Q 25,2 50,7 T 100,5" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        )}
      </div>
      
      <div className="w-full h-1 bg-zinc-900 mt-1" />
      <div className="w-5/6 h-1 bg-zinc-900" />
    </div>
  );
}

const PREVIEWS = {
  'decision-coin': DecisionCoinPreview,
  'brown-noise-loop': BrownNoisePreview,
  'spoon-tracker': SpoonTrackerPreview,
  'dopamine-menu': DopamineMenuPreview,
  'dopamine-snacks': DopamineMenuPreview,
  'acoustic-shield': AcousticShieldPreview,
  'visual-snow-shield': VisualSnowPreview,
  'visual-snow': VisualSnowPreview,
  'sensory-audit': SensoryAuditPreview,
  'banner-showcase': BannerShowcasePreview,
};

export function LabPreview({ slug, isActive }) {
  const PreviewComponent = PREVIEWS[slug] || null;
  if (!PreviewComponent) {
    return (
      <div className="w-full h-full bg-black/60 flex items-center justify-center">
        <span className="text-[8px] font-mono text-text-muted uppercase tracking-wider">
          PREVIEW UNAVAILABLE
        </span>
      </div>
    );
  }
  return <PreviewComponent isActive={isActive} />;
}
