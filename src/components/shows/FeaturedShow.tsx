// src/components/shows/FeaturedShow.tsx
'use client';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FeaturedShowProps {
  show: any;
  isUpcoming: boolean;
  formatDate: (date: string) => string;
  onDetailsClick: () => void;
}

const FeaturedShow = ({
  show,
  isUpcoming,
  formatDate
}: FeaturedShowProps) => {
  // Make sure show exists before trying to render
  if (!show) return null;
  
  return (
    <div className="mt-10 mb-16">
      <div className="flex flex-col md:flex-row gap-8 md:gap-12">
        {/* Left side - Show poster/image - Full size */}
        <div className="w-full md:w-2/5">
          <div className="aspect-[3/4] overflow-hidden">
            <img 
              src={show.image}
              alt={show.title}
              className={cn(
                "w-full h-full object-cover shadow-md",
                !isUpcoming && "grayscale-[30%] opacity-80"
              )}
            />
          </div>
          
          <div className="flex gap-2 mt-3">
            {/* Status badge */}
            <span className={cn(
              "inline-block px-3 py-1 rounded-full text-xs font-medium",
              isUpcoming ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
            )}>
              {isUpcoming ? "Upcoming" : "Past Event"}
            </span>
            
            {/* Series badge if available */}
            {show.series && (
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                {show.series}
              </span>
            )}
          </div>
        </div>
        
        {/* Right side - Event info */}
        <div className="w-full md:w-3/5">
          <div className="text-sm font-mono text-surface-500 uppercase mb-1">
            FEATURED EVENT
          </div>
          <h3 className="font-display text-2xl md:text-3xl font-medium mb-4">{show.title}</h3>
          
          <div className="flex items-center gap-2 text-surface-600 mb-3">
            <Calendar size={16} />
            <span>{formatDate(show.date)} • {show.time}</span>
          </div>
          
          <div className="flex items-center gap-2 text-surface-600 mb-6">
            <MapPin size={16} />
            <span>{show.venue}, {show.city}</span>
          </div>
          
          {/* Lineup - more prominent and detailed */}
          {show.lineup && show.lineup.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-surface-600 mb-3">Lineup</h4>
              <div className="space-y-2">
                {show.lineup.map((artist, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-3 px-4 py-2 bg-surface-50 rounded-md"
                  >
                    <div className="w-6 h-6 rounded-full bg-surface-200 flex items-center justify-center text-xs">
                      {index + 1}
                    </div>
                    <span className="text-surface-700">{artist}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <p className="text-surface-700 mb-8 whitespace-pre-line">{show.description}</p>
          
          {/* Ticket button */}
          {isUpcoming && show.ticketLink && (
            <Button
              variant="primary"
              onClick={() => window.open(show.ticketLink, '_blank')}
            >
              Get Tickets
              <ExternalLink size={16} className="ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedShow;