

// types/index.ts
// Export all types from their respective files
export * from './artist';
export * from './releases';
export * from './show';




export interface Artist {
    id: string;
    name: string;
    image: string;
    bio: string;
    links?: Record<string, string>;
    releases?: {
      id: string;
      title: string;
      coverArt: string;
    }[];
  }
  
  export interface Track {
    id: string;
    title: string;
    duration: string;
    audioUrl: string;
  }
  
  export interface Release {
    id: string;
    title: string;
    artist: string;
    coverArt: string;
    releaseDate: string;
    description: string;
    previewAudio: string;
    tracks: Track[];
  }
  
  export interface Show {
    id: string;
    title: string;
    image: string;
    date: string;
    time: string;
    venue: string;
    address: string;
    city: string;
    country: string;
    description: string;
    lineup: string[];
    ticketLink?: string;
  }
  
  export interface MerchItem {
    id: string;
    title: string;
    image: string;
    price: string;
    description: string;
    options: string[];
    storeLink: string;
  }
  
  export interface AudioTrack {
    id: string;
    title: string;
    artist: string;
    audioUrl: string;
    coverArt: string;
  }