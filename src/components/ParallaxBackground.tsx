// Optimized parallax with proper RAF cleanup and visibility detection
'use client';
import { useEffect, useRef, useState } from 'react';

interface ParallaxLayer {
  image: string;
  speed: number;
  zIndex: number;
  opacity: number;
  position?: 'foreground' | 'midground' | 'background';
}

const parallaxLayers: ParallaxLayer[] = [
  {
    image: '/images/parallax/layer1.svg',
    speed: 0,
    zIndex: -30,
    opacity: 1.0
  },
  {
    image: '/images/parallax/layer2.svg',
    speed: 0.05,
    zIndex: -20,
    opacity: 1.0
  },
  {
    image: '/images/parallax/layer3.svg',
    speed: -0.15,
    zIndex: -10,
    opacity: 1.0
  }
];

export function ParallaxPreload() {
  return (
    <>
      {parallaxLayers.map((layer, index) => (
        <link 
          key={`parallax-preload-${index}`}
          rel="preload" 
          href={layer.image} 
          as="image" 
        />
      ))}
    </>
  );
}

export default function ParallaxBackground() {
  const layerRefs = useRef<HTMLDivElement[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastScrollY = useRef(0);
  const [hasMounted, setHasMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Visibility detection to pause parallax when off-screen
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: '100px' }
    );
    
    visibilityObserver.observe(container);
    
    return () => {
      visibilityObserver.disconnect();
    };
  }, []);
  
  // Optimized parallax with RAF cleanup
  useEffect(() => {
    setHasMounted(true);
    
    if (!isVisible) return; // Don't run parallax when not visible
    
    const updateParallax = () => {
      const scrollY = window.scrollY;
      const scrollDelta = Math.abs(scrollY - lastScrollY.current);
      
      // Only update if scroll delta is significant (performance optimization)
      if (scrollDelta > 1 && layerRefs.current.length) {
        layerRefs.current.forEach((layer, index) => {
          if (layer) {
            const yOffset = scrollY * parallaxLayers[index].speed;
            // Use transform3d for hardware acceleration
            layer.style.transform = `translate3d(0, ${yOffset}px, 0)`;
          }
        });
        lastScrollY.current = scrollY;
      }
      
      // Continue animation loop only if visible
      if (isVisible) {
        rafRef.current = requestAnimationFrame(updateParallax);
      }
    };
    
    // Start animation loop
    rafRef.current = requestAnimationFrame(updateParallax);
    
    // Cleanup function - CRITICAL for memory management
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isVisible]); // Re-run when visibility changes

  // Optimize will-change property
  useEffect(() => {
    if (hasMounted && isVisible) {
      layerRefs.current.forEach((layer) => {
        if (layer) {
          layer.style.willChange = 'transform';
        }
      });
      
      // Remove will-change after delay to prevent long-term memory impact
      const timeoutId = setTimeout(() => {
        layerRefs.current.forEach((layer) => {
          if (layer) {
            layer.style.willChange = 'auto';
          }
        });
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [hasMounted, isVisible]);

  return (
    <div 
      ref={containerRef}
      className="parallax-container fixed inset-0 w-full h-full pointer-events-none overflow-hidden"
    >
      {parallaxLayers.map((layer, index) => (
        <div
          key={index}
          ref={el => {
            if (el) layerRefs.current[index] = el;
          }}
          className={`parallax-layer absolute inset-0 w-full h-full bg-no-repeat bg-cover ${layer.position}`}
          style={{
            zIndex: layer.zIndex,
            opacity: layer.opacity,
            backgroundImage: `url(${layer.image})`,
            transform: 'translate3d(0, 0, 0)'
          }}
        />
      ))}
    </div>
  );
}