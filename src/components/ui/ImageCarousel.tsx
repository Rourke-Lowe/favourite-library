// Optimized carousel with proper cleanup and inline visibility detection
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const ImageCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [carouselReady, setCarouselReady] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [isCarouselVisible, setIsCarouselVisible] = useState(true); // ✅ MEMORY OPTIMIZATION: Control animations
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const visibilityObserverRef = useRef<IntersectionObserver | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const imagePaths = [
    "/images/gallery/image-1.jpg",
    "/images/gallery/image-2.jpg",
    "/images/gallery/image-3.jpg",
    "/images/gallery/image-4.jpg", 
    "/images/gallery/image-5.jpg",
    "/images/gallery/image-6.jpg",
  ];

  // ✅ MEMORY OPTIMIZATION: Visibility detection to pause animations when off-screen
  useEffect(() => {
    const element = carouselRef.current;
    if (!element) return;
    
    visibilityObserverRef.current = new IntersectionObserver(
      ([entry]) => {
        setIsCarouselVisible(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: '50px' }
    );
    
    visibilityObserverRef.current.observe(element);
    
    // ✅ CRITICAL: Cleanup observer to prevent memory leaks
    return () => {
      if (visibilityObserverRef.current) {
        visibilityObserverRef.current.disconnect();
        visibilityObserverRef.current = null;
      }
    };
  }, []);

  // ✅ MEMORY OPTIMIZATION: AbortController prevents memory leaks from cancelled image loads
  useEffect(() => {
    const abortController = new AbortController();
    const criticalImages = imagePaths.slice(0, 3);
    
    const preloadPromises = criticalImages.map((path, index) => {
      return new Promise<number>((resolve) => {
        if (abortController.signal.aborted) {
          resolve(index);
          return;
        }
        
        const img = new Image();
        img.src = path;
        
        const handleLoad = () => {
          if (!abortController.signal.aborted) {
            setLoadedImages(prev => new Set([...prev, index]));
          }
          resolve(index);
        };
        
        const handleError = () => {
          console.error(`Failed to load image: ${path}`);
          resolve(index);
        };
        
        img.addEventListener('load', handleLoad);
        img.addEventListener('error', handleError);
        
        // ✅ MEMORY OPTIMIZATION: Cleanup listeners if aborted
        abortController.signal.addEventListener('abort', () => {
          img.removeEventListener('load', handleLoad);
          img.removeEventListener('error', handleError);
          resolve(index);
        });
        
        setTimeout(() => resolve(index), 3000);
      });
    });

    Promise.all(preloadPromises).then(() => {
      if (!abortController.signal.aborted) {
        setCarouselReady(true);
      }
    });

    // Background loading for remaining images
    imagePaths.slice(3).forEach((path, i) => {
      if (abortController.signal.aborted) return;
      
      const actualIndex = i + 3;
      const img = new Image();
      img.src = path;
      img.onload = () => {
        if (!abortController.signal.aborted) {
          setLoadedImages(prev => new Set([...prev, actualIndex]));
        }
      };
      img.onerror = () => {
        console.error(`Failed to load background image: ${path}`);
      };
    });

    // ✅ CRITICAL: AbortController cleanup prevents memory leaks
    return () => {
      abortController.abort();
    };
  }, [imagePaths]);

  // ✅ MEMORY OPTIMIZATION: Optimized carousel advance with proper cleanup
  const advanceCarousel = useCallback(() => {
    setActiveIndex(current => {
      const next = (current + 1) % imagePaths.length;
      // Preload next images
      setLoadedImages(prev => new Set([...prev, next, (next + 1) % imagePaths.length]));
      return next;
    });
  }, [imagePaths.length]);
  
  // ✅ MEMORY OPTIMIZATION: Only run animation when visible and ready
  useEffect(() => {
    if (carouselReady && isCarouselVisible) {
      // Clear existing interval - IMPORTANT for cleanup
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      intervalRef.current = setInterval(advanceCarousel, 4000);
      
      // ✅ CRITICAL: Cleanup function prevents memory leaks
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    } else {
      // ✅ MEMORY OPTIMIZATION: Clear interval when not visible
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [carouselReady, isCarouselVisible, advanceCarousel]);
  
  // Calculate card positions with memoization
  const getCardStyle = useCallback((index: number) => {
    const position = (index - activeIndex + imagePaths.length) % imagePaths.length;
    
    let zIndex = 10 - Math.min(Math.abs(position), Math.abs(position - imagePaths.length));
    let xTranslate = 0;
    let scale = 1;
    let opacity = 1;
    let rotate = 0;
    
    if (isMobile) {
      if (position === 0) {
        scale = 1.1;
        zIndex = 20;
      } else {
        if (position > 0 && position <= Math.floor(imagePaths.length / 2)) {
          xTranslate = 120 + (position - 1) * 60; 
          scale = 0.8 - (position * 0.05);
          opacity = 0.8 - (position * 0.15);
          rotate = 8 + (position * 4);
        } else {
          const adjustedPosition = position > Math.floor(imagePaths.length / 2) 
            ? position - imagePaths.length 
            : position;
          xTranslate = -120 + (adjustedPosition + 1) * 60; 
          scale = 0.8 - (Math.abs(adjustedPosition) * 0.05);
          opacity = 0.8 - (Math.abs(adjustedPosition) * 0.15);
          rotate = -8 + (adjustedPosition * 4);
        }
      }
    } else {
      if (position === 0) {
        scale = 2;
        zIndex = 20;
      } else {
        if (position > 0 && position <= Math.floor(imagePaths.length / 2)) {
          xTranslate = 240 + (position - 1) * 120; 
          scale = 0.85 - (position * 0.05);
          opacity = 0.9 - (position * 0.15);
          rotate = 12 + (position * 6);
        } else {
          const adjustedPosition = position > Math.floor(imagePaths.length / 2) 
            ? position - imagePaths.length 
            : position;
          xTranslate = -240 + (adjustedPosition + 1) * 120; 
          scale = 0.85 - (Math.abs(adjustedPosition) * 0.05);
          opacity = 0.9 - (Math.abs(adjustedPosition) * 0.15);
          rotate = -12 + (adjustedPosition * 6);
        }
      }
    }
    
    return {
      zIndex,
      transform: `translateX(${xTranslate}px) scale(${scale}) rotateY(${rotate}deg)`,
      opacity
    };
  }, [activeIndex, isMobile, imagePaths.length]);

  // Force load image with proper error handling
  const forceLoadImage = useCallback((index: number) => {
    if (!loadedImages.has(index)) {
      const img = new Image();
      img.src = imagePaths[index];
      img.onload = () => {
        setLoadedImages(prev => new Set([...prev, index]));
      };
      img.onerror = () => {
        console.error(`Failed to force load image at index ${index}`);
      };
    }
  }, [loadedImages, imagePaths]);
  
  return (
    <div 
      ref={carouselRef} // ✅ MEMORY OPTIMIZATION: Used for visibility detection
      className={cn(
        "relative w-full overflow-hidden py-10",
        !carouselReady && "min-h-[28rem]",
        isMobile && "min-h-[22rem]"
      )}
    >
      {/* Loading state */}
      {!carouselReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      <div className={cn(
        "flex justify-center items-center",
        isMobile ? "h-[20rem]" : "h-[28rem]",
        "perspective-1000",
        !carouselReady && "opacity-0"
      )}>
        {imagePaths.map((path, index) => (
          <div
            key={path}
            className={cn(
              "absolute transition-all duration-700 cursor-pointer shadow-xl rounded-md overflow-hidden",
              isMobile ? "w-60 h-[16rem]" : "w-80 h-[26rem]"
            )}
            style={getCardStyle(index)}
            onClick={() => {
              setActiveIndex(index);
              forceLoadImage(index);
            }}
            onMouseEnter={() => forceLoadImage(index)}
          >
            {/* Placeholder */}
            <div 
              className={cn(
                "absolute inset-0 bg-gray-200",
                loadedImages.has(index) ? "opacity-0" : "opacity-100"
              )}
              style={{ 
                transition: 'opacity 0.3s ease-in-out',
                backgroundColor: '#f0f0f0'
              }}
            />
            
            {/* ✅ MEMORY OPTIMIZATION: Lazy loaded images */}
            <img 
              ref={el => { imageRefs.current[index] = el }}
              src={path} 
              alt={`Gallery image ${index + 1}`}
              className={cn(
                "w-full h-full object-cover transition-opacity duration-300",
                loadedImages.has(index) ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => {
                setLoadedImages(prev => new Set([...prev, index]));
              }}
              onError={() => {
                console.error(`Error loading image at index ${index}`);
              }}
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
            onClick={() => {
              setActiveIndex(index);
              forceLoadImage(index);
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;