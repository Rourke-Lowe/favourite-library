// src/components/ui/NewsletterWidget.tsx
'use client';
import { useState, useEffect, useRef } from 'react';

const NewsletterWidget = () => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !shouldLoad) {
            setShouldLoad(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '100px' // Start loading when 100px away
      }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <div 
      ref={containerRef}
      style={{
        width: '100%',
        minHeight: '280px',
        borderRadius: '8px'
      }}
    >
      {shouldLoad ? (
        <iframe
          id="mookeeSubscribeWidgetIframe"
          src="https://app.mookee.io/t/favourite-library/subscribeWidget/main?theme=light"
          style={{
            width: '100%',
            height: '280px',
            border: 'none',
            borderRadius: '8px',
            display: 'block'
          }}
          frameBorder="0"
          allowTransparency
          sandbox="allow-forms allow-scripts allow-same-origin"
          title="Newsletter Signup"
        />
      ) : (
        <div 
          style={{
            width: '100%',
            height: '280px',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            color: '#666'
          }}
        >
          Loading newsletter signup...
        </div>
      )}
    </div>
  );
};

export default NewsletterWidget;