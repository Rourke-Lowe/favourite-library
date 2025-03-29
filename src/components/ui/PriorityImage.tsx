// src/components/ui/PriorityImage.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useResourcePriority } from '@/context/ResourcePriorityContext';
import { cn } from '@/lib/utils';

interface PriorityImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  priority?: 'critical' | 'high' | 'medium' | 'low';
  id?: string; // Optional custom ID
  placeholderColor?: string;
  onLoad?: () => void;
}

const PriorityImage: React.FC<PriorityImageProps> = ({
  src,
  alt,
  priority = 'medium',
  id,
  className,
  placeholderColor = '#f3f4f6',
  onLoad,
  ...props
}) => {
  const resourceId = id || `img-${src}`;
  const { registerResource, isResourceLoaded, preloadResource } = useResourcePriority();
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Register the resource when the component mounts
  useEffect(() => {
    registerResource(resourceId, src, 'image', priority);
    
    // If critical or high priority, preload immediately
    if (priority === 'critical' || priority === 'high') {
      preloadResource(resourceId).then(() => {
        setIsLoaded(true);
        onLoad?.();
      });
    }
  }, [resourceId, src, priority, registerResource, preloadResource, onLoad]);
  
  // Check if the resource is already loaded
  useEffect(() => {
    if (isResourceLoaded(resourceId)) {
      setIsLoaded(true);
      onLoad?.();
    }
  }, [resourceId, isResourceLoaded, onLoad]);
  
  // For medium/low priority, start loading when observed
  useEffect(() => {
    if (priority === 'medium' || priority === 'low') {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !isLoaded) {
            preloadResource(resourceId).then(() => {
              setIsLoaded(true);
              onLoad?.();
            });
            observer.unobserve(entry.target);
          }
        },
        { rootMargin: '200px' }
      );
      
      const element = document.getElementById(resourceId);
      if (element) {
        observer.observe(element);
      }
      
      return () => {
        if (element) {
          observer.unobserve(element);
        }
      };
    }
  }, [resourceId, priority, isLoaded, preloadResource, onLoad]);
  
  return (
    <div 
      id={resourceId}
      className={cn(
        "relative overflow-hidden",
        className
      )}
    >
      {/* Placeholder */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 animate-pulse" 
          style={{ backgroundColor: placeholderColor }}
        ></div>
      )}
      
      {/* Image */}
      <img
        src={src}
        alt={alt}
        className={cn(
          "transition-opacity duration-500",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={() => {
          setIsLoaded(true);
          onLoad?.();
        }}
        {...props}
      />
    </div>
  );
};

export default PriorityImage;