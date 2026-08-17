'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrandingConfig } from '@/types';

export const DEFAULT_BRANDING: BrandingConfig = {
  systemName: 'GGBingo CRM',
  tagline: 'Enterprise Platform',
  logoType: 'TEXT_BADGE',
  logoUrl: '',
  logoText: 'GG',
  logoBgGradient: 'from-purple-600 via-indigo-600 to-blue-500',
  faviconUrl: '',
  titleSuffix: '- Enterprise E-Commerce Platform',
};

interface BrandingContextType {
  branding: BrandingConfig;
  updateBranding: (newConfig: Partial<BrandingConfig>) => void;
  resetBranding: () => void;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

// Helper to generate dynamic SVG Data URI favicon if text badge is used
function generateSvgFaviconDataUri(letter: string, gradientFrom: string = '#9333ea', gradientTo: string = '#3b82f6') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${gradientFrom}" />
        <stop offset="100%" stop-color="${gradientTo}" />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="16" fill="url(#g)"/>
    <text x="50%" y="54%" text-anchor="middle" dominant-baseline="central" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="30">${letter}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function BrandingProvider({ children }: { children: React.ReactNode }) {
  const [branding, setBranding] = useState<BrandingConfig>(DEFAULT_BRANDING);

  const syncBrandingFromStorage = () => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem('ggbg_branding_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        setBranding({ ...DEFAULT_BRANDING, ...parsed });
      }
    } catch {
      // ignore JSON parse error
    }
  };

  useEffect(() => {
    syncBrandingFromStorage();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ggbg_branding_config' || !e.key) {
        syncBrandingFromStorage();
      }
    };

    const handleCustomSync = () => {
      syncBrandingFromStorage();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('ggbg_branding_updated', handleCustomSync);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('ggbg_branding_updated', handleCustomSync);
    };
  }, []);

  // Update dynamic favicon and document title in head
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Update Favicon
    let iconHref = branding.faviconUrl;
    if (!iconHref) {
      if (branding.logoType === 'IMAGE' && branding.logoUrl) {
        iconHref = branding.logoUrl;
      } else {
        iconHref = generateSvgFaviconDataUri(branding.logoText || 'GG');
      }
    }

    if (iconHref) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = iconHref;
    }

    // 2. Update default title if appropriate
    if (document.title.includes('GGBingo CRM') || document.title.includes('Enterprise')) {
      document.title = `${branding.systemName} ${branding.titleSuffix}`.trim();
    }
  }, [branding]);

  const updateBranding = (newConfig: Partial<BrandingConfig>) => {
    setBranding((prev) => {
      const updated = {
        ...prev,
        ...newConfig,
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      };
      try {
        localStorage.setItem('ggbg_branding_config', JSON.stringify(updated));
        window.dispatchEvent(new Event('ggbg_branding_updated'));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const resetBranding = () => {
    setBranding(DEFAULT_BRANDING);
    try {
      localStorage.setItem('ggbg_branding_config', JSON.stringify(DEFAULT_BRANDING));
      window.dispatchEvent(new Event('ggbg_branding_updated'));
    } catch {
      // ignore
    }
  };

  return (
    <BrandingContext.Provider value={{ branding, updateBranding, resetBranding }}>
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
}
