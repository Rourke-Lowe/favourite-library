// src/lib/types.ts
export type StreamingLinks = {
    spotify?: string;
    bandcamp?: string;
    soundcloud?: string;
    appleMusic?: string;
  };
  
  export type ReleaseType = 'album' | 'ep' | 'single';
  
  export type Release = {
    id: string;
    title: string;
    artist: string;
    releaseDate: string;
    type: ReleaseType;
    coverArt: string;
    description: string;
    previewUrl?: string;
    streamingLinks?: StreamingLinks;
    tracklist?: Track[];
  };
  
  export type Track = {
    id: string;
    title: string;
    duration: string; // Format: "MM:SS"
    previewUrl?: string;
  };
  
  export type Artist = {
    id: string;
    name: string;
    image: string;
    bio: string;
    releases?: string[]; // IDs of releases
    socialLinks?: {
      instagram?: string;
      twitter?: string;
      website?: string;
    };
  };
  
  export type Show = {
    id: string;
    title: string;
    date: string;
    time: string;
    venue: string;
    location: string;
    description?: string;
    artists: string[]; // IDs of artists
    ticketLink?: string;
    image?: string;
  };
  
  export type MoodboardItem = {
    id: string;
    image: string;
    caption?: string;
    credit?: string;
  };
  
  export type MerchItem = {
    id: string;
    title: string;
    price: number;
    image: string;
    description: string;
    sizes?: string[];
    available: boolean;
    storeLink: string;
  };
  
  export type SectionId = 'hero' | 'artists' | 'releases' | 'moodboard' | 'shows' | 'merch';