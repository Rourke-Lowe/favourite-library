// src/components/layout/NavigationWrapper.tsx
'use client';
import React, { useState } from 'react';
import Navbar from './Navbar';
import { MobileDrawer } from './MobileNav';

export default function NavigationWrapper() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

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