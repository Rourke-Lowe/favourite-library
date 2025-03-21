// src/components/sections/Releases.tsx
'use client';
import { useState } from 'react';
import CardEnhanced from '@/components/ui/CardEnhanced';
import Modal from '@/components/ui/Modal';
import { useAudio } from '@/context/AudioContext';
import { releases } from '@/data/releases';
import SectionHeader from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { Play, ExternalLink, PauseCircle } from 'lucide-react';

const Releases = () => {
  const { playTrack, currentTrack, isPlaying, togglePlayPause } = useAudio();
  const [selectedRelease, setSelectedRelease] = useState<any | null>(null);
  
  // Function to format release date
  const formatReleaseDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  return (
    <section id="releases" className="py-24 bg-surface-50">
      <div className="container mx-auto px-6">
        <SectionHeader 
          title="Releases" 
          subtitle="Explore our catalog of albums, EPs, and singles from our talented artists."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {releases.map((release) => (
            <CardEnhanced
              key={release.id}
              title={release.title}
              subtitle={release.artist}
              image={release.coverArt}
              onClick={() => setSelectedRelease(release)}
              aspectRatio="square"
              badge={release.type.toUpperCase()}
              className="bg-white"
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
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Cover art with play overlay */}
              <div className="w-full sm:w-2/5">
                <div className="aspect-square bg-surface-200 rounded-lg overflow-hidden relative group">
                  <img 
                    src={selectedRelease.coverArt}
                    alt={selectedRelease.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Play button overlay */}
                  {selectedRelease.previewAudio && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="bg-white/90 text-black hover:bg-white h-16 w-16 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          playTrack({
                            id: selectedRelease.id,
                            title: selectedRelease.title,
                            artist: selectedRelease.artist,
                            audioUrl: selectedRelease.previewAudio,
                            coverArt: selectedRelease.coverArt
                          });
                        }}
                      >
                        <Play size={30} className="ml-1" />
                      </Button>
                    </div>
                  )}
                </div>
                
                {/* Streaming links */}
                {selectedRelease.streamingLinks && (
                  <div className="mt-4">
                    <h5 className="text-sm font-medium mb-2">Listen on:</h5>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(selectedRelease.streamingLinks).map(([platform, url]) => (
                        <a 
                          key={platform}
                          href={url as string}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1 bg-surface-100 hover:bg-surface-200 rounded-full text-xs transition-colors"
                        >
                          <span className="capitalize">{platform}</span>
                          <ExternalLink size={12} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Release info */}
              <div className="w-full sm:w-3/5 space-y-4">
                <div>
                  <div className="text-xs font-mono text-surface-500 uppercase mb-1">
                    {selectedRelease.type} • {formatReleaseDate(selectedRelease.releaseDate)}
                  </div>
                  <h3 className="font-display text-xl font-medium">{selectedRelease.title}</h3>
                  <p className="text-surface-600">{selectedRelease.artist}</p>
                </div>
                
                <p className="text-surface-600 text-sm">{selectedRelease.description}</p>
                
                {selectedRelease.tracks && selectedRelease.tracks.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-3">Tracklist:</h4>
                    <div className="space-y-1">
                      {selectedRelease.tracks.map((track: any, index: number) => {
                        const isCurrentTrack = currentTrack && track.id === currentTrack.id;
                        
                        return (
                          <div 
                            key={track.id}
                            className={`flex items-center justify-between py-2 px-3 hover:bg-surface-100 rounded-md cursor-pointer transition-colors ${
                              isCurrentTrack ? 'bg-surface-100' : ''
                            }`}
                            onClick={() => {
                              if (isCurrentTrack && isPlaying) {
                                togglePlayPause();
                              } else {
                                playTrack({
                                  id: track.id,
                                  title: track.title,
                                  artist: selectedRelease.artist,
                                  audioUrl: track.audioUrl,
                                  coverArt: selectedRelease.coverArt
                                });
                              }
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-xs text-surface-400 w-5 text-right">
                                {index + 1}
                              </span>
                              <span className={isCurrentTrack ? 'text-primary' : ''}>
                                {track.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-surface-500 text-sm">{track.duration}</span>
                              {isCurrentTrack ? (
                                <PauseCircle size={16} className={isPlaying ? 'text-primary' : ''} />
                              ) : (
                                <Play size={16} />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};

export default Releases;