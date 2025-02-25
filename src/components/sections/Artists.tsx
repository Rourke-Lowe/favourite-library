// src/components/sections/Artists.tsx
'use client';
import { useState } from 'react';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import { artists } from '@/data/artists';

const Artists = () => {
  const [selectedArtist, setSelectedArtist] = useState<any | null>(null);
  
  return (
    <section id="artists" className="py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-light mb-12">Artists</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artists.map((artist) => (
            <Card
              key={artist.id}
              title={artist.name}
              image={artist.image}
              onClick={() => setSelectedArtist(artist)}
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
            <div className="bg-gray-200 h-64 flex items-center justify-center rounded-lg">
              {selectedArtist.image ? (
                <img 
                  src={selectedArtist.image}
                  alt={selectedArtist.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-gray-400">Artist Image Placeholder</span>
              )}
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-2">{selectedArtist.name}</h3>
              <p className="text-gray-700">{selectedArtist.bio}</p>
            </div>
            
            {selectedArtist.releases?.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Releases</h4>
                <div className="grid grid-cols-2 gap-4">
                  {selectedArtist.releases.map((release: any) => (
                    <div key={release.id} className="text-center">
                      <img 
                        src={release.coverArt}
                        alt={release.title}
                        className="w-full h-32 object-cover rounded-lg mb-2"
                      />
                      <p className="text-sm">{release.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {selectedArtist.links && (
              <div>
                <h4 className="font-medium mb-2">Links</h4>
                <div className="flex space-x-4">
                  {Object.entries(selectedArtist.links).map(([platform, url]) => (
                    <a 
                      key={platform}
                      href={url as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-500 hover:underline"
                    >
                      {platform}
                    </a>
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