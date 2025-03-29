// src/components/shows/ShowCard.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface ShowCardProps {
  show: any;
  isUpcoming: boolean;
  formatDate: (date: string) => string;
  onClick: () => void;
}

const ShowCard: React.FC<ShowCardProps> = ({
  show,
  isUpcoming,
  formatDate,
  onClick
}) => {
  return (
    <div 
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-lg bg-background/90 shadow">
        {/* Poster image with hover effect */}
        <div className={cn(
          "aspect-[4/5] overflow-hidden",
          !isUpcoming && "grayscale-[30%] opacity-80"
        )}>
          <img 
            src={show.image}
            alt={show.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Series badge removed as requested */}
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-surface-900/80 via-surface-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        {/* Info overlay that appears on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <div className="text-white">
            <h3 className="font-display text-lg">{show.title}</h3>
            <p className="text-sm opacity-90">{formatDate(show.date)}</p>
            <p className="text-xs opacity-80">{show.venue}, {show.city}</p>
          </div>
        </div>
      </div>
      
      {/* Event details below the poster (always visible) */}
      <div className="mt-3 px-2">
        <h3 className="font-medium text-base truncate">{show.title}</h3>
        <p className="text-sm text-surface-600 truncate">{formatDate(show.date)}</p>
        <p className="text-xs text-surface-500 truncate">{show.venue}, {show.city}</p>
      </div>
    </div>
  );
};

export default ShowCard;