// src/components/ParallaxBackground.tsx - Updated
'use client';
import { useEffect, useRef } from 'react';
import { throttle } from '@/utils/throttle';
import { useResourcePriority } from '@/context/ResourcePriorityContext';

interface ParallaxLayer {
  image: string;
  speed: number;
  zIndex: number;
  opacity: number;
  position?: 'foreground' | 'midground' | 'background';
}

const parallaxLayers: ParallaxLayer[] = [
  {
    image: '/images/parallax/layer1.png',
    speed: 0,
    zIndex: -30,
    opacity: 1.0
  },
  {
    image: '/images/parallax/layer2.png',
    speed: 0.05,
    zIndex: -20,
    opacity: 1.0
  },
  {
    image: '/images/parallax/layer3.png',
    speed: -0.15,
    zIndex: -10,
    opacity: 1.0
  }
];

export default function ParallaxBackground() {
  const layerRefs = useRef<HTMLDivElement[]>([]);
  const { registerResource, isResourceLoaded } = useResourcePriority();
  
  // Register all parallax layers as critical resources
  useEffect(() => {
    parallaxLayers.forEach((layer, index) => {
      registerResource(`parallax-layer-${index}`, layer.image, 'background', 'critical');
    });
  }, [registerResource]);

  // Set up parallax scrolling
  useEffect(() => {
    const handleScroll = throttle(() => {
      const scrollPosition = window.scrollY;
      
      layerRefs.current.forEach((layer, index) => {
        if (layer && isResourceLoaded(`parallax-layer-${index}`)) {
          const yOffset = scrollPosition * parallaxLayers[index].speed;
          layer.style.transform = `translate3d(0, ${yOffset}px, 0)`;
        }
      });
    }, 10);
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial positioning
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isResourceLoaded]);

  return (
    <div className="parallax-container">
      {parallaxLayers.map((layer, index) => (
        <div
          key={index}
          ref={el => {
            if (el) layerRefs.current[index] = el;
          }}
          className={`parallax-layer ${layer.position}`}
          style={{
            zIndex: layer.zIndex,
            opacity: isResourceLoaded(`parallax-layer-${index}`) ? layer.opacity : 0,
            backgroundImage: isResourceLoaded(`parallax-layer-${index}`) ? `url(${layer.image})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            willChange: 'transform',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            transition: 'opacity 0.5s ease'
          }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}