// src/components/sections/Shows.tsx
'use client';
import { useState } from 'react';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import { shows } from '@/data/shows';

const Shows = () => {
  const [selectedShow, setSelectedShow] = useState<any | null>(null);
  
  return (
    <section id="shows" className="py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-light mb-12">Shows</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {shows.map((show) => (
            <Card
              key={show.id}
              title={show.title}
              image={show.image}
              onClick={() => setSelectedShow(show)}
            />
          ))}
        </div>
      </div>
      
      <Modal
        isOpen={!!selectedShow}
        onClose={() => setSelectedShow(null)}
        title={selectedShow?.title || ''}
      >
        {selectedShow && (
          <div className="space-y-6">
            <div className="bg-gray-200 h-64 flex items-center justify-center rounded-lg">
              {selectedShow.image ? (
                <img 
                  src={selectedShow.image}
                  alt={selectedShow.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-gray-400">Show Image Placeholder</span>
              )}
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-2">{selectedShow.title}</h3>
              <p className="text-gray-700">{selectedShow.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Date & Time</h4>
                <p>{selectedShow.date}</p>
                <p>{selectedShow.time}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Location</h4>
                <p>{selectedShow.venue}</p>
                <p>{selectedShow.address}</p>
                <p>{selectedShow.city}, {selectedShow.country}</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Lineup</h4>
              <ul className="list-disc pl-5">
                {selectedShow.lineup.map((artist: string, index: number) => (
                  <li key={index}>{artist}</li>
                ))}
              </ul>
            </div>
            
            {selectedShow.ticketLink && (
              <div className="text-center pt-4">
                <a 
                  href={selectedShow.ticketLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
                >
                  Get Tickets
                </a>
              </div>
            )}
          </div>
        )}
      </Modal>
    </section>
  );
};

export default Shows;