"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Square, Clock, Eye, EyeOff, Info, AlertTriangle } from 'lucide-react';

export default function BrownNoiseLoop({ noWrapper = false }) {
  // Audio State
  const [audioActive, setAudioActive] = useState(false);
  const [volume, setVolume] = useState(0.3); // Safe default volume (30%)
  
  // Timer State
  const [timerActive, setTimerActive] = useState(true); // Default timer turned ON
  const [timerSeconds, setTimerSeconds] = useState(3600); // 60 minutes default (3600s)
  const [selectedDuration, setSelectedDuration] = useState(3600); // Track preset selection
  
  // Accessibility & Visuals
  const [disableVisuals, setDisableVisuals] = useState(false);
  
  // Audio Refs
  const audioContextRef = useRef(null);
  const gainNodeRef = useRef(null);
  const bufferSourceRef = useRef(null);
  const analyserNodeRef = useRef(null);
  
  // Animation & Clock Refs
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const timerIntervalRef = useRef(null);

  // 1. Web Audio Brownian Synthesizer
  const startBrownianNoise = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      audioContextRef.current = ctx;

      // Generate 10 seconds of high-fidelity Brownian noise buffer (which loops seamlessly)
      const bufferSize = 10 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // First-order integrator formula for true Brownian (1/f^2) red noise
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // Compounding gain adjustment for cozy level
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      // Warm low-pass filter to clean higher frequencies and provide a heavy, comforting rumble
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(150, ctx.currentTime); // Low cozy rumbly cutoff

      // Analyser node for our live premium wave visualization
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyserNodeRef.current = analyser;

      // Gain controls with safe ramp-up to prevent click/pop triggers
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0, ctx.currentTime); // Start at absolute zero
      
      // Connections: source -> filter -> analyser -> gain -> destination
      noiseSource.connect(filter);
      filter.connect(analyser);
      analyser.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Start sound
      noiseSource.start();
      
      // Gently ramp up the volume over 300ms for a sensory-safe fade-in
      gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.3);

      bufferSourceRef.current = noiseSource;
      gainNodeRef.current = gainNode;
      setAudioActive(true);

      // Start the canvas visualizer loop
      startVisualizer();

      // Start the countdown timer if it's active
      if (timerActive) {
        startTimerCountdown();
      }
    } catch (err) {
      console.error("Failed to synthesize Brownian Noise:", err);
    }
  };

  const stopBrownianNoise = () => {
    // Stop countdown timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    // Cancel visualizer animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    const ctx = audioContextRef.current;
    const gain = gainNodeRef.current;
    const source = bufferSourceRef.current;

    if (ctx && gain && source) {
      try {
        // Safe sensory fade-out: Ramp volume to zero over 250ms before stopping source to avoid audio clicks
        gain.gain.cancelScheduledValues(ctx.currentTime);
        gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.25);

        setTimeout(() => {
          try {
            source.stop();
            ctx.close();
          } catch (e) {}
        }, 300);
      } catch (err) {
        console.warn("Error during audio teardown:", err);
      }
    }

    bufferSourceRef.current = null;
    gainNodeRef.current = null;
    audioContextRef.current = null;
    analyserNodeRef.current = null;
    setAudioActive(false);
  };

  const togglePlayback = () => {
    if (audioActive) {
      stopBrownianNoise();
    } else {
      startBrownianNoise();
    }
  };

  // 2. Volume Adjuster with safe ramp
  useEffect(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      const ctx = audioContextRef.current;
      gainNodeRef.current.gain.cancelScheduledValues(ctx.currentTime);
      gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, ctx.currentTime);
      gainNodeRef.current.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.1);
    }
  }, [volume]);

  // 3. Tactile Timer System
  const startTimerCountdown = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    
    timerIntervalRef.current = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
          // Time is up! Gently stop noise
          stopBrownianNoise();
          
          // Trigger a beautiful low auditory completion tone
          triggerCompletionTone();
          
          return selectedDuration; // Reset to the previously active duration
        }
        return prev - 1;
      });
    }, 1000);
  };

  const triggerCompletionTone = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle'; // Warm, soft sound
      osc.frequency.setValueAtTime(220, ctx.currentTime); // Low comforting pitch (A3)
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.8); // Drop pitch down
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {}
  };

  const handleTimerToggle = () => {
    const nextTimerActive = !timerActive;
    setTimerActive(nextTimerActive);
    
    if (audioActive) {
      if (nextTimerActive) {
        startTimerCountdown();
      } else {
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }
      }
    }
  };

  const handlePresetSelect = (secs) => {
    setSelectedDuration(secs);
    setTimerSeconds(secs);
    
    if (audioActive && timerActive) {
      // Restart countdown with fresh value
      startTimerCountdown();
    }
  };

  const formatTimerDisplay = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  // 4. Live HTML5 Canvas Waveform Visualizer
  const startVisualizer = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = analyserNodeRef.current;
    if (!analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!analyserNodeRef.current || !canvasRef.current) return;
      animationFrameRef.current = requestAnimationFrame(draw);

      const width = canvas.width;
      const height = canvas.height;

      analyser.getByteTimeDomainData(dataArray);

      // Extract colors dynamically from CSS variables so it shifts themes perfectly!
      const compStyle = getComputedStyle(canvas);
      const accentColor = compStyle.getPropertyValue('--accent').trim() || '#FF2E88';
      const ruleColor = compStyle.getPropertyValue('--rule').trim() || '#1F1F22';

      ctx.clearRect(0, 0, width, height);

      // Draw subtle grid guides
      ctx.strokeStyle = ruleColor;
      ctx.lineWidth = 1;
      
      // Horizontal center line
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Horizontal quarter guides
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, height / 4);
      ctx.lineTo(width, height / 4);
      ctx.moveTo(0, (3 * height) / 4);
      ctx.lineTo(width, (3 * height) / 4);
      ctx.stroke();
      ctx.setLineDash([]); // Reset line dash

      if (disableVisuals) {
        // Draw static gentle sine curve if animations are disabled
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let x = 0; x < width; x++) {
          const y = height / 2 + Math.sin(x * 0.02) * 4;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        return;
      }

      // Draw active dynamic low-frequency waveform
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 3;
      ctx.shadowColor = accentColor;
      ctx.shadowBlur = 4;
      ctx.beginPath();

      const sliceWidth = width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0; // Normalized wave amplitude
        const y = (v * height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(width, height / 2);
      ctx.stroke();
      ctx.shadowBlur = 0; // Reset shadow
    };

    draw();
  };

  // 5. Lifecycle Listeners (Reduced Motion & Cleanups)
  useEffect(() => {
    // Detect system reduced motion configuration
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) {
      setDisableVisuals(true);
    }

    const handleMotionChange = (e) => {
      if (e.matches) {
        setDisableVisuals(true);
      }
    };
    
    motionQuery.addEventListener('change', handleMotionChange);

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  // Cleanup audio node on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        // Clean up audio nodes safely
        const source = bufferSourceRef.current;
        const ctx = audioContextRef.current;
        if (source) {
          try { source.stop(); } catch(e){}
        }
        if (ctx) {
          try { ctx.close(); } catch(e){}
        }
      }
    };
  }, []);

  // Sync canvas size on mount / state shifts
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.parentElement.clientWidth || 380;
      canvas.height = 100;
      if (audioActive) {
        startVisualizer();
      } else {
        // Draw static grid when offline
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const compStyle = getComputedStyle(canvas);
          const ruleColor = compStyle.getPropertyValue('--rule').trim() || '#1F1F22';
          const mutedColor = compStyle.getPropertyValue('--muted').trim() || '#8A8A93';
          
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.strokeStyle = ruleColor;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(0, canvas.height / 2);
          ctx.lineTo(canvas.width, canvas.height / 2);
          ctx.stroke();
          
          // Small dots at center
          ctx.fillStyle = mutedColor;
          ctx.font = '9px monospace';
          ctx.fillText("ENGINE OFFLINE · STANDBY", 12, canvas.height / 2 - 8);
        }
      }
    }
  }, [audioActive, disableVisuals]);

  const content = (
    <div className="space-y-6 select-none font-sans">
      {/* Header and Brand Bar */}
      <div className="flex items-center justify-between border-b border-[var(--rule)] pb-4">
        <h3 className="text-lg font-black uppercase tracking-wider text-[var(--fg)] flex items-center gap-2">
          <Volume2 size={18} className="text-[var(--accent)] animate-pulse" /> BROWN NOISE LOOP
        </h3>
        <span className="text-xs font-mono text-[var(--muted)] uppercase border border-[var(--rule)] px-2 py-0.5 tracking-wider">
          SYNTH
        </span>
      </div>

      {/* Dynamic Wave Visualizer Canvas */}
      <div className="w-full bg-black/60 border border-[var(--rule)] overflow-hidden flex items-center justify-center p-0.5 relative group">
        <canvas 
          ref={canvasRef} 
          className="w-full h-[100px] bg-black block cursor-pointer transition-colors"
          title={audioActive ? "Live Brownian soundwave feedback" : "Synthesizer standing by"}
          onClick={togglePlayback}
        />
        
        {/* Toggle visual anim button */}
        <button
          onClick={() => setDisableVisuals(!disableVisuals)}
          className="absolute bottom-2 right-2 p-1.5 bg-black/80 hover:bg-black border border-[var(--rule)] hover:border-[var(--accent)] text-[var(--muted)] hover:text-[var(--fg)] transition-all cursor-pointer select-none rounded-none"
          title={disableVisuals ? "Enable waveform animation" : "Mute visual animation (Sensory Friendly)"}
        >
          {disableVisuals ? <Eye size={12} /> : <EyeOff size={12} />}
        </button>
      </div>

      {/* Main Controls Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        
        {/* Playback & Volume Grid */}
        <div className="flex flex-col justify-between border border-[var(--rule)] bg-black/20 p-4 shadow-sm">
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[var(--muted)] font-mono">
              AUDIO EMISSION
            </h4>
            
            <button
              onClick={togglePlayback}
              className={`w-full py-4 font-black uppercase text-xs tracking-widest border transition-all flex items-center justify-center gap-2.5 cursor-pointer rounded-none active:scale-[0.99] ${
                audioActive 
                  ? 'bg-transparent text-red-500 border-red-500/80 hover:bg-red-500/5' 
                  : 'bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)] hover:bg-[var(--accent)]/90 shadow-[2px_2px_0px_rgba(0,0,0,0.2)]'
              }`}
            >
              {audioActive ? (
                <>
                  <Square size={14} fill="currentColor" /> DEACTIVATE DRONE
                </>
              ) : (
                <>
                  <Play size={14} fill="currentColor" /> EMIT BROWN NOISE
                </>
              )}
            </button>
          </div>

          <div className="space-y-2 pt-4 border-t border-[var(--rule)]/60 mt-4 md:mt-0">
            <div className="flex justify-between items-center text-xs font-mono text-[var(--muted)] uppercase tracking-wider">
              <span>VOLUME INTENSITY</span>
              <span className="font-bold text-[var(--fg)]">{Math.round(volume * 100)}%</span>
            </div>
            
            <div className="flex items-center gap-3">
              <input 
                type="range" 
                min="0.05" 
                max="0.8" 
                step="0.01" 
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="flex-1 accent-[var(--accent)] h-1.5 bg-[var(--rule)] cursor-pointer rounded-none outline-none" 
                aria-label="Brown noise volume slider"
              />
            </div>
          </div>
        </div>

        {/* Tactical Focus Timer Grid */}
        <div className="flex flex-col justify-between border border-[var(--rule)] bg-black/20 p-4 shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-[var(--muted)] font-mono flex items-center gap-1">
                <Clock size={12} className="text-[var(--accent)]" /> TIMER BLOCK
              </h4>
              <button
                onClick={handleTimerToggle}
                className={`text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 border cursor-pointer select-none transition-all ${
                  timerActive 
                    ? 'border-accent-pink/40 bg-accent-pink-soft text-[var(--accent)]' 
                    : 'border-[var(--rule)] text-[var(--muted)] hover:border-[var(--muted)]/50'
                }`}
              >
                {timerActive ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>

            {/* Large Digital Counter */}
            <div className="bg-black/40 border border-[var(--rule)] px-4 py-2.5 flex items-center justify-between">
              <span className={`text-3xl font-black font-display tracking-tight leading-none ${timerActive ? 'text-[var(--fg)]' : 'text-[var(--muted)]/40 line-through'}`}>
                {formatTimerDisplay(timerSeconds)}
              </span>
              <span className="text-xs font-mono text-[var(--muted)] uppercase tracking-widest text-right">
                {audioActive && timerActive ? 'COUNTING' : 'READY'}
              </span>
            </div>
          </div>

          {/* Quick presets */}
          <div className="pt-4 border-t border-[var(--rule)]/60 mt-4 md:mt-0 space-y-2">
            <span className="text-xs font-mono text-[var(--muted)] uppercase tracking-wider block font-bold">
              PRESET DURATION TIMEBOX:
            </span>
            <div className="grid grid-cols-4 gap-1.5">
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
                    className={`py-1.5 text-xs font-mono font-black border transition-all cursor-pointer rounded-none disabled:opacity-30 disabled:cursor-not-allowed uppercase ${
                      isActive && timerActive
                        ? 'border-[var(--accent)] text-[var(--accent)] bg-accent-pink-soft'
                        : 'border-[var(--rule)] text-[var(--muted)] hover:border-[var(--muted)]/80 hover:text-[var(--fg)] bg-transparent'
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

      {/* Safety & Accessibility Advisory Banner */}
      <div className="border border-amber-500/20 bg-amber-500/5 p-4 flex gap-3 text-left leading-normal font-sans">
        <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1.5">
          <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest block select-none">
            SENSORY AUDIT NOTE
          </span>
          <p className="text-sm text-[var(--muted)] leading-relaxed font-sans">
            Volume defaults to 30%. Tone is heavily low-passed around 150Hz. If you suffer from tinnitus that escalates under heavy low frequencies, low noise may increase ring feedback. Consider transitioning to the <a href="/labs/acoustic-shield" className="text-[var(--fg)] hover:text-[var(--accent)] underline font-bold">Acoustic Shield</a> to dynamically blend higher frequency channels instead.
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
    <div className="bg-bg-primary/40 border border-[var(--rule)] p-6 md:p-8 flex flex-col justify-between shadow-[4px_4px_0px_var(--rule)] max-w-lg mx-auto">
      {content}
    </div>
  );
}
