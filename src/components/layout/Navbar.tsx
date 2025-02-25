// src/components/layout/Navbar.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { throttle } from '@/utils/throttle';
import Image from 'next/image';

const Navbar = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isSticky, setIsSticky] = useState(false);
  const navbarRef = useRef<HTMLDivElement>(null);
  const observerTargetRef = useRef<HTMLDivElement>(null);
  const isInitialRender = useRef(true);

  useEffect(() => {
    // Set up intersection observer for sticky detection
    const observerTarget = observerTargetRef.current;
    if (observerTarget) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          // When target is not intersecting (out of view), navbar should be sticky
          setIsSticky(!entry.isIntersecting);
        },
        { threshold: 0 }
      );
      
      observer.observe(observerTarget);
      
      // Clean up observer
      return () => observer.disconnect();
    }
  }, []);

  useEffect(() => {
    const handleScroll = throttle(() => {
      // Determine active section for menu highlighting
      const sections = ['hero', 'artists', 'releases', 'moodboard', 'shows', 'merch'];
      let bestVisibilityScore = 0;
      let bestSection = 'hero';
      
      sections.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (!element) return;
        
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Calculate visibility score
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(windowHeight, rect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        
        // Prioritize sections in the center
        const centerFactor = 1 - Math.abs((rect.top + rect.bottom) / 2 - windowHeight / 2) / windowHeight;
        const visibilityScore = (visibleHeight / windowHeight) * centerFactor * 2;
        
        if (visibilityScore > bestVisibilityScore) {
          bestVisibilityScore = visibilityScore;
          bestSection = sectionId;
        }
      });
      
      setActiveSection(bestSection);
    }, 100);
    
    window.addEventListener('scroll', handleScroll);
    
    // Initial check (only once)
    if (isInitialRender.current) {
      handleScroll();
      isInitialRender.current = false;
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {/* Observer target - placed at the point where we want navbar to become sticky */}
      <div 
        ref={observerTargetRef} 
        className="h-1 w-full absolute top-[92vh]" 
        style={{ visibility: 'hidden', pointerEvents: 'none' }}
        aria-hidden="true" 
      />
      
      <nav 
        ref={navbarRef}
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isSticky ? 'backdrop-blur-sm' : ''
        }`}
      >
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          {/* Logo that only appears when sticky */}
          <div className={`transition-all duration-300 ${isSticky ? 'opacity-100 w-auto' : 'opacity-0 w-0'} overflow-hidden`}>
            <Image 
              src="/logo-small.png" 
              alt="Favorite Library"
              width={40}
              height={40}
              className="h-8 w-auto"
            />
          </div>

          {/* Navigation links - always right-aligned */}
          <ul className="flex space-x-10 md:space-x-16 ml-auto">
            {['Artists', 'Releases', 'Moodboard', 'Shows', 'Merch'].map((item) => (
              <li key={item}>
                <a 
                  href={`#${item.toLowerCase()}`}
                  className={`transition-colors font-medium hover:text-orange-500 ${
                    activeSection === item.toLowerCase() 
                      ? 'text-orange-500' 
                      : 'text-gray-800'
                  }`}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;