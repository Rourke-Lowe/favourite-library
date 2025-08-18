// src/components/sections/Hero.tsx
'use client';
import { useRef, useEffect, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { featuredContent } from '@/data/featured';
import { Button } from '../ui/button';
import type { LocalizedSiteData } from '@/lib/dataLoader';
import { useLanguage } from '@/context/LanguageContext';

interface HeroProps {
  siteData: LocalizedSiteData;
}

const Hero = ({ siteData }: HeroProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [content, setContent] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { locale } = useLanguage();

  useEffect(() => {
    // Get data for current locale
    const currentData = siteData[locale];
    if (!currentData) return;

    // Load featured content based on type
    switch (featuredContent.type) {
      case 'release':
        setContent(currentData.releases.find(r => r.id === featuredContent.id));
        break;
      case 'artist':
        setContent(currentData.artists.find(a => a.id === featuredContent.id));
        break;
      case 'show':
        setContent(currentData.shows.find(s => s.id === featuredContent.id));
        break;
    }
    setIsLoaded(true);
  }, [locale, siteData]);

  useEffect(() => {
    if (videoRef.current) {
      // Set video properties for optimal loading
      videoRef.current.preload = 'metadata'; // Start with metadata only
      
      // Change function declaration to const arrow function
      const loadAndPlayVideo = () => {
        if (videoRef.current) {
          videoRef.current.preload = 'auto';
          
          // Play video when it's ready (after content is loaded)
          videoRef.current.addEventListener('loadeddata', () => {
            videoRef.current?.play().catch(e => {
              console.error('Video autoplay failed:', e);
            });
          });
          
          // Load the video
          videoRef.current.load();
        }
      };
      
      // Only load full video after page content is ready
      if (document.readyState === 'complete') {
        loadAndPlayVideo();
      } else {
        window.addEventListener('load', loadAndPlayVideo);
        
        return () => {
          window.removeEventListener('load', loadAndPlayVideo);
        };
      }
    }
  }, []);

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

  // Render loading state if content isn't loaded yet
  if (!content) {
    return (
      <section id="hero" className="h-[92vh] flex items-center justify-center">
        <div className="w-72 h-72 md:w-[30rem] md:h-[30rem] mx-auto">
          <video 
            ref={videoRef}
            className="w-full h-full object-contain outline-none border-none"
            muted
            playsInline
            loop
            preload="metadata" // Start with metadata loading
            style={{ outline: 'none' }}
          >
            <source src="/videos/logo-animation.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>
    );
  }

  return (
    <section id="hero" className="min-h-[92vh] w-full relative overflow-hidden">
      {/* Main content */}
      <div className="relative z-10 min-h-[92vh] flex flex-col md:flex-row items-center">
        {/* Left column with video logo */}
        <div className="w-full md:w-1/2 flex items-center justify-center py-8 md:py-0 transition-all duration-700 opacity-0 animate-in fade-in slide-in-from-bottom-4">
          <div className="w-72 h-72 md:w-[30rem] md:h-[30rem]">
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
          </div>
        </div>
        
        {/* Right column with featured content */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-12 transition-all duration-700 opacity-0 animate-in fade-in slide-in-from-bottom-8 delay-300">
          {/* Featured content tagline */}
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-mono uppercase tracking-wider backdrop-blur-sm">
              {featuredContent.tagline}
            </span>
          </div>
          
          {/* Featured image */}
          <div className="mb-6 max-w-md rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-[1.02]">
            <img 
              src={getImage()}
              alt={getTitle()}
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>
          
          <div className="backdrop-blur-[2px] bg-white/10 p-4 rounded-lg shadow-sm">
            <h1 className="font-display text-display mb-2">{getTitle()}</h1>
            
            {getSubtitle() && (
              <h2 className="text-subtitle font-light mb-4 text-surface-600">{getSubtitle()}</h2>
            )}
            
            <p className="text-base mb-8 max-w-xl text-surface-700">
              {getDescription()}
            </p>
            
            <Button
              variant="primary"
              size="lg"
              className="w-fit"
              rightIcon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
              onClick={() => {
                document.getElementById(featuredContent.type + 's')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-700 opacity-0 animate-in fade-in delay-500">
        <div 
          className="flex flex-col items-center cursor-pointer group"
          onClick={() => document.getElementById('releases')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <span className="text-surface-700 text-xs font-mono tracking-wider mb-2 group-hover:text-primary transition-colors">
            SCROLL
          </span>
          <div className="animate-bounce">
            <ArrowDown className="text-surface-600 group-hover:text-primary transition-colors" size={18} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;