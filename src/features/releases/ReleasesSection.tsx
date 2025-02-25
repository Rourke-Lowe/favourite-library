'use client';

import React, { useState } from 'react';
import { Release, ReleaseType } from '@/lib/types';
import ReleaseCard from './ReleaseCard';

interface ReleasesSectionProps {
  releases: Release[];
}

const ReleasesSection: React.FC<ReleasesSectionProps> = ({ releases }) => {
  const [filter, setFilter] = useState<ReleaseType | 'all'>('all');
  
  // Get the most recent release for the featured spot
  const featuredRelease = releases.length > 0 
    ? [...releases].sort((a, b) => 
        new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
      )[0]
    : null;
  
  // Other releases (excluding the featured one)
  const otherReleases = featuredRelease 
    ? releases.filter(release => release.id !== featuredRelease.id)
    : releases;
  
  // Filter releases by type
  const filteredReleases = filter === 'all' 
    ? otherReleases
    : otherReleases.filter(release => release.type === filter);
  
  return (
    <section id="releases" className="py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">Releases</h2>
        <p className="text-lg mb-12 max-w-2xl">
          Our latest and greatest music across all genres.
        </p>
        
        {/* Featured Release */}
        {featuredRelease && (
          <div className="mb-16">
            <h3 className="text-lg font-medium mb-4">New Release</h3>
            <div className="bg-white bg-opacity-50 p-6 rounded-lg shadow-sm">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                  <div className="aspect-square rounded-lg overflow-hidden shadow-lg">
                    <img 
                      src={featuredRelease.coverArt} 
                      alt={featuredRelease.title}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </div>
                <div className="md:w-2/3 flex flex-col justify-between">
                  <div>
                    <div className="inline-block px-2 py-1 bg-black text-white text-xs mb-2 rounded">
                      {featuredRelease.type.toUpperCase()}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{featuredRelease.title}</h3>
                    <p className="text-gray-600 mb-1">{featuredRelease.artist}</p>
                    <p className="text-gray-500 text-sm mb-4">{featuredRelease.releaseDate}</p>
                    <p className="mb-6">{featuredRelease.description}</p>
                  </div>
                  
                  {/* Streaming links */}
                  {featuredRelease.streamingLinks && (
                    <div className="flex flex-wrap gap-3">
                      {Object.entries(featuredRelease.streamingLinks).map(([platform, url]) => (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium"
                        >
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Filter Controls */}
        <div className="flex space-x-4 mb-8">
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === 'all' 
                ? 'bg-black text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === 'album' 
                ? 'bg-black text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
            onClick={() => setFilter('album')}
          >
            Albums
          </button>
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === 'ep' 
                ? 'bg-black text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
            onClick={() => setFilter('ep')}
          >
            EPs
          </button>
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === 'single' 
                ? 'bg-black text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
            onClick={() => setFilter('single')}
          >
            Singles
          </button>
        </div>
        
        {/* Releases Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredReleases.map(release => (
            <ReleaseCard key={release.id} release={release} />
          ))}
        </div>
        
        {filteredReleases.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No releases match the selected filter.
          </div>
        )}
      </div>
    </section>
  );
};

export default ReleasesSection;