'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSectionObserver } from '@/hooks/useIntersection';
import { SectionId } from '@/lib/types';

// Section background colors
const sectionColors: Record<SectionId, string> = {
  hero: 'transparent',
  artists: 'rgba(255, 240, 230, 0.6)', // Light orange
  releases: 'rgba(230, 255, 240, 0.6)', // Light green
  shows: 'rgba(230, 240, 255, 0.6)',    // Light blue
  moodboard: 'rgba(255, 230, 250, 0.6)', // Light pink
  merch: 'rgba(245, 255, 230, 0.6)'      // Light yellow
};

const Navigation = () => {
  const [isSticky, setIsSticky] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  
  // Section IDs to observe
  const sections: SectionId[] = ['hero', 'shows', 'releases', 'artists', 'moodboard', 'merch'];
  
  // Get the currently active section
  const activeSection = useSectionObserver(sections, {
    threshold: 0.3,
    rootMargin: '-20% 0px -80% 0px' // Gives more weight to sections near the top
  }) as SectionId | null;
  
  // Handle sticky navigation
  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero');
      if (!heroSection || !navRef.current) return;
      
      console.log('Hero bottom:', heroSection.getBoundingClientRect().bottom);
      
      const heroBottom = heroSection.getBoundingClientRect().bottom;
      setIsSticky(heroBottom <= 0);
    };
    
    // Ensure the event listener is properly attached
    window.addEventListener('scroll', handleScroll);
    
    // Initial call to set correct initial state
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Scroll to section smoothly
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Get human-readable section names
  const getSectionName = (id: string): string => {
    return id.charAt(0).toUpperCase() + id.slice(1);
  };
  
  return (
    <>
      {/* Background color transition layer */}
      {activeSection && (
        <div
          className="fixed inset-0 pointer-events-none -z-10 transition-colors duration-1000"
          style={{ backgroundColor: sectionColors[activeSection] }}
          aria-hidden="true"
        />
      )}
      
      {/* Navigation */}
      <nav
        ref={navRef}
        className={`w-full py-4 transition-all duration-300 z-40 ${
          isSticky 
            ? 'fixed top-0 left-0 right-0 bg-white bg-opacity-95 shadow-sm' 
            : 'relative'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo (only visible when sticky) */}
            <div className={`transition-opacity duration-300 w-20 ${isSticky ? 'opacity-100' : 'opacity-0'}`}>
              {isSticky && (
                <img 
                  src="/assets/logo.png" 
                  alt="Favorite Library" 
                  className="h-8"
                />
              )}
            </div>
            
            {/* Navigation Links */}
            <div className="flex items-center gap-6">
              {sections.filter(id => id !== 'hero').map(section => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`py-1 px-2 text-sm font-medium border-b-2 transition-colors ${
                    activeSection === section
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-600 hover:text-black'
                  }`}
                >
                  {getSectionName(section)}
                </button>
              ))}
            </div>
            
            {/* Right-side placeholder to balance the logo */}
            <div className="w-20"></div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;