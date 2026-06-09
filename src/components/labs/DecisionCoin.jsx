"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, RefreshCw, Volume2, HelpCircle } from 'lucide-react';
import { useLabLocalStorage } from '../../lib/useLabStorage';

export default function DecisionCoin({ noWrapper = false }) {
  const { value: savedLabelA, setValue: setSavedLabelA } = useLabLocalStorage('nd3-coin-label-a', 'PUSH');
  const { value: savedLabelB, setValue: setSavedLabelB } = useLabLocalStorage('nd3-coin-label-b', 'REST');

  const [labelA, setLabelA] = useState(savedLabelA);
  const [labelB, setLabelB] = useState(savedLabelB);
  const [isFlipping, setIsFlipping] = useState(false);
  const [coinSide, setCoinSide] = useState('A');
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [gutFeedback, setGutFeedback] = useState("");
  const [flipHistory, setFlipHistory] = useState([]);

  const coinRef = useRef(null);

  useEffect(() => {
    if (savedLabelA) setLabelA(savedLabelA);
    if (savedLabelB) setLabelB(savedLabelB);

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(motionQuery.matches);
    const handleMotionChange = (e) => setReducedMotion(e.matches);
    motionQuery.addEventListener('change', handleMotionChange);
    return () => motionQuery.removeEventListener('change', handleMotionChange);
  }, []);

  useEffect(() => {
    setSavedLabelA(labelA);
  }, [labelA]);

  useEffect(() => {
    setSavedLabelB(labelB);
  }, [labelB]);

  // Web Audio landing click sound
  const playLandingClick = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280, ctx.currentTime); // Quick soft wood-block click
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {}
  };

  const flipCoin = () => {
    if (isFlipping) return;

    setIsFlipping(true);
    setGutFeedback("");

    const targetSide = Math.random() > 0.5 ? 'A' : 'B';
    const extraFlips = Math.floor(Math.random() * 3) + 4;
    const currentBase = Math.floor(rotationDegrees / 360) * 360;
    const addedDegrees = extraFlips * 180 + (targetSide === 'A' ? 0 : 180);
    const finalDegrees = currentBase + addedDegrees;

    const newEntry = {
      side: targetSide,
      label: targetSide === 'A' ? labelA : labelB,
      timestamp: Date.now(),
    };
    setFlipHistory(prev => [...prev.slice(-49), newEntry]);

    if (reducedMotion) {
      setCoinSide(targetSide);
      setRotationDegrees(targetSide === 'A' ? 0 : 180);
      setIsFlipping(false);
      playLandingClick();
      showGutFeedback(targetSide);
    } else {
      setRotationDegrees(finalDegrees);
      setTimeout(() => {
        setCoinSide(targetSide);
        setIsFlipping(false);
        playLandingClick();
        showGutFeedback(targetSide);
      }, 850);
    }
  };

  const showGutFeedback = (landedSide) => {
    const optionName = landedSide === 'A' ? labelA : labelB;
    setGutFeedback(`The coin landed on [${optionName.toUpperCase()}]. Notice your immediate gut reaction. If you feel a tiny disappointment, choose the other option. If you feel relief, go with this one.`);
  };

  // Keyboard accessibility
  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      flipCoin();
    }
  };

  const content = (
    <div className={`select-none font-sans text-left ${noWrapper ? 'space-y-4' : 'space-y-6'}`}>
      {/* Brand Header */}
      <div className="flex items-center justify-between border-b border-[var(--rule)] pb-3">
        <h3 className="text-base font-black uppercase tracking-wider text-[var(--fg)] flex items-center gap-2">
          <Sparkles size={16} className="text-[var(--accent)]" /> DECISION COIN
        </h3>
        <span className="text-[10px] font-mono text-[var(--muted)] uppercase border border-[var(--rule)] px-2 py-0.5 tracking-wider">
          TACTILE • BRAIN HACK
        </span>
      </div>

      <p className={`text-[13px] text-[var(--muted)] leading-relaxed ${noWrapper ? 'line-clamp-2 hover:line-clamp-none transition-all duration-300' : ''}`}>
        Stuck in executive paralysis? Deliberating has stopped helping. Type your two options, tap to flip, and notice your gut reaction — the half-second of relief or disappointment is the answer your brain couldn't access.
      </p>

      {/* Two Text Inputs for Labels */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="font-mono text-[9px] text-[var(--muted)] uppercase tracking-wider block font-bold">
            SIDE A (HEADS)
          </label>
          <input
            type="text"
            maxLength={18}
            value={labelA}
            onChange={(e) => setLabelA(e.target.value.toUpperCase())}
            disabled={isFlipping}
            placeholder="OPTION 1"
            className="w-full bg-black border border-[var(--rule)] focus:border-[var(--accent)] text-xs text-white px-2 py-1.5 font-black tracking-wide outline-none text-center rounded-none transition-colors"
          />
        </div>

        <div className="space-y-1">
          <label className="font-mono text-[9px] text-[var(--muted)] uppercase tracking-wider block font-bold">
            SIDE B (TAILS)
          </label>
          <input
            type="text"
            maxLength={18}
            value={labelB}
            onChange={(e) => setLabelB(e.target.value.toUpperCase())}
            disabled={isFlipping}
            placeholder="OPTION 2"
            className="w-full bg-black border border-[var(--rule)] focus:border-[var(--accent)] text-xs text-[var(--accent)] px-2 py-1.5 font-black tracking-wide outline-none text-center rounded-none transition-colors"
          />
        </div>
      </div>

      {/* 3D Coin Workspace */}
      <div className={`flex flex-col justify-center items-center relative bg-black/45 border border-[var(--rule)] transition-all ${noWrapper ? 'py-4 min-h-[170px]' : 'py-8 min-h-[220px]'}`}>
        
        {/* CSS 3D Perspective container */}
        <div 
          className="w-24 h-24 cursor-pointer focus-ring outline-none rounded-full"
          onClick={flipCoin}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-label="Tap to flip coin"
          ref={coinRef}
          style={{ perspective: '1000px' }}
        >
          {/* Flipper Card */}
          <div 
            className="w-full h-full relative rounded-full transition-transform duration-[800ms]"
            style={{ 
              transformStyle: 'preserve-3d',
              transform: `rotateY(${rotationDegrees}deg)`,
              transition: isFlipping && !reducedMotion ? 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'none'
            }}
          >
            {/* FRONT FACE (Side A) */}
            <div 
              className="absolute inset-0 rounded-full border-2 border-[var(--fg)] bg-[#121215] flex flex-col items-center justify-center p-2 text-center shadow-lg backface-hidden"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="w-18 h-18 rounded-full border border-dashed border-[var(--rule)] flex flex-col items-center justify-center p-1.5">
                <span className="text-[8px] font-mono tracking-widest text-[var(--muted)] select-none uppercase">PUSH</span>
                <span className="text-[11px] font-black tracking-tight text-white uppercase break-all mt-0.5 leading-tight select-none">
                  {labelA || "HEADS"}
                </span>
              </div>
            </div>

            {/* BACK FACE (Side B) */}
            <div 
              className="absolute inset-0 rounded-full border-2 border-[var(--accent)] bg-[#0c0c0e] flex flex-col items-center justify-center p-2 text-center shadow-lg backface-hidden"
              style={{ 
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              <div className="w-18 h-18 rounded-full border border-dashed border-[var(--rule)] flex flex-col items-center justify-center p-1.5">
                <span className="text-[8px] font-mono tracking-widest text-[var(--accent)] select-none uppercase">REST</span>
                <span className="text-[11px] font-black tracking-tight text-[var(--accent)] uppercase break-all mt-0.5 leading-tight select-none">
                  {labelB || "TAILS"}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Floating status */}
        {isFlipping && (
          <span className="absolute bottom-2 font-mono text-[9px] text-[var(--accent)] uppercase tracking-widest animate-pulse select-none">
            FLIPPING CHANNELS...
          </span>
        )}

        {!isFlipping && !gutFeedback && (
          <span className="absolute bottom-2 font-mono text-[9px] text-[var(--muted)] uppercase tracking-widest select-none animate-pulse-slow">
            [ TAP COIN TO FLIP ]
          </span>
        )}
      </div>

      {/* Gut Reaction Feedback Display */}
      {gutFeedback && (
        <div className={`border border-[var(--rule)] bg-black/30 animate-in fade-in slide-in-from-bottom-2 duration-300 ${noWrapper ? 'p-3' : 'p-4'}`}>
          <h4 className="text-[10px] font-mono font-bold text-[var(--accent)] uppercase tracking-widest flex items-center gap-1.5 border-b border-[var(--rule)] pb-1.5 mb-1.5">
            <Volume2 size={11} /> GUT-REACTION METRIC OUTPUT
          </h4>
          <p className="text-xs text-[var(--fg)] leading-relaxed font-sans">
            {gutFeedback}
          </p>
        </div>
      )}
    </div>
  );

  if (noWrapper) {
    return (
      <div className="flex flex-col justify-between h-full">
        {content}
      </div>
    );
  }

  return (
    <div className="bg-bg-primary/40 border border-[var(--rule)] p-6 md:p-8 shadow-[4px_4px_0px_var(--rule)] max-w-sm mx-auto">
      {content}
    </div>
  );
}
