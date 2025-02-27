// src/components/sections/Hero.tsx
'use client';
import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { featuredContent } from '@/data/featured';
import { releases } from '@/data/releases';
import { artists } from '@/data/artists';
import { shows } from '@/data/shows';

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    // Load featured content based on type and ID
    const loadFeaturedContent = () => {
      switch (featuredContent.type) {
        case 'release': {
          const release = releases.find(r => r.id === featuredContent.id);
          setContent(release);
          break;
        }
        case 'artist': {
          const artist = artists.find(a => a.id === featuredContent.id);
          setContent(artist);
          break;
        }
        case 'show': {
          const show = shows.find(s => s.id === featuredContent.id);
          setContent(show);
          break;
        }
      }
    };

    loadFeaturedContent();
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(e => {
        console.error('Video autoplay failed:', e);
      });
    }
  }, []);

  // Render loading state if content isn't loaded yet
  if (!content) {
    return (
      <section id="hero" className="h-[92vh] flex items-center justify-center">
        <div className="w-64 h-64 md:w-[27rem] md:h-[27rem] mx-auto relative">
          <video 
            ref={videoRef}
            className="w-full h-full object-contain outline-none border-none"
            muted
            playsInline
            loop
            autoPlay
            style={{ outline: 'none' }}
          >
            <source src="/videos/logo-animation.mp4" type="video/mp4" />
          </video>
          
          <div className="absolute inset-0 -z-10 opacity-60">
            <div className="w-full h-full bg-gradient-to-r from-yellow-100 via-pink-100 to-blue-100 rounded-full blur-xl"></div>
          </div>
        </div>
      </section>
    );
  }

  // Helper functions to get content data based on type
  const getImage = () => {
    switch (featuredContent.type) {
      case 'release':
        return content.coverArt || content.image;
      case 'artist':
      case 'show':
        return content.image;
      default:
        return '';
    }
  };

  const getTitle = () => {
    return content.name || content.title;
  };

  const getSubtitle = () => {
    switch (featuredContent.type) {
      case 'release':
        return content.artist;
      case 'show':
        return content.venue;
      case 'artist':
        return content.releases?.length > 0 ? `${content.releases.length} Releases` : '';
      default:
        return '';
    }
  };

  const getDescription = () => {
    return content.description || content.bio;
  };

  return (
    <section id="hero" className="h-[92vh] w-full">
      {/* Two-column layout */}
      <div className="flex h-full">
        {/* Left column with video logo */}
        <div className="w-1/2 flex items-center justify-center relative">
          <div className="w-64 h-64 md:w-[25rem] md:h-[25rem] relative">
            <video 
              ref={videoRef}
              className="w-full h-full object-contain outline-none border-none"
              muted
              playsInline
              loop
              autoPlay
              style={{ outline: 'none' }}
            >
              <source src="/videos/logo-animation.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            <div className="absolute inset-0 -z-10 opacity-60">
              <div className="w-full h-full bg-gradient-to-r from-yellow-100 via-pink-100 to-blue-100 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
        
        {/* Right column with featured content */}
        <div className="w-1/2 flex flex-col justify-center p-12">
          {/* Featured content tagline */}
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-orange-500/10 text-orange-600 rounded-full text-sm font-medium">
              {featuredContent.tagline}
            </span>
          </div>
          
          {/* Featured image */}
          <div className="mb-6 max-w-md">
            <img 
              src={getImage()}
              alt={getTitle()}
              className="w-full h-auto object-cover rounded-lg shadow-md"
            />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-medium mb-2">{getTitle()}</h1>
          
          {getSubtitle() && (
            <h2 className="text-xl md:text-2xl font-light mb-4 text-gray-700">{getSubtitle()}</h2>
          )}
          
          <p className="text-base mb-8 max-w-xl text-gray-700">
            {getDescription()}
          </p>
          
          <Link 
            href={`#${featuredContent.type}s`} 
            className="inline-block px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors text-sm w-fit"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;