// src/context/LanguageContext.tsx
'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

type LanguageContextType = {
  locale: 'en' | 'fr';
  setLocale: (locale: 'en' | 'fr') => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  formatDate: (date: Date | string, format?: 'short' | 'long' | 'full') => string;
};

// Comprehensive UI translations
const translations = {
  en: {
    // Navigation
    'nav.about': 'About',
    'nav.artists': 'Artists', 
    'nav.releases': 'Releases',
    'nav.shows': 'Shows',
    'nav.contact': 'Contact',
    
    // Common UI
    'common.showMore': 'Show more',
    'common.showLess': 'Show less',
    'common.viewDetails': 'View details',
    'common.close': 'Close',
    'common.loading': 'Loading...',
    'common.error': 'Error loading content',
    'common.retry': 'Try again',
    
    // Artists Section
    'artists.subtitle': 'We work with amazing artists building beautiful words.',
    'artists.location': 'Location',
    'artists.genres': 'Genres',
    'artists.currentArtists': 'Current Artists',
    'artists.pastArtists': 'Past Artists',
    
    // Releases Section
    'releases.subtitle': 'Artifacts of creation. Some of the gorgeous work that we\'ve helped release.',
    'releases.listen': 'Listen',
    'releases.featuredRelease': 'Featured Release',
    'releases.allReleases': 'All Releases',
    'releases.filterByArtist': 'Filter by Artist',
    'releases.filterByType': 'Filter by Type',
    'releases.allArtists': 'All Artists',
    'releases.allTypes': 'All Types',
    'releases.tracklist': 'Tracklist',
    'releases.genres': 'Genres',
    'releases.comingSoon': 'Coming Soon',
    'releases.noResults': 'No releases found matching your filters.',
    'releases.clearFilters': 'Clear All Filters',
    
    // Shows Section
    'shows.subtitle': 'We run shows every couple of months in beautiful unique locations around Montreal.',
    'shows.wantToPlay': 'Want to play a show?',
    'shows.clickHere': 'Click here!',
    'shows.upcoming': 'Upcoming Shows',
    'shows.past': 'Past Shows',
    'shows.allShows': 'All Shows',
    'shows.tickets': 'Get Tickets',
    'shows.lineup': 'Lineup',
    'shows.venue': 'Venue',
    'shows.date': 'Date',
    'shows.time': 'Time',
    'shows.doors': 'Doors',
    'shows.featuring': 'Featuring',
    'shows.presentedBy': 'Presented by',
    'shows.filterBySeries': 'Filter by Series',
    'shows.allSeries': 'All Series',
    'shows.viewMode.grid': 'Grid View',
    'shows.viewMode.list': 'List View',
    'shows.noUpcoming': 'No upcoming shows at the moment.',
    'shows.checkBackSoon': 'Check back soon for new events!',
    
    // Contact Section
    'contact.title': 'Contact',
    'contact.subtitle': 'Get in touch with us',
    'contact.email': 'Email',
    'contact.follow': 'Follow us',
    
    // Date/Time formatting templates
    'date.today': 'Today',
    'date.tomorrow': 'Tomorrow',
    'date.daysAgo': '{{count}} days ago',
    'date.inDays': 'In {{count}} days',
    'date.at': 'at',
  },
  fr: {
    // Navigation
    'nav.about': 'À propos',
    'nav.artists': 'Artistes',
    'nav.releases': 'Sorties', 
    'nav.shows': 'Spectacles',
    'nav.contact': 'Contact',
    
    // Common UI
    'common.showMore': 'Voir plus',
    'common.showLess': 'Voir moins',
    'common.viewDetails': 'Voir les détails',
    'common.close': 'Fermer',
    'common.loading': 'Chargement...',
    'common.error': 'Erreur de chargement',
    'common.retry': 'Réessayer',
    
    // Artists Section
    'artists.subtitle': 'Nous travaillons avec des artistes incroyables qui créent de beaux univers.',
    'artists.location': 'Lieu',
    'artists.genres': 'Genres',
    'artists.currentArtists': 'Artistes actuels',
    'artists.pastArtists': 'Anciens artistes',
    
    // Releases Section
    'releases.subtitle': 'Artéfacts de création. Quelques-unes des magnifiques œuvres que nous avons aidé à sortir.',
    'releases.listen': 'Écouter',
    'releases.featuredRelease': 'Sortie en vedette',
    'releases.allReleases': 'Toutes les sorties',
    'releases.filterByArtist': 'Filtrer par artiste',
    'releases.filterByType': 'Filtrer par type',
    'releases.allArtists': 'Tous les artistes',
    'releases.allTypes': 'Tous les types',
    'releases.tracklist': 'Liste des pistes',
    'releases.genres': 'Genres',
    'releases.comingSoon': 'Bientôt disponible',
    'releases.noResults': 'Aucune sortie trouvée correspondant à vos filtres.',
    'releases.clearFilters': 'Effacer tous les filtres',
    
    // Shows Section
    'shows.subtitle': 'Nous organisons des spectacles tous les deux mois dans de magnifiques lieux uniques autour de Montréal.',
    'shows.wantToPlay': 'Vous voulez jouer un spectacle?',
    'shows.clickHere': 'Cliquez ici!',
    'shows.upcoming': 'Spectacles à venir',
    'shows.past': 'Spectacles passés',
    'shows.allShows': 'Tous les spectacles',
    'shows.tickets': 'Billets',
    'shows.lineup': 'Programmation',
    'shows.venue': 'Lieu',
    'shows.date': 'Date',
    'shows.time': 'Heure',
    'shows.doors': 'Portes',
    'shows.featuring': 'Avec',
    'shows.presentedBy': 'Présenté par',
    'shows.filterBySeries': 'Filtrer par série',
    'shows.allSeries': 'Toutes les séries',
    'shows.viewMode.grid': 'Vue grille',
    'shows.viewMode.list': 'Vue liste',
    'shows.noUpcoming': 'Aucun spectacle à venir pour le moment.',
    'shows.checkBackSoon': 'Revenez bientôt pour de nouveaux événements!',
    
    // Contact Section
    'contact.title': 'Contact',
    'contact.subtitle': 'Contactez-nous',
    'contact.email': 'Courriel',
    'contact.follow': 'Suivez-nous',
    
    // Date/Time formatting templates
    'date.today': 'Aujourd\'hui',
    'date.tomorrow': 'Demain',
    'date.daysAgo': 'Il y a {{count}} jours',
    'date.inDays': 'Dans {{count}} jours',
    'date.at': 'à',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<'en' | 'fr'>('en');
  
  useEffect(() => {
    const saved = localStorage.getItem('language') as 'en' | 'fr';
    if (saved && (saved === 'en' || saved === 'fr')) {
      setLocaleState(saved);
    }
  }, []);
  
  const setLocale = (newLocale: 'en' | 'fr') => {
    setLocaleState(newLocale);
    localStorage.setItem('language', newLocale);
  };
  
  // Enhanced translation function with parameter support
  const t = (key: string, params?: Record<string, string | number>): string => {
    let translation = translations[locale][key as keyof typeof translations['en']] || key;
    
    // Replace parameters like {{count}} with actual values
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        translation = translation.replace(`{{${paramKey}}}`, String(value));
      });
    }
    
    return translation;
  };
  
  // Date formatting function that respects locale
  const formatDate = (date: Date | string, format: 'short' | 'long' | 'full' = 'long'): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Check if date is today or tomorrow
    if (dateObj.toDateString() === today.toDateString()) {
      return t('date.today');
    }
    if (dateObj.toDateString() === tomorrow.toDateString()) {
      return t('date.tomorrow');
    }
    
    // Format based on locale and format type
    const formatOptions = {
      short: { month: 'short' as const, day: 'numeric' as const },
      long: { weekday: 'short' as const, month: 'long' as const, day: 'numeric' as const, year: 'numeric' as const },
      full: { weekday: 'long' as const, month: 'long' as const, day: 'numeric' as const, year: 'numeric' as const }
    };
    
    const options: Intl.DateTimeFormatOptions = formatOptions[format];
    
    return dateObj.toLocaleDateString(locale === 'fr' ? 'fr-CA' : 'en-CA', options);
  };
  
  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, formatDate }}>
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