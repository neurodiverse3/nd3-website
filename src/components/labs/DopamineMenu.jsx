"use client";
import React, { useState } from 'react';
import { Coffee, RefreshCw } from 'lucide-react';

export default function DopamineMenu({ noWrapper = false }) {
  const dopamineSnacks = [
    { title: "Cold Shock", body: "Splash ice-cold water on your face. Instant nervous system reset.", duration: "1 min" },
    { title: "Solar Charge", body: "Step outside or look out a window. Let daylight hit your eyes without a screen.", duration: "3 mins" },
    { title: "Bilateral Tap", body: "Cross your arms and tap your shoulders alternately. Activates both brain hemispheres.", duration: "2 mins" },
    { title: "Sonic Purge", body: "Put on noise-cancelling headphones. Complete silence for exactly 120 seconds.", duration: "2 mins" },
    { title: "Micro Scribble", body: "Grab physical paper and scribble as fast and hard as you can. Purges restless energy.", duration: "1 min" },
    { title: "Kinetic Shake", body: "Stand up and shake your hands, arms, and legs loosely. Discharges nervous build-up.", duration: "1 min" },
    { title: "Hydration Surge", body: "Drink one glass of ice-cold water as mindfully as possible, feeling the temperature change.", duration: "2 mins" }
  ];
  const [activeSnack, setActiveSnack] = useState(dopamineSnacks[0]);
  const [isSpinning, setIsSpinning] = useState(false);

  const rollDopamine = () => {
    setIsSpinning(true);
    let counter = 0;
    const interval = setInterval(() => {
      setActiveSnack(dopamineSnacks[Math.floor(Math.random() * dopamineSnacks.length)]);
      counter++;
      if (counter > 6) {
        clearInterval(interval);
        setIsSpinning(false);
      }
    }, 80);
  };

  const content = (
    <div className={`space-y-4 select-none font-sans text-left`}>
      <div className="flex items-center justify-between border-b border-[var(--rule)] pb-3">
        <h3 className="text-base font-black uppercase tracking-wider text-[var(--fg)] flex items-center gap-2">
          <Coffee size={16} className="text-[var(--accent)]" /> RESET MENU
        </h3>
        <span className="text-[10px] font-mono text-[var(--muted)] uppercase border border-[var(--rule)] px-2 py-0.5">DOPAMINE</span>
      </div>

      <div className="space-y-3">
        <h4 className="text-lg font-black uppercase text-[var(--fg)] tracking-tight">DOPAMINE SNACKS</h4>
        <p className={`text-[13px] text-[var(--muted)] leading-relaxed ${noWrapper ? 'line-clamp-2 hover:line-clamp-none transition-all duration-300' : ''}`}>
          Stuck in an executive function loop? Roll for a sensory reset. Simple physical tasks that interrupt digital feedback patterns and clear cortisol load.
        </p>

        <div className={`bg-bg-primary/75 border border-[var(--rule)] flex flex-col justify-between shadow-inner transition-all ${noWrapper ? 'p-4 min-h-[100px]' : 'p-5 min-h-[120px]'}`}>
          <div className="space-y-1 text-left">
            <span className="text-xs font-mono uppercase text-[var(--accent)] font-bold tracking-widest">· {activeSnack.title} ·</span>
            <p className="text-xs font-mono text-[var(--muted)] leading-relaxed">{activeSnack.body}</p>
          </div>
          <div className="text-[10px] font-mono text-[var(--muted)] tracking-wider mt-3 uppercase border-t border-[var(--rule)]/40 pt-2 flex justify-between">
            <span>SENSORY TARGET</span>
            <span>EST: {activeSnack.duration}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const buttonContent = (
    <div className={noWrapper ? 'mt-4' : 'mt-8'}>
      <button
        onClick={rollDopamine}
        disabled={isSpinning}
        className="w-full py-3.5 bg-transparent text-[var(--fg)] border border-[var(--rule)] hover:border-[var(--accent)] font-black uppercase text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        <RefreshCw size={14} className={isSpinning ? 'animate-spin' : ''} />
        {isSpinning ? 'ROLLING SNACK...' : 'GENERATE SENSORY SNACK'}
      </button>
    </div>
  );

  if (noWrapper) {
    return (
      <div className="flex flex-col justify-between h-full">
        <div>
          {content}
        </div>
        {buttonContent}
      </div>
    );
  }

  return (
    <div className="bg-bg-primary/40 border border-[var(--rule)] p-6 md:p-8 flex flex-col justify-between shadow-[4px_4px_0px_var(--rule)] max-w-md mx-auto">
      {content}
      {buttonContent}
    </div>
  );
}
