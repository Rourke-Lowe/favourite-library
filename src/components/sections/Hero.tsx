// src/components/sections/Hero.tsx
'use client';
import { useRef, useEffect } from 'react';

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(e => {
        console.error('Video autoplay failed:', e);
      });
    }
  }, []);

  return (
    <section 
      id="hero" 
      className="h-[92vh] flex flex-col items-center justify-center text-center px-4"
    >
      <div className="relative max-w-xl">
        {/* Larger background effect that extends beyond the video */}
        <div className="absolute -inset-32 z-0 opacity-75">
          <div className="w-full h-full bg-gradient-to-r from-yellow-100/70 via-pink-100/70 to-blue-100/70 rounded-full blur-3xl"></div>
        </div>
        
        {/* Video container with blend mode */}
        <div className="relative z-0 w-112 h-112 md:w-168 md:h-168 mx-auto">
          <video 
            ref={videoRef}
            className="w-full h-full object-contain outline-none border-none mix-blend-multiply"
            muted
            playsInline
            loop
            autoPlay
            style={{ 
              outline: 'none',
              backgroundColor: 'transparent'
            }}
          >
            <source src="/videos/logo-animation.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
};

export default Hero;