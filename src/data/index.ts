// src/data/index.ts
import { Artist, Release, Show, MoodboardItem, MerchItem } from '@/lib/types';

export const artists: Artist[] = [
  {
    id: 'artist-1',
    name: 'Lunar Echo',
    image: '/assets/artist-1.jpg',
    bio: 'Lunar Echo creates atmospheric electronic music that blends ambient textures with subtle beats.',
    socialLinks: {
      instagram: 'https://instagram.com/lunarecho',
      twitter: 'https://twitter.com/lunarecho',
      website: 'https://lunarecho.com',
    }
  },
  {
    id: 'artist-2',
    name: 'Velvet Tide',
    image: '/assets/artist-2.jpg',
    bio: 'Velvet Tide crafts dreamlike indie pop with lush harmonies and introspective lyrics.',
    socialLinks: {
      instagram: 'https://instagram.com/velvettide',
      twitter: 'https://twitter.com/velvettide',
    }
  },
  {
    id: 'artist-3',
    name: 'Neon Forest',
    image: '/assets/artist-3.jpg',
    bio: 'Neon Forest explores the intersection of folk traditions and modern electronic production.',
    socialLinks: {
      instagram: 'https://instagram.com/neonforest',
      website: 'https://neonforest.bandcamp.com',
    }
  }
];

export const releases: Release[] = [
  {
    id: 'release-1',
    title: 'Midnight Bloom',
    artist: 'Lunar Echo',
    releaseDate: '2023-09-15',
    type: 'album',
    coverArt: '/assets/release-1.jpg',
    description: 'A journey through nocturnal soundscapes and ethereal textures.',
    previewUrl: '/assets/audio/preview-1.mp3',
    streamingLinks: {
      spotify: 'https://open.spotify.com/album/example1',
      bandcamp: 'https://lunarecho.bandcamp.com/album/midnight-bloom',
      soundcloud: 'https://soundcloud.com/lunarecho/sets/midnight-bloom',
    },
    tracklist: [
      { id: 'track-1-1', title: 'First Light', duration: '4:32' },
      { id: 'track-1-2', title: 'Shimmer', duration: '3:45', previewUrl: '/assets/audio/preview-1-2.mp3' },
      { id: 'track-1-3', title: 'Distant Stars', duration: '5:17' },
    ]
  },
  {
    id: 'release-2',
    title: 'Coastal',
    artist: 'Velvet Tide',
    releaseDate: '2023-07-22',
    type: 'ep',
    coverArt: '/assets/release-2.jpg',
    description: 'Five tracks exploring memories of summer and seaside nostalgia.',
    previewUrl: '/assets/audio/preview-2.mp3',
    streamingLinks: {
      spotify: 'https://open.spotify.com/album/example2',
      bandcamp: 'https://velvettide.bandcamp.com/album/coastal',
    },
    tracklist: [
      { id: 'track-2-1', title: 'Waves', duration: '3:12' },
      { id: 'track-2-2', title: 'Salt Air', duration: '4:05', previewUrl: '/assets/audio/preview-2-2.mp3' },
    ]
  },
  {
    id: 'release-3',
    title: 'Evergreen',
    artist: 'Neon Forest',
    releaseDate: '2023-11-03',
    type: 'single',
    coverArt: '/assets/release-3.jpg',
    description: 'A folk-electronic fusion exploring themes of nature and renewal.',
    previewUrl: '/assets/audio/preview-3.mp3',
    streamingLinks: {
      spotify: 'https://open.spotify.com/track/example3',
      soundcloud: 'https://soundcloud.com/neonforest/evergreen',
      appleMusic: 'https://music.apple.com/album/evergreen/example3',
    }
  }
];

export const shows: Show[] = [
  {
    id: 'show-1',
    title: 'Summer Solstice Showcase',
    date: '2023-06-21',
    time: '20:00',
    venue: 'Echo Garden',
    location: 'Los Angeles, CA',
    description: 'A special evening featuring all Favorite Library artists in an intimate garden setting.',
    artists: ['artist-1', 'artist-2', 'artist-3'],
    ticketLink: 'https://tickets.example.com/summer-solstice',
    image: '/assets/show-1.jpg'
  },
  {
    id: 'show-2',
    title: 'Lunar Echo: Ambient Night',
    date: '2023-08-12',
    time: '21:30',
    venue: 'The Blue Room',
    location: 'New York, NY',
    description: 'An immersive audio-visual experience featuring new material.',
    artists: ['artist-1'],
    ticketLink: 'https://tickets.example.com/lunar-echo-ambient',
    image: '/assets/show-2.jpg'
  },
  {
    id: 'show-3',
    title: 'Forest & Tide: Unplugged',
    date: '2023-09-05',
    time: '19:00',
    venue: 'Acoustic Loft',
    location: 'Portland, OR',
    description: 'An intimate unplugged session featuring stripped-back arrangements.',
    artists: ['artist-2', 'artist-3'],
    ticketLink: 'https://tickets.example.com/forest-tide-unplugged',
    image: '/assets/show-3.jpg'
  }
];

export const moodboard: MoodboardItem[] = [
  {
    id: 'mood-1',
    image: '/assets/mood-1.jpg',
    caption: 'Coastal dawn inspiration for upcoming Velvet Tide artwork',
    credit: 'Photo by @coastal_dreamer'
  },
  {
    id: 'mood-2',
    image: '/assets/mood-2.jpg',
    caption: 'Studio session with Lunar Echo',
    credit: 'Photo by Maria Chen'
  },
  {
    id: 'mood-3',
    image: '/assets/mood-3.jpg',
    caption: 'Forest textures informing Neon Forest\'s new direction',
    credit: 'Photo by @wilderness_collective'
  },
  {
    id: 'mood-4',
    image: '/assets/mood-4.jpg',
    caption: 'Light studies for upcoming show visuals',
    credit: 'Photo by Thomas Ray'
  }
];

export const merch: MerchItem[] = [
  {
    id: 'merch-1',
    title: 'Midnight Bloom Vinyl',
    price: 25,
    image: '/assets/merch-1.jpg',
    description: 'Limited edition 180g vinyl pressing of Lunar Echo\'s debut album.',
    available: true,
    storeLink: 'https://store.example.com/midnight-bloom-vinyl'
  },
  {
    id: 'merch-2',
    title: 'Favorite Library Tote',
    price: 18,
    image: '/assets/merch-2.jpg',
    description: 'Organic cotton tote with embroidered label logo.',
    available: true,
    storeLink: 'https://store.example.com/favorite-library-tote'
  },
  {
    id: 'merch-3',
    title: 'Neon Forest Tee',
    price: 22,
    image: '/assets/merch-3.jpg',
    description: 'Limited edition t-shirt featuring artwork from the Evergreen single.',
    sizes: ['S', 'M', 'L', 'XL'],
    available: true,
    storeLink: 'https://store.example.com/neon-forest-tee'
  }
];