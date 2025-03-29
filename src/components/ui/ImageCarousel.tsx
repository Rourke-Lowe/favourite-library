import React, { useState, useEffect, useRef } from 'react';

const ImageCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
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
        setActiveIndex((current) => (current + 1) % imagePaths.length);
      }, 2500);
      
      return () => clearInterval(interval);
    }
  }, [isPaused, imagePaths.length]);
  
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
      className="relative w-full overflow-hidden py-10" // Reduced vertical padding
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      ref={carouselRef}
    >
      <div className="flex justify-center items-center h-[28rem] perspective-1000"> {/* Increased height */}
        {imagePaths.map((path, index) => (
          <div
            key={path}
            className="absolute w-80 h-[26rem] transition-all duration-700 cursor-pointer shadow-xl rounded-md overflow-hidden" /* Increased width and height */
            style={getCardStyle(index)}
            onClick={() => setActiveIndex(index)}
          >
            <img 
              src={path} 
              alt={`Gallery image ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      
      {/* Navigation dots */}
      <div className="flex justify-center mt-6 mb-2"> {/* Reduced bottom margin */}
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