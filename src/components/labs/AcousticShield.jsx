"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Square, Clock, Headphones, AlertTriangle, ShieldAlert, Sliders } from 'lucide-react';

export default function AcousticShield({ noWrapper = false }) {
  // Audio State
  const [audioActive, setAudioActive] = useState(false);
  const [masterVolume, setMasterVolume] = useState(0.25); // Master Volume
  const [baseVolume, setBaseVolume] = useState(0.3); // Deep Brownian rumble volume
  const [midVolume, setMidVolume] = useState(0.15); // Mid-frequency hum volume
  
  // Binaural Beat Mode State
  const [binauralActive, setBinauralActive] = useState(false);
  const [binauralVolume, setBinauralVolume] = useState(0.08); // Binaural carriers volume

  // Timer State
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(1800); // Default 30 mins
  const [selectedDuration, setSelectedDuration] = useState(1800);

  // Audio Graph Refs
  const audioContextRef = useRef(null);
  const masterGainRef = useRef(null);
  
  // Synthesized Sources Refs
  const baseSourceRef = useRef(null);
  const baseGainRef = useRef(null);
  
  const midSourceRef = useRef(null);
  const midGainRef = useRef(null);
  
  const oscLeftRef = useRef(null);
  const oscRightRef = useRef(null);
  const binauralGainRef = useRef(null);

  // Timer Interval Ref
  const timerIntervalRef = useRef(null);

  // 1. Synthesize Multichannel Soundscape
  const startShield = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      audioContextRef.current = ctx;

      // Master Gain for safe ramps
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      // --- LAYER A: DEEP BROWNIAN RUMBLE (10s Buffer) ---
      const bufferSize = 10 * ctx.sampleRate;
      const brownBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const brownOutput = brownBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        brownOutput[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = brownOutput[i];
        brownOutput[i] *= 3.5; // Compounding volume gain
      }

      const baseSource = ctx.createBufferSource();
      baseSource.buffer = brownBuffer;
      baseSource.loop = true;

      const baseFilter = ctx.createBiquadFilter();
      baseFilter.type = 'lowpass';
      baseFilter.frequency.setValueAtTime(140, ctx.currentTime); // Deep warm roll-off

      const baseGain = ctx.createGain();
      baseGain.gain.setValueAtTime(baseVolume, ctx.currentTime);

      baseSource.connect(baseFilter);
      baseFilter.connect(baseGain);
      baseGain.connect(masterGain);
      
      baseSource.start();
      baseSourceRef.current = baseSource;
      baseGainRef.current = baseGain;

      // --- LAYER B: MID-FREQUENCY HUM (Filtered White Noise) ---
      const whiteBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const whiteOutput = whiteBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        whiteOutput[i] = Math.random() * 2 - 1;
      }

      const midSource = ctx.createBufferSource();
      midSource.buffer = whiteBuffer;
      midSource.loop = true;

      const midFilter = ctx.createBiquadFilter();
      midFilter.type = 'bandpass'; // Squeeze frequencies for air hum (voice masking)
      midFilter.frequency.setValueAtTime(320, ctx.currentTime);
      midFilter.Q.setValueAtTime(1.5, ctx.currentTime);

      const midGain = ctx.createGain();
      midGain.gain.setValueAtTime(midVolume, ctx.currentTime);

      midSource.connect(midFilter);
      midFilter.connect(midGain);
      midGain.connect(masterGain);

      midSource.start();
      midSourceRef.current = midSource;
      midGainRef.current = midGain;

      // --- LAYER C: BINAURAL FOCUS BEATS (Theta 6Hz Entrainment) ---
      if (binauralActive) {
        setupBinauralBeats(ctx, masterGain);
      }

      // Safe sensory ramp master volume up over 350ms
      masterGain.gain.linearRampToValueAtTime(masterVolume, ctx.currentTime + 0.35);
      
      setAudioActive(true);

      // Start Timer countdown if active
      if (timerActive) {
        startTimerCountdown();
      }

    } catch (error) {
      console.error("Failed to build Acoustic Shield soundscape:", error);
    }
  };

  // Helper to construct Left/Right detuned Sine Oscillators
  const setupBinauralBeats = (ctx, masterGain) => {
    // Left Channel: 120Hz carrier panned hard left
    const oscLeft = ctx.createOscillator();
    oscLeft.type = 'sine';
    oscLeft.frequency.setValueAtTime(120, ctx.currentTime);

    const panLeft = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    if (panLeft) panLeft.pan.setValueAtTime(-1, ctx.currentTime);

    // Right Channel: 126Hz carrier (6Hz Theta entrainment difference) panned hard right
    const oscRight = ctx.createOscillator();
    oscRight.type = 'sine';
    oscRight.frequency.setValueAtTime(126, ctx.currentTime);

    const panRight = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    if (panRight) panRight.pan.setValueAtTime(1, ctx.currentTime);

    const binauralGain = ctx.createGain();
    binauralGain.gain.setValueAtTime(binauralVolume, ctx.currentTime);

    // Connections
    if (panLeft && panRight) {
      oscLeft.connect(panLeft);
      panLeft.connect(binauralGain);
      
      oscRight.connect(panRight);
      panRight.connect(binauralGain);
    } else {
      // Fallback if Panner is not supported in browser
      oscLeft.connect(binauralGain);
      oscRight.connect(binauralGain);
    }

    binauralGain.connect(masterGain);

    oscLeft.start();
    oscRight.start();

    oscLeftRef.current = oscLeft;
    oscRightRef.current = oscRight;
    binauralGainRef.current = binauralGain;
  };

  const teardownBinauralBeats = () => {
    if (oscLeftRef.current) {
      try { oscLeftRef.current.stop(); } catch(e){}
      oscLeftRef.current = null;
    }
    if (oscRightRef.current) {
      try { oscRightRef.current.stop(); } catch(e){}
      oscRightRef.current = null;
    }
    binauralGainRef.current = null;
  };

  const stopShield = () => {
    // Clear timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    const ctx = audioContextRef.current;
    const masterGain = masterGainRef.current;

    if (ctx && masterGain) {
      try {
        // Fade Master to absolute zero over 300ms to prevent audio pop/click trigger
        masterGain.gain.cancelScheduledValues(ctx.currentTime);
        masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
        masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.25);

        setTimeout(() => {
          try {
            if (baseSourceRef.current) baseSourceRef.current.stop();
            if (midSourceRef.current) midSourceRef.current.stop();
            teardownBinauralBeats();
            ctx.close();
          } catch(e){}
        }, 280);
      } catch (err) {
        console.warn("Error during audio cleanup:", err);
      }
    }

    baseSourceRef.current = null;
    midSourceRef.current = null;
    masterGainRef.current = null;
    audioContextRef.current = null;
    setAudioActive(false);
  };

  const togglePlayback = () => {
    if (audioActive) stopShield();
    else startShield();
  };

  // --- Dynamic Volume Mix Synchronization ---
  useEffect(() => {
    if (masterGainRef.current && audioContextRef.current) {
      const ctx = audioContextRef.current;
      masterGainRef.current.gain.linearRampToValueAtTime(masterVolume, ctx.currentTime + 0.1);
    }
  }, [masterVolume]);

  useEffect(() => {
    if (baseGainRef.current && audioContextRef.current) {
      const ctx = audioContextRef.current;
      baseGainRef.current.gain.linearRampToValueAtTime(baseVolume, ctx.currentTime + 0.1);
    }
  }, [baseVolume]);

  useEffect(() => {
    if (midGainRef.current && audioContextRef.current) {
      const ctx = audioContextRef.current;
      midGainRef.current.gain.linearRampToValueAtTime(midVolume, ctx.currentTime + 0.1);
    }
  }, [midVolume]);

  useEffect(() => {
    if (audioActive && audioContextRef.current) {
      const ctx = audioContextRef.current;
      if (binauralActive) {
        if (!oscLeftRef.current && masterGainRef.current) {
          // Construct Binaural oscillators on the fly
          setupBinauralBeats(ctx, masterGainRef.current);
        } else if (binauralGainRef.current) {
          binauralGainRef.current.gain.linearRampToValueAtTime(binauralVolume, ctx.currentTime + 0.1);
        }
      } else {
        teardownBinauralBeats();
      }
    }
  }, [binauralActive, binauralVolume, audioActive]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (audioContextRef.current) {
        try {
          if (baseSourceRef.current) baseSourceRef.current.stop();
          if (midSourceRef.current) midSourceRef.current.stop();
          if (oscLeftRef.current) oscLeftRef.current.stop();
          if (oscRightRef.current) oscRightRef.current.stop();
          audioContextRef.current.close();
        } catch(e){}
      }
    };
  }, []);

  // --- Timer Operations ---
  const startTimerCountdown = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    
    timerIntervalRef.current = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
          stopShield();
          triggerSoftAlert();
          return selectedDuration;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const triggerSoftAlert = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.0);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.0);
    } catch(e){}
  };

  const handleTimerToggle = () => {
    const nextTimerActive = !timerActive;
    setTimerActive(nextTimerActive);
    
    if (audioActive) {
      if (nextTimerActive) startTimerCountdown();
      else if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }
  };

  const handlePresetSelect = (secs) => {
    setSelectedDuration(secs);
    setTimerSeconds(secs);
    if (audioActive && timerActive) startTimerCountdown();
  };

  const formatTimerDisplay = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const content = (
    <div className="space-y-6 select-none font-sans text-left">
      {/* Brand Header */}
      <div className="flex items-center justify-between border-b border-[var(--rule)] pb-4">
        <h3 className="text-lg font-black uppercase tracking-wider text-[var(--fg)] flex items-center gap-2">
          <ShieldAlert size={18} className="text-[var(--accent)]" /> ACOUSTIC SHIELD
        </h3>
        <span className="text-xs font-mono text-[var(--muted)] uppercase border border-[var(--rule)] px-2 py-0.5 tracking-wider">
          SYNTH
        </span>
      </div>

      <p className="text-sm text-[var(--muted)] leading-relaxed">
        Unpredictable ambient noise is the single greatest disruptor for sensory-sensitive and neurodivergent thinking systems. This advanced Acoustic Shield allows you to blend deep Brownian rumble, a soft office voice-masker mid-frequency drone, and binaural beats.
      </p>

      {/* Main Synthesizer Control Switch */}
      <button
        onClick={togglePlayback}
        className={`w-full py-4 font-black uppercase text-xs tracking-widest border transition-all flex items-center justify-center gap-2.5 cursor-pointer rounded-none active:scale-[0.99] ${
          audioActive 
            ? 'bg-transparent text-red-500 border-red-500/80 hover:bg-red-500/5' 
            : 'bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)] hover:bg-[var(--accent)]/90'
        }`}
      >
        {audioActive ? (
          <>
            <Square size={14} fill="currentColor" /> DEACTIVATE ACOUSTIC SHIELD
          </>
        ) : (
          <>
            <Play size={14} fill="currentColor" /> ACTIVATE ACOUSTIC SHIELD
          </>
        )}
      </button>

      {/* Mixer channels & details grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Side: Mixer Sliders */}
        <div className="space-y-4 border border-[var(--rule)] bg-black/20 p-4 shadow-inner">
          <span className="text-xs font-mono text-[var(--muted)] uppercase tracking-widest flex items-center gap-1.5 font-bold">
            <Sliders size={12} className="text-[var(--accent)]" /> AUDIO MIXER
          </span>

          {/* Slider 1: Master Gain */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-mono text-[var(--muted)] font-bold">
              <span>MASTER GAIN</span>
              <span>{Math.round(masterVolume * 100)}%</span>
            </div>
            <input 
              type="range" min="0" max="0.6" step="0.01" value={masterVolume}
              onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
              aria-label="Master Volume Control"
              className="w-full accent-[var(--accent)] h-1.5 bg-[var(--rule)] cursor-pointer rounded-none outline-none"
            />
          </div>

          {/* Slider 2: Base Brownian Rumble */}
          <div className="space-y-1 pt-2 border-t border-[var(--rule)]/60">
            <div className="flex justify-between items-center text-xs font-mono text-[var(--muted)]">
              <span>CHANNEL A · BROWNIAN RUMBLE</span>
              <span>{Math.round(baseVolume * 100)}%</span>
            </div>
            <input 
              type="range" min="0" max="0.6" step="0.01" value={baseVolume}
              onChange={(e) => setBaseVolume(parseFloat(e.target.value))}
              aria-label="Channel A: Brownian Rumble Volume"
              className="w-full accent-[var(--accent)] h-1.5 bg-[var(--rule)] cursor-pointer rounded-none outline-none"
            />
          </div>

          {/* Slider 3: Mid-Frequency Hum */}
          <div className="space-y-1 pt-2 border-t border-[var(--rule)]/60">
            <div className="flex justify-between items-center text-xs font-mono text-[var(--muted)]">
              <span>CHANNEL B · VOICE MASKING AIR-HUM</span>
              <span>{Math.round(midVolume * 100)}%</span>
            </div>
            <input 
              type="range" min="0" max="0.5" step="0.01" value={midVolume}
              onChange={(e) => setMidVolume(parseFloat(e.target.value))}
              aria-label="Channel B: Voice Masking Air-Hum Volume"
              className="w-full accent-[var(--accent)] h-1.5 bg-[var(--rule)] cursor-pointer rounded-none outline-none"
            />
          </div>
        </div>

        {/* Right Side: Advanced Binaural Mode & Session Timer */}
        <div className="space-y-4 border border-[var(--rule)] bg-black/20 p-4 flex flex-col justify-between">
          
          {/* Binaural beats toggle */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[var(--muted)] uppercase tracking-widest flex items-center gap-1.5 font-bold">
                <Headphones size={12} className="text-[var(--accent)]" /> BINAURAL FOCUS MODE
              </span>
              <button
                onClick={() => setBinauralActive(!binauralActive)}
                className={`text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 border cursor-pointer select-none transition-all ${
                  binauralActive 
                    ? 'border-accent-pink/40 bg-accent-pink-soft text-[var(--accent)] shadow-[1px_1px_0px_var(--accent)]' 
                    : 'border-[var(--rule)] text-[var(--muted)] hover:border-[var(--muted)]/50'
                }`}
              >
                {binauralActive ? 'ON (ACTIVE)' : 'OFF (PAUSED)'}
              </button>
            </div>

            {binauralActive && (
              <div className="space-y-2 animate-in fade-in duration-200">
                <div className="flex justify-between items-center text-xs font-mono text-[var(--muted)]">
                  <span>BINAURAL FOCUS INTENSITY (THETA 6Hz BEAT)</span>
                  <span>{Math.round(binauralVolume * 100)}%</span>
                </div>
                <input 
                  type="range" min="0.01" max="0.25" step="0.01" value={binauralVolume}
                  onChange={(e) => setBinauralVolume(parseFloat(e.target.value))}
                  aria-label="Binaural Focus Intensity Volume"
                  className="w-full accent-[var(--accent)] h-1.5 bg-[var(--rule)] cursor-pointer rounded-none outline-none"
                />
                <span className="text-xs md:text-sm font-mono text-amber-500 uppercase tracking-widest block font-bold leading-normal">
                  ⚠️ HEADPHONES REQUIRED · BINAURAL MODE WILL NOT WORK ON SPEAKERS.
                </span>
              </div>
            )}
          </div>

          {/* Session countdown timer */}
          <div className="space-y-2 pt-3 border-t border-[var(--rule)]/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[var(--muted)] uppercase tracking-wider block font-bold">SESSION TIMER TIMEBOX:</span>
              <button
                onClick={handleTimerToggle}
                className={`text-xs md:text-sm font-mono font-bold uppercase tracking-widest px-1.5 py-0.5 border cursor-pointer select-none ${
                  timerActive ? 'border-accent-pink-soft bg-accent-pink-soft text-[var(--accent)]' : 'border-[var(--rule)] text-[var(--muted)]'
                }`}
              >
                {timerActive ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-black font-display tracking-tight leading-none min-w-[70px] ${timerActive ? 'text-white' : 'text-[var(--muted)]/30 line-through'}`}>
                {formatTimerDisplay(timerSeconds)}
              </span>
              
              <div className="grid grid-cols-4 gap-1.5 flex-1">
                {[
                  { label: '15m', val: 900 },
                  { label: '30m', val: 1800 },
                  { label: '60m', val: 3600 },
                  { label: '90m', val: 5400 }
                ].map((preset) => {
                  const isActive = selectedDuration === preset.val;
                  return (
                    <button
                      key={preset.label}
                      onClick={() => handlePresetSelect(preset.val)}
                      disabled={!timerActive}
                      className={`py-1 text-xs font-mono border transition-all cursor-pointer rounded-none disabled:opacity-30 disabled:cursor-not-allowed uppercase ${
                        isActive && timerActive
                          ? 'border-[var(--accent)] text-[var(--accent)] bg-accent-pink-soft'
                          : 'border-[var(--rule)] text-[var(--muted)] hover:border-white hover:text-white bg-transparent'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Safety & Advisory Board Section */}
      <div className="border border-red-500/20 bg-red-500/5 p-4 flex gap-3 text-left leading-normal font-sans">
        <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
        <div className="space-y-1.5">
          <span className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest block select-none">
            CRITICAL SENSORY & SAFETY ADVISORY
          </span>
          <p className="text-sm text-[var(--muted)] leading-relaxed font-sans">
            1. <strong>Do not operate machinery or drive</strong> while using Binaural Focus Mode. Binaural entrainment induces focused theta brainwave loops which restrict peripheral speed alertness.
          </p>
          <p className="text-sm text-[var(--muted)] leading-relaxed font-sans">
            2. <strong>Epilepsy & Sound Migraine Warning</strong>: If you have a clinical history of seizures, epilepsy, or chronic migraines triggered by sustained high/low frequency binaural hums, do not activate binaural beats without consulting a medical professional.
          </p>
          <p className="text-sm text-[var(--muted)] leading-relaxed font-sans">
            3. All soundwaves are generated locally inside your browser cache. No audio is streamed or recorded.
          </p>
        </div>
      </div>
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
    <div className="bg-bg-primary/40 border border-[var(--rule)] p-6 md:p-8 shadow-[4px_4px_0px_var(--rule)] max-w-3xl mx-auto">
      {content}
    </div>
  );
}
