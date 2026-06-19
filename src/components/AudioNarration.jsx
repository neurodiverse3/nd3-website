"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Play, Pause, RotateCcw, FastForward } from 'lucide-react';

export const AudioNarration = ({ compact = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(1); // 1x standard, customizable up to 2x for fast brains!
  const [supported, setSupported] = useState(true);
  const utteranceRef = useRef(null);
  const textChunksRef = useRef([]);
  const currentChunkRef = useRef(0);

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.speechSynthesis) {
      setSupported(false);
    }
    
    // Clean up speech when unmounting
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const rates = [1, 1.25, 1.5, 1.75, 2];

  const cycleRate = () => {
    const nextIdx = (rates.indexOf(rate) + 1) % rates.length;
    const newRate = rates[nextIdx];
    setRate(newRate);
    
    // If playing, apply the rate change dynamically by pausing and restarting
    if (isPlaying && typeof window !== 'undefined') {
      window.speechSynthesis.cancel();
      playNextChunk(currentChunkRef.current, newRate);
    }
  };

  const playNextChunk = (index, speakRate = rate) => {
    if (index >= textChunksRef.current.length) {
      setIsPlaying(false);
      setIsPaused(false);
      return;
    }

    currentChunkRef.current = index;
    const text = textChunksRef.current[index];
    
    if (!text.trim()) {
      playNextChunk(index + 1, speakRate);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speakRate;
    utterance.pitch = 1.0;
    
    // Try to select a natural local English voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      (v.lang.startsWith('en-GB') || v.lang.startsWith('en-US')) && v.name.toLowerCase().includes('google')
    ) || voices.find(v => v.lang.startsWith('en'));
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      // Play next chunk if we haven't stopped
      if (utteranceRef.current === utterance) {
        playNextChunk(index + 1, speakRate);
      }
    };

    utterance.onerror = (e) => {
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        console.error('Speech synthesis error:', e);
        // Try to continue
        if (utteranceRef.current === utterance) {
           playNextChunk(index + 1, speakRate);
        }
      }
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const speak = (speakRate = rate) => {
    try {
      const paragraphs = document.querySelectorAll('#blog-content p, #blog-content h2, #blog-content h3');
      if (paragraphs.length === 0) return;

      const chunks = Array.from(paragraphs)
        .map(p => p.textContent.trim())
        .filter(text => text.length > 0);

      textChunksRef.current = chunks;
      currentChunkRef.current = 0;

      window.speechSynthesis.cancel(); // Stop any current speech first
      playNextChunk(0, speakRate);
    } catch (err) {
      console.error('Narration failed:', err);
    }
  };

  const toggleNarration = () => {
    if (!supported || typeof window === 'undefined') return;

    const synth = window.speechSynthesis;
    // Check if it's actually speaking to resync state just in case
    if (isPlaying) {
      if (isPaused) {
        synth.resume();
        setIsPaused(false);
      } else {
        synth.pause();
        setIsPaused(true);
      }
    } else {
      speak();
    }
  };

  const stopNarration = () => {
    if (!supported || typeof window === 'undefined') return;
    
    utteranceRef.current = null; // Clear ref so onend doesn't trigger next
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    currentChunkRef.current = 0;
  };

  if (!supported) return null;

  return (
    <div className={`flex ${compact ? 'flex-col items-start gap-3 p-4 bg-black/15 border border-border-rule/60' : 'flex-wrap items-center gap-3 p-3 bg-bg-primary/50 border border-border-rule'} rounded-none shadow-[2px_2px_0px_var(--rule)]`}>
      <span className="text-[9.5px] font-mono tracking-widest text-text-muted uppercase font-black flex items-center gap-1.5 ml-0.5">
        {isPlaying && !isPaused ? (
          <span className="audio-wave active text-accent-pink shrink-0" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </span>
        ) : (
          <Volume2 size={12} className={`text-accent-pink ${isPlaying && isPaused ? 'animate-pulse-slow' : ''} shrink-0`} />
        )}
        {isPlaying ? (isPaused ? 'PAUSED' : 'NARRATING...') : 'AUDIO NARRATION'}
      </span>
      
      <div className={`flex items-center gap-2 ${compact ? 'w-full justify-between' : 'ml-auto'}`}>
        {/* Play / Pause Toggle Button */}
        <button
          onClick={toggleNarration}
          className={`h-8 ${compact ? 'flex-grow justify-center' : 'px-3'} border border-border-rule/70 hover:border-accent-pink flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer rounded-none bg-transparent ${
            isPlaying && !isPaused ? 'text-accent-pink border-accent-pink animate-pulse-slow' : 'text-text-muted hover:text-fg-primary hover:border-accent-pink'
          }`}
          aria-label={isPlaying ? (isPaused ? 'Resume narration' : 'Pause narration') : 'Play narration'}
        >
          {isPlaying && !isPaused ? (
            <>
              <Pause size={10} strokeWidth={3} /> {compact ? 'PAUSE' : 'Pause'}
            </>
          ) : (
            <>
              <Play size={10} strokeWidth={3} /> {compact ? 'PLAY' : 'Play'}
            </>
          )}
        </button>

        {/* Speed rate selection */}
        <button
          onClick={cycleRate}
          className={`h-8 border border-border-rule/70 hover:border-accent-pink text-[9px] font-black uppercase tracking-wider text-text-muted hover:text-fg-primary transition-all cursor-pointer rounded-none bg-transparent flex items-center justify-center gap-0.5 shrink-0 ${compact ? 'w-12' : 'px-2.5'}`}
          aria-label={`Change speech speed, current ${rate}x`}
        >
          {rate}x
        </button>

        {/* Stop button */}
        {(isPlaying || isPaused) && (
          <button
            onClick={stopNarration}
            className="h-8 w-8 border border-border-rule/70 hover:border-red-500 flex items-center justify-center text-text-muted hover:text-red-500 transition-all cursor-pointer rounded-none bg-transparent shrink-0"
            aria-label="Stop narration"
          >
            <RotateCcw size={10} strokeWidth={3} />
          </button>
        )}
      </div>
    </div>
  );
};

export default AudioNarration;
