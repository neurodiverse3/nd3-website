"use client";
import { createContext, useContext, useState, useEffect } from 'react';

const BrainStateContext = createContext(undefined);

export const BRAIN_STATES = [
  { id: "burned-out", label: "BURNED OUT", hint: "for when everything feels too much", num: "01" },
  { id: "hyperfocus", label: "HYPERFOCUSED", hint: "for when your brain wants the deep dive", num: "02" },
  { id: "masking", label: "MASKING", hint: "for when you're tired of performing", num: "03" },
  { id: "spiraling", label: "SPIRALLING", hint: "for when you need one small next step", num: "04" },
  { id: "on-a-roll", label: "ON A ROLL", hint: "for when the momentum is finally there", num: "05" }
];

export const getBrainStateInfo = (stateId) => {
  return BRAIN_STATES.find(s => s.id === stateId) || null;
};

export const BrainStateProvider = ({ children }) => {
  const [brainState, setBrainStateState] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('nd3-brain-state');
    if (saved) setBrainStateState(saved);
  }, []);

  const setBrainState = (stateId) => {
    if (stateId) {
      localStorage.setItem('nd3-brain-state', stateId);
    } else {
      localStorage.removeItem('nd3-brain-state');
    }
    setBrainStateState(stateId);
  };

  return (
    <BrainStateContext.Provider value={{ brainState, setBrainState }}>
      {children}
    </BrainStateContext.Provider>
  );
};

export const useBrainState = () => {
  const context = useContext(BrainStateContext);
  if (!context) throw new Error('useBrainState must be used within a BrainStateProvider');
  return context;
};
