'use client';

import React from 'react';
import { Show, Artist } from '@/lib/types';
import ShowCard from './ShowCard';

interface ShowsSectionProps {
  shows: Show[];
  artists: Artist[];
}

const ShowsSection: React.FC<ShowsSectionProps> = ({ shows, artists }) => {
  // Sort shows by date (newest first)
  const sortedShows = [...shows].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Get upcoming shows (dates in the future)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingShows = sortedShows.filter(show => 
    new Date(show.date) >= today
  );
  
  // Get the next/featured show
  const featuredShow = upcomingShows.length > 0 ? upcomingShows[0] : null;
  
  // Other upcoming shows (excluding the featured one)
  const otherUpcomingShows = featuredShow 
    ? upcomingShows.filter(show => show.id !== featuredShow.id)
    : [];
  
  // Format date for countdown
  const formatCountdownDate = (dateString: string) => {
    const eventDate = new Date(dateString);
    const now = new Date();
    
    // Calculate days difference
    const diffTime = eventDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? `${diffDays} days` : 'Today!';
  };
  
  return (
    <section id="shows" className="py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">Shows</h2>
        <p className="text-lg mb-12 max-w-2xl">
          Catch our artists live at venues across the country.
        </p>
        
        {/* Featured Show */}
        {featuredShow && (
          <div className="mb-16">
            <h3 className="text-lg font-medium mb-4">Next Show</h3>
            <div className="bg-white bg-opacity-50 rounded-lg shadow-sm overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Show Image */}
                {featuredShow.image && (
                  <div className="md:w-1/3">
                    <div className="h-full">
                      <img 
                        src={featuredShow.image} 
                        alt={featuredShow.title}
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  </div>
                )}
                
                <div className={`p-6 ${featuredShow.image ? 'md:w-2/3' : 'w-full'}`}>
                  {/* Countdown */}
                  <div className="mb-4 inline-block px-3 py-1 bg-black text-white text-sm rounded-full">
                    {formatCountdownDate(featuredShow.date)}
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2">{featuredShow.title}</h3>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 mb-4">
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <span>{new Date(featuredShow.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span>{featuredShow.time}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      <span>{featuredShow.venue}, {featuredShow.location}</span>
                    </div>
                  </div>
                  
                  {featuredShow.description && (
                    <p className="mb-6">{featuredShow.description}</p>
                  )}
                  
                  {featuredShow.ticketLink && (
                    <a
                      href={featuredShow.ticketLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Get Tickets
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Other Upcoming Shows */}
        {otherUpcomingShows.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-4">Upcoming Shows</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherUpcomingShows.map(show => (
                <ShowCard key={show.id} show={show} artists={artists} />
              ))}
            </div>
          </div>
        )}
        
        {/* No shows message */}
        {upcomingShows.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No upcoming shows scheduled. Check back soon!
          </div>
        )}
      </div>
    </section>
  );
};

export default ShowsSection;