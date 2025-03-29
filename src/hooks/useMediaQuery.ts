// src/hooks/useMediaQuery.ts
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Update the state with the current value
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    // Create a listener function
    const listener = () => setMatches(media.matches);
    
    // Add the listener to watch for changes
    media.addEventListener('change', listener);
    
    // Remove the listener on cleanup
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);
  
  return matches;
}