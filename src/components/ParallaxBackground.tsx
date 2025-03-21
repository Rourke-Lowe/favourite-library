// src/components/ParallaxBackground.tsx
'use client';
import { useEffect, useRef } from 'react';
import { throttle } from '@/utils/throttle';

interface ParallaxLayer {
  image: string;
  speed: number; // between 0.1 (slow) and 0.9 (fast)
  zIndex: number;
  opacity: number;
  position?: 'foreground' | 'midground' | 'background';
}

const parallaxLayers: ParallaxLayer[] = [
  {
    image: '/images/parallax/layer1.png', // Update this to your layer 1 image
    speed: 0,
    zIndex: -30,
    opacity: 1.0
  },
  {
    image: '/images/parallax/layer2.png', // Update this to your layer 2 image
    speed: 0.05,
    zIndex: -20,
    opacity: 1.0
  },
  {
    image: '/images/parallax/layer3.png', // Update this to your layer 3 image
    speed: -0.15,
    zIndex: -10,
    opacity: 1.0
  }
];




export default function ParallaxBackground() {
  const layerRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const handleScroll = throttle(() => {
      const scrollPosition = window.scrollY;
      
      layerRefs.current.forEach((layer, index) => {
        if (layer) {
          // Move layers at different speeds
          const yOffset = scrollPosition * parallaxLayers[index].speed;
          layer.style.transform = `translate3d(0, ${yOffset}px, 0)`;
        }
      });
    }, 10); // More frequent updates for smoother parallax
    
    window.addEventListener('scroll', handleScroll);
    // Initial positioning
    handleScroll();
    
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
            opacity: layer.opacity,
            backgroundImage: `url(${layer.image})`
          }}
        />
      ))}
    </div>
  );
}