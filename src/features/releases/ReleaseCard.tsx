'use client';

import React from 'react';
import { Release } from '@/lib/types';
import BaseCard from '@/components/ui/BaseCard';
import { Play, ExternalLink } from 'lucide-react';
import { useAudio, createTrackFromRelease } from '@/context/AudioContext';
import CardDetail from '@/components/ui/CardDetail';

interface ReleaseCardProps {
  release: Release;
}

const ReleaseCard: React.FC<ReleaseCardProps> = ({ release }) => {
  const { playTrack, currentTrack, isPlaying } = useAudio();
  const [showDetail, setShowDetail] = React.useState(false);
  
  const isCurrentTrack = currentTrack && 
    currentTrack.id === `release-preview-${release.id}` && isPlaying;
  
  const handlePlayToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    
    if (release.previewUrl) {
      const track = createTrackFromRelease(release);
      playTrack(track);
    }
  };
  
  const releaseDetailContent = (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Cover Art */}
        <div className="w-full sm:w-1/3">
          <div className="aspect-square rounded-lg overflow-hidden">
            <img
              src={release.coverArt}
              alt={`${release.title} by ${release.artist}`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* Release Info */}
        <div className="w-full sm:w-2/3 space-y-4">
          <div>
            <h3 className="text-xl font-bold">{release.title}</h3>
            <p className="text-gray-600">{release.artist}</p>
            <p className="text-sm text-gray-500 mt-1">{release.releaseDate} · {release.type.toUpperCase()}</p>
          </div>
          
          <p className="text-sm">{release.description}</p>
          
          {/* Streaming Links */}
          {release.streamingLinks && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Listen on:</h4>
              <div className="flex flex-wrap gap-3">
                {release.streamingLinks.spotify && (
                  <a
                    href={release.streamingLinks.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs"
                  >
                    <span>Spotify</span>
                    <ExternalLink size={12} />
                  </a>
                )}
                {release.streamingLinks.bandcamp && (
                  <a
                    href={release.streamingLinks.bandcamp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs"
                  >
                    <span>Bandcamp</span>
                    <ExternalLink size={12} />
                  </a>
                )}
                {release.streamingLinks.soundcloud && (
                  <a
                    href={release.streamingLinks.soundcloud}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs"
                  >
                    <span>SoundCloud</span>
                    <ExternalLink size={12} />
                  </a>
                )}
                {release.streamingLinks.appleMusic && (
                  <a
                    href={release.streamingLinks.appleMusic}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs"
                  >
                    <span>Apple Music</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Tracklist */}
      {release.tracklist && release.tracklist.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-3">Tracklist:</h4>
          <ul className="space-y-2">
            {release.tracklist.map((track, index) => (
              <li key={track.id} className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-sm">{index + 1}</span>
                  <span>{track.title}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-500 text-sm">{track.duration}</span>
                  {track.previewUrl && (
                    <button
                      className="p-1 rounded-full hover:bg-gray-200"
                      onClick={() => {/* Play track preview */}}
                    >
                      <Play size={16} />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
  
  return (
    <>
      <div className="relative group">
        <BaseCard
          title={`${release.title} - ${release.artist}`}
          image={release.coverArt}
          imageAlt={`${release.title} by ${release.artist}`}
          onClick={() => setShowDetail(true)}
        />
        
        {/* Play button overlay */}
        {release.previewUrl && (
          <button
            className="absolute bottom-16 right-4 p-2 bg-black text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handlePlayToggle}
            aria-label={isCurrentTrack ? "Pause" : "Play preview"}
          >
            {isCurrentTrack ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
              </svg>
            ) : (
              <Play size={16} />
            )}
          </button>
        )}
        
        {/* Release type badge */}
        <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          {release.type.toUpperCase()}
        </div>
      </div>
      
      <CardDetail
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        title={release.title}
      >
        {releaseDetailContent}
      </CardDetail>
    </>
  );
};

export default ReleaseCard;