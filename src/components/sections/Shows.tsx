// src/components/sections/Shows.tsx
'use client';
import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { shows } from '@/data/shows';

// Helper function to check if a show is in the past
const isEventInPast = (dateString) => {
  const eventDate = new Date(dateString);
  const today = new Date();
  return eventDate < today;
};

const Shows = () => {
  const [selectedShow, setSelectedShow] = useState(null);
  
  // Filter shows to put upcoming events first, then past events
  const sortedShows = [...shows].sort((a, b) => {
    const aInPast = isEventInPast(a.date);
    const bInPast = isEventInPast(b.date);
    
    if (aInPast && !bInPast) return 1;
    if (!aInPast && bInPast) return -1;
    
    // If both are in same category (past or upcoming), sort by date
    return new Date(b.date) - new Date(a.date);
  });

  return (
    <section id="shows" className="py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-light mb-12">Shows</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedShows.map((show) => {
            const isPast = isEventInPast(show.date);
            
            return (
              <div 
                key={show.id} 
                className="cursor-pointer transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
                onClick={() => setSelectedShow(show)}
              >
                {/* Poster with 4:5 aspect ratio */}
                <div className="aspect-[4/5] relative overflow-hidden rounded-lg">
                  <img 
                    src={show.image}
                    alt={show.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Subtle indicator for past events */}
                  {isPast && (
                    <div className="absolute bottom-3 right-3">
                      <div className="text-xs font-medium text-white px-2 py-1 rounded-full bg-black bg-opacity-50 backdrop-blur-sm">
                        Past
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <Modal
        isOpen={!!selectedShow}
        onClose={() => setSelectedShow(null)}
        title={selectedShow?.title || ''}
      >
        {selectedShow && (
          <div className="space-y-6">
            <div className="rounded-lg overflow-hidden aspect-[4/5] max-h-[60vh]">
              <img 
                src={selectedShow.image}
                alt={selectedShow.title}
                className="w-full h-full object-contain"
              />
            </div>
            
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-medium">{selectedShow.title}</h3>
                <p className="text-gray-600">{selectedShow.venue}, {selectedShow.city}</p>
                <p className="text-gray-600">{selectedShow.date} • {selectedShow.time}</p>
              </div>
              
              {selectedShow.ticketLink && !isEventInPast(selectedShow.date) && (
                <a 
                  href={selectedShow.ticketLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
                >
                  Get Tickets
                </a>
              )}
            </div>
            
            <div>
              <p className="text-gray-700">{selectedShow.description}</p>
            </div>
            
            {selectedShow.lineup.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Lineup</h4>
                <div className="space-y-1">
                  {selectedShow.lineup.map((artist, index) => (
                    <p key={index} className="text-gray-700">{artist}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </section>
  );
};

export default Shows;