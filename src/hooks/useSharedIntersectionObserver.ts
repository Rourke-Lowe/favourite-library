import { useEffect, useRef, useState, useCallback } from 'react';

// Singleton observer instance
let globalObserver: IntersectionObserver | null = null;
const observerCallbacks = new Map<Element, (isIntersecting: boolean) => void>();

// Initialize observer once
const getObserver = (options: IntersectionObserverInit) => {
  if (!globalObserver) {
    globalObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const callback = observerCallbacks.get(entry.target);
        callback?.(entry.isIntersecting);
      });
    }, options);
  }
  return globalObserver;
};

export function useSharedIntersectionObserver<T extends Element>(
  options: IntersectionObserverInit = { rootMargin: '50px', threshold: 0.01 },
  triggerOnce = true
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef<T>(null);
  const callbackRef = useRef<(isIntersecting: boolean) => void>();

  // Update callback
  callbackRef.current = useCallback((intersecting: boolean) => {
    if (intersecting && !hasIntersected && triggerOnce) {
      setHasIntersected(true);
      setIsIntersecting(true);
      // Auto-cleanup after first intersection
      if (elementRef.current) {
        observerCallbacks.delete(elementRef.current);
        globalObserver?.unobserve(elementRef.current);
      }
    } else if (!triggerOnce) {
      setIsIntersecting(intersecting);
    }
  }, [hasIntersected, triggerOnce]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || (triggerOnce && hasIntersected)) return;

    const observer = getObserver(options);
    observerCallbacks.set(element, callbackRef.current!);
    observer.observe(element);

    return () => {
      observerCallbacks.delete(element);
      observer.unobserve(element);
    };
  }, [options.rootMargin, options.threshold, triggerOnce, hasIntersected]);

  return [elementRef, isIntersecting || hasIntersected] as const;
}