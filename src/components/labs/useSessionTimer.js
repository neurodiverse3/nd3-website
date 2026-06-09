"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import { useLabLocalStorage } from './useLabStorage';

export function useSessionTimer(labId, isActive = false) {
  const { value: totalSeconds, setValue: setTotalSeconds } = useLabLocalStorage(`nd3-session-${labId}`, 0);
  const [currentSession, setCurrentSession] = useState(0);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      startTimeRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        setCurrentSession(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (currentSession > 0 && startTimeRef.current) {
        setTotalSeconds((prev) => (prev || 0) + currentSession);
      }
      setCurrentSession(0);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  const reset = useCallback(() => {
    setCurrentSession(0);
    setTotalSeconds(0);
  }, []);

  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return {
    currentSession,
    totalSeconds: totalSeconds || 0,
    formatCurrent: formatTime(currentSession),
    formatTotal: formatTime(totalSeconds || 0),
    reset,
  };
}
