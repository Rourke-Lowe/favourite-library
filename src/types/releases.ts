// src/types/releases.ts
export interface Release {
  id: string;
  title: string;
  artists: string[];
  releaseDate: string;
  releaseType: string;
  genres: string[];
  tracks: string[];
  artworkPath: string;
  spotifyUrl: string;
  appleMusicUrl: string;
  description: string;
  audioClipTime: string | number;
  releaseStage: 'marketing' | 'released'; // Change from 'string' to specific union type
}

// Add this type alias
export type ReleaseDataFormat = Release;