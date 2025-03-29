// src/types/releases.ts
export interface Release {
    id: string;
    title: string;
    artists: string[];
    releaseDate: string;
    releaseType: string;
    genres?: string[];
    tracks?: string[];
    description?: string;
    spotifyUrl?: string;
    appleMusicUrl?: string;
    // Add other properties your releases have
  }