'use client';

import React, { useState } from 'react';
import { Artist, Release } from '@/lib/types';
import BaseCard from '@/components/ui/BaseCard';
import CardDetail from '@/components/ui/CardDetail';
import { Instagram, Twitter, Globe } from 'lucide-react';

interface ArtistCardProps {
  artist: Artist;
  artistReleases?: Release[];
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist, artistReleases = [] }) => {
  const [showDetail, setShowDetail] = useState(false);
  
  const detailContent = (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Artist Image */}
        <div className="w-full sm:w-1/3">
          <div className="aspect-square rounded-lg overflow-hidden">
            <img
              src={artist.image}
              alt={artist.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* Artist Info */}
        <div className="w-full sm:w-2/3 space-y-4">
          <div>
            <h3 className="text-xl font-bold">{artist.name}</h3>
          </div>
          
          <p className="text-sm">{artist.bio}</p>
          
          {/* Social Links */}
          {artist.socialLinks && (
            <div className="flex gap-4 mt-4">
              {artist.socialLinks.instagram && (
                <a
                  href={artist.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900"
                  aria-label={`${artist.name} on Instagram`}
                >
                  <Instagram size={20} />
                </a>
              )}
              {artist.socialLinks.twitter && (
                <a
                  href={artist.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900"
                  aria-label={`${artist.name} on Twitter`}
                >
                  <Twitter size={20} />
                </a>
              )}
              {artist.socialLinks.website && (
                <a
                  href={artist.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900"
                  aria-label={`${artist.name}'s Website`}
                >
                  <Globe size={20} />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Artist Releases */}
      {artistReleases.length > 0 && (
        <div>
          <h4 className="text-lg font-medium mb-4">Releases</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {artistReleases.map(release => (
              <div key={release.id} className="rounded-lg overflow-hidden shadow">
                <div className="aspect-square">
                  <img 
                    src={release.coverArt} 
                    alt={release.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <div className="text-xs text-gray-500 mb-1">{release.type.toUpperCase()}</div>
                  <h5 className="font-medium text-sm">{release.title}</h5>
                  <div className="text-xs text-gray-600 mt-1">{release.releaseDate}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
  
  return (
    <>
      <BaseCard
        title={artist.name}
        image={artist.image}
        imageAlt={artist.name}
        onClick={() => setShowDetail(true)}
      />
      
      <CardDetail
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        title={artist.name}
      >
        {detailContent}
      </CardDetail>
    </>
  );
};

export default ArtistCard;