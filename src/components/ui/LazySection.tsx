// src/components/ui/LazySection.tsx
import React, { ReactNode } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';

interface LazySectionProps {
  children: ReactNode | ((isVisible: boolean) => ReactNode);
  className?: string;
  rootMargin?: string;
  threshold?: number;
  id?: string;
  tag?: keyof JSX.IntrinsicElements;
}

const LazySection: React.FC<LazySectionProps> = ({
  children,
  className,
  rootMargin = '200px',
  threshold = 0.1,
  id,
  tag: Tag = 'section',
}) => {
  const [ref, isVisible] = useIntersectionObserver<HTMLElement>({
    rootMargin,
    threshold,
    triggerOnce: true,
  });

  return (
    <Tag 
      ref={ref} 
      className={className} 
      id={id}
    >
      {typeof children === 'function' ? children(isVisible) : (isVisible ? children : null)}
    </Tag>
  );
};

export default LazySection;