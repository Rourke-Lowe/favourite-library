import { useState, useEffect } from 'react';
import OptimizedImage from './OptimizedImage';
import { cn } from '@/lib/utils';

const images = [
  "/images/gallery/image-1.jpg",
  "/images/gallery/image-2.jpg",
  "/images/gallery/image-3.jpg",
  "/images/gallery/image-5.jpg",
  "/images/gallery/image-6.jpg",
];

export default function SimpleImageCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || document.hidden) return;

    const timer = setInterval(() => {
      setActiveIndex(current => (current + 1) % images.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [isPaused]);

  // Pause when page is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPaused(document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return (
    <div 
      className="relative w-full max-w-4xl mx-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Container with 16:9 aspect ratio for desktop, 4:3 for mobile */}
      <div className="relative w-full aspect-[4/3] md:aspect-[16/10] overflow-hidden rounded-lg shadow-lg">
        {/* Only render current and adjacent images */}
        {images.map((src, index) => {
          const isActive = index === activeIndex;
          const isPrev = index === (activeIndex - 1 + images.length) % images.length;
          const isNext = index === (activeIndex + 1) % images.length;
          
          // Skip rendering non-visible images
          if (!isActive && !isPrev && !isNext) return null;

          return (
            <div
              key={src}
              className={cn(
                "absolute inset-0 transition-all duration-700",
                isActive ? "opacity-100 scale-100 z-10" : "opacity-0 scale-95 z-0"
              )}
            >
              <OptimizedImage
                src={src}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full"
                imgClassName="w-full h-full object-cover"
                priority={isActive}
              />
            </div>
          );
        })}

        {/* Gradient overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              index === activeIndex 
                ? "bg-white w-8 shadow-lg" 
                : "bg-white/60 hover:bg-white/80"
            )}
            onClick={() => {
              setActiveIndex(index);
              setIsPaused(true);
              setTimeout(() => setIsPaused(false), 5000); // Resume after 5s
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Optional: Add navigation arrows */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity z-20"
        onClick={() => {
          setActiveIndex((activeIndex - 1 + images.length) % images.length);
          setIsPaused(true);
          setTimeout(() => setIsPaused(false), 5000);
        }}
        aria-label="Previous image"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity z-20"
        onClick={() => {
          setActiveIndex((activeIndex + 1) % images.length);
          setIsPaused(true);
          setTimeout(() => setIsPaused(false), 5000);
        }}
        aria-label="Next image"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}