"use client";
import React, { useState, useEffect } from 'react';
import { Eye, HelpCircle, ArrowRight, ArrowLeft, ClipboardList, RefreshCw, CheckCircle, Save } from 'lucide-react';
import { useLabLocalStorage } from '../../lib/useLabStorage';

const AUDIT_DOMAINS = [
  {
    key: 'light',
    title: 'LIGHT',
    eyebrow: 'DOMAIN 01 · VISUAL LUMINANCE',
    question: 'Rate your visual environment:',
    description: 'Look around. Assess brightness levels, high contrasts, screen glare, fluorescent light flicker, or harsh direct angles.'
  },
  {
    key: 'sound',
    title: 'SOUND',
    eyebrow: 'DOMAIN 02 · AUDITORY DENSITY',
    question: 'Rate your auditory environment:',
    description: 'Listen. Assess background hums, sudden noises, conversations you can hear, rhythmic clocks, or high pitch spikes.'
  },
  {
    key: 'temperature',
    title: 'TEMPERATURE',
    eyebrow: 'DOMAIN 03 · THERMAL REGULATION',
    question: 'Rate the room temperature:',
    description: 'Feel the air. Assess drafts, stuffiness, humidity, cold hands/feet, or overheating layers.'
  },
  {
    key: 'texture',
    title: 'TEXTURE',
    eyebrow: 'DOMAIN 04 · SOMATOSENSORY TACTILITY',
    question: 'Rate dress seams and surfaces:',
    description: 'Feel your skin. Assess itchy clothing tags, tight waistbands, stiff chair backing, or scratchy materials.'
  },
  {
    key: 'smell',
    title: 'SMELL',
    eyebrow: 'DOMAIN 05 · OLFACTORY STIMULATION',
    question: 'Rate active smells or air quality:',
    description: 'Inhale. Assess strong cooking aromas, musty air, strong colognes, cleaning chemicals, or stuffiness.'
  },
  {
    key: 'crowding',
    title: 'CROWDING',
    eyebrow: 'DOMAIN 06 · SPATIAL & VISUAL CLUTTER',
    question: 'Rate spatial crowding & motion:',
    description: 'Look at the space. Assess visual clutter on your desk, people walking past, traffic, or cramped space.'
  },
  {
    key: 'decision',
    title: 'DECISION LOAD',
    eyebrow: 'DOMAIN 07 · COGNITIVE OVERHEAD',
    question: 'Rate current decision fatigue:',
    description: 'Feel your brain. Assess the number of tiny choices you just made, tabs open, notifications, or upcoming priorities.'
  }
];

const RATING_SCALES = [
  { score: 0, label: 'FINE', desc: 'Neutral presence. No friction felt.' },
  { score: 1, label: 'NOTICEABLE', desc: 'Aware of it, but does not interrupt focus.' },
  { score: 2, label: 'UNCOMFORTABLE', desc: 'Draining energy. Pulls attention away.' },
  { score: 3, label: 'UNBEARABLE', desc: 'Painful/exhausting. Requires escape.' }
];

export default function SensoryAudit({ noWrapper = false }) {
  const { value: savedPermission, setValue: setSavedPermission } = useLabLocalStorage('nd3-audit-save-permission', false);
  const { value: savedRatings, setValue: setSavedRatings } = useLabLocalStorage('nd3-audit-last-ratings', null);

  const [currentStep, setCurrentStep] = useState(0);
  const [ratings, setRatings] = useState({
    light: 0,
    sound: 0,
    temperature: 0,
    texture: 0,
    smell: 0,
    crowding: 0,
    decision: 0
  });

  const [savedLocal, setSavedLocal] = useState(false);
  const [saveToBrowser, setSaveToBrowser] = useState(savedPermission);

  useEffect(() => {
    if (savedPermission) {
      setSaveToBrowser(true);
      if (savedRatings) {
        setRatings(savedRatings);
        setCurrentStep(7);
      }
    }
  }, []);

  const selectRating = (score) => {
    const domainKey = AUDIT_DOMAINS[currentStep].key;
    const nextRatings = { ...ratings, [domainKey]: score };
    setRatings(nextRatings);

    if (saveToBrowser) {
      setSavedRatings(nextRatings);
    }

    setTimeout(() => {
      setCurrentStep(prev => prev + 1);
    }, 200);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const handleRestart = () => {
    setRatings({
      light: 0,
      sound: 0,
      temperature: 0,
      texture: 0,
      smell: 0,
      crowding: 0,
      decision: 0
    });
    setCurrentStep(0);
    setSavedLocal(false);
    if (saveToBrowser) {
      setSavedRatings(null);
    }
  };

  const handleSaveToggle = () => {
    const nextVal = !saveToBrowser;
    setSaveToBrowser(nextVal);
    setSavedPermission(nextVal);

    if (nextVal) {
      setSavedRatings(ratings);
      setSavedLocal(true);
    } else {
      setSavedRatings(null);
      setSavedLocal(false);
    }
  };

  // Score Calculations
  const totalScore = Object.values(ratings).reduce((a, b) => a + b, 0);

  const getScoreClassification = () => {
    if (totalScore <= 4) {
      return {
        bracket: "0-4 · SAFE SENSORY BASING",
        color: "text-green-500 border-green-500/20 bg-green-500/5",
        summary: "You are sensory balanced. The 'wrong' or restless feeling you are experiencing is likely emotional fatigue, hunger, or executive task block, rather than sensory bombardment. Check your physical battery instead."
      };
    } else if (totalScore <= 10) {
      return {
        bracket: "5-10 · QUIET LEAK ACTIVE",
        color: "text-amber-500 border-amber-500/20 bg-amber-500/5",
        summary: "You are paying a quiet sensory tax. One or two specific friction points are draining your working memory in the background. Addressing your single largest drain will immediately unlock capacity."
      };
    } else {
      return {
        bracket: "11+ · SENSORY DEBT CRITICAL",
        color: "text-red-500 border-red-500/20 bg-red-500/5",
        summary: "You are in critical sensory overload. Your filter threshold is exhausted. The single most constructive action you can take right now is to leave the room, dim all immediate lights, and enter deep auditory shielding."
      };
    }
  };

  // Identify highest drain domain
  const getHighestDrainDomain = () => {
    let maxScore = -1;
    let maxDomain = null;

    AUDIT_DOMAINS.forEach(d => {
      if (ratings[d.key] > maxScore) {
        maxScore = ratings[d.key];
        maxDomain = d;
      }
    });

    return { domain: maxDomain, score: maxScore };
  };

  const getOTSuggestion = (key) => {
    switch (key) {
      case 'light':
        return "Put on tinted glasses, fully dim screen luminance grids, or transition immediately to indirect warm lamplight.";
      case 'sound':
        return "Deploy noise-cancelling headphones, trigger your Acoustic Shield lab, or seek a designated quiet room for 15 minutes.";
      case 'temperature':
        return "Open a draft window for ventilation, put on a weighted cozy hoodie, or wrap your hands around a warm beverage.";
      case 'texture':
        return "Change seams immediately, loosen tight collars or waistbands, or move from the stiff desk chair to a floor cushion.";
      case 'smell':
        return "Spritz a known safe/comfort fragrance, open windows to purge the air, or step outside for three full lung-resets.";
      case 'crowding':
        return "Shut your eyes completely for 120 seconds to halt visual tracking, clear immediate clutter into a drawer, or move to a low-traffic corner.";
      case 'decision':
        return "Declare a 30-minute absolute decision freeze. Lock down incoming tabs, close email channels, and commit to one tiny mechanical task.";
      default:
        return "Change one small element in your environment to break the sensory loop.";
    }
  };

  const classification = getScoreClassification();
  const highestDrain = getHighestDrainDomain();

  // Render stepped question
  const renderStep = () => {
    const domain = AUDIT_DOMAINS[currentStep];
    const progressPercent = Math.round(((currentStep) / 7) * 100);

    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        
        {/* Step Progress indicators */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-mono text-[var(--muted)]">
            <span className="font-bold text-[var(--accent)]">{domain.eyebrow}</span>
            <span>AUDIT PROGRESS: {progressPercent}%</span>
          </div>
          <div className="w-full h-1 bg-[var(--rule)]">
            <div 
              className="h-full bg-[var(--accent)] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Question Text block */}
        <div className="space-y-3">
          <span className="text-xs font-mono text-[var(--muted)] uppercase border border-[var(--rule)] px-2 py-0.5 inline-block">
            {domain.title} CHANNEL
          </span>
          <h4 className="text-xl md:text-2xl font-black uppercase text-[var(--fg)] font-display tracking-tight leading-tight">
            {domain.question}
          </h4>
          <p className="text-sm text-[var(--muted)] leading-relaxed font-sans">
            {domain.description}
          </p>
        </div>

        {/* Brutalist rating selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-2">
          {RATING_SCALES.map((scale) => {
            const isCurrentVal = ratings[domain.key] === scale.score;
            return (
              <button
                key={scale.score}
                onClick={() => selectRating(scale.score)}
                className={`p-4 border text-left cursor-pointer transition-all flex flex-col justify-between h-28 rounded-none ${
                  isCurrentVal
                    ? 'border-[var(--accent)] bg-accent-pink-soft text-white shadow-[2px_2px_0px_var(--accent)]'
                    : 'border-[var(--rule)] hover:border-[var(--muted)] bg-black/25 text-[var(--muted)] hover:text-white'
                }`}
              >
                <span className="font-mono text-2xl font-black">{scale.score}</span>
                <div className="space-y-0.5">
                  <span className={`text-xs font-mono font-bold block ${isCurrentVal ? 'text-[var(--accent)]' : 'text-white'}`}>
                    {scale.label}
                  </span>
                  <span className="text-xs leading-tight block text-[var(--muted)] font-normal">{scale.desc}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Wizard Controls */}
        <div className="flex justify-between items-center pt-4 border-t border-[var(--rule)]">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="px-4 py-2 border border-[var(--rule)] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[var(--fg)] text-xs font-mono uppercase tracking-wider flex items-center gap-1 cursor-pointer rounded-none text-white transition-colors"
          >
            <ArrowLeft size={12} /> BACK
          </button>
          
          <span className="font-mono text-xs text-[var(--muted)]">
            STEP {currentStep + 1} OF 7
          </span>
        </div>
      </div>
    );
  };

  // Render One-page audit report
  const renderSummary = () => {
    return (
      <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Congratulatory Alert badge */}
        <div className="flex items-center gap-2 border border-green-500/20 bg-green-500/5 p-4 rounded-none">
          <CheckCircle size={16} className="text-green-500 shrink-0" />
          <span className="text-sm font-mono font-bold text-green-500 uppercase tracking-widest leading-none">
            AUDIT COMPLETED · SENSORY PROFILE CALCULATED
          </span>
        </div>

        {/* Score classification card */}
        <div className={`border p-5 space-y-4 rounded-none ${classification.color}`}>
          <div className="flex justify-between items-end border-b border-white/5 pb-2">
            <span className="font-mono text-xs uppercase tracking-widest font-bold">ACCUMULATED SENSORY DEBT:</span>
            <span className="text-3xl font-black font-display tracking-tight leading-none">{totalScore} / 21</span>
          </div>

          <div className="space-y-2">
            <h4 className="text-lg font-black uppercase tracking-tight font-display">{classification.bracket}</h4>
            <p className="text-sm leading-relaxed font-sans">{classification.summary}</p>
          </div>
        </div>

        {/* Aggregated Breakdown Grid */}
        <div className="border border-[var(--rule)] bg-black/20 p-5 space-y-4">
          <span className="font-mono text-xs text-[var(--muted)] uppercase tracking-widest block font-bold">// 7-DOMAIN DRAIN SPECTRUM</span>
          
          <div className="grid grid-cols-2 sm:grid-cols-7 gap-2.5">
            {AUDIT_DOMAINS.map((domain) => {
              const score = ratings[domain.key];
              return (
                <div 
                  key={domain.key}
                  className={`p-3 border flex flex-col justify-between items-center text-center rounded-none ${
                    score === 3 
                      ? 'border-red-500/50 bg-red-500/5 text-red-500' 
                      : score === 2 
                      ? 'border-amber-500/50 bg-amber-500/5 text-amber-500'
                      : score === 1
                      ? 'border-[var(--muted)]/50 bg-transparent text-[var(--muted)]'
                      : 'border-[var(--rule)] bg-black/40 text-[var(--muted)]/30'
                  }`}
                >
                  <span className="font-mono text-xs tracking-wider block font-bold uppercase">{domain.title}</span>
                  <span className="text-2xl font-black font-display block mt-1.5">{score}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Highest Drain OT suggest block */}
        {highestDrain.score > 0 && (
          <div className="border border-blue-500/20 bg-blue-500/5 p-5 space-y-3 rounded-none">
            <h4 className="text-xs font-mono font-bold text-blue-500 uppercase tracking-widest flex items-center gap-1.5 border-b border-blue-500/10 pb-2.5">
              💡 CORE SENSORY INTERVENTION SUGGESTION
            </h4>
            <div className="space-y-1.5 text-left">
              <span className="text-sm font-black text-white uppercase font-display leading-tight block">
                TARGET CHANNEL: {highestDrain.domain.title} (DRAIN LEVEL: {highestDrain.score}/3)
              </span>
              <p className="text-sm text-[var(--muted)] leading-relaxed font-sans">
                {getOTSuggestion(highestDrain.domain.key)}
              </p>
            </div>
          </div>
        )}

        {/* Settings & Persistence controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[var(--rule)] bg-black/25 p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveToggle}
              className={`p-2 border text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors rounded-none ${
                saveToBrowser 
                  ? 'border-[var(--accent)] text-[var(--accent)] bg-accent-pink-soft' 
                  : 'border-[var(--rule)] text-[var(--muted)] hover:border-[var(--muted)] bg-transparent'
              }`}
            >
              <Save size={10} /> {saveToBrowser ? 'STORE PERMISSION ACTIVE' : 'SAVE TO BROWSER STORAGE'}
            </button>
            {savedLocal && (
              <span className="text-xs font-mono text-green-500 uppercase tracking-widest animate-pulse">SAVED SUCCESSFULLY!</span>
            )}
          </div>

          <button
            onClick={handleRestart}
            className="w-full sm:w-auto px-5 py-3 bg-white text-black font-black uppercase text-xs tracking-wider hover:bg-[var(--accent)] hover:text-white cursor-pointer transition-colors rounded-none flex items-center justify-center gap-2"
          >
            <RefreshCw size={12} /> RE-AUDIT ENVIRONMENT
          </button>
        </div>

      </div>
    );
  };

  const content = (
    <>
      {currentStep < 7 ? renderStep() : renderSummary()}
    </>
  );

  if (noWrapper) {
    return (
      <div className="flex flex-col justify-between h-full">
        {content}
      </div>
    );
  }

  return (
    <div className="bg-bg-primary/40 border border-[var(--rule)] p-6 md:p-8 shadow-[4px_4px_0px_var(--rule)] max-w-2xl mx-auto">
      {content}
    </div>
  );
}
