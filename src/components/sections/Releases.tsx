// src/components/sections/Releases.tsx
'use client';
import { useState } from 'react';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import { useAudio } from '@/context/AudioContext';
import { releases } from '@/data/releases';

const Releases = () => {
  const { playTrack } = useAudio();
  const [selectedRelease, setSelectedRelease] = useState<any | null>(null);
  
  return (
    <section id="releases" className="py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-light mb-12">Releases</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {releases.map((release) => (
            <Card
              key={release.id}
              title={release.title}
              image={release.coverArt}
              onClick={() => setSelectedRelease(release)}
            />
          ))}
        </div>
      </div>
      
      <Modal
        isOpen={!!selectedRelease}
        onClose={() => setSelectedRelease(null)}
        title={selectedRelease?.title || ''}
      >
        {selectedRelease && (
          <div className="space-y-6">
            <div className="bg-gray-200 h-64 flex items-center justify-center rounded-lg">
              {selectedRelease.coverArt ? (
                <img 
                  src={selectedRelease.coverArt}
                  alt={selectedRelease.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-gray-400">Album Cover Placeholder</span>
              )}
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-medium">{selectedRelease.title}</h3>
                <p className="text-gray-600">{selectedRelease.artist}</p>
              </div>
              
              <button
                onClick={() => playTrack({
                  id: selectedRelease.id,
                  title: selectedRelease.title,
                  artist: selectedRelease.artist,
                  audioUrl: selectedRelease.previewAudio,
                  coverArt: selectedRelease.coverArt || '/placeholder.jpg'
                })}
                className="px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
              >
                Play
              </button>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Tracklist</h4>
              <ul className="space-y-2">
                {selectedRelease.tracks.map((track: any) => (
                  <li 
                    key={track.id}
                    className="flex justify-between items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
                    onClick={() => playTrack({
                      id: track.id,
                      title: track.title,
                      artist: selectedRelease.artist,
                      audioUrl: track.audioUrl,
                      coverArt: selectedRelease.coverArt || '/placeholder.jpg'
                    })}
                  >
                    <span>{track.title}</span>
                    <span className="text-gray-500">{track.duration}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Release Date</h4>
              <p>{selectedRelease.releaseDate}</p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-gray-700">{selectedRelease.description}</p>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};

export default Releases;