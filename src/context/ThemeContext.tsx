'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
export type ThemeMode = 'light' | 'dark';
export type DensityMode = 'comfortable' | 'compact';
export type PrimaryColor = 'blue' | 'emerald' | 'purple' | 'slate';

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  densityMode: DensityMode;
  setDensityMode: (mode: DensityMode) => void;
  toggleDensity: () => void;
  primaryColor: PrimaryColor;
  setPrimaryColor: (color: PrimaryColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');
  const [densityMode, setDensityModeState] = useState<DensityMode>('comfortable');
  const [primaryColor, setPrimaryColorState] = useState<PrimaryColor>('blue');

  useEffect(() => {
    const savedTheme = localStorage.getItem('ggbg_theme_mode') as ThemeMode;
    const savedDensity = localStorage.getItem('ggbg_density_mode') as DensityMode;
    const savedColor = localStorage.getItem('ggbg_primary_color') as PrimaryColor;

    if (savedTheme) setThemeModeState(savedTheme);
    if (savedDensity) setDensityModeState(savedDensity);
    if (savedColor) setPrimaryColorState(savedColor);
  }, []);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem('ggbg_theme_mode', mode);
  };

  const toggleTheme = () => {
    const nextMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(nextMode);
  };

  const setDensityMode = (mode: DensityMode) => {
    setDensityModeState(mode);
    localStorage.setItem('ggbg_density_mode', mode);
  };

  const toggleDensity = () => {
    const nextDensity = densityMode === 'comfortable' ? 'compact' : 'comfortable';
    setDensityMode(nextDensity);
  };

  const setPrimaryColor = (color: PrimaryColor) => {
    setPrimaryColorState(color);
    localStorage.setItem('ggbg_primary_color', color);
  };

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        setThemeMode,
        toggleTheme,
        densityMode,
        setDensityMode,
        toggleDensity,
        primaryColor,
        setPrimaryColor,
      }}
    >
      <div className={themeMode === 'dark' ? 'dark-theme' : 'light-theme'}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
