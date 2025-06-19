// src/components/sections/Shows.tsx
'use client';
import { useState, useMemo } from 'react';
import { ExternalLink, ChevronDown, Grid, List, FileText } from 'lucide-react';
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

// Google Form URL - Update this with your actual form URL
const GOOGLE_FORM_URL = 'https://forms.google.com/your-form-url-here';

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
  { value: 'And Friends', label: 'And Friends' },
  { value: 'Common Ground', label: 'Common Ground' }
];

const Shows = () => {
  const { openModal } = useModal();
  const [timeFilter, setTimeFilter] = useState<TimeFilterType>('all');
  const [seriesFilter, setSeriesFilter] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showAllShows, setShowAllShows] = useState(false);
  
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Helper function to check if a show is upcoming
  const isUpcoming = (dateString: string) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate >= today;
  };
  
  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric'
    });
  };
  
  // Get featured show
  const featuredShow = useMemo(() => {
    const upcomingShows = shows.filter(show => isUpcoming(show.date));
    return upcomingShows.length > 0 ? upcomingShows[0] : shows[0];
  }, []);
  
  // Apply filters
  const filteredShows = useMemo(() => {
    return shows
      .filter(show => show.id !== featuredShow.id)
      .filter(show => {
        const passesTimeFilter = 
          timeFilter === 'all' ? true :
          timeFilter === 'upcoming' ? isUpcoming(show.date) :
          !isUpcoming(show.date);
        
        const passesSeriesFilter = 
          seriesFilter === 'all' ? true :
          show.series === seriesFilter;
        
        return passesTimeFilter && passesSeriesFilter;
      })
      .sort((a, b) => {
        const aDate = new Date(a.date);
        const bDate = new Date(b.date);
        
        if (isUpcoming(a.date) && !isUpcoming(b.date)) return -1;
        if (!isUpcoming(a.date) && isUpcoming(b.date)) return 1;
        
        if (isUpcoming(a.date)) {
          return aDate.getTime() - bDate.getTime();
        }
        
        return bDate.getTime() - aDate.getTime();
      });
  }, [timeFilter, seriesFilter, featuredShow.id]);

  const handleShowClick = (show: ShowDataFormat) => {
    openModal(show.title, (
      <ShowDetail
        show={show}
        isUpcoming={isUpcoming(show.date)}
        formatDate={formatDate}
      />
    ));
  };

  // Handle Google Form button click
  const handleGoogleFormClick = () => {
    window.open(GOOGLE_FORM_URL, '_blank', 'noopener,noreferrer');
  };
  
  return (
    <section id="shows" className="py-24 relative">
      <div className="container mx-auto px-6">
        <SectionHeader 
          title="Shows" 
          subtitle="We run shows every couple of months in beautiful unique locations around Montreal."
        />
        
        {/* Google Form Button - Simple and prominent */}
        <div className="flex justify-center mb-10">
          <Button
            variant="primary"
            size="lg"
            onClick={handleGoogleFormClick}
            leftIcon={<FileText size={20} />}
            className="shadow-lg hover:shadow-xl transition-shadow"
          >
            Submit Your Show Proposal
          </Button>
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
            {showAllShows ? "Show Less" : `See All ${filteredShows.length + 1} Shows`}
          </Button>
        </div>
        
        {/* Additional Shows */}
        {showAllShows && (
          <>
            {/* Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 my-8">
              {/* Time filter */}
              <div className="flex rounded-lg border border-surface-200 p-1">
                {(['all', 'upcoming', 'past'] as TimeFilterType[]).map(filter => (
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
                    {filter}
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