// src/components/releases/FeaturedRelease.tsx
'use client';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeaturedReleaseProps {
  release: any;
  onPlay: (track: any) => void;
  isPlaying: boolean;
  currentTrack: any;
  togglePlayPause: () => void;
  onDetailsClick: () => void;
  formatReleaseDate: (date: string) => string;
  getArtworkPath: (release: any) => string;
}

const FeaturedRelease = ({
  release,
  formatReleaseDate,
  getArtworkPath,
}: FeaturedReleaseProps) => {
  return (
    <div className="mt-10 mb-16">
      <div className="flex flex-col md:flex-row gap-8 md:gap-12">
        {/* Left side - Album artwork */}
        <div className="w-full md:w-2/5">
          <div className="aspect-square overflow-hidden">
            <img 
              src={getArtworkPath(release)}
              alt={release.title}
              className="w-full h-full object-cover shadow-md"
            />
          </div>
          
          {/* Release stage badge - if applicable */}
          {release.releaseStage === 'marketing' && (
            <div className="mt-3">
              <span className="inline-block px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                Coming Soon
              </span>
            </div>
          )}
        </div>
        
        {/* Right side - Release info */}
        <div className="w-full md:w-3/5">
          <div className="text-sm font-mono text-surface-500 uppercase mb-1">
            FEATURED {release.releaseType}
          </div>
          <h3 className="font-display text-2xl md:text-3xl font-medium mb-2">{release.title}</h3>
          <p className="text-surface-600 text-lg mb-4">{release.artists.join(', ')}</p>
          
          <div className="mb-4">
            <span className="text-sm text-surface-500">{formatReleaseDate(release.releaseDate)}</span>
          </div>
          
          {/* Genres - if available */}
          {release.genres && release.genres.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-surface-600 mb-2">Genres</h4>
              <div className="flex flex-wrap gap-2">
                {release.genres.map((genre, index) => (
                  <span 
                    key={index} 
                    className="px-2 py-1 bg-surface-100 rounded-full text-xs text-surface-700"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <p className="text-surface-700 mb-6 whitespace-pre-line">{release.description}</p>
          
          {/* Tracklist - if available */}
          {release.tracks && release.tracks.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-surface-600 mb-2">Tracklist</h4>
              <div className="space-y-1">
                {release.tracks.map((trackTitle, index) => (
                  <div key={index} className="flex items-center gap-3 py-1">
                    <span className="font-mono text-xs text-surface-400 w-5 text-right">{index + 1}</span>
                    <span>{trackTitle}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Streaming links */}
          <div className="flex flex-wrap gap-2 mt-8">
            {release.spotifyUrl && (
              <a 
                href={release.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-4 py-2 bg-surface-100 hover:bg-surface-200 rounded-full text-sm transition-colors"
              >
                <span>Listen on Spotify</span>
                <ExternalLink size={14} />
              </a>
            )}
            {release.appleMusicUrl && (
              <a 
                href={release.appleMusicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-4 py-2 bg-surface-100 hover:bg-surface-200 rounded-full text-sm transition-colors"
              >
                <span>Apple Music</span>
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
;

export default FeaturedRelease;