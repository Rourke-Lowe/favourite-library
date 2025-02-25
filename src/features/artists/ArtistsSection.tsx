'use client';

import React from 'react';
import { Artist, Release } from '@/lib/types';
import ArtistCard from './ArtistCard';

interface ArtistsSectionProps {
  artists: Artist[];
  releases: Release[];
}

const ArtistsSection: React.FC<ArtistsSectionProps> = ({ artists, releases }) => {
  // Get releases for each artist
  const getArtistReleases = (artistId: string) => {
    return releases.filter(release => 
      release.artist === artists.find(a => a.id === artistId)?.name
    );
  };

  return (
    <section id="artists" className="py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">Artists</h2>
        <p className="text-lg mb-12 max-w-2xl">
          Meet the talented musicians behind our sound.
        </p>
        
        {/* Artists Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {artists.map(artist => (
            <ArtistCard 
              key={artist.id} 
              artist={artist} 
              artistReleases={getArtistReleases(artist.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArtistsSection;