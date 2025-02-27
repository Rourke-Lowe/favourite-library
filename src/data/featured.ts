export interface FeaturedContent {
    type: 'release' | 'artist' | 'show';
    id: string;
    tagline: string;
  }
  
  export const featuredContent: FeaturedContent = {
    type: 'show',
    id: 'spring-showcase',
    tagline: 'upcoming show!!!'
  };