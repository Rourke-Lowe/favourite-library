// src/components/shows/ShowDetail.tsx
import React from 'react';
import { Button } from '@/components/ui/Button';
import { ExternalLink, Calendar } from 'lucide-react';

interface ShowDetailProps {
  show: any;
  isUpcoming: boolean;
  formatDate: (date: string) => string;
}

const ShowDetail: React.FC<ShowDetailProps> = ({
  show,
  isUpcoming,
  formatDate
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Left column - Poster */}
      <div className="w-full md:w-2/5">
        <div className="aspect-[4/5] rounded-lg overflow-hidden bg-surface-100 shadow-md">
          <img 
            src={show.image}
            alt={show.title}
            className={`w-full h-full object-cover ${!isUpcoming ? 'grayscale-[30%]' : ''}`}
          />
        </div>
        
        {/* Ticket button for mobile view */}
        <div className="mt-4 md:hidden">
          {isUpcoming && show.ticketLink && (
            <Button
              variant="primary"
              className="w-full"
              rightIcon={<ExternalLink size={16} />}
              onClick={() => window.open(show.ticketLink, '_blank')}
            >
              Get Tickets
            </Button>
          )}
        </div>
      </div>
      
      {/* Right column - Event details */}
      <div className="w-full md:w-3/5 space-y-6">
        <div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
            <div>
              <h3 className="text-xl font-display mb-1">{show.title}</h3>
              <p className="text-surface-600">
                {formatDate(show.date)} • {show.time}
              </p>
              <p className="text-surface-500">{show.venue}, {show.city}</p>
              
              {/* Series badge if available */}
              {show.series && (
                <div className="mt-2">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    {show.series}
                  </span>
                </div>
              )}
            </div>
            
            {/* Ticket button for desktop */}
            <div className="hidden md:block">
              {isUpcoming && show.ticketLink && (
                <Button
                  variant="primary"
                  rightIcon={<ExternalLink size={16} />}
                  onClick={() => window.open(show.ticketLink, '_blank')}
                >
                  Get Tickets
                </Button>
              )}
            </div>
          </div>
          
          {/* Event description */}
          {show.description && (
            <div className="mt-6">
              <p className="text-surface-700">{show.description}</p>
            </div>
          )}
        </div>
        
        {/* Lineup */}
        {show.lineup && show.lineup.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">Lineup</h4>
            <div className="space-y-2">
              {show.lineup.map((artist: string, index: number) => (
                <div 
                  key={index} 
                  className="px-4 py-3 bg-surface-100 rounded-md flex items-center"
                >
                  <div className="w-6 h-6 rounded-full bg-surface-300 flex items-center justify-center text-xs mr-3">
                    {index + 1}
                  </div>
                  <span>{artist}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Add to calendar option */}
        {isUpcoming && (
          <div className="pt-4 border-t border-surface-200">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Calendar size={16} />}
              onClick={() => {
                // Simple Google Calendar link
                const startDate = new Date(show.date);
                const endDate = new Date(startDate);
                endDate.setHours(endDate.getHours() + 3); // Assume 3-hour event
                
                const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(show.title)}&dates=${startDate.toISOString().replace(/-|:|\.\d+/g, '')
                }/${endDate.toISOString().replace(/-|:|\.\d+/g, '')}&details=${
                  encodeURIComponent(`${show.description || ''}\n\nLineup: ${show.lineup?.join(', ') || ''}`)
                }&location=${encodeURIComponent(`${show.venue}, ${show.city}`)}&sf=true&output=xml`;
                
                window.open(calendarUrl, '_blank');
              }}
            >
              Add to Calendar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowDetail;