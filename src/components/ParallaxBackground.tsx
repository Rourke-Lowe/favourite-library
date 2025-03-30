// src/components/CssParallaxBackground.tsx
'use client';
import { useEffect } from 'react';

interface ParallaxLayer {
  image: string;
  speed: number; // CSS variable value (percent)
  zIndex: number;
  opacity: number;
}

const parallaxLayers: ParallaxLayer[] = [
  {
    image: '/images/parallax/layer1.png',
    speed: 0,    // Stationary background
    zIndex: -30,
    opacity: 1.0
  },
  {
    image: '/images/parallax/layer2.png',
    speed: 5,    // Moves at 5% of scroll speed
    zIndex: -20,
    opacity: 1.0
  },
  {
    image: '/images/parallax/layer3.png',
    speed: -15,  // Moves at -15% of scroll speed (opposite direction)
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

export default function CssParallaxBackground() {
  // Set up CSS custom properties once on component mount
  useEffect(() => {
    // Add the CSS for the parallax effect
    const style = document.createElement('style');
    style.textContent = `
      /* Base styles for the parallax container */
      .parallax-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        pointer-events: none;
      }
      
      /* Base styles for all parallax layers */
      .parallax-layer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        will-change: transform;
      }
      
      /* CSS-only parallax effect using transform and perspective */
      @media (prefers-reduced-motion: no-preference) {
        .parallax-container {
          perspective: 1px;
        }
        
        .parallax-layer-0 {
          transform: translateZ(0); /* No movement */
        }
        
        .parallax-layer-1 {
          transform: translateZ(-0.05px) scale(1.05); /* Adjust scale to compensate for perspective */
        }
        
        .parallax-layer-2 {
          transform: translateZ(0.15px) scale(0.85); /* Adjust scale to compensate for perspective */
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="parallax-container">
      {parallaxLayers.map((layer, index) => (
        <div
          key={index}
          className={`parallax-layer parallax-layer-${index}`}
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