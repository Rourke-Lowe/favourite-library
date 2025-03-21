export interface Release {
  id: string;
  title: string;
  artist: string;
  date: string;
  description: string;
  image: string;
  coverArt: string;
  previewAudio: string;
  tracks: Track[];
  type: string; // Added type property to the interface
}

export interface Track {
  id: string;
  title: string;
  duration: string;
  audioUrl: string;
}

export const releases = [
  {
    id: "midnight-echoes",
    title: "Midnight Echoes",
    artist: "Elliot Dawn",
    date: "February 18, 2025",
    description: "A hauntingly beautiful collection exploring themes of solitude and renewal.",
    image: "/images/releases/midnight-echoes.jpg",
    coverArt: "/images/releases/midnight-echoes.jpg",
    previewAudio: "/audio/preview-midnight-echoes.mp3",
    type: "EP", // Added type property
    tracks: [
      { id: "track1", title: "Midnight Prelude", duration: "3:42", audioUrl: "/audio/track1.mp3" },
      { id: "track2", title: "Echoes of Dawn", duration: "4:17", audioUrl: "/audio/track2.mp3" },
      { id: "track3", title: "Solitude", duration: "5:30", audioUrl: "/audio/track3.mp3" }
    ]
  },
  {
    id: "summer-waves",
    title: "Summer Waves",
    artist: "Aurora Waves",
    date: "January 5, 2025",
    description: "Upbeat electronic tracks with tropical influences perfect for summer vibes.",
    image: "/images/releases/summer-waves.jpg",
    coverArt: "/images/releases/summer-waves.jpg",
    previewAudio: "/audio/preview-summer-waves.mp3",
    type: "Single", // Added type property
    tracks: [
      { id: "track1", title: "Ocean Drive", duration: "3:15", audioUrl: "/audio/sw-track1.mp3" },
      { id: "track2", title: "Sunset Blvd", duration: "4:30", audioUrl: "/audio/sw-track2.mp3" }
    ]
  }
];