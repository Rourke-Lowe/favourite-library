// src/components/ui/LazyImage.tsx
import Image from 'next/image';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';
import { useState, useRef } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  onClick?: () => void;
  width?: number;
  height?: number;
}

const LazyImage = ({
  src,
  alt,
  className,
  imgClassName,
  onClick,
  width = 500,
  height = 500,
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [ref, isInView] = useIntersectionObserver<HTMLDivElement>({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '200px',
  });
  
  return (
    <div 
      ref={ref} 
      className={cn("relative overflow-hidden", className)}
      onClick={onClick}
    >
      {/* Placeholder */}
      {(!isLoaded || !isInView) && (
        <div className="absolute inset-0 bg-surface-200 animate-pulse"></div>
      )}
      
      {/* Only render image when in viewport */}
      {isInView && (
        <Image 
          src={src} 
          alt={alt} 
          width={width}
          height={height}
          className={cn(
            "transition-opacity duration-500",
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