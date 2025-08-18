// src/components/layout/NavigationWrapper.tsx
'use client';
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { MobileDrawer } from './MobileNav';

export default function NavigationWrapper() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Track active section based on scroll position
  useEffect(() => {
    const sections = ['hero', 'about', 'artists', 'shows', 'releases', 'contact'];
    const navbarHeight = 70;
    
    const observers = sections.map(sectionId => {
      const element = document.getElementById(sectionId);
      if (!element) return null;
      
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(sectionId);
          }
        },
        {
          rootMargin: `-${navbarHeight}px 0px -50% 0px`, // Account for navbar height and require 50% visibility
          threshold: 0
        }
      );
      
      observer.observe(element);
      return observer;
    });
    
    // Cleanup function
    return () => {
      observers.forEach(observer => {
        if (observer) {
          observer.disconnect();
        }
      });
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    
    const targetSection = document.getElementById(sectionId);
    if (!targetSection) return;
    
    // Get navbar height for offset (approximate since we don't have ref here)
    const navbarHeight = 70;
    
    const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - navbarHeight;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
    
    setActiveSection(sectionId);
    window.history.pushState({}, '', `#${sectionId}`);
  };

  return (
    <>
      <Navbar 
        onMobileMenuToggle={setIsMobileMenuOpen}
        isMobileMenuOpen={isMobileMenuOpen}
        activeSection={activeSection}
        onNavClick={handleNavClick}
      />
      
      {/* MobileDrawer rendered outside of Navbar's stacking context */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeSection={activeSection}
        onNavClick={handleNavClick}
      />
    </>
  );
}