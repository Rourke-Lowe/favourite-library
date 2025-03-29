// src/components/sections/Moodboard.tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';

// LazyImage component for optimized image loading
const LazyImage = ({ src, alt, className, imgClassName, parentClassName }) => {
  const [ref, isInView] = useIntersectionObserver<HTMLDivElement>({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '300px', // Load a bit earlier for moodboard
  });
  
  const [isLoaded, setIsLoaded] = useState(false);
  
  return (
    <div 
      ref={ref} 
      className={cn("relative overflow-hidden", parentClassName)}
    >
      {/* Placeholder */}
      {(!isLoaded || !isInView) && (
        <div className="w-full h-full bg-surface-200 animate-pulse"></div>
      )}
      
      {/* Only render image when in viewport */}
      {isInView && (
        <img 
          src={src} 
          alt={alt} 
          className={cn(
            "transition-all duration-700",
            isLoaded ? "opacity-100 transform-none" : "opacity-0 translate-y-4",
            className,
            imgClassName
          )}
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </div>
  );
};

const Moodboard = () => {
  // Create array of image paths for all 10 moodboard images
  const moodboardImages = Array.from({ length: 10 }, (_, i) => `/images/moodboard/moodboard${i + 1}.jpg`);
  
  // Ref for the container
  const galleryRef = useRef<HTMLDivElement>(null);
  
  // Section visibility observer
  const [sectionRef, isSectionVisible] = useIntersectionObserver<HTMLElement>({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '200px',
  });
  
  // Dynamic layout - some images span multiple grid cells
  const getGridClass = (index: number) => {
    // Make certain images stand out by spanning multiple columns or rows
    switch (index) {
      case 0: // First image - feature it
        return 'md:col-span-2 md:row-span-2';
      case 3: // Fourth image
        return 'md:col-span-2';
      case 7: // Eighth image
        return 'md:row-span-2';
      default:
        return '';
    }
  };
  
  return (
    <section ref={sectionRef} id="moodboard" className="py-24">
      <div className="container mx-auto px-6">
        <SectionHeader 
          title="Moodboard" 
          subtitle="Some visual vibes that reflect our identity."
        />
        
        {/* Dynamic grid layout with no card backgrounds */}
        <div 
          ref={galleryRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {moodboardImages.map((src, index) => (
            <div 
              key={index} 
              className={`moodboard-item ${getGridClass(index)}`}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <LazyImage
                src={src}
                alt={`Moodboard image ${index + 1}`}
                className="max-w-full h-auto object-contain block"
                parentClassName={`moodboard-item ${getGridClass(index)}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Moodboard;