// src/components/ParallaxBackground.tsx
'use client';
import { useEffect, useRef, useState } from 'react';

interface ParallaxLayer {
  image: string;
  speed: number; // between 0.1 (slow) and 0.9 (fast)
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

// Export this to use in layout.tsx
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
  const [hasMounted, setHasMounted] = useState(false);
  
  // Use requestAnimationFrame for smooth animations
  useEffect(() => {
    setHasMounted(true);
    
    // We don't need to update the transform on every scroll event
    // Instead, we update it on animation frames
    const updateParallax = () => {
      const scrollPosition = window.scrollY;
      
      // Only update if we have layers
      if (layerRefs.current.length) {
        layerRefs.current.forEach((layer, index) => {
          if (layer) {
            // Apply transform through style property with hardware acceleration
            const yOffset = scrollPosition * parallaxLayers[index].speed;
            layer.style.transform = `translate3d(0, ${yOffset}px, 0)`;
          }
        });
      }
      
      // Request next frame
      rafRef.current = requestAnimationFrame(updateParallax);
    };
    
    // Start the animation loop
    rafRef.current = requestAnimationFrame(updateParallax);
    
    // Clean up
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Add will-change to optimize browser rendering
  useEffect(() => {
    // Add will-change to hint the browser about upcoming transformations
    // but only after component mounts to avoid unnecessary memory usage on initial load
    if (hasMounted) {
      layerRefs.current.forEach((layer) => {
        if (layer) {
          layer.style.willChange = 'transform';
        }
      });
      
      // Remove will-change after a delay to prevent long-term memory impact
      const timeoutId = setTimeout(() => {
        layerRefs.current.forEach((layer) => {
          if (layer) {
            layer.style.willChange = 'auto';
          }
        });
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [hasMounted]);

  return (
    <div className="parallax-container fixed inset-0 w-full h-full pointer-events-none overflow-hidden">
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
            // Use translate3d for hardware acceleration
            transform: 'translate3d(0, 0, 0)'
          }}
        />
      ))}
    </div>
  );
}