import fs from 'fs';
import path from 'path';
import type { Artist } from '@/types/artist';
import type { Release } from '@/types/releases';
import type { Show } from '@/types/show';

export interface SiteData {
  artists: Artist[];
  releases: Release[];
  shows: Show[];
}

export interface LocalizedSiteData {
  en: SiteData;
  fr: SiteData;
}

function loadJsonFile<T>(filePath: string, dataKey: string): T {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    
    // The JSON files have the structure { "generated": "...", "artists": [...] } etc.
    // We need to extract the actual array using the specified key
    if (data[dataKey]) {
      return data[dataKey] as T;
    }
    
    // Fallback: if the specified key doesn't exist, try to find it automatically
    const keys = Object.keys(data).filter(key => key !== 'generated');
    if (keys.length === 1) {
      return data[keys[0]] as T;
    }
    
    // If all else fails, return the data as-is
    console.warn(`Could not find key "${dataKey}" in data file, returning full object`);
    return data as T;
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error);
    throw error;
  }
}

export function loadSiteData(): LocalizedSiteData {
  const publicDataPath = path.join(process.cwd(), 'public', 'data');
  
  try {
    // Load English data
    const enArtists = loadJsonFile<Artist[]>(path.join(publicDataPath, 'en', 'artists.json'), 'artists');
    const enReleases = loadJsonFile<Release[]>(path.join(publicDataPath, 'en', 'releases.json'), 'releases');
    const enShows = loadJsonFile<Show[]>(path.join(publicDataPath, 'en', 'shows.json'), 'shows');
    
    // Load French data
    const frArtists = loadJsonFile<Artist[]>(path.join(publicDataPath, 'fr', 'artists.json'), 'artists');
    const frReleases = loadJsonFile<Release[]>(path.join(publicDataPath, 'fr', 'releases.json'), 'releases');
    const frShows = loadJsonFile<Show[]>(path.join(publicDataPath, 'fr', 'shows.json'), 'shows');
    
    return {
      en: {
        artists: enArtists,
        releases: enReleases,
        shows: enShows
      },
      fr: {
        artists: frArtists,
        releases: frReleases,
        shows: frShows
      }
    };
  } catch (error) {
    console.error('Error loading site data:', error);
    throw error;
  }
}