// src/components/sections/Shows.tsx
'use client';
import { useState, useEffect, useMemo } from 'react';
import { ExternalLink, Calendar, ChevronDown, Grid, List } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { shows } from '@/data/shows';
import ShowCard from '@/components/shows/ShowCard';
import ShowListItem from '@/components/shows/ShowListItem';
import ShowDetail from '@/components/shows/ShowDetail';
import FeaturedShow from '@/components/shows/FeaturedShow';
import { cn } from '@/lib/utils';
import { useModal } from '@/context/ModalContext';
import { Show, ShowDataFormat } from '@/types/show';
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

// Type for time filtering
type TimeFilterType = 'all' | 'upcoming' | 'past';

// Type for view mode
type ViewMode = 'grid' | 'list';

// Series filter options
const SERIES_OPTIONS = [
  { value: 'all', label: 'All Series' },
  { value: 'Late Fees', label: 'Late Fees' },
  { value: 'Afternoon Tea House', label: 'Afternoon Tea House' },
  { value: 'Handmade', label: 'Handmade' },
  { value: 'And Friends', label: 'And Friends' }
];

const Shows = () => {
  const { openModal } = useModal();
  const [timeFilter, setTimeFilter] = useState<TimeFilterType>('all');
  const [seriesFilter, setSeriesFilter] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showAllShows, setShowAllShows] = useState(false);
  
  // Detect if we're on mobile
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Observe the section for visibility
  const [sectionRef, isSectionVisible] = useIntersectionObserver<HTMLElement>({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '200px',
  });


  // Helper function to check if a show is upcoming
  const isUpcoming = (dateString: string) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    return eventDate >= today;
  };
  
  // Format date in a more readable way
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric'
    });
  };
  
  // Get featured show (first upcoming show or explicitly set featured one)
  const featuredShow = useMemo(() => {
    const upcomingShows = shows.filter(show => isUpcoming(show.date));
    return upcomingShows.length > 0 ? upcomingShows[0] : shows[0];
  }, []);
  
  // Apply both time and series filters, excluding the featured show
  const filteredShows = useMemo(() => {
    return shows
      .filter(show => show.id !== featuredShow.id)
      .filter(show => {
        // Apply time filter
        const passesTimeFilter = 
          timeFilter === 'all' ? true :
          timeFilter === 'upcoming' ? isUpcoming(show.date) :
          !isUpcoming(show.date);
        
        // Apply series filter
        const passesSeriesFilter = 
          seriesFilter === 'all' ? true :
          show.series === seriesFilter;
        
        // Show must pass both filters
        return passesTimeFilter && passesSeriesFilter;
      }).sort((a, b) => {
        // Sort by date (upcoming first, then past in reverse chronological order)
        const aDate = new Date(a.date);
        const bDate = new Date(b.date);
        
        if (isUpcoming(a.date) && !isUpcoming(b.date)) return -1;
        if (!isUpcoming(a.date) && isUpcoming(b.date)) return 1;
        
        // For upcoming events, sort by date (soonest first)
        if (isUpcoming(a.date)) {
          return aDate.getTime() - bDate.getTime();
        }
        
        // For past events, sort by date (most recent first)
        return bDate.getTime() - aDate.getTime();
      });
  }, [timeFilter, seriesFilter, featuredShow.id]);

  const handleShowClick = (show: ShowDataFormat) => {
    // For all devices, use the global modal
    openModal(show.title, (
      <ShowDetail
        show={show}
        isUpcoming={isUpcoming(show.date)}
        formatDate={formatDate}
      />
    ));
  };
  
  // Custom ShowCard optimized for lazy loading
  const OptimizedShowCard = ({ show, isUpcoming, formatDate, onClick }: {
  show: ShowDataFormat;
  isUpcoming: boolean;
  formatDate: (date: string) => string;
  onClick: () => void;
}) => (
    <div className="cursor-pointer" onClick={onClick}>
      <div className={cn(
        "aspect-[4/5] overflow-hidden rounded-lg",
        !isUpcoming && "grayscale-[30%] opacity-80"
      )}>
        <LazyImage 
          src={show.image}
          alt={show.title}
          imgClassName="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-900/80 via-surface-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      {/* Event details below the poster (always visible) */}
      <div className="mt-3 px-2">
        <h3 className="font-medium text-base truncate">{show.title}</h3>
        <p className="text-sm text-surface-600 truncate">{formatDate(show.date)}</p>
        <p className="text-xs text-surface-500 truncate">{show.venue}, {show.city}</p>
      </div>
    </div>
  );
  
  return (
    <section ref={sectionRef} id="shows" className="py-24 relative">
      <div className="container mx-auto px-6 relative z-10">
        <SectionHeader 
          title="Shows" 
          subtitle="We run shows every couple of months in beautiful unique locations around Montreal."
        />
        
        {/* Featured Show - Always load immediately */}
        <FeaturedShow 
          show={featuredShow}
          isUpcoming={isUpcoming(featuredShow.date)}
          formatDate={formatDate}
          onDetailsClick={() => handleShowClick(featuredShow)}
        />
        
        {/* Show More Button */}
        <div className="text-center mt-10">
          <Button
            variant="outline"
            className="bg-white/50 hover:bg-white/70 backdrop-blur-sm"
            onClick={() => setShowAllShows(!showAllShows)}
          >
            {showAllShows ? "Show Less" : `See All ${filteredShows.length + 1} Shows`}
          </Button>
        </div>
        
        {/* Additional Shows (Only shown when expanded) */}
        {showAllShows && (
          <>
            {/* Tab + Dropdown filtering UI */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 my-8">
              {/* Time filter tabs */}
              <div className="flex rounded-lg border border-surface-200 p-1 bg-white/60 backdrop-blur-sm">
                <button 
                  className={cn(
                    "px-4 py-2 text-sm rounded-md transition-colors",
                    timeFilter === 'all' 
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-white/50"
                  )}
                  onClick={() => setTimeFilter('all')}
                >
                  All
                </button>
                <button 
                  className={cn(
                    "px-4 py-2 text-sm rounded-md transition-colors",
                    timeFilter === 'upcoming' 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-white/50"
                  )}
                  onClick={() => setTimeFilter('upcoming')}
                >
                  Upcoming
                </button>
                <button 
                  className={cn(
                    "px-4 py-2 text-sm rounded-md transition-colors",
                    timeFilter === 'past' 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-white/50"
                  )}
                  onClick={() => setTimeFilter('past')}
                >
                  Past
                </button>
              </div>
              
              <div className="flex gap-4">
                {/* Series filter dropdown */}
                <div className="relative">
                  <select
                    value={seriesFilter}
                    onChange={(e) => setSeriesFilter(e.target.value)}
                    className="appearance-none px-4 py-2 pr-10 rounded-md border border-surface-200 bg-white/60 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {SERIES_OPTIONS.map(series => (
                      <option key={series.value} value={series.value}>
                        {series.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-500 pointer-events-none" size={14} />
                </div>
                
                {/* View mode toggle (only on desktop) */}
                {!isMobile && (
                  <div className="flex rounded-md border border-surface-200 p-1 bg-white/60 backdrop-blur-sm">
                    <button 
                      className={cn(
                        "p-1 rounded",
                        viewMode === 'grid' ? "bg-surface-200" : "hover:bg-white/50"
                      )}
                      onClick={() => setViewMode('grid')}
                      aria-label="Grid view"
                    >
                      <Grid size={18} />
                    </button>
                    <button 
                      className={cn(
                        "p-1 rounded",
                        viewMode === 'list' ? "bg-surface-200" : "hover:bg-white/50"
                      )}
                      onClick={() => setViewMode('list')}
                      aria-label="List view"
                    >
                      <List size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Display results count */}
            <p className="text-sm text-surface-500 mb-6">
              Showing {filteredShows.length} of {filteredShows.length} shows
            </p>
            
            {/* Shows grid/list view with background for cards */}
            {(viewMode === 'grid' || isMobile) ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredShows.map(show => (
                  <OptimizedShowCard
                    key={show.id}
                    show={show}
                    isUpcoming={isUpcoming(show.date)}
                    formatDate={formatDate}
                    onClick={() => handleShowClick(show)}
                  />
                ))}
              </div>
            ) : (
              // Desktop list view
              <div className="space-y-4 bg-white/30 backdrop-blur-sm rounded-lg p-4">
                {filteredShows.map(show => (
                  <div 
                    key={show.id}
                    onClick={() => handleShowClick(show)}
                    className="cursor-pointer"
                  >
                    <ShowListItem
                      show={show}
                      isUpcoming={isUpcoming(show.date)}
                      formatDate={formatDate}
                      onClick={() => {}} // Empty handler as we now handle clicks at the wrapper level
                    />
                  </div>
                ))}
              </div>
            )}
            
            {/* Empty state when no shows match filter */}
            {filteredShows.length === 0 && (
              <div className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-lg border border-surface-200">
                <p className="text-surface-500 mb-4">No shows found matching your filters.</p>
                <div className="flex gap-4 justify-center">
                  <Button 
                    variant="outline"
                    className="bg-white/50 hover:bg-white/70"
                    onClick={() => {
                      setTimeFilter('all');
                      setSeriesFilter('all');
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

export default Shows;