'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
export interface ModuleToggles {
  customers: boolean;
  leads: boolean;
  chat: boolean;
  stores: boolean;
  finance: boolean;
  contracts: boolean;
  hrm: boolean;
  products: boolean;
  kpis: boolean;
  performance: boolean;
  reviews: boolean;
  audit: boolean;
}

const DEFAULT_TOGGLES: ModuleToggles = {
  customers: true,
  leads: true,
  chat: true,
  stores: true,
  finance: true,
  contracts: true,
  hrm: true,
  products: true,
  kpis: true,
  performance: true,
  reviews: true,
  audit: true,
};

interface ModuleToggleContextType {
  toggles: ModuleToggles;
  toggleModule: (moduleKey: keyof ModuleToggles) => void;
  resetToggles: () => void;
}

const ModuleToggleContext = createContext<ModuleToggleContextType | undefined>(undefined);

export function ModuleToggleProvider({ children }: { children: React.ReactNode }) {
  const [toggles, setToggles] = useState<ModuleToggles>(DEFAULT_TOGGLES);

  const syncTogglesFromStorage = () => {
    try {
      const saved = localStorage.getItem('ggbg_module_toggles');
      if (saved) {
        setToggles(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    syncTogglesFromStorage();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ggbg_module_toggles' || !e.key) {
        syncTogglesFromStorage();
      }
    };

    const handleCustomSync = () => {
      syncTogglesFromStorage();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('ggbg_module_toggles_updated', handleCustomSync);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('ggbg_module_toggles_updated', handleCustomSync);
    };
  }, []);

  const toggleModule = (moduleKey: keyof ModuleToggles) => {
    setToggles((prev) => {
      const updated = { ...prev, [moduleKey]: !prev[moduleKey] };
      try {
        localStorage.setItem('ggbg_module_toggles', JSON.stringify(updated));
        window.dispatchEvent(new Event('ggbg_module_toggles_updated'));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const resetToggles = () => {
    setToggles(DEFAULT_TOGGLES);
    try {
      localStorage.setItem('ggbg_module_toggles', JSON.stringify(DEFAULT_TOGGLES));
      window.dispatchEvent(new Event('ggbg_module_toggles_updated'));
    } catch {
      // ignore
    }
  };

  return (
    <ModuleToggleContext.Provider value={{ toggles, toggleModule, resetToggles }}>
      {children}
    </ModuleToggleContext.Provider>
  );
}

export function useModuleToggles() {
  const context = useContext(ModuleToggleContext);
  if (!context) {
    throw new Error('useModuleToggles must be used within a ModuleToggleProvider');
  }
  return context;
}
