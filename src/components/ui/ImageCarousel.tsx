// src/components/ui/ImageCarousel.tsx
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const ImageCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [carouselReady, setCarouselReady] = useState(false);
  const [imageStatuses, setImageStatuses] = useState<Record<number, boolean>>({});
  const carouselRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  
  // Reduced to 6 images as requested
  const imagePaths = [
    "/images/gallery/image-1.jpg",
    "/images/gallery/image-2.jpg",
    "/images/gallery/image-3.jpg",
    "/images/gallery/image-4.jpg", 
    "/images/gallery/image-5.jpg",
    "/images/gallery/image-6.jpg",
  ];

  // Force load all images at initialization
  useEffect(() => {
    const imagePromises = imagePaths.map((path, index) => {
      return new Promise<number>((resolve, reject) => {
        const img = new Image();
        img.src = path;
        img.onload = () => resolve(index);
        img.onerror = () => {
          console.error(`Failed to load image: ${path}`);
          resolve(index); // Resolve anyway to prevent blocking
        };
        
        // Set a timeout to resolve anyway after 5 seconds to prevent indefinite waiting
        setTimeout(() => resolve(index), 5000);
      });
    });

    // Mark carousel as ready when all images are loaded or after timeout
    Promise.all(imagePromises).then((loadedIndices) => {
      const statusMap = loadedIndices.reduce((acc, index) => {
        acc[index] = true;
        return acc;
      }, {} as Record<number, boolean>);
      
      setImageStatuses(statusMap);
      setCarouselReady(true);
    });

    // Add preload links for the first 3 images
    imagePaths.slice(0, 3).forEach(path => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = path;
      document.head.appendChild(link);
    });

    return () => {
      // Clean up preload links
      document.querySelectorAll('link[rel="preload"][as="image"]').forEach(el => {
        const href = el.getAttribute('href');
        if (href && imagePaths.includes(href)) {
          document.head.removeChild(el);
        }
      });
    };
  }, [imagePaths]);
  
  // Auto-scroll effect - only start when carousel is ready
  useEffect(() => {
    if (!isPaused && carouselReady) {
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
  }, [isPaused, carouselReady, imagePaths.length]);
  
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

  // Handle image load/error events
  const handleImageLoad = (index: number) => {
    setImageStatuses(prev => ({ ...prev, [index]: true }));
  };

  const handleImageError = (index: number) => {
    console.error(`Error loading image at index ${index}`);
    // Mark as loaded anyway to prevent blocking the UI
    setImageStatuses(prev => ({ ...prev, [index]: true }));
  };
  
  return (
    <div 
      className={cn(
        "relative w-full overflow-hidden py-10",
        !carouselReady && "min-h-[28rem]" // Maintain height when loading
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      ref={carouselRef}
    >
      {/* Loading state */}
      {!carouselReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      <div className={cn(
        "flex justify-center items-center h-[28rem] perspective-1000",
        !carouselReady && "opacity-0" // Hide until images are loaded
      )}>
        {imagePaths.map((path, index) => (
          <div
            key={path}
            className="absolute w-80 h-[26rem] transition-all duration-700 cursor-pointer shadow-xl rounded-md overflow-hidden"
            style={getCardStyle(index)}
            onClick={() => setActiveIndex(index)}
          >
            {/* Low-quality placeholder image (blurred version) */}
            <div 
              className={cn(
                "absolute inset-0 bg-gray-200",
                imageStatuses[index] ? "opacity-0" : "opacity-100"
              )}
              style={{ 
                transition: 'opacity 0.3s ease-in-out',
                backgroundImage: `url(${path})`,
                backgroundSize: 'cover',
                filter: 'blur(10px)',
                transform: 'scale(1.1)'
              }}
            />
            
            {/* Actual image */}
            <img 
              ref={el => { imageRefs.current[index] = el }}
              src={path} 
              alt={`Gallery image ${index + 1}`}
              className={cn(
                "w-full h-full object-cover transition-opacity duration-300",
                imageStatuses[index] ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => handleImageLoad(index)}
              onError={() => handleImageError(index)}
              loading={index < 3 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>
      
      {/* Navigation dots */}
      <div className={cn(
        "flex justify-center mt-6 mb-2",
        !carouselReady && "opacity-0"
      )}>
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