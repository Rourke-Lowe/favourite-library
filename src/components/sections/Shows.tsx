// src/components/sections/Shows.tsx
'use client';
import { useState, useMemo } from 'react';
import { ExternalLink, ChevronDown, Grid, List } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useLocalizedData } from '@/hooks/useLocalizedData';
import { useLanguage } from '@/context/LanguageContext';
import { useStaticContent } from '@/content/staticContent';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import type { Show } from '@/types/show';
import ShowCard from '@/components/shows/ShowCard';
import ShowListItem from '@/components/shows/ShowListItem';
import ShowDetail from '@/components/shows/ShowDetail';
import FeaturedShow from '@/components/shows/FeaturedShow';
import { cn } from '@/lib/utils';
import { useModal } from '@/context/ModalContext';
import { ShowDataFormat } from '@/types/show';

const Shows = () => {
  // ========================================
  // SECTION 1: ALL HOOKS (NO EXCEPTIONS!)
  // ========================================
  
  // Translation hooks
  const { t, formatDate } = useLanguage();
  const staticContent = useStaticContent();
  const { data: shows, loading, error } = useLocalizedData<Show[]>('shows');
  
  // Modal hook
  const { openModal } = useModal();
  
  // State hooks - KEEP ALL YOUR EXISTING ONES!
  const [timeFilter, setTimeFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [seriesFilter, setSeriesFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAllShows, setShowAllShows] = useState(false);
  
  // Media query hook
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Intersection observer
  const [sectionRef, isSectionVisible] = useIntersectionObserver<HTMLElement>({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  // ========================================
  // SECTION 2: HELPER FUNCTIONS
  // ========================================
  
  const isUpcoming = (dateString: string) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate >= today;
  };
  
  // ========================================
  // SECTION 3: MEMOIZED VALUES
  // ========================================
  
  // Series options - with translation
  const SERIES_OPTIONS = useMemo(() => [
    { value: 'all', label: t('shows.allShows') },
    { value: 'Late Fees', label: 'Late Fees' },
    { value: 'Afternoon Tea House', label: 'Afternoon Tea House' },
    { value: 'Handmade', label: 'Handmade' },
    { value: 'And Friends', label: 'And Friends' },
    { value: 'Common Ground', label: 'Common Ground' }
  ], [t]);
  
  // Featured show - handle null data
  const featuredShow = useMemo(() => {
    if (!shows || shows.length === 0) return null;
    const upcomingShows = shows.filter(show => isUpcoming(show.date));
    return upcomingShows.length > 0 ? upcomingShows[0] : shows[0];
  }, [shows]);
  
  // Filtered shows - handle null data
  const filteredShows = useMemo(() => {
    if (!shows) return [];
    
    return shows
      .filter(show => show.id !== featuredShow?.id)
      .filter(show => {
        const passesTimeFilter = 
          timeFilter === 'all' ? true :
          timeFilter === 'upcoming' ? isUpcoming(show.date) :
          !isUpcoming(show.date);
        
        const passesSeriesFilter = 
          seriesFilter === 'all' || 
          show.series === seriesFilter;
        
        return passesTimeFilter && passesSeriesFilter;
      });
  }, [shows, timeFilter, seriesFilter, featuredShow]);
  
  // Display shows
  const displayedShows = showAllShows 
    ? filteredShows 
    : filteredShows.slice(0, 6);
  
  // ========================================
  // SECTION 4: EVENT HANDLERS
  // ========================================
  
  const handleShowClick = (show: Show) => {
    openModal(show.title, (
      <ShowDetail show={show} />
    ));
  };
  
  // ========================================
  // SECTION 5: LOADING/ERROR (AFTER ALL HOOKS!)
  // ========================================
  
  if (loading) {
    return (
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <p className="text-surface-600">{t('common.loading')}</p>
          </div>
        </div>
      </section>
    );
  }
  
  if (error || !shows) {
    return (
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <p className="text-red-600 mb-2">{t('common.error')}</p>
            <button 
              onClick={() => window.location.reload()}
              className="text-primary underline"
            >
              {t('common.retry')}
            </button>
          </div>
        </div>
      </section>
    );
  }
  
  // ========================================
  // SECTION 6: MAIN RENDER
  // ========================================
  
  return (
    <section ref={sectionRef} id="shows" className="py-24 relative">
      <div className="container mx-auto px-6">
        <SectionHeader 
          title={t('nav.shows')} 
          subtitle={staticContent.sections.shows.description}
        />
        
        {/* CTA Section */}
        <div className="text-center mb-8">
          <p className="text-surface-600">
            {staticContent.sections.shows.ctaText}{' '}
            <a href="/contact" className="text-primary underline">
              {staticContent.sections.shows.ctaLink}
            </a>
          </p>
        </div>
        
        {/* Featured Show */}
        {featuredShow && (
          <FeaturedShow 
            show={featuredShow}
            isUpcoming={isUpcoming(featuredShow.date)}
            formatDate={formatDate}
            onDetailsClick={() => handleShowClick(featuredShow)}
          />
        )}
        
        {/* Show More Button */}
        <div className="text-center mt-10">
          <Button
            variant="outline"
            onClick={() => setShowAllShows(!showAllShows)}
          >
{showAllShows ? t('common.showLess') : t('shows.allShows')}
          </Button>
        </div>
        
        {/* Additional Shows */}
        {showAllShows && (
          <>
            {/* Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 my-8">
              {/* Time filter */}
              <div className="flex rounded-lg border border-surface-200 p-1">
                {(['all', 'upcoming', 'past'] as const).map(filter => (
                  <button 
                    key={filter}
                    className={cn(
                      "px-4 py-2 text-sm rounded-md capitalize transition-colors",
                      timeFilter === filter 
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-surface-100"
                    )}
                    onClick={() => setTimeFilter(filter)}
                  >
{filter === 'all' ? t('shows.allShows') : filter === 'upcoming' ? t('shows.upcoming') : t('shows.past')}
                  </button>
                ))}
              </div>
              
              <div className="flex gap-4">
                {/* Series filter */}
                <div className="relative">
                  <select
                    value={seriesFilter}
                    onChange={(e) => setSeriesFilter(e.target.value)}
                    className="appearance-none px-4 py-2 pr-10 rounded-md border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {SERIES_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-500 pointer-events-none" size={14} />
                </div>
                
                {/* View mode toggle */}
                {!isMobile && (
                  <div className="flex rounded-md border border-surface-200 p-1">
                    <button 
                      className={cn(
                        "p-1 rounded",
                        viewMode === 'grid' ? "bg-surface-200" : "hover:bg-surface-100"
                      )}
                      onClick={() => setViewMode('grid')}
aria-label="Grid view"
                    >
                      <Grid size={18} />
                    </button>
                    <button 
                      className={cn(
                        "p-1 rounded",
                        viewMode === 'list' ? "bg-surface-200" : "hover:bg-surface-100"
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

            {/* Results count */}
            <p className="text-sm text-surface-500 mb-6">
  Showing {filteredShows.length} of {filteredShows.length} shows
            </p>
            
            {/* Shows display */}
            {viewMode === 'grid' || isMobile ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredShows.map(show => (
                  <ShowCard
                    key={show.id}
                    show={show}
                    isUpcoming={isUpcoming(show.date)}
                    formatDate={formatDate}
                    onClick={() => handleShowClick(show)}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredShows.map(show => (
                  <ShowListItem
                    key={show.id}
                    show={show}
                    isUpcoming={isUpcoming(show.date)}
                    formatDate={formatDate}
                    onClick={() => handleShowClick(show)}
                  />
                ))}
              </div>
            )}
            
            {/* Empty state */}
            {filteredShows.length === 0 && (
              <div className="text-center py-16 bg-surface-50 rounded-lg">
                <p className="text-surface-500 mb-4">No shows found matching your filters.</p>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setTimeFilter('all');
                    setSeriesFilter('all');
                  }}
                >
Clear All Filters
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Shows;