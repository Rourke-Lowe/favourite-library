// src/types/releases.ts
export interface Release {
    id: string;
    title: string;
    artists: string[];
    releaseDate: string;
    releaseType: string;
    releaseStage?: 'marketing' | 'released'; 
    genres?: string[];
    artworkPath?: string;
    tracks?: string[];
    description?: string;
    spotifyUrl?: string;
    appleMusicUrl?: string;

    // Add other properties your releases have
}

// Add this type alias
export type ReleaseDataFormat = Release;