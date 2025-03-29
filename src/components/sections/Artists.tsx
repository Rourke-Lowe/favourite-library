// src/components/sections/Artists.tsx
'use client';
import { useState } from 'react';
import { artists, Artist } from '@/data/artists';
import { ArtistDataFormat } from '@/types/artist';
import SectionHeader from '@/components/ui/SectionHeader';
import { 
  Instagram, 
  Globe, 
  Music, 
  Headphones, 
  Twitter, 
  Youtube, 
  Facebook, 
  Mail,
  ExternalLink 
} from 'lucide-react';

// Custom social media icons not available in Lucide React
const SpotifyIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M8 11.999c3.5 2 7.5 2 11 0"></path>
    <path d="M17 15c-2.5-1.5-5.5-1.5-8 0"></path>
    <path d="M9 9c2.5 1.5 5.5 1.5 8 0"></path>
  </svg>
);

const AppleMusicIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z"></path>
    <path d="M14.5 8a2.5 2.5 0 0 0-2.5 2.5v7"></path>
    <path d="M8.5 13a2.5 2.5 0 0 0 0 5H12a2.5 2.5 0 0 0 0-5H9"></path>
  </svg>
);

const TikTokIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 11V4a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v7h-5z"></path>
    <path d="M14 15a5 5 0 1 1-8-4V5"></path>
    <line x1="7" y1="15" x2="10" y2="15"></line>
  </svg>
);
import { useModal } from '@/context/ModalContext';

const Artists = () => {
  const { openModal } = useModal();
  
  // Function to get social icon based on link type - simplified, just for labels
  const getSocialLabel = (linkType: string) => {
    switch(linkType) {
      case 'instagram': return 'Instagram';
      case 'website': return 'Website';
      case 'soundcloud': return 'SoundCloud';
      case 'bandcamp': return 'Bandcamp';
      case 'spotify': return 'Spotify';
      case 'twitter': return 'Twitter';
      case 'youtube': return 'YouTube';
      case 'facebook': return 'Facebook';
      case 'email': return 'Email';
      case 'apple': return 'Apple Music';
      case 'tiktok': return 'TikTok';
      default: return 'Link';
    }
  };
  
  const handleArtistClick = (artist: Artist) => {
    openModal(artist.name, (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="w-full sm:w-1/3">
            <div className="aspect-square bg-surface-200 rounded-lg overflow-hidden">
              <img 
                src={artist.image}
                alt={artist.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Social Links - Using text labels for better visibility and accessibility */}
            {artist.links && Object.keys(artist.links).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {Object.entries(artist.links).map(([platform, url]) => {
                  if (!url) return null;
                  
                  const label = getSocialLabel(platform);
                  
                  return (
                    <a 
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-100 hover:bg-surface-200 text-xs transition-colors"
                      aria-label={label}
                    >
                      <ExternalLink size={14} />
                      <span>{label}</span>
                    </a>
                  );
                })}
              </div>
            )}
          </div>
          
          <div className="w-full sm:w-2/3 space-y-4">
            <h3 className="font-display text-display text-xl font-medium">{artist.name}</h3>
            
            <p className="text-surface-600">{artist.bio}</p>
            
            {/* Artist metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
              {artist.genre && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-surface-700">Genre:</span>
                  <span className="text-surface-600">{artist.genre}</span>
                </div>
              )}
              
              {artist.location && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-surface-700">Location:</span>
                  <span className="text-surface-600">{artist.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Releases - Simplified version without hover effects */}
        {artist.releases && artist.releases.length > 0 && (
          <div className="mt-8">
            <h4 className="font-display text-subtitle mb-4">Releases</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {artist.releases.map((release: any) => (
                <div key={release.id}>
                  <div className="aspect-square rounded-md overflow-hidden">
                    <img 
                      src={release.coverArt}
                      alt={release.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm mt-2 font-medium">{release.title}</p>
                  <p className="text-xs text-surface-500">{release.releaseDate}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    ));
  };
  
  return (
    <section id="artists" className="py-24">
      <div className="container mx-auto px-6">
        <SectionHeader 
          title="Artists" 
          subtitle="We work with amazing artists building beautiful words."
        />
        
        {/* All Artists - Single Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artists.map((artist) => {
            // Check if artist is no longer with favorite library
            const isPastArtist = artist.status === 'Past' || 
                                (artist.endDate && new Date(artist.endDate) < new Date());
            
            return (
              <div 
                key={artist.id} 
                className={`group cursor-pointer ${isPastArtist ? 'opacity-70' : ''}`} 
                onClick={() => handleArtistClick(artist)}
              >
                {/* Artist image - matching release styling */}
                <div className="aspect-portrait overflow-hidden rounded-lg bg-white/10 backdrop-blur-[2px] shadow-lg relative">
                  <img 
                    src={artist.image}
                    alt={artist.name}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${isPastArtist ? 'grayscale' : ''}`}
                  />
                  
                  {/* Past artist label */}
                  {isPastArtist && (
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      Past
                    </div>
                  )}
                </div>
                
                {/* Artist info below artwork - transparent background */}
                <div className="mt-3 px-1">
                  <h3 className="font-medium text-base truncate">{artist.name}</h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Artists;