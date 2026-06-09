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
    <div className="w-full h-full flex items-center justify-center bg-black/60">
      <div
        className="w-12 h-12 relative"
        style={{ perspective: '400px' }}
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
            className="absolute inset-0 rounded-full border border-[var(--fg)] bg-[#121215] flex items-center justify-center"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <span className="text-[6px] font-black text-white uppercase tracking-tight">PUSH</span>
          </div>
          <div
            className="absolute inset-0 rounded-full border border-[var(--accent)] bg-[#0c0c0e] flex items-center justify-center"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <span className="text-[6px] font-black text-[var(--accent)] uppercase tracking-tight">REST</span>
          </div>
        </div>
      </div>
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
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    const accentColor = getComputedStyle(canvas).getPropertyValue('--accent').trim() || '#FF2E88';
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2;
    ctx.shadowColor = accentColor;
    ctx.shadowBlur = 3;
    ctx.beginPath();
    const time = Date.now() * 0.001;
    for (let x = 0; x < w; x++) {
      const y = h / 2 + Math.sin(x * 0.03 + time * 2) * 8 + Math.sin(x * 0.07 + time * 3) * 4;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
    animRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    if (isActive) {
      draw();
    } else {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = getComputedStyle(canvas).getPropertyValue('--rule').trim() || '#1F1F22';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
      }
    }
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [isActive, draw]);

  return (
    <div className="w-full h-full bg-black/60 flex items-center justify-center p-1">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}

export function SpoonTrackerPreview({ isActive }) {
  const [activeSpoons, setActiveSpoons] = useState(5);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setActiveSpoons(prev => {
        const next = prev + (Math.random() > 0.5 ? 1 : -1);
        return Math.max(1, Math.min(6, next));
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="w-full h-full bg-black/60 flex items-center justify-center p-2">
      <div className="flex gap-1.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={`w-5 h-5 flex items-center justify-center border transition-all duration-300 ${
              i < activeSpoons
                ? 'border-[var(--accent)] bg-accent-pink-soft/20 text-[var(--accent)]'
                : 'border-[var(--rule)] bg-transparent text-[var(--muted)]/30'
            }`}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
              <path d="M12 2c-1.85 0-3.35 1.5-3.35 3.35v6.59c0 1.55 1.05 2.87 2.5 3.23v5.83c0 .55.45 1 1 1s1-.45 1-1v-5.83c1.45-.36 2.5-1.68 2.5-3.23V5.35C15.35 3.5 13.85 2 12 2z" />
            </svg>
          </div>
        ))}
      </div>
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
    if (!isActive) return;
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % snacks.length);
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="w-full h-full bg-black/60 flex items-center justify-center p-3">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="text-center space-y-1"
        >
          <span className="text-lg block">{snacks[index].icon}</span>
          <span className="text-[7px] font-mono font-bold text-[var(--accent)] uppercase tracking-wider">
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
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    const accentColor = getComputedStyle(canvas).getPropertyValue('--accent').trim() || '#FF2E88';
    const ruleColor = getComputedStyle(canvas).getPropertyValue('--rule').trim() || '#1F1F22';
    const time = Date.now() * 0.001;
    const bars = 12;
    const barWidth = w / bars - 2;
    for (let i = 0; i < bars; i++) {
      const barHeight = 8 + Math.sin(time * 2 + i * 0.5) * 12 + Math.sin(time * 3 + i * 0.8) * 6;
      const x = i * (barWidth + 2);
      const y = h - barHeight;
      ctx.fillStyle = i < 6 ? accentColor : ruleColor;
      ctx.fillRect(x, y, barWidth, barHeight);
    }
    animRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    if (isActive) {
      draw();
    } else {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = getComputedStyle(canvas).getPropertyValue('--muted').trim() || '#8A8A93';
        ctx.font = '7px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('FREQ ANALYSIS', canvas.width / 2, canvas.height / 2 + 3);
      }
    }
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [isActive, draw]);

  return (
    <div className="w-full h-full bg-black/60 flex items-center justify-center p-1">
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
    for (let i = 0; i < imageData.data.length; i += 4) {
      const v = Math.random() * 255;
      imageData.data[i] = v;
      imageData.data[i + 1] = v;
      imageData.data[i + 2] = v;
      imageData.data[i + 3] = 30;
    }
    ctx.putImageData(imageData, 0, 0);
    animRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = Math.min(canvas.offsetWidth, 80);
    canvas.height = Math.min(canvas.offsetHeight, 60);
    if (isActive) {
      draw();
    } else {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = getComputedStyle(canvas).getPropertyValue('--muted').trim() || '#8A8A93';
        ctx.font = '7px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GRAIN TEXTURE', canvas.width / 2, canvas.height / 2 + 3);
      }
    }
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [isActive, draw]);

  return (
    <div className="w-full h-full bg-black/60 flex items-center justify-center p-1 overflow-hidden">
      <canvas ref={canvasRef} className="block" />
    </div>
  );
}

export function SensoryAuditPreview({ isActive }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setProgress(0);
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
    <div className="w-full h-full bg-black/60 flex flex-col items-center justify-center p-3 gap-2">
      <div className="flex gap-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i < progress
                ? 'bg-[var(--accent)] shadow-[0_0_4px_var(--accent)]'
                : 'bg-[var(--rule)]'
            }`}
          />
        ))}
      </div>
      <div className="w-full h-1 bg-[var(--rule)] rounded-none overflow-hidden">
        <div
          className="h-full bg-[var(--accent)] transition-all duration-300"
          style={{ width: `${(progress / 7) * 100}%` }}
        />
      </div>
      <span className="text-[6px] font-mono text-[var(--muted)] uppercase tracking-wider">
        {progress === 0 ? '7-DOMAIN AUDIT' : `${progress}/7 CHANNELS`}
      </span>
    </div>
  );
}

export function BannerShowcasePreview({ isActive }) {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setPulse(0);
      return;
    }
    const interval = setInterval(() => {
      setPulse(prev => (prev + 1) % 4);
    }, 1200);
    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="w-full h-full bg-black/60 flex flex-col justify-center p-4 gap-2 text-left select-none overflow-hidden relative">
      {/* Background visual detail */}
      <div className="absolute top-1 right-2 font-mono text-[6px] text-zinc-600">
        SANDBOX
      </div>

      <div className="w-1/4 h-1 bg-zinc-800 rounded-none mb-0.5" />
      <div className="w-full h-2.5 bg-zinc-800 rounded-none" />
      <div className="w-4/5 h-2.5 bg-zinc-800 rounded-none mb-1.5" />
      
      {/* Mini concept line representation */}
      <div className="w-full h-3 flex items-center justify-center">
        {pulse === 0 && (
          <div className="h-0.5 w-full bg-gradient-to-r from-accent-pink via-[#C026D3] to-[#7C3AED]" />
        )}
        {pulse === 1 && (
          <div className="h-2.5 w-full border-t border-b border-dashed border-[var(--accent)]/40 overflow-hidden relative flex items-center">
            <div className="text-[5px] font-mono text-[var(--accent)] whitespace-nowrap animate-pulse uppercase tracking-[0.05em] font-bold">
              UNMASKED · TINY SYSTEMS · GLITCHWORK
            </div>
          </div>
        )}
        {pulse === 2 && (
          <div className="text-[6px] font-mono text-zinc-500 tracking-wider">
            - - • - - • - - • - - • - - • - -
          </div>
        )}
        {pulse === 3 && (
          <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="w-full h-2" style={{ stroke: 'var(--accent)', fill: 'none' }}>
            <path d="M 0,5 Q 25,2 50,7 T 100,5" strokeWidth="0.8" strokeLinecap="round" />
          </svg>
        )}
      </div>
      
      <div className="w-full h-1 bg-zinc-900 rounded-none mt-1" />
      <div className="w-5/6 h-1 bg-zinc-900 rounded-none" />
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
        <span className="text-[8px] font-mono text-[var(--muted)] uppercase tracking-wider">
          PREVIEW UNAVAILABLE
        </span>
      </div>
    );
  }
  return <PreviewComponent isActive={isActive} />;
}
