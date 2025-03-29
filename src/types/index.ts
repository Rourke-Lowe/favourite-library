

// types/index.ts
// Export all types from their respective files


  
  export interface Track {
    id: string;
    title: string;
    duration: string;
    audioUrl: string;
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