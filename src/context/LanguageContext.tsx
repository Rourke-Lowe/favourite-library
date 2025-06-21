'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

type LanguageContextType = {
  locale: 'en' | 'fr';
  setLocale: (locale: 'en' | 'fr') => void;
  t: (key: string) => string; // For UI translations
};

// UI translations (not content)
const translations = {
  en: {
    'nav.about': 'About',
    'nav.artists': 'Artists', 
    'nav.releases': 'Releases',
    'nav.shows': 'Shows',
    'nav.contact': 'Contact',
    'releases.listen': 'Listen',
    'shows.tickets': 'Get Tickets',
    'shows.upcoming': 'Upcoming Shows',
    'shows.past': 'Past Shows',
  },
  fr: {
    'nav.about': 'À propos',
    'nav.artists': 'Artistes',
    'nav.releases': 'Sorties', 
    'nav.shows': 'Spectacles',
    'nav.contact': 'Contact',
    'releases.listen': 'Écouter',
    'shows.tickets': 'Billets',
    'shows.upcoming': 'Spectacles à venir',
    'shows.past': 'Spectacles passés',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Get initial language from localStorage or default to 'en'
  const [locale, setLocaleState] = useState<'en' | 'fr'>('en');
  
  useEffect(() => {
    // Check localStorage after component mounts (client-side only)
    const saved = localStorage.getItem('language') as 'en' | 'fr';
    if (saved && (saved === 'en' || saved === 'fr')) {
      setLocaleState(saved);
    }
  }, []);
  
  const setLocale = (newLocale: 'en' | 'fr') => {
    setLocaleState(newLocale);
    localStorage.setItem('language', newLocale);
  };
  
  const t = (key: string): string => {
    return translations[locale][key as keyof typeof translations['en']] || key;
  };
  
  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};