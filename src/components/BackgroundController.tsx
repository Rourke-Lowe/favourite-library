// src/components/BackgroundController.tsx
'use client';
import { useEffect, useRef } from 'react';
import { throttle } from '@/utils/throttle';

// Section colors
const sectionColors = {
  hero: '#EEEDE5',
  artists: '#397F6D',
  releases: '#D9581A',
  moodboard: '#F7E8C8',
  shows: '#FDCBF3',
  merch: '#F7E8C8',
  default: '#EEEFE6'
};

export default function BackgroundController() {
  const animationRef = useRef<number | null>(null);
  const targetColorRef = useRef(sectionColors.default);
  const currentColorRef = useRef(sectionColors.default);
  const sectionVisibilityRef = useRef<Record<string, number>>({});
  
  useEffect(() => {
    // Apply initial background color
    document.body.style.backgroundColor = sectionColors.default;
    
    // Animate background color smoothly - using a slower transition rate
    const animate = () => {
      const current = currentColorRef.current;
      const target = targetColorRef.current;
      
      if (current !== target) {
        // Convert hex to RGB
        const currentRgb = hexToRgb(current);
        const targetRgb = hexToRgb(target);
        
        if (currentRgb && targetRgb) {
          // Slower interpolation (1% per frame instead of 5%)
          const newR = Math.round(currentRgb.r + (targetRgb.r - currentRgb.r) * 0.05);
          const newG = Math.round(currentRgb.g + (targetRgb.g - currentRgb.g) * 0.05);
          const newB = Math.round(currentRgb.b + (targetRgb.b - currentRgb.b) * 0.05);
          
          // Convert back to hex
          const newColor = rgbToHex(newR, newG, newB);
          currentColorRef.current = newColor;
          document.body.style.backgroundColor = newColor;
        }
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    // Calculate visibility for all sections and blend colors
    const calculateVisibleSections = throttle(() => {
      const sections = ['hero', 'artists', 'releases', 'moodboard', 'shows', 'merch'];
      const visibilityScores: Record<string, number> = {};
      let totalVisibility = 0;
      
      // Calculate visibility scores for all sections
      sections.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (!element) {
          visibilityScores[sectionId] = 0;
          return;
        }
        
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Calculate how visible the section is in the viewport
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(windowHeight, rect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        
        // Calculate distance from center (0 = centered, 1 = completely off-center)
        const sectionCenter = rect.top + rect.height / 2;
        const viewportCenter = windowHeight / 2;
        const distanceFromCenter = Math.abs(sectionCenter - viewportCenter);
        const maxDistance = windowHeight / 2 + rect.height / 2;
        const normalizedDistance = Math.min(1, distanceFromCenter / maxDistance);
        
        // Visibility score that prioritizes centered content and decays with distance
        // Using a more gradual curve for transition
        // Higher power (e.g., Math.pow(..., 2)) = more influence from centered sections
        const visibilityScore = (visibleHeight / windowHeight) * Math.pow(1 - normalizedDistance, 1.5);
        
        visibilityScores[sectionId] = Math.max(0, visibilityScore);
        totalVisibility += visibilityScores[sectionId];
      });
      
      // Store section visibility data
      sectionVisibilityRef.current = visibilityScores;
      
      // Blend colors from all visible sections based on their visibility score
      if (totalVisibility > 0) {
        // Normalize visibility scores so they sum to 1
        const normalizedScores: Record<string, number> = {};
        
        for (const section in visibilityScores) {
          normalizedScores[section] = visibilityScores[section] / totalVisibility;
        }
        
        // Calculate blended RGB values
        let r = 0, g = 0, b = 0;
        
        for (const section in normalizedScores) {
          const weight = normalizedScores[section];
          if (weight > 0) {
            const color = sectionColors[section as keyof typeof sectionColors];
            const rgb = hexToRgb(color);
            if (rgb) {
              r += rgb.r * weight;
              g += rgb.g * weight;
              b += rgb.b * weight;
            }
          }
        }
        
        // Round and convert back to hex
        const blendedColor = rgbToHex(Math.round(r), Math.round(g), Math.round(b));
        targetColorRef.current = blendedColor;
      } else {
        // If nothing is visible (shouldn't happen normally), use default
        targetColorRef.current = sectionColors.default;
      }
    }, 50); // More frequent updates for smoother results
    
    window.addEventListener('scroll', calculateVisibleSections);
    calculateVisibleSections(); // Initial check
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('scroll', calculateVisibleSections);
    };
  }, []);
  
  // The component doesn't render anything visible
  return null;
}

// Helper functions for color conversion
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}