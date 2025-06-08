'use client';
import { useEffect, useRef, useState } from 'react';

interface ParallaxLayer {
  image: string;
  speed: number;
  zIndex: number;
  opacity: number;
}

const parallaxLayers: ParallaxLayer[] = [
  { image: '/images/parallax/layer1.svg', speed: 0, zIndex: -30, opacity: 1.0 },
  { image: '/images/parallax/layer2.svg', speed: 0.05, zIndex: -20, opacity: 1.0 },
  { image: '/images/parallax/layer3.svg', speed: -0.15, zIndex: -10, opacity: 1.0 }
];

export default function ParallaxBackground() {
  const layerRefs = useRef<HTMLDivElement[]>([]);
  const rafId = useRef<number>();
  const lastScrollY = useRef(0);
  const [isPageVisible, setIsPageVisible] = useState(true);

  useEffect(() => {
    // Page visibility API to completely stop when tab is hidden
    const handleVisibilityChange = () => {
      setIsPageVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    if (!isPageVisible) {
      // Cancel any pending animation frame when page is hidden
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = undefined;
      }
      return;
    }

    let ticking = false;
    
    const updateParallax = () => {
      if (!ticking && layerRefs.current.length) {
        ticking = true;
        rafId.current = requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          
          // Only update if scroll changed significantly
          if (Math.abs(scrollY - lastScrollY.current) > 0.5) {
            layerRefs.current.forEach((layer, index) => {
              if (layer) {
                const yOffset = scrollY * parallaxLayers[index].speed;
                layer.style.transform = `translate3d(0, ${yOffset}px, 0)`;
              }
            });
            lastScrollY.current = scrollY;
          }
          
          ticking = false;
          // Only continue if page is still visible
          if (!document.hidden) {
            updateParallax();
          }
        });
      }
    };

    // Passive scroll listener
    const handleScroll = () => {
      if (!ticking) {
        updateParallax();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateParallax();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [isPageVisible]);

  return (
    <div className="parallax-container fixed inset-0 w-full h-full pointer-events-none overflow-hidden">
      {parallaxLayers.map((layer, index) => (
        <div
          key={index}
          ref={el => { if (el) layerRefs.current[index] = el; }}
          className="parallax-layer absolute inset-0 w-full h-full bg-no-repeat bg-cover"
          style={{
            zIndex: layer.zIndex,
            opacity: layer.opacity,
            backgroundImage: `url(${layer.image})`,
            willChange: 'transform',
            transform: 'translate3d(0, 0, 0)'
          }}
        />
      ))}
    </div>
  );
}