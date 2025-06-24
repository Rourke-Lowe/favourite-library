// src/hooks/useMediaQuery.ts
import { useState, useEffect } from 'react';

/**
 * Hook to detect if viewport matches a media query
 * @param query - Media query string like '(max-width: 768px)'
 * @returns boolean indicating if query matches
 */
export function useMediaQuery(query: string): boolean {
  // Start with false for SSR compatibility
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Create media query list
    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQuery.matches);

    // Create event listener
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add listener (using addEventListener for better compatibility)
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}

// Export a specific hook for mobile detection
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 767px)');
}