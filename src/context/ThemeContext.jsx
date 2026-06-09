"use client";
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(undefined);

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState('void');

  const applyTheme = (newTheme) => {
    const root = document.documentElement;
    const themeValue = newTheme === 'warm-charcoal' ? 'parchment' : newTheme;
    root.classList.remove('theme-void', 'theme-warm-charcoal', 'theme-incubation', 'theme-parchment');
    root.classList.add(`theme-${themeValue}`);
    root.setAttribute('data-theme', themeValue);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('nd3-theme') || 'void';
    const resolvedTheme = savedTheme === 'warm-charcoal' ? 'parchment' : savedTheme;
    setThemeState(resolvedTheme);
    applyTheme(resolvedTheme);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.shiftKey && (e.key === 'T' || e.key === 't')) {
        e.preventDefault();
        const themes = ['void', 'parchment', 'incubation'];
        setThemeState((current) => {
          const currentIndex = themes.indexOf(current);
          const nextIndex = (currentIndex + 1) % themes.length;
          const nextTheme = themes[nextIndex];
          applyTheme(nextTheme);
          localStorage.setItem('nd3-theme', nextTheme);
          return nextTheme;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);



  const setTheme = (newTheme) => {
    const resolvedTheme = newTheme === 'warm-charcoal' ? 'parchment' : newTheme;
    setThemeState(resolvedTheme);
    applyTheme(resolvedTheme);
    localStorage.setItem('nd3-theme', resolvedTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
