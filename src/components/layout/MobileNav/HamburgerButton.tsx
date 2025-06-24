// src/components/layout/MobileNav/HamburgerButton.tsx
import React from 'react';

interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function HamburgerButton({ isOpen, onClick }: HamburgerButtonProps) {
  return (
    <button
      onClick={onClick}
      className="relative w-11 h-11 flex items-center justify-center md:hidden focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg"
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
    >
      <div className="w-6 h-5 relative flex flex-col justify-between">
        {/* Top line */}
        <span
          className={`block h-0.5 w-full bg-current transform transition-all duration-300 ${
            isOpen ? 'rotate-45 translate-y-2' : ''
          }`}
        />
        
        {/* Middle line */}
        <span
          className={`block h-0.5 w-full bg-current transition-all duration-300 ${
            isOpen ? 'opacity-0' : ''
          }`}
        />
        
        {/* Bottom line */}
        <span
          className={`block h-0.5 w-full bg-current transform transition-all duration-300 ${
            isOpen ? '-rotate-45 -translate-y-2' : ''
          }`}
        />
      </div>
    </button>
  );
}