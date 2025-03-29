// src/components/ParallaxBackground.tsx
'use client';
import { useEffect, useRef } from 'react';
import { throttle } from '@/utils/throttle';

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
  const imagesLoadedRef = useRef<boolean[]>(parallaxLayers.map(() => false));

  useEffect(() => {
    // Load background images with low priority
    parallaxLayers.forEach((layer, index) => {
      const img = new Image();
      img.onload = () => {
        imagesLoadedRef.current[index] = true;
        if (layerRefs.current[index]) {
          layerRefs.current[index].style.backgroundImage = `url(${layer.image})`;
          layerRefs.current[index].style.opacity = layer.opacity.toString();
        }
      };
      // Use low priority for background images
      img.fetchPriority = 'high';
      img.loading = 'lazy';
      img.src = layer.image;
    });

    const handleScroll = throttle(() => {
      const scrollPosition = window.scrollY;
      
      layerRefs.current.forEach((layer, index) => {
        if (layer) {
          // Only apply parallax effect if image is loaded
          if (imagesLoadedRef.current[index]) {
            const yOffset = scrollPosition * parallaxLayers[index].speed;
            layer.style.transform = `translate3d(0, ${yOffset}px, 0)`;
          }
        }
      });
    }, 10);
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial positioning
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
            opacity: 0, // Start with opacity 0, will be set to proper value when loaded
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            willChange: 'transform', // Hint for browser optimization
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none'
          }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}