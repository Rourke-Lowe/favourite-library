  export interface Artist {
    id: string;
    name: string;
    bio: string;
    image: string;
    startDate: string; 
    endDate?: string;
    status?: 'Active' | 'Past' | 'Inactive';
    genre?: string;
    location?: string;
    links?: {
        instagram?: string;
        website?: string;
        soundcloud?: string;
        spotify?: string;
        bandcamp?: string;
        tiktok?: string;
        apple?: string;
        youtube?: string;
        twitter?: string;
        facebook?: string;
        email?: string;
        [key: string]: string | undefined;
      };
    releases?: ArtistRelease[];
}

export interface ArtistRelease {
    id: string;
    title: string;
    coverArt: string;
    releaseDate: string;
}

// Add this type alias
export type ArtistDataFormat = Artist;