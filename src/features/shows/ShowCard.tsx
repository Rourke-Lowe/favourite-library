'use client';

import React, { useState } from 'react';
import { Show, Artist } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Calendar, MapPin, Clock, ExternalLink } from 'lucide-react';
import CardDetail from '@/components/ui/CardDetail';

interface ShowCardProps {
  show: Show;
  artists: Artist[];
}

const ShowCard: React.FC<ShowCardProps> = ({ show, artists }) => {
  const [showDetail, setShowDetail] = useState(false);
  
  // Format date nicely
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Get artist names for this show
  const showArtists = show.artists
    .map(id => artists.find(artist => artist.id === id))
    .filter(artist => artist !== undefined) as Artist[];
  
  const detailContent = (
    <div className="space-y-6">
      {/* Show Image */}
      {show.image && (
        <div className="rounded-lg overflow-hidden">
          <img
            src={show.image}
            alt={show.title}
            className="w-full h-64 object-cover"
          />
        </div>
      )}
      
      {/* Event Details */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-2/3">
            <div className="flex items-center gap-2 text-gray-600 mb-3">
              <Calendar size={16} />
              <span>{formatDate(show.date)}</span>
              <Clock size={16} className="ml-3" />
              <span>{show.time}</span>
            </div>
            
            <div className="flex items-start gap-2 text-gray-600 mb-4">
              <MapPin size={16} className="mt-1 flex-shrink-0" />
              <div>
                <div>{show.venue}</div>
                <div>{show.location}</div>
              </div>
            </div>
            
            {show.description && (
              <p className="text-sm mt-4">{show.description}</p>
            )}
          </div>
          
          <div className="w-full sm:w-1/3">
            {/* Ticket Button */}
            {show.ticketLink && (
              <a
                href={show.ticketLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full px-4 py-3 bg-black text-white text-center font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Get Tickets
              </a>
            )}
          </div>
        </div>
        
        {/* Artists */}
        {showArtists.length > 0 && (
          <div className="mt-6">
            <h4 className="text-lg font-medium mb-4">Artists</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {showArtists.map(artist => (
                <div key={artist.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-sm font-medium">{artist.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
  return (
    <>
      <Card 
        className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => setShowDetail(true)}
      >
        <CardContent className="p-0">
          {/* Show Image */}
          {show.image && (
            <div className="aspect-[3/2] overflow-hidden">
              <img
                src={show.image}
                alt={show.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {/* Show Info */}
          <div className="p-4">
            <h3 className="font-medium mb-1">{show.title}</h3>
            
            <div className="flex items-center gap-1 text-gray-600 text-sm mb-2">
              <Calendar size={14} />
              <span>{formatDate(show.date)}</span>
            </div>
            
            <div className="flex items-center gap-1 text-gray-600 text-sm">
              <MapPin size={14} />
              <span>{show.venue}, {show.location}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <CardDetail
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        title={show.title}
      >
        {detailContent}
      </CardDetail>
    </>
  );
};

export default ShowCard;