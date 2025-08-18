// src/components/sections/Releases.tsx
'use client';
import { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useStaticContent } from '@/content/staticContent';
import type { Release } from '@/types/releases';
import type { LocalizedSiteData } from '@/lib/dataLoader';
import SectionHeader from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/button';
import { ExternalLink, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useModal } from '@/context/ModalContext';
import { ReleaseDataFormat } from '@/types/releases';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

// LazyImage component for optimized image loading
interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  onClick?: () => void;
}

const LazyImage = ({ src, alt, className, imgClassName, onClick }: LazyImageProps) => {
  const [ref, isInView] = useIntersectionObserver<HTMLDivElement>({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '200px',
  });
  
  const [isLoaded, setIsLoaded] = useState(false);
  
  return (
    <div 
      ref={ref} 
      className={cn("relative overflow-hidden", className)}
      onClick={onClick}
    >
      {/* Placeholder */}
      {(!isLoaded || !isInView) && (
        <div className="absolute inset-0 bg-surface-200 animate-pulse"></div>
      )}
      
      {/* Only render image when in viewport */}
      {isInView && (
        <img 
          src={src} 
          alt={alt} 
          className={cn(
            "transition-opacity duration-500",
            isLoaded ? "opacity-100" : "opacity-0",
            imgClassName
          )}
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </div>
  );
};

const getArtworkPath = (release: ReleaseDataFormat) => {
  // Check if artworkPath exists and isn't "None"
  if (release.artworkPath && release.artworkPath !== 'None') {
    return `/images/releases/${release.artworkPath}`;
  }
  // Fallback for missing artwork
  return '/images/releases/placeholder.jpg';
};

interface ReleasesProps {
  siteData: LocalizedSiteData;
}

const Releases = ({ siteData }: ReleasesProps) => {
  // ==================================
  // 1. ALL HOOKS FIRST (NO EXCEPTIONS!)
  // ==================================
  
  // Language and content hooks
  const { t, formatDate, locale } = useLanguage();
  const staticContent = useStaticContent();
  const currentLocale = (locale === 'fr') ? 'fr' : 'en';
  const releases = siteData[currentLocale]?.releases || [];
  
  // Modal hook
  const { openModal } = useModal();
  
  // State hooks
  const [artistFilter, setArtistFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showAllReleases, setShowAllReleases] = useState(false);
  
  // Intersection observer hook
  const [sectionRef, isSectionVisible] = useIntersectionObserver<HTMLElement>({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '200px',
  });


  // ==================================
  // 2. COMPUTED VALUES (useMemo)
  // ==================================
  
  // Unique artists - handle null data
  const uniqueArtists = useMemo(() => {
    if (!releases) return [t('releases.allArtists')];
    
    const artists = new Set<string>();
    releases.forEach(release => {
      release.artists.forEach((artist: string) => artists.add(artist));
    });
    return [t('releases.allArtists'), ...Array.from(artists)];
  }, [releases, t]);
  
  // Release types
  const RELEASE_TYPES = useMemo(() => 
    [t('releases.allTypes'), 'Single', 'EP', 'Album'], 
    [t]
  );
  
  // Featured release - handle null data
  const featuredRelease = useMemo(() => {
    if (!releases || releases.length === 0) return null;
    return releases[0];
  }, [releases]);
  
  // Filtered releases - SIMPLIFIED like Shows section
  const filteredReleases = useMemo(() => {
    if (!releases) return [];
    
    return releases
      .filter(release => release.id !== featuredRelease?.id)
      .filter(release => {
        // Simple string comparison - no translation matching!
        const passesArtistFilter = 
          artistFilter === 'all' || 
          release.artists.includes(artistFilter);
        
        const passesTypeFilter = 
          typeFilter === 'all' || 
          release.releaseType === typeFilter;
        
        return passesArtistFilter && passesTypeFilter;
      });
  }, [releases, artistFilter, typeFilter, featuredRelease]);
  
  // Display releases
  const displayedReleases = showAllReleases 
    ? filteredReleases 
    : [];

  // Temporary debug - remove after fixing
  useEffect(() => {
    console.log('Debug Info:');
    console.log('Total releases:', releases?.length);
    console.log('Featured release:', featuredRelease?.title);
    console.log('Artist filter:', artistFilter);
    console.log('Type filter:', typeFilter);
    console.log('t("releases.allArtists"):', t('releases.allArtists'));
    console.log('t("releases.allTypes"):', t('releases.allTypes'));
    console.log('Filtered releases count:', filteredReleases.length);
    console.log('Show button?', filteredReleases.length > 0);
  }, [releases, featuredRelease, artistFilter, typeFilter, filteredReleases, t]);

  // ==================================
  // 3. HELPER FUNCTIONS
  // ==================================
  
  const formatReleaseDate = (dateString: string) => {
    return formatDate(dateString);
  };

  // ==================================
  // 4. DATA VALIDATION
  // ==================================
  
  if (!releases || releases.length === 0) {
    return (
      <section className="py-24">
        <div className="container mx-auto px-6">
          <p className="text-center">No releases found</p>
        </div>
      </section>
    );
  }

  
  const handleReleaseClick = (release: ReleaseDataFormat) => {
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
              <h5 className="text-sm font-medium mb-2">{t('releases.listen')}:</h5>
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
                <h4 className="text-sm font-medium mb-2">{t('releases.genres')}:</h4>
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
                <h4 className="text-sm font-medium mb-3">{t('releases.tracklist')}:</h4>
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
    <section ref={sectionRef} id="releases" className="py-24 relative">
      <div className="container mx-auto px-6 relative z-10">
        <SectionHeader 
          title={t('nav.releases')} 
          subtitle={staticContent.sections.releases.description}
        />

        {/* Featured Release Hero - Always load immediately */}
        {featuredRelease && (
          <div className="mt-10 mb-16">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12">
              {/* Left side - Album artwork */}
              <div className="w-full md:w-2/5">
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={getArtworkPath(featuredRelease)}
                    alt={featuredRelease.title}
                    className="w-full h-full object-cover shadow-md"
                    loading="eager" // Use eager loading for featured content
                  />
                </div>
                
                {/* Release stage badge - if applicable */}
                {featuredRelease.releaseStage === 'marketing' && (
                  <div className="mt-3">
                    <span className="inline-block px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                      {t('releases.comingSoon')}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Right side - Release info */}
              <div className="w-full md:w-3/5">
                <div className="text-sm font-mono text-surface-500 uppercase mb-1">
                  {t('releases.featuredRelease')} {featuredRelease.releaseType}
                </div>
                <h3 className="font-display text-2xl md:text-3xl font-medium mb-2">{featuredRelease.title}</h3>
                <p className="text-surface-600 text-lg mb-4">{featuredRelease.artists.join(', ')}</p>
                
                <div className="mb-4">
                  <span className="text-sm text-surface-500">{formatReleaseDate(featuredRelease.releaseDate)}</span>
                </div>
                
                {/* Genres - if available */}
                {featuredRelease.genres && featuredRelease.genres.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-surface-600 mb-2">{t('releases.genres')}</h4>
                    <div className="flex flex-wrap gap-2">
                      {featuredRelease.genres.map((genre: string, index: number) => (
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
                    <h4 className="text-sm font-medium text-surface-600 mb-2">{t('releases.tracklist')}</h4>
                    <div className="space-y-1">
                      {featuredRelease.tracks.map((trackTitle: string, index: number) => (
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
                      <span>{t('releases.listen')} on Spotify</span>
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
        )}
        
        {/* Show More Button */}
        {filteredReleases.length > 0 && (
          <div className="text-center mt-10">
            <Button
              variant="outline"
              onClick={() => setShowAllReleases(!showAllReleases)}
            >
              {showAllReleases ? t('common.showLess') : t('common.showMore')}
            </Button>
          </div>
        )}

        {/* Additional releases - only shown when expanded */}
        {showAllReleases && (
          <>
            {/* Filtering options */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 my-8">
              {/* Release type filter buttons */}
              <div className="flex rounded-lg border border-surface-200 p-1 bg-white/10 backdrop-blur-sm">
                <button 
                  className={cn(
                    "px-4 py-2 text-sm rounded-md transition-colors",
                    typeFilter === 'all' 
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-white/50"
                  )}
                  onClick={() => setTypeFilter('all')}
                >
                  {t('releases.allTypes')}
                </button>
                {['Single', 'EP', 'Album'].map(type => (
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
                  className="appearance-none px-4 py-2 pr-10 rounded-md border border-surface-200 bg-white/10 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="all">{t('releases.allArtists')}</option>
                  {/* Get unique artists from releases */}
                  {Array.from(new Set(
                    releases?.flatMap(r => r.artists) || []
                  )).map(artist => (
                    <option key={artist} value={artist}>
                      {artist}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-500 pointer-events-none" size={14} />
              </div>
            </div>
            
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedReleases.map((release) => (
                <div key={release.id} className="group cursor-pointer" onClick={() => handleReleaseClick(release)}>
                  {/* Album artwork - square format with simple zoom on hover */}
                  <div className="aspect-square overflow-hidden rounded-lg bg-white/10 backdrop-blur-[2px] shadow-lg">
                    <LazyImage 
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
              <div className="text-center py-16 bg-white/10 backdrop-blur-sm rounded-lg border border-surface-200">
                <p className="text-surface-500 mb-4">{t('releases.noResults')}</p>
                <div className="flex gap-4 justify-center">
                  <Button 
                    variant="outline"
                    className="bg-white/10 hover:bg-white/20"
                    onClick={() => {
                      setArtistFilter(t('releases.allArtists'));
                      setTypeFilter(t('releases.allTypes'));
                    }}
                  >
                    {t('releases.clearFilters')}
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