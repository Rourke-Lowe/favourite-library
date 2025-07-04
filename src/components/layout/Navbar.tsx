// src/components/layout/Navbar.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';
// Add these imports at the top of Navbar.tsx
import { HamburgerButton } from './MobileNav';
import { useIsMobile } from '@/hooks/useMediaQuery';

// Add this new interface export right after the imports
export interface NavbarProps {
  onMobileMenuToggle: (isOpen: boolean) => void;
  isMobileMenuOpen: boolean;
  activeSection: string;
  onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => void;
}

const Navbar = ({ 
  onMobileMenuToggle, 
  isMobileMenuOpen,
  activeSection: externalActiveSection,
  onNavClick: externalOnNavClick
}: NavbarProps) => {
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  
  // Use external props if provided, otherwise use internal state
  const activeSection = externalActiveSection;
  
  const [isSticky, setIsSticky] = useState(false);
  const navbarRef = useRef<HTMLDivElement>(null);
  const observerTargetRef = useRef<HTMLDivElement>(null);
  
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


  // Handle navigation click
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    if (externalOnNavClick) {
      externalOnNavClick(e, sectionId);
    }
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

          {/* Navigation - Desktop only */}
          <div className="hidden md:flex items-center space-x-6 ml-auto">
            <ul className="flex space-x-6 md:space-x-12">
              {[
                { key: 'about', label: t('nav.about') },
                { key: 'artists', label: t('nav.artists') },
                { key: 'shows', label: t('nav.shows') },
                { key: 'releases', label: t('nav.releases') },
                { key: 'contact', label: t('nav.contact') }
              ].map((item) => (
                <li key={item.key}>
                  <a 
                    href={`#${item.key}`}
                    onClick={(e) => handleNavClick(e, item.key)}
                    className={`transition-all duration-200 font-mono text-sm uppercase tracking-wider hover:text-primary relative py-2 ${
                      activeSection === item.key 
                        ? 'text-primary' 
                        : 'text-foreground'
                    }`}
                  >
                    {item.label}
                    
                    <span 
                      className={`absolute left-0 bottom-0 w-full h-0.5 bg-primary rounded transform origin-left transition-transform duration-300 ${
                        activeSection === item.key ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </a>
                </li>
              ))}
            </ul>
            <LanguageSwitcher />
          </div>

          {/* Mobile Navigation Controls */}
          <div className="flex items-center space-x-4 ml-auto md:hidden">
            <LanguageSwitcher />
            <HamburgerButton 
              isOpen={isMobileMenuOpen} 
              onClick={() => onMobileMenuToggle(!isMobileMenuOpen)} 
            />
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;