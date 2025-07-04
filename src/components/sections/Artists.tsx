// src/components/sections/Artists.tsx
'use client';
import { useLocalizedData } from '@/hooks/useLocalizedData';
import { useLanguage } from '@/context/LanguageContext';
import { useStaticContent } from '@/content/staticContent';
import type { Artist } from '@/types/artist';
import SectionHeader from '@/components/ui/SectionHeader';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { ExternalLink } from 'lucide-react';
import { useModal } from '@/context/ModalContext';

const Artists = () => {
  const { t } = useLanguage();
  const staticContent = useStaticContent();
  const { data: artists, loading, error } = useLocalizedData<Artist[]>('artists');
  const { openModal } = useModal();
  
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
            
            {/* Social Links */}
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
        
        {/* Releases */}
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
  
  if (loading) {
    return (
      <section className="py-24">
        <div className="container mx-auto px-6">
          <p>Loading artists...</p>
        </div>
      </section>
    );
  }
  
  if (error || !artists) {
    return (
      <section className="py-24">
        <div className="container mx-auto px-6">
          <p>Error loading artists</p>
        </div>
      </section>
    );
  }

  return (
    <section id="artists" className="py-24">
      <div className="container mx-auto px-6">
        <SectionHeader 
          title={t('nav.artists')} 
          subtitle={staticContent.sections.artists.description}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artists.map((artist) => {
            const isPastArtist = artist.status === 'Past' || 
                                (artist.endDate && new Date(artist.endDate) < new Date());
            
            return (
              <div 
                key={artist.id} 
                className={`group cursor-pointer ${isPastArtist ? 'opacity-70' : ''}`} 
                onClick={() => handleArtistClick(artist)}
              >
                {/* Fixed: Using aspect-[3/4] for consistent portrait dimensions */}
                <div className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-white/10 backdrop-blur-[2px] shadow-lg relative">
                  <OptimizedImage 
                    src={artist.image}
                    alt={artist.name}
                    imgClassName={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${isPastArtist ? 'grayscale' : ''}`}
                  />
                  
                  {isPastArtist && (
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      Past
                    </div>
                  )}
                </div>
                
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