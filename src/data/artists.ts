export interface Artist {
  id: string;
  name: string;
  bio: string;
  image: string;
  links?: {
    instagram?: string;
    spotify?: string;
    bandcamp?: string;
  };
  releases?: string[]; // IDs referencing releases
}

export const artists = [
  {
    id: "elliot-dawn",
    name: "Elliot Dawn",
    bio: "Electronic music producer known for ambient soundscapes and introspective compositions.",
    image: "/images/artists/elliot-dawn.jpg",
    links: {
      instagram: "https://instagram.com/elliot-dawn",
      spotify: "https://spotify.com/artist/elliot-dawn",
      bandcamp: "https://elliotdawn.bandcamp.com"
    },
    releases: ["midnight-echoes"]
  },
  {
    id: "aurora-waves",
    name: "Aurora Waves",
    bio: "Production duo creating vibrant electronic music with tropical influences and upbeat rhythms.",
    image: "/images/artists/aurora-waves.jpg",
    links: {
      instagram: "https://instagram.com/aurora-waves",
      spotify: "https://spotify.com/artist/aurora-waves"
    },
    releases: ["summer-waves"]
  }
];