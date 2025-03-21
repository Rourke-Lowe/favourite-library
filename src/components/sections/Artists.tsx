// src/components/sections/Artists.tsx
'use client';
import { useState } from 'react';
import CardEnhanced from '@/components/ui/CardEnhanced';
import Modal from '@/components/ui/Modal';
import { artists } from '@/data/artists';
import SectionHeader from '@/components/ui/SectionHeader';
import { Instagram, Globe, Music } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const Artists = () => {
  const [selectedArtist, setSelectedArtist] = useState<any | null>(null);
  
  return (
    <section id="artists" className="py-24">
      <div className="container mx-auto px-6">
        <SectionHeader 
          title="Artists" 
          subtitle="Meet the talented musicians behind our sound and explore their releases."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artists.map((artist) => (
            <CardEnhanced
              key={artist.id}
              title={artist.name}
              subtitle={artist.genre || 'Artist'}
              image={artist.image}
              onClick={() => setSelectedArtist(artist)}
              aspectRatio="portrait"
            />
          ))}
        </div>
      </div>
      
      <Modal
        isOpen={!!selectedArtist}
        onClose={() => setSelectedArtist(null)}
        title={selectedArtist?.name || ''}
      >
        {selectedArtist && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="w-full sm:w-1/3">
                <div className="aspect-square bg-surface-200 rounded-lg overflow-hidden">
                  <img 
                    src={selectedArtist.image}
                    alt={selectedArtist.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Social Links */}
                {selectedArtist.links && (
                  <div className="flex justify-center gap-4 mt-4">
                    {selectedArtist.links.instagram && (
                      <a 
                        href={selectedArtist.links.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-surface-100 hover:bg-surface-200 transition-colors"
                        aria-label="Instagram"
                      >
                        <Instagram size={18} />
                      </a>
                    )}
                    {selectedArtist.links.website && (
                      <a 
                        href={selectedArtist.links.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-surface-100 hover:bg-surface-200 transition-colors"
                        aria-label="Website"
                      >
                        <Globe size={18} />
                      </a>
                    )}
                    {selectedArtist.links.soundcloud && (
                      <a 
                        href={selectedArtist.links.soundcloud}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-surface-100 hover:bg-surface-200 transition-colors"
                        aria-label="SoundCloud"
                      >
                        <Music size={18} />
                      </a>
                    )}
                  </div>
                )}
              </div>
              
              <div className="w-full sm:w-2/3 space-y-4">
                <h3 className="font-display text-display text-xl font-medium">{selectedArtist.name}</h3>
                <p className="text-surface-600">{selectedArtist.bio}</p>
                
                {/* Artist metadata */}
                {selectedArtist.genre && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-surface-700">Genre:</span>
                    <span className="text-surface-600">{selectedArtist.genre}</span>
                  </div>
                )}
                
                {selectedArtist.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-surface-700">Location:</span>
                    <span className="text-surface-600">{selectedArtist.location}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Releases */}
            {selectedArtist.releases?.length > 0 && (
              <div className="mt-8">
                <h4 className="font-display text-subtitle mb-4">Releases</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {selectedArtist.releases.map((release: any) => (
                    <div key={release.id} className="group relative">
                      <div className="aspect-square rounded-md overflow-hidden">
                        <img 
                          src={release.coverArt}
                          alt={release.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <Button variant="ghost" size="icon" className="text-white bg-black/50 hover:bg-black/70">
                            <Music size={18} />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm mt-2 font-medium">{release.title}</p>
                      <p className="text-xs text-surface-500">{release.releaseDate}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </section>
  );
};

export default Artists;