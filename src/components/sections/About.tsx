// src/components/sections/About.tsx
'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import ImageCarousel from '@/components/ui/ImageCarousel';

const About = () => {
  return (
    <section id="about" className="py-16 md:py-20 relative"> {/* Reduced bottom padding */}
      <div className="container mx-auto px-6">
        {/* Quote header (for both desktop and mobile) */}
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-display font-light">
            "Favourite Library is all about the sustainability of art"
          </h2>
          <div className="mt-4 w-32 md:w-64 h-px bg-surface-200 mx-auto"></div>
        </div>
        
        {/* New paragraph - Added here between header and statements */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-base md:text-lg text-surface-600 max-w-3xl mx-auto">
            An indie music label based in Tiohtià:ke/Montreal, Canada. Monthly unplugged intimate shows and artist label services.
          </p>
        </div>
        
        {/* Three statements row - Desktop version */}
        <div className="hidden md:block">
          <div className="max-w-5xl mx-auto">
            {/* Row of quotes */}
            <div className="flex">
              {/* First message */}
              <div className="flex-1 group px-8 relative">
                <div className="backdrop-blur-sm bg-background/10 p-6 rounded-md hover:bg-background/20 transition-colors">
                  <p className="text-lg font-light">
                    We are dedicated to tea, music, and community.
                  </p>
                </div>
                {/* Right divider */}
                <div className="absolute right-0 top-1/2 h-12 w-px bg-surface-200 transform -translate-y-1/2"></div>
              </div>
              
              {/* Second message */}
              <div className="flex-1 group px-8 relative">
                <div className="backdrop-blur-sm bg-background/10 p-6 rounded-md hover:bg-background/20 transition-colors">
                  <p className="text-lg font-light">
                    A space to support artists in channeling their vision.
                  </p>
                </div>
                {/* Right divider */}
                <div className="absolute right-0 top-1/2 h-12 w-px bg-surface-200 transform -translate-y-1/2"></div>
              </div>
              
              {/* Third message */}
              <div className="flex-1 group px-8">
                <div className="backdrop-blur-sm bg-background/10 p-6 rounded-md hover:bg-background/20 transition-colors">
                  <p className="text-lg font-light">
                    A library to discover new music, art, creation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile layout (hidden on desktop) */}
        <div className="md:hidden">
          <div className="space-y-6">
            {/* First message */}
            <div className="mx-auto max-w-[300px]">
              <div className="backdrop-blur-sm bg-background/10 p-5 rounded-md">
                <p className="text-center text-base font-light">
                  We are dedicated to tea, music, and community.
                </p>
              </div>
            </div>
            
            {/* Second message */}
            <div className="mx-auto max-w-[300px]">
              <div className="backdrop-blur-sm bg-background/10 p-5 rounded-md">
                <p className="text-center text-base font-light">
                  A space to support artists in channeling their vision.
                </p>
              </div>
            </div>
            
            {/* Third message */}
            <div className="mx-auto max-w-[300px]">
              <div className="backdrop-blur-sm bg-background/10 p-5 rounded-md">
                <p className="text-center text-base font-light">
                  A library to discover new music, art, creation.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Image Carousel - integrated directly within the About section */}
        <div className="mt-14 max-w-7xl mx-auto pb-0"> {/* Larger max-width, reduced top margin, removed bottom padding */}
          <ImageCarousel />
        </div>
      </div>
    </section>
  );
};

export default About;