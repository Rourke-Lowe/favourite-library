// src/components/sections/Moodboard.tsx
'use client';
import { useEffect, useRef } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';

const Moodboard = () => {
  // Create array of image paths for all 10 moodboard images
  const moodboardImages = Array.from({ length: 10 }, (_, i) => `/images/moodboard/moodboard${i + 1}.jpg`);
  
  // Ref for the container
  const galleryRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Animate images in on load for a more dynamic feel
    const gallery = galleryRef.current;
    if (!gallery) return;
    
    const images = gallery.querySelectorAll('.moodboard-item');
    
    images.forEach((img, index) => {
      setTimeout(() => {
        (img as HTMLElement).style.opacity = '1';
        (img as HTMLElement).style.transform = 'translateY(0)';
      }, 100 * index);
    });
  }, []);
  
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
    <section id="moodboard" className="py-24">
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
              className={`moodboard-item opacity-0 transform translate-y-8 transition-all duration-700 ease-out ${getGridClass(index)}`}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <img 
                src={src}
                alt={`Moodboard image ${index + 1}`}
                style={{ 
                  maxWidth: '100%', 
                  height: 'auto', 
                  objectFit: 'contain',
                  display: 'block'
                }}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Moodboard;