// src/features/hero/HeroSection.tsx
import React from 'react';

const HeroSection = () => {
  return (
    <section 
      id="hero" 
      className="min-h-screen flex items-center justify-center relative bg-gray-100" // Added bg-color for visibility
    >
      <div className="max-w-2xl w-full mx-auto px-6">
        {/* Add a text backup to check if the section is rendering */}
        <h1 className="text-3xl font-bold text-center mb-6">Favorite Library</h1>
        
        {/* Video Logo */}
        <div className="w-full relative">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full"
            poster="/assets/logo-poster.jpg"
          >
            <source src="/assets/logo-animation.mp4" type="video/mp4" />
            {/* Fallback for browsers that don't support video */}
            <img src="/assets/logo.png" alt="Favorite Library" className="w-full" />
          </video>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-60"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;