"use client";
import React, { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, Battery, RefreshCw, Lock, Sparkles, HelpCircle } from 'lucide-react';
import { useLabLocalStorage } from '../../lib/useLabStorage';

const SpoonIcon = ({ className = "w-5 h-5", glow = false }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={`${className} transition-all duration-300 ${glow ? 'text-[var(--accent)] filter drop-shadow-[0_0_5px_var(--accent)]' : 'text-[var(--muted)]'}`}
  >
    <path d="M12 2c-1.85 0-3.35 1.5-3.35 3.35v6.59c0 1.55 1.05 2.87 2.5 3.23v5.83c0 .55.45 1 1 1s1-.45 1-1v-5.83c1.45-.36 2.5-1.68 2.5-3.23V5.35C15.35 3.5 13.85 2 12 2zm0 1.5c1.02 0 1.85.83 1.85 1.85v1.65c0 .28-.22.5-.5.5s-.5-.22-.5-.5V5.35c0-.47-.38-.85-.85-.85s-.85.38-.85.85v1.65c0 .28-.22.5-.5.5s-.5-.22-.5-.5V5.35c0-1.02.83-1.85 1.85-1.85z" />
  </svg>
);

export default function SpoonTracker({ noWrapper = false }) {
  const { value: savedMax, setValue: setSavedMax } = useLabLocalStorage('nd3-spoon-tracker-max', 8);
  const { value: savedBanked, setValue: setSavedBanked } = useLabLocalStorage('nd3-spoon-tracker-banked', 0);
  const { value: savedTasks, setValue: setSavedTasks } = useLabLocalStorage('nd3-spoon-tracker-tasks', [
    { id: '1', title: 'Check administrative email inbox', cost: 1 },
    { id: '2', title: 'Focus code core layout block', cost: 3 }
  ]);
  const { value: savedDate, setValue: setSavedDate } = useLabLocalStorage('nd3-spoon-tracker-date', null);

  const [maxSpoons, setMaxSpoons] = useState(savedMax);
  const [bankedSpoonsCount, setBankedSpoonsCount] = useState(savedBanked);
  const [spentTasks, setSpentTasks] = useState(savedTasks);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCost, setNewTaskCost] = useState(1);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const todayStr = new Date().toDateString();

      if (savedDate && savedDate !== todayStr) {
        setSavedDate(todayStr);
        setSavedBanked(0);
        setSavedTasks([]);
        setBankedSpoonsCount(0);
        setSpentTasks([]);
      } else if (!savedDate) {
        setSavedDate(todayStr);
      }
    }
  }, []);

  useEffect(() => { setSavedMax(maxSpoons); }, [maxSpoons]);
  useEffect(() => { setSavedBanked(bankedSpoonsCount); }, [bankedSpoonsCount]);
  useEffect(() => { setSavedTasks(spentTasks); }, [spentTasks]);

  const handleMaxChange = (change) => {
    const nextMax = Math.max(1, Math.min(12, maxSpoons + change));
    setMaxSpoons(nextMax);
  };

  const totalSpentSpoons = spentTasks.reduce((sum, item) => sum + item.cost, 0);
  const availableSpoons = Math.max(0, maxSpoons - totalSpentSpoons - bankedSpoonsCount);

  // Add spent task
  const addSpentTask = (title = null, cost = null) => {
    const finalTitle = (title || newTaskTitle || "Activity").trim();
    const finalCost = cost || newTaskCost;

    if (availableSpoons < finalCost) {
      alert("⚠️ INSUFFICIENT ENERGY: You don't have enough spoons left for this task!");
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title: finalTitle,
      cost: finalCost
    };

    const nextTasks = [...spentTasks, newTask];
    setSpentTasks(nextTasks);
    setNewTaskTitle("");
    setNewTaskCost(1);
  };

  // Remove spent task
  const removeSpentTask = (id) => {
    const nextTasks = spentTasks.filter(t => t.id !== id);
    setSpentTasks(nextTasks);
  };

  const adjustBankedSpoons = (change) => {
    if (change > 0 && availableSpoons < 1) {
      alert("⚠️ INSUFFICIENT ENERGY: You don't have enough spoons left to bank!");
      return;
    }
    if (change < 0 && bankedSpoonsCount < 1) return;

    const nextBanked = bankedSpoonsCount + change;
    setBankedSpoonsCount(nextBanked);
  };

  const resetEntireTracker = () => {
    if (confirm("🔄 RESET TRACKER: Are you sure you want to reset your energy budget for the day?")) {
      setMaxSpoons(8);
      setBankedSpoonsCount(0);
      setSpentTasks([]);
    }
  };

  const content = (
    <div className={`select-none font-sans text-left ${noWrapper ? 'space-y-4' : 'space-y-6'}`}>
      {/* Brand Header */}
      <div className="flex items-center justify-between border-b border-[var(--rule)] pb-3">
        <h3 className="text-base font-black uppercase tracking-wider text-[var(--fg)] flex items-center gap-2">
          <Battery size={16} className="text-[var(--accent)]" /> SPOON TRACKER
        </h3>
        <span className="text-[10px] font-mono text-[var(--muted)] uppercase border border-[var(--rule)] px-2 py-0.5 tracking-wider">
          ENERGY · BUDGETING
        </span>
      </div>

      <p className={`text-[13px] text-[var(--muted)] leading-relaxed ${noWrapper ? 'line-clamp-2 hover:line-clamp-none transition-all duration-300' : ''}`}>
        ADHD and chronic fatigue brains struggle to feel the cost of a task until the crash hits. Externalize your budget: set your starting spoons, drag or click to spend them, and bank energy to protect your late-day reserves.
      </p>

      {/* Starting energy configure slider box */}
      <div className={`bg-black/45 border border-[var(--rule)] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm transition-all ${noWrapper ? 'p-3' : 'p-4'}`}>
        <div className="text-left space-y-1">
          <span className="font-mono text-[9px] text-[var(--muted)] uppercase tracking-widest block font-bold">DAILY CAPACITY INITIALIZER</span>
          <span className="text-sm font-black text-white uppercase font-display leading-tight block">STARTING SPOONS FOR TODAY: {maxSpoons}</span>
        </div>
        
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => handleMaxChange(-1)}
            className="w-9 h-9 border border-[var(--rule)] hover:border-[var(--accent)] text-base font-black flex items-center justify-center cursor-pointer transition-colors text-white"
          >
            -
          </button>
          <button
            onClick={() => handleMaxChange(1)}
            className="w-9 h-9 border border-[var(--rule)] hover:border-[var(--accent)] text-base font-black flex items-center justify-center cursor-pointer transition-colors text-white"
          >
            +
          </button>
        </div>
      </div>

      {/* Main Spoons visualization board */}
      <div className={`border border-[var(--rule)] bg-black/10 transition-all ${noWrapper ? 'p-4 space-y-4' : 'p-5 space-y-6'}`}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--rule)] pb-3">
          <span className="font-mono text-[10px] text-[var(--muted)] uppercase tracking-widest font-bold">ENERGETIC POTENTIAL METRICS</span>
          <button
            onClick={resetEntireTracker}
            className="text-[10px] font-mono font-bold text-red-500 hover:text-red-400 bg-transparent flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw size={10} /> CLEAR WORKSPACE
          </button>
        </div>

        {/* Visual tray showing the actual glowing spoons */}
        <div className="space-y-2 text-left">
          <div className="flex justify-between font-mono text-[10px] text-[var(--muted)] uppercase font-bold">
            <span>TRAY STATE: {availableSpoons} / {maxSpoons} SPOONS READY</span>
            <span>{totalSpentSpoons} SPENT · {bankedSpoonsCount} BANKED</span>
          </div>

          <div className={`w-full border border-dashed border-[var(--rule)] bg-black/40 flex flex-wrap gap-2.5 items-center justify-start transition-all ${noWrapper ? 'p-3 min-h-[48px]' : 'p-4 min-h-[56px]'}`}>
            {Array.from({ length: maxSpoons }).map((_, idx) => {
              // Determine if this spoon is active, spent, or banked
              let state = 'available';
              if (idx < totalSpentSpoons) {
                state = 'spent';
              } else if (idx < totalSpentSpoons + bankedSpoonsCount) {
                state = 'banked';
              }

              return (
                <div 
                  key={idx}
                  className={`border flex items-center justify-center relative cursor-help transition-all duration-300 ${noWrapper ? 'w-8 h-8' : 'w-9 h-9'} ${
                    state === 'available' 
                      ? 'border-[var(--accent)] bg-accent-pink-soft/10 text-[var(--accent)]' 
                      : state === 'banked' 
                      ? 'border-blue-500 bg-blue-500/10 text-blue-500' 
                      : 'border-[var(--rule)] bg-transparent text-[var(--muted)]/30'
                  }`}
                  title={
                    state === 'available' 
                      ? "Available energy unit" 
                      : state === 'banked' 
                      ? "Banked (Protected) energy unit" 
                      : "Spent energy unit"
                  }
                >
                  <SpoonIcon 
                    className={noWrapper ? "w-4.5 h-4.5" : "w-5 h-5"} 
                    glow={state === 'available'}
                  />
                  {state === 'banked' && (
                    <Lock size={noWrapper ? 7 : 8} className="absolute bottom-1 right-1 text-blue-500 animate-pulse" />
                  )}
                </div>
              );
            })}

            {maxSpoons === 0 && (
              <span className="text-xs font-mono text-red-500 uppercase tracking-wider block">TOTALLY DEPLETED</span>
            )}
          </div>
        </div>

        {/* Three Columns Workspaces */}
        <div className={`grid grid-cols-1 gap-6 pt-4 border-t border-[var(--rule)] ${noWrapper ? 'lg:grid-cols-1 xl:grid-cols-2' : 'md:grid-cols-2'}`}>
          
          {/* Left Side Column: Spent Tasks details */}
          <div className="space-y-4 text-left">
            <span className="font-mono text-[10px] text-[var(--muted)] uppercase tracking-widest block font-bold">SPENT ENERGY LOG</span>
            
            <div className={`space-y-2 custom-scrollbar overflow-y-auto border border-[var(--rule)] bg-black/40 p-2.5 transition-all ${noWrapper ? 'max-h-[140px] min-h-[80px]' : 'max-h-[180px] min-h-[100px]'}`}>
              {spentTasks.map((task) => (
                <div 
                  key={task.id}
                  className="flex items-center justify-between border border-[var(--rule)] bg-black/20 p-2 text-xs transition-all hover:border-[var(--accent)]/55 group"
                >
                  <div className="space-y-1">
                    <span className="text-white font-bold block pr-2 leading-snug text-xs">{task.title}</span>
                    <span className="font-mono text-[9px] text-[var(--muted)] uppercase tracking-wider">COST: {task.cost} {task.cost === 1 ? 'SPOON' : 'SPOONS'}</span>
                  </div>
                  
                  <button
                    onClick={() => removeSpentTask(task.id)}
                    className="p-1 border border-transparent hover:border-red-500/50 hover:bg-red-500/5 text-[var(--muted)] hover:text-red-500 cursor-pointer shrink-0 transition-colors"
                    title="Refund spoons"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              ))}

              {spentTasks.length === 0 && (
                <span className="text-xs font-mono text-[var(--muted)] italic p-2 block">TRAY EMPTY. ENERGY AT PEAK.</span>
              )}
            </div>

            {/* Manual task addition form */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-wider block font-bold">ADD NEW SPENT BLOCK:</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Task title..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="flex-1 bg-black border border-[var(--rule)] px-3 py-1.5 text-xs text-white outline-none rounded-none focus:border-[var(--accent)]"
                />
                
                <select
                  value={newTaskCost}
                  onChange={(e) => setNewTaskCost(parseInt(e.target.value))}
                  className="bg-black border border-[var(--rule)] px-2 py-1.5 text-xs text-[var(--accent)] outline-none rounded-none cursor-pointer"
                >
                  <option value={1}>1 Sp</option>
                  <option value={2}>2 Sp</option>
                  <option value={3}>3 Sp</option>
                  <option value={4}>4 Sp</option>
                </select>

                <button
                  onClick={() => addSpentTask()}
                  disabled={!newTaskTitle.trim() || availableSpoons < newTaskCost}
                  className="px-3 bg-white text-black font-black hover:bg-[var(--accent)] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-xs transition-colors cursor-pointer rounded-none flex items-center justify-center shrink-0"
                >
                  <Plus size={12} />
                </button>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  { label: "Email (1)", cost: 1, name: "Administrative Email Inbox" },
                  { label: "Meeting (2)", cost: 2, name: "Client Sync Meeting" },
                  { label: "Focused Code (3)", cost: 3, name: "Focused Core Coding Layouts" },
                  { label: "Socialize (2)", cost: 2, name: "Co-worker Social Gathering" }
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => addSpentTask(preset.name, preset.cost)}
                    disabled={availableSpoons < preset.cost}
                    className="px-2 py-1 text-[9px] font-mono border border-[var(--rule)] hover:border-[var(--accent)] text-[var(--muted)] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer bg-transparent rounded-none transition-colors"
                  >
                    + {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side Column: Banked Reserves & Instructions */}
          <div className={`space-y-4 text-left pt-4 md:pt-0 flex flex-col justify-between ${noWrapper ? 'border-t lg:border-t lg:border-l-0 xl:border-l xl:border-t-0 xl:pt-0 xl:pl-4 border-[var(--rule)]' : 'border-t md:border-t-0 md:border-l md:pl-6 border-[var(--rule)]'}`}>
            <div className="space-y-3">
              <span className="font-mono text-[10px] text-[var(--muted)] uppercase tracking-widest block font-bold">PROTECTED RESERVE BANK</span>
              
              <div className={`bg-black/30 border border-[var(--rule)] flex items-center justify-between shadow-inner transition-all ${noWrapper ? 'p-3' : 'p-4'}`}>
                <div className="space-y-0.5">
                  <span className="text-sm font-black text-blue-500 uppercase font-display leading-tight block">BANKED ENERGY: {bankedSpoonsCount}</span>
                  <span className="text-[10px] font-mono text-[var(--muted)] leading-tight block">Locks spoons in place to protect reserves.</span>
                </div>
                
                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={() => adjustBankedSpoons(-1)}
                    disabled={bankedSpoonsCount === 0}
                    className="w-7 h-7 border border-[var(--rule)] hover:border-blue-500 text-white font-black flex items-center justify-center cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed rounded-none"
                  >
                    -
                  </button>
                  <button
                    onClick={() => adjustBankedSpoons(1)}
                    disabled={availableSpoons === 0}
                    className="w-7 h-7 border border-[var(--rule)] hover:border-blue-500 text-white font-black flex items-center justify-center cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed rounded-none"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Energy alert guide badge */}
            <div className={`border border-blue-500/20 bg-blue-500/5 flex gap-2.5 text-left leading-normal transition-all ${noWrapper ? 'p-3 mt-2' : 'p-4 mt-4 md:mt-0'}`}>
              <Clock size={14} className="text-blue-500 shrink-0 mt-0.5 animate-pulse" />
              <div className="space-y-1.5">
                <span className="text-[9px] font-mono font-bold text-blue-500 uppercase tracking-widest block">MIDNIGHT TIMER RESET</span>
                <p className="text-xs text-[var(--muted)] leading-relaxed font-sans">
                  The budget resets automatically at midnight in your local browser timezone. Clear browser cache or use the "CLEAR" button to restart manually.
                </p>
              </div>
            </div>
          </div>

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
    <div className="bg-bg-primary/40 border border-[var(--rule)] p-6 md:p-8 shadow-[4px_4px_0px_var(--rule)] max-w-2xl mx-auto">
      {content}
    </div>
  );
}
