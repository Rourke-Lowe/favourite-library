// src/components/ClientSections.tsx
'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import type { LocalizedSiteData } from '@/lib/dataLoader';
import type { Artist } from '@/types/artist';
import type { Release } from '@/types/releases';
import type { Show } from '@/types/show';
import Artists from '@/components/sections/Artists';
import Shows from '@/components/sections/Shows';
import Releases from '@/components/sections/Releases';

interface ClientSectionsProps {
  initialData: LocalizedSiteData;
}

export default function ClientSections({ initialData }: ClientSectionsProps) {
  const { locale } = useLanguage();
  const [siteData, setSiteData] = useState<LocalizedSiteData>(initialData);
  const [loading, setLoading] = useState(false);

  // Fetch data when language changes
  useEffect(() => {
    const fetchLocalizedData = async () => {
      setLoading(true);
      try {
        // Fetch all three data files for the current locale
        const [artistsRes, releasesRes, showsRes] = await Promise.all([
          fetch(`/data/${locale}/artists.json`),
          fetch(`/data/${locale}/releases.json`),
          fetch(`/data/${locale}/shows.json`)
        ]);

        const [artistsData, releasesData, showsData] = await Promise.all([
          artistsRes.json(),
          releasesRes.json(),
          showsRes.json()
        ]);

        // Update the site data for the current locale
        setSiteData(prevData => ({
          ...prevData,
          [locale]: {
            artists: artistsData.artists || [],
            releases: releasesData.releases || [],
            shows: showsData.shows || []
          }
        }));
      } catch (error) {
        console.error('Error fetching localized data:', error);
        // If fetching fails, keep using the existing data
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we don't already have data for this locale
    if (!siteData[locale] || 
        !siteData[locale].artists || 
        !siteData[locale].releases || 
        !siteData[locale].shows) {
      fetchLocalizedData();
    }
  }, [locale, siteData]);

  // Ensure we always have valid data structure
  const safeData: LocalizedSiteData = {
    en: {
      artists: siteData.en?.artists || [],
      releases: siteData.en?.releases || [],
      shows: siteData.en?.shows || []
    },
    fr: {
      artists: siteData.fr?.artists || [],
      releases: siteData.fr?.releases || [],
      shows: siteData.fr?.shows || []
    }
  };

  // Show loading state briefly when switching languages
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-pulse text-surface-500">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Artists siteData={safeData} />
      <Shows siteData={safeData} />
      <Releases siteData={safeData} />
    </>
  );
}