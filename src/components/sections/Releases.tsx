// src/components/sections/Releases.tsx
'use client';
import { useState, useMemo } from 'react';
import { useAudio } from '@/context/AudioContext';
import { releases } from '@/data/releases';
import SectionHeader from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/button';
import { ExternalLink, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useModal } from '@/context/ModalContext';

// Get unique artists and release types for filters
const getUniqueArtists = () => {
  const artists = new Set<string>();
  releases.forEach(release => {
    release.artists.forEach(artist => artists.add(artist));
  });
  return ['All Artists', ...Array.from(artists)];
};

const RELEASE_TYPES = ['All Types', 'Single', 'EP', 'Album'];

const Releases = () => {
  const { openModal } = useModal();
  const { currentTrack } = useAudio(); // Keep reference to useAudio to avoid breaking context
  const [artistFilter, setArtistFilter] = useState('All Artists');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [showAllReleases, setShowAllReleases] = useState(false);

  // List of all unique artists for the dropdown
  const uniqueArtists = useMemo(() => getUniqueArtists(), []);
  
  // Get featured release (first one by default)
  const featuredRelease = useMemo(() => releases[0], []);
  
  // Function to format release date
  const formatReleaseDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Function to get the artwork path
  const getArtworkPath = (release) => {
    // Check if artworkPath exists and isn't "None"
    if (release.artworkPath && release.artworkPath !== 'None') {
      return `/images/releases/${release.artworkPath}`;
    }
    // Fallback for missing artwork
    return '/images/releases/placeholder.jpg';
  };

  // Filter releases based on selected filters, excluding the featured one
  const filteredReleases = useMemo(() => {
    return releases
      .filter(release => release.id !== featuredRelease.id)
      .filter(release => {
        // Filter by artist
        const passesArtistFilter = 
          artistFilter === 'All Artists' || 
          release.artists.includes(artistFilter);
        
        // Filter by type
        const passesTypeFilter = 
          typeFilter === 'All Types' || 
          release.releaseType === typeFilter;
        
        return passesArtistFilter && passesTypeFilter;
      });
  }, [artistFilter, typeFilter, featuredRelease.id]);

  // Limit to 3 releases if not showing all
  const displayedReleases = showAllReleases 
    ? filteredReleases 
    : filteredReleases.slice(0, 3);
  
  const handleReleaseClick = (release) => {
    openModal(release.title, (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Cover art without play overlay */}
          <div className="w-full sm:w-2/5">
            <div className="aspect-square bg-surface-200 rounded-lg overflow-hidden">
              <img 
                src={getArtworkPath(release)}
                alt={release.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Streaming links */}
            <div className="mt-4">
              <h5 className="text-sm font-medium mb-2">Listen on:</h5>
              <div className="flex flex-wrap gap-2">
                {release.spotifyUrl && (
                  <a 
                    href={release.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1 bg-surface-100 hover:bg-surface-200 rounded-full text-xs transition-colors"
                  >
                    <span>Spotify</span>
                    <ExternalLink size={12} />
                  </a>
                )}
                {release.appleMusicUrl && (
                  <a 
                    href={release.appleMusicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1 bg-surface-100 hover:bg-surface-200 rounded-full text-xs transition-colors"
                  >
                    <span>Apple Music</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          </div>
          
          {/* Release info */}
          <div className="w-full sm:w-3/5 space-y-4">
            <div>
              <div className="text-xs font-mono text-surface-500 uppercase mb-1">
                {release.releaseType} • {formatReleaseDate(release.releaseDate)}
              </div>
              <h3 className="font-display text-xl font-medium">{release.title}</h3>
              <p className="text-surface-600">{release.artists.join(', ')}</p>
            </div>
            
            <p className="text-surface-600 text-sm">{release.description}</p>
            
            {/* Genres */}
            {release.genres && release.genres.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Genres:</h4>
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
            
            {/* Release stage badge */}
            {release.releaseStage === 'marketing' && (
              <div className="inline-block px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                Coming Soon
              </div>
            )}
            
            {/* Tracklist - without play functionality */}
            {release.tracks && release.tracks.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-3">Tracklist:</h4>
                <div className="space-y-1">
                  {release.tracks.map((trackTitle, index) => {
                    return (
                      <div 
                        key={`track-${index}`}
                        className="flex items-center justify-between py-2 px-3 hover:bg-surface-100 rounded-md transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs text-surface-400 w-5 text-right">
                            {index + 1}
                          </span>
                          <span>{trackTitle}</span>
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
    ));
  };
  
  return (
    <section id="releases" className="py-24 relative">
      <div className="container mx-auto px-6 relative z-10">
        <SectionHeader 
          title="Releases" 
          subtitle="Artifacts of creation. Some of the gorgeous work that we've helped release."
        />

        {/* Featured Release Hero */}
        <div className="mt-10 mb-16">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Left side - Album artwork */}
            <div className="w-full md:w-2/5">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={getArtworkPath(featuredRelease)}
                  alt={featuredRelease.title}
                  className="w-full h-full object-cover shadow-md"
                />
              </div>
              
              {/* Release stage badge - if applicable */}
              {featuredRelease.releaseStage === 'marketing' && (
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
                FEATURED {featuredRelease.releaseType}
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-medium mb-2">{featuredRelease.title}</h3>
              <p className="text-surface-600 text-lg mb-4">{featuredRelease.artists.join(', ')}</p>
              
              <div className="mb-4">
                <span className="text-sm text-surface-500">{formatReleaseDate(featuredRelease.releaseDate)}</span>
              </div>
              
              {/* Genres - if available */}
              {featuredRelease.genres && featuredRelease.genres.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-surface-600 mb-2">Genres</h4>
                  <div className="flex flex-wrap gap-2">
                    {featuredRelease.genres.map((genre, index) => (
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
              
              <p className="text-surface-700 mb-6 whitespace-pre-line">{featuredRelease.description}</p>
              
              {/* Tracklist - if available */}
              {featuredRelease.tracks && featuredRelease.tracks.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-surface-600 mb-2">Tracklist</h4>
                  <div className="space-y-1">
                    {featuredRelease.tracks.map((trackTitle, index) => (
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
                {featuredRelease.spotifyUrl && (
                  <a 
                    href={featuredRelease.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-4 py-2 bg-surface-100 hover:bg-surface-200 rounded-full text-sm transition-colors"
                  >
                    <span>Listen on Spotify</span>
                    <ExternalLink size={14} />
                  </a>
                )}
                {featuredRelease.appleMusicUrl && (
                  <a 
                    href={featuredRelease.appleMusicUrl}
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
        
        {/* Show more/less button */}
        <div className="text-center mt-10">
          <Button
            variant="outline"
            className="bg-white/50 hover:bg-white/70 backdrop-blur-sm"
            onClick={() => setShowAllReleases(!showAllReleases)}
          >
            {showAllReleases ? "Show Less" : `See All ${filteredReleases.length + 1} Releases`}
          </Button>
        </div>

        {/* Additional releases - only shown when expanded */}
        {showAllReleases && (
          <>
            {/* Filtering options */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 my-8">
              {/* Release type filter buttons */}
              <div className="flex rounded-lg border border-surface-200 p-1 bg-white/60 backdrop-blur-sm">
                {RELEASE_TYPES.map(type => (
                  <button 
                    key={type}
                    className={cn(
                      "px-4 py-2 text-sm rounded-md transition-colors",
                      typeFilter === type 
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-white/50"
                    )}
                    onClick={() => setTypeFilter(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
              
              {/* Artist filter dropdown */}
              <div className="relative">
                <select
                  value={artistFilter}
                  onChange={(e) => setArtistFilter(e.target.value)}
                  className="appearance-none px-4 py-2 pr-10 rounded-md border border-surface-200 bg-white/60 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {uniqueArtists.map(artist => (
                    <option key={artist} value={artist}>
                      {artist}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-500 pointer-events-none" size={14} />
              </div>
            </div>
            
            {/* Display results count */}
            <p className="text-sm text-surface-500 mb-6">
              Showing {filteredReleases.length} of {filteredReleases.length} releases
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredReleases.map((release) => (
                <div key={release.id} className="group cursor-pointer" onClick={() => handleReleaseClick(release)}>
                  {/* Album artwork - square format with simple zoom on hover */}
                  <div className="aspect-square overflow-hidden rounded-lg bg-white/10 backdrop-blur-[2px] shadow-lg">
                    <img 
                      src={getArtworkPath(release)}
                      alt={release.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  
                  {/* Release info below artwork */}
                  <div className="mt-3 px-1">
                    <h3 className="font-medium text-base truncate">{release.title}</h3>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-surface-600 truncate">{release.artists.join(', ')}</p>
                      <span className="text-xs text-surface-500">{release.releaseType}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No results message */}
            {filteredReleases.length === 0 && (
              <div className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-lg border border-surface-200">
                <p className="text-surface-500 mb-4">No releases found matching your filters.</p>
                <div className="flex gap-4 justify-center">
                  <Button 
                    variant="outline"
                    className="bg-white/50 hover:bg-white/70"
                    onClick={() => {
                      setArtistFilter('All Artists');
                      setTypeFilter('All Types');
                    }}
                  >
                    Clear All Filters
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Releases;