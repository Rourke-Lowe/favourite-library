import { useState, useEffect } from 'react';
import { useSharedIntersectionObserver } from '@/hooks/useSharedIntersectionObserver';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  onClick?: () => void;
  priority?: boolean;
}

// Image cache to prevent re-loading
const imageCache = new Set<string>();

export default function OptimizedImage({
  src,
  alt,
  className,
  imgClassName,
  onClick,
  priority = false
}: OptimizedImageProps) {
  const [ref, isInView] = useSharedIntersectionObserver<HTMLDivElement>({
    rootMargin: priority ? '500px' : '50px',
    threshold: 0.01
  });
  
  const [isLoaded, setIsLoaded] = useState(imageCache.has(src));
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!isInView || isLoaded || hasError) return;

    const img = new Image();
    let isCancelled = false;

    img.onload = () => {
      if (!isCancelled) {
        imageCache.add(src);
        setIsLoaded(true);
      }
    };

    img.onerror = () => {
      if (!isCancelled) {
        setHasError(true);
      }
    };

    img.src = src;

    return () => {
      isCancelled = true;
      img.onload = null;
      img.onerror = null;
    };
  }, [src, isInView, isLoaded, hasError]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)} onClick={onClick}>
      {/* Show placeholder until loaded */}
      {(!isLoaded || hasError) && (
        <div className="absolute inset-0 bg-surface-200 animate-pulse" />
      )}
      
      {/* Only render img tag when loaded */}
      {isLoaded && !hasError && (
        <img 
          src={src} 
          alt={alt}
          className={cn(
            "transition-opacity duration-300",
            imgClassName
          )}
        />
      )}
    </div>
  );
}