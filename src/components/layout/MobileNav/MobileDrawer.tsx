// src/components/layout/MobileNav/MobileDrawer.tsx
import React, { useEffect, useRef } from 'react';
import MobileNavItem from './MobileNavItem';
import { useLanguage } from '@/context/LanguageContext';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => void;
}

export default function MobileDrawer({ 
  isOpen, 
  onClose, 
  activeSection,
  onNavClick 
}: MobileDrawerProps) {
  const { t } = useLanguage();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      // Small delay to prevent immediate close on open
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 100);
    }

    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Navigation items configuration
  const navItems = [
    { key: 'about', label: t('nav.about') },
    { key: 'artists', label: t('nav.artists') },
    { key: 'shows', label: t('nav.shows') },
    { key: 'releases', label: t('nav.releases') },
    { key: 'contact', label: t('nav.contact') }
  ];

  const handleNavItemClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    onNavClick(e, sectionId);
    onClose(); // Close drawer after navigation
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]
          transition-opacity duration-300 md:hidden
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`
          fixed top-0 right-0 h-full w-full max-w-sm
          bg-background shadow-2xl z-[9999]
          transform transition-transform duration-300 ease-out
          md:hidden
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-200">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="py-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <MobileNavItem
                key={item.key}
                href={`#${item.key}`}
                label={item.label}
                isActive={activeSection === item.key}
                onClick={(e) => handleNavItemClick(e, item.key)}
              />
            ))}
          </ul>
        </nav>

        {/* Social Links (optional footer) */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-surface-200">
          <p className="text-sm text-surface-600 text-center">
            © 2024 Favorite Library
          </p>
        </div>
      </div>
    </>
  );
}