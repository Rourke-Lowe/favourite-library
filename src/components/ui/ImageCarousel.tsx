// src/components/ui/ImageCarousel.tsx
import React, { useState, useEffect, useRef } from 'react';

const ImageCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0, 1])); // Only preload first two
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Reduced to 6 images as requested
  const imagePaths = [
    "/images/gallery/image-1.jpg",
    "/images/gallery/image-2.jpg",
    "/images/gallery/image-3.jpg",
    "/images/gallery/image-4.jpg", 
    "/images/gallery/image-5.jpg",
    "/images/gallery/image-6.jpg",
  ];
  
  // Auto-scroll effect
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setActiveIndex((current) => {
          const next = (current + 1) % imagePaths.length;
          // Preload the next image that will be shown
          setLoadedImages(prev => new Set([...prev, next, (next + 1) % imagePaths.length]));
          return next;
        });
      }, 2500);
      
      return () => clearInterval(interval);
    }
  }, [isPaused, imagePaths.length]);
  
  // Preload active and adjacent images
  useEffect(() => {
    // Preload active, previous, and next images
    const imagesToPreload = [
      activeIndex,
      (activeIndex + 1) % imagePaths.length,
      (activeIndex - 1 + imagePaths.length) % imagePaths.length
    ];
    
    // Preload these images
    const preloadImages = () => {
      imagesToPreload.forEach(idx => {
        if (!loadedImages.has(idx)) {
          const img = new Image();
          img.onload = () => {
            setLoadedImages(prev => new Set([...prev, idx]));
          };
          img.src = imagePaths[idx];
        }
      });
    };
    
    preloadImages();
  }, [activeIndex, imagePaths, loadedImages]);
  
  // Calculate position and styles for each card
  const getCardStyle = (index: number) => {
    const position = (index - activeIndex + imagePaths.length) % imagePaths.length;
    
    // Calculate position based on distance from active card
    let zIndex = 10 - Math.min(Math.abs(position), Math.abs(position - imagePaths.length));
    let xTranslate = 0;
    let scale = 1;
    let opacity = 1;
    let rotate = 0;
    
    // Increase spacing and make active card more prominent
    if (position === 0) {
      // Active card - make it larger
      scale = 2; // Increased scale for larger active card
      zIndex = 20;
    } else {
      // Cards to the right
      if (position > 0 && position <= Math.floor(imagePaths.length / 2)) {
        // Significantly increased spacing between cards
        xTranslate = 240 + (position - 1) * 120; 
        scale = 0.85 - (position * 0.05);
        opacity = 0.9 - (position * 0.15);
        rotate = 12 + (position * 6); // More pronounced rotation
      } 
      // Cards to the left
      else {
        const adjustedPosition = position > Math.floor(imagePaths.length / 2) 
          ? position - imagePaths.length 
          : position;
        // Significantly increased spacing between cards
        xTranslate = -240 + (adjustedPosition + 1) * 120; 
        scale = 0.85 - (Math.abs(adjustedPosition) * 0.05);
        opacity = 0.9 - (Math.abs(adjustedPosition) * 0.15);
        rotate = -12 + (adjustedPosition * 6); // More pronounced rotation
      }
    }
    
    return {
      zIndex,
      transform: `translateX(${xTranslate}px) scale(${scale}) rotateY(${rotate}deg)`,
      opacity
    };
  };
  
  return (
    <div 
      className="relative w-full overflow-hidden py-10"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      ref={carouselRef}
    >
      <div className="flex justify-center items-center h-[28rem] perspective-1000">
        {imagePaths.map((path, index) => {
          const isLoaded = loadedImages.has(index);
          const isVisible = index === activeIndex || 
                            index === (activeIndex + 1) % imagePaths.length || 
                            index === (activeIndex - 1 + imagePaths.length) % imagePaths.length;
          
          return (
            <div
              key={path}
              className="absolute w-80 h-[26rem] transition-all duration-700 cursor-pointer shadow-xl rounded-md overflow-hidden"
              style={getCardStyle(index)}
              onClick={() => setActiveIndex(index)}
            >
              {isLoaded || isVisible ? (
                <img 
                  src={path} 
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading={index <= 1 ? "eager" : "lazy"}
                  decoding={index <= 1 ? "sync" : "async"}
                  fetchpriority={index === activeIndex ? "high" : "low"}
                />
              ) : (
                <div className="w-full h-full bg-surface-200 animate-pulse"></div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Navigation dots */}
      <div className="flex justify-center mt-6 mb-2">
        {imagePaths.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 mx-2 rounded-full transition-all ${
              index === activeIndex ? 'bg-primary w-4' : 'bg-surface-300'
            }`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;