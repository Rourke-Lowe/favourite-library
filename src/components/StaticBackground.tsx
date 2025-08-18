'use client';
import { useEffect, useRef, useState } from 'react';

export default function StaticBackground() {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // Detect mobile devices
  useEffect(() => {
    const checkIfMobile = () => {
      const userAgent = navigator.userAgent;
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isMobileDevice || isSmallScreen);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const updateBackground = () => {
      if (!ticking.current && backgroundRef.current) {
        ticking.current = true;
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          
          // Only update if scroll changed significantly (reduces jank)
          if (Math.abs(scrollY - lastScrollY.current) > 0.5) {
            // Adaptive parallax speed based on device
            const parallaxSpeed = isMobile ? -0.05 : -0.05;
            const yOffset = scrollY * parallaxSpeed;
            
            if (backgroundRef.current) {
              // Use transform instead of background-position for GPU acceleration
              backgroundRef.current.style.transform = `translate3d(0, ${yOffset}px, 0)`;
            }
            lastScrollY.current = scrollY;
          }
          
          ticking.current = false;
        });
      }
    };

    // Throttled scroll handler for better performance
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      if (!ticking.current) {
        updateBackground();
      }
      
      // Additional throttling for mobile
      if (isMobile) {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateBackground, 16); // ~60fps
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateBackground(); // Initial position

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [isMobile]);

  return (
    <div 
      className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden"
      style={{ 
        contain: 'layout style paint',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {/* Main repeating background image with parallax scroll */}
      <div 
        ref={backgroundRef}
        className="absolute bg-repeat"
        style={{
          backgroundImage: 'url(/images/parallax/staticBG.jpg)',
          backgroundSize: '100vw auto',
          backgroundPosition: 'center 0px',
          zIndex: -30,
          willChange: 'transform',
          width: '100%',
          height: '200%',
          top: '-50%',
          left: '0',
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          transformStyle: 'preserve-3d',
          imageRendering: isMobile ? '-webkit-optimize-contrast' as any : 'auto'
        }}
      />
      
      {/* Subtle overlay for better text contrast */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5"
        style={{ 
          zIndex: -25,
          willChange: 'auto'
        }}
      />
    </div>
  );
}