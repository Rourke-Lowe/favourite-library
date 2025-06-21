// src/components/layout/Navbar.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

const Navbar = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isSticky, setIsSticky] = useState(false);
  const navbarRef = useRef<HTMLDivElement>(null);
  const observerTargetRef = useRef<HTMLDivElement>(null);
  const sectionObserversRef = useRef<IntersectionObserver | null>(null);
  
  // Set up intersection observer for sticky detection
  useEffect(() => {
    const observerTarget = observerTargetRef.current;
    if (observerTarget) {
      const stickyObserver = new IntersectionObserver(
        ([entry]) => {
          // When target is not intersecting (out of view), navbar should be sticky
          setIsSticky(!entry.isIntersecting);
        },
        { threshold: 0 }
      );
      
      stickyObserver.observe(observerTarget);
      
      // Clean up observer
      return () => stickyObserver.disconnect();
    }
  }, []);

  // Set up intersection observers for section detection
  useEffect(() => {
    // Define array of section IDs in order - Added 'contact'
    const sections = ['hero', 'about', 'artists', 'shows', 'releases', 'contact'];
    
    // Options for the IntersectionObserver
    // Using multiple thresholds for better accuracy
    const options = {
      rootMargin: '-10% 0px -70% 0px', // Bias toward the top of the section
      threshold: [0.1, 0.25, 0.5] // Multiple thresholds for better accuracy
    };
    
    // Track the currently active section with the highest visibility
    let currentActiveSection = '';
    const visibilityScores = new Map();
    
    // Create a single observer for all sections
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // Get the section ID
        const id = entry.target.id;
        
        // Calculate and store visibility score based on intersection ratio
        // and position in viewport (center bias)
        const rect = entry.boundingClientRect;
        const windowHeight = window.innerHeight;
        const centerFactor = 1 - Math.abs((rect.top + rect.bottom) / 2 - windowHeight / 2) / windowHeight;
        const visibilityScore = entry.intersectionRatio * centerFactor * 2;
        
        // Store the score
        visibilityScores.set(id, visibilityScore);
      });
      
      // Find the section with the highest visibility score
      let bestVisibilityScore = 0;
      
      sections.forEach((section) => {
        const score = visibilityScores.get(section) || 0;
        if (score > bestVisibilityScore) {
          bestVisibilityScore = score;
          currentActiveSection = section;
        }
      });
      
      // Update the active section if necessary
      if (currentActiveSection && currentActiveSection !== activeSection) {
        setActiveSection(currentActiveSection);
      }
    }, options);
    
    // Observe all sections
    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });
    
    // Store the observer for cleanup
    sectionObserversRef.current = observer;
    
    // Clean up
    return () => {
      observer.disconnect();
    };
  }, [activeSection]);

  // Handle smooth scrolling when clicking navigation links
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    
    const targetSection = document.getElementById(sectionId);
    if (!targetSection) return;
    
    // Get navbar height for offset
    const navbarHeight = navbarRef.current?.clientHeight || 0;
    
    // Calculate scroll position with offset for sticky navbar
    const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - navbarHeight;
    
    // Smooth scroll to target
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
    
    // Update URL without causing jump
    window.history.pushState({}, '', `#${sectionId}`);
  };
  
  // Scroll to top when logo is clicked
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Clear hash from URL
    window.history.pushState({}, '', window.location.pathname);
  };

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
        className={`sticky top-0 z-50 w-full transition-all duration-300 min-h-[70px] ${
          isSticky ? 'backdrop-blur-md bg-background/80 shadow-sm' : ''
        }`}
      >
        {/* Increased padding significantly and added min-height to nav items */}
        <div className="container mx-auto px-6 py-6 flex items-center justify-between min-h-[70px]">
          {/* Logo that only appears when sticky - made slightly larger */}
          <div 
            className={`transition-all duration-500 transform ${
              isSticky 
                ? 'opacity-100 scale-100 translate-x-0' 
                : 'opacity-0 scale-95 -translate-x-4'
            } cursor-pointer`}
            onClick={scrollToTop}
            title="Back to top"
          >
            <Image 
              src="/logo-small.png" 
              alt="Favorite Library - Back to top" 
              width={44}
              height={44}
              className="h-10 w-auto hover:opacity-80 transition-opacity"
            />
          </div>

          {/* Navigation links - always right-aligned - Added Contact and increased text size */}
          <div className="flex items-center space-x-6 ml-auto">
            <ul className="flex space-x-6 md:space-x-12">
              {['About', 'Artists', 'Shows', 'Releases', 'Contact'].map((item) => (
              <li key={item}>
                <a 
                  href={`#${item.toLowerCase()}`}
                  onClick={(e) => handleNavClick(e, item.toLowerCase())}
                  className={`transition-all duration-200 font-mono text-sm uppercase tracking-wider hover:text-primary relative py-2 ${
                    activeSection === item.toLowerCase() 
                      ? 'text-primary' 
                      : 'text-foreground'
                  }`}
                >
                  {item}
                  
                  {/* Animated underline for active item */}
                  <span 
                    className={`absolute left-0 bottom-0 w-full h-0.5 bg-primary rounded transform origin-left transition-transform duration-300 ${
                      activeSection === item.toLowerCase() ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </a>
              </li>
            ))}
            </ul>
            <LanguageSwitcher />
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;