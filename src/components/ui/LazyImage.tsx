// src/components/ui/LazyImage.tsx
import React, { useState, useEffect } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  placeholderClassName?: string;
  threshold?: number;
  rootMargin?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className,
  imgClassName,
  placeholderClassName,
  threshold = 0.1,
  rootMargin = '200px',
  ...props
}) => {
  const [ref, isInView] = useIntersectionObserver<HTMLDivElement>({
    triggerOnce: true,
    threshold,
    rootMargin,
  });
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    if (isInView && !isLoaded && !error) {
      const img = new Image();
      
      img.onload = () => {
        setIsLoaded(true);
      };
      
      img.onerror = () => {
        setError(true);
        console.error(`Failed to load image: ${src}`);
      };
      
      img.src = src;
    }
  }, [isInView, src, isLoaded, error]);
  
  return (
    <div 
      ref={ref} 
      className={cn("overflow-hidden relative", className)}
      {...props}
    >
      {/* Show placeholder while loading */}
      {(!isInView || !isLoaded) && (
        <div 
          className={cn(
            "absolute inset-0 bg-surface-200 animate-pulse", 
            placeholderClassName
          )}
        />
      )}
      
      {/* Only render the image when it's in view */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={cn(
            "w-full h-full transition-opacity duration-500", 
            isLoaded ? "opacity-100" : "opacity-0",
            imgClassName
          )}
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </div>
  );
};

export default LazyImage;