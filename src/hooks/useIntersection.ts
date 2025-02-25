// src/hooks/useIntersection.tsx
'use client';
import { useState, useEffect, RefObject } from 'react';

interface IntersectionInfo {
  isIntersecting: boolean;
  ratio: number;
}

export function useIntersection(
  elementRef: RefObject<Element>,
  options: IntersectionObserverInit = { threshold: [0, 0.25, 0.5, 0.75, 1] }
): IntersectionInfo {
  const [intersectionInfo, setIntersectionInfo] = useState<IntersectionInfo>({
    isIntersecting: false,
    ratio: 0
  });

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      setIntersectionInfo({
        isIntersecting: entry.isIntersecting,
        ratio: entry.intersectionRatio
      });
    }, options);

    observer.observe(element);
    return () => observer.disconnect();
  }, [elementRef, options]);

  return intersectionInfo;
}