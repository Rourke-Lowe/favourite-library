// src/components/shows/ShowListItem.tsx
import React from 'react';
import { Button } from '@/components/ui/Button';
import { ExternalLink } from 'lucide-react';
import { DateDisplay } from '@/components/shows/DateDisplay';

interface ShowListItemProps {
  show: any;
  isUpcoming: boolean;
  formatDate: (date: string) => string;
  onClick: () => void;
}

const ShowListItem: React.FC<ShowListItemProps> = ({
  show,
  isUpcoming,
  formatDate,
  onClick
}) => {
  return (
    <div 
      className="flex items-start gap-4 p-4 rounded-lg hover:bg-surface-100 transition-colors cursor-pointer"
      onClick={onClick}
    >
      {/* Date display */}
      <div className="flex-shrink-0 w-16 text-center">
        <DateDisplay dateString={show.date} />
      </div>
      
      {/* Thumbnail */}
      <div className="w-24 flex-shrink-0 hidden md:block">
        <div className="aspect-[4/3] rounded-md overflow-hidden">
          <img 
            src={show.image} 
            alt={show.title} 
            className={`w-full h-full object-cover ${!isUpcoming ? 'grayscale-[30%] opacity-80' : ''}`}
          />
        </div>
      </div>
      
      {/* Event details */}
      <div className="flex-grow min-w-0">
        <h3 className="font-medium truncate">{show.title}</h3>
        <p className="text-sm text-surface-600">{show.time}</p>
        <p className="text-sm text-surface-500 truncate">{show.venue}, {show.city}</p>
        
        {/* Show the lineup if available */}
        {show.lineup && show.lineup.length > 0 && (
          <div className="mt-1 text-xs text-surface-500">
            <span className="font-medium">Lineup:</span> {show.lineup.join(", ")}
          </div>
        )}
      </div>
      
      {/* Ticket button or status */}
      <div className="flex-shrink-0 flex items-center">
        {isUpcoming && show.ticketLink ? (
          <Button
            variant="outline"
            size="sm"
            rightIcon={<ExternalLink size={14} />}
            onClick={(e) => {
              e.stopPropagation();
              window.open(show.ticketLink, '_blank');
            }}
          >
            Tickets
          </Button>
        ) : (
          <span className="text-xs px-2 py-1 rounded bg-surface-200 text-surface-600">
            {isUpcoming ? 'Free Entry' : 'Past Event'}
          </span>
        )}
      </div>
    </div>
  );
};

export default ShowListItem;