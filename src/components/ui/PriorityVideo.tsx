// src/components/ui/PriorityVideo.tsx
'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useResourcePriority } from '@/context/ResourcePriorityContext';
import { cn } from '@/lib/utils';

interface PriorityVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  priority?: 'critical' | 'high' | 'medium' | 'low';
  id?: string; // Optional custom ID
  placeholderColor?: string;
  onLoad?: () => void;
}

const PriorityVideo: React.FC<PriorityVideoProps> = ({
  src,
  priority = 'medium',
  id,
  className,
  placeholderColor = '#f3f4f6',
  onLoad,
  autoPlay,
  muted = true,
  playsInline = true,
  loop,
  ...props
}) => {
  const resourceId = id || `video-${src}`;
  const { registerResource, isResourceLoaded, preloadResource } = useResourcePriority();
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Register the resource when the component mounts
  useEffect(() => {
    registerResource(resourceId, src, 'video', priority);
    
    // If critical or high priority, preload immediately
    if (priority === 'critical' || priority === 'high') {
      preloadResource(resourceId).then(() => {
        setIsLoaded(true);
        onLoad?.();
        // Start playing if autoPlay is true
        if (autoPlay && videoRef.current) {
          videoRef.current.play().catch(e => console.error('Video autoplay failed:', e));
        }
      });
    }
  }, [resourceId, src, priority, autoPlay, registerResource, preloadResource, onLoad]);
  
  // Check if the resource is already loaded
  useEffect(() => {
    if (isResourceLoaded(resourceId)) {
      setIsLoaded(true);
      onLoad?.();
      // Start playing if autoPlay is true
      if (autoPlay && videoRef.current) {
        videoRef.current.play().catch(e => console.error('Video autoplay failed:', e));
      }
    }
  }, [resourceId, isResourceLoaded, autoPlay, onLoad]);
  
  // For medium/low priority, start loading when observed
  useEffect(() => {
    if (priority === 'medium' || priority === 'low') {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !isLoaded) {
            preloadResource(resourceId).then(() => {
              setIsLoaded(true);
              onLoad?.();
              // Start playing if autoPlay is true
              if (autoPlay && videoRef.current) {
                videoRef.current.play().catch(e => console.error('Video autoplay failed:', e));
              }
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
  }, [resourceId, priority, isLoaded, autoPlay, preloadResource, onLoad]);
  
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
      
      {/* Video */}
      <video
        ref={videoRef}
        className={cn(
          "transition-opacity duration-500",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        muted={muted}
        playsInline={playsInline}
        loop={loop}
        preload="auto"
        onLoadedData={() => {
          setIsLoaded(true);
          onLoad?.();
        }}
        {...props}
      >
        <source src={isLoaded ? src : ''} type="video/mp4" />
      </video>
    </div>
  );
};

export default PriorityVideo;