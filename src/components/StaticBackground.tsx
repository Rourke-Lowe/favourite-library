'use client';
import { useEffect, useRef, useState } from 'react';

export default function StaticBackground() {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number>();
  const [isPageVisible, setIsPageVisible] = useState(true);

  useEffect(() => {
    // Page visibility API to stop when tab is hidden
    const handleVisibilityChange = () => {
      setIsPageVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    if (!isPageVisible) {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = undefined;
      }
      return;
    }

    let ticking = false;
    
    const updateBackground = () => {
      if (!ticking && backgroundRef.current) {
        ticking = true;
        rafId.current = requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          
          // Move background position with -1x speed for parallax effect
          const parallaxSpeed = -1;
          const yOffset = scrollY * parallaxSpeed;
          
          if (backgroundRef.current) {
            backgroundRef.current.style.backgroundPositionY = `${yOffset}px`;
          }
          
          ticking = false;
          // Continue if page is still visible
          if (!document.hidden) {
            updateBackground();
          }
        });
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        updateBackground();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateBackground();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [isPageVisible]);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden">
      {/* Main repeating background image with parallax scroll */}
      <div 
        ref={backgroundRef}
        className="absolute bg-repeat"
        style={{
          backgroundImage: 'url(/images/parallax/staticBG.jpg)',
          backgroundSize: '100vw auto',
          backgroundPosition: 'center 0px',
          zIndex: -30,
          willChange: 'background-position',
          width: '100%',
          height: '200%',
          top: '-50%',
          left: '0'
        }}
      />
      
      {/* Subtle overlay for better text contrast */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5"
        style={{ zIndex: -25 }}
      />
    </div>
  );
}