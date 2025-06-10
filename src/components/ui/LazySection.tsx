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
  tag?: 'section' | 'div' | 'article' | 'aside' | 'main';
}

const LazySection: React.FC<LazySectionProps> = ({
  children,
  className,
  rootMargin = '200px',
  threshold = 0.1,
  id,
  tag = 'section',
}) => {
  const [ref, isVisible] = useIntersectionObserver<HTMLElement>({
    rootMargin,
    threshold,
    triggerOnce: true,
  });

  const content = typeof children === 'function' ? children(isVisible) : (isVisible ? children : null);

  switch (tag) {
    case 'div':
      return <div ref={ref as any} className={className} id={id}>{content}</div>;
    case 'article':
      return <article ref={ref as any} className={className} id={id}>{content}</article>;
    case 'aside':
      return <aside ref={ref as any} className={className} id={id}>{content}</aside>;
    case 'main':
      return <main ref={ref as any} className={className} id={id}>{content}</main>;
    default:
      return <section ref={ref as any} className={className} id={id}>{content}</section>;
  }
};

export default LazySection;