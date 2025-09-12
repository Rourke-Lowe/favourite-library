// src/components/ui/MookeeWidget.tsx
'use client';
import { useEffect, useRef, useState } from 'react';

const MookeeWidget = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Wait a bit to ensure DOM is ready
    const timer = setTimeout(() => {
      if (!containerRef.current) return;
      
      // First, add the iframe
      const iframe = document.createElement('iframe');
      iframe.id = 'mookeeSubscribeWidgetIframe1757710143919';
      iframe.style.display = 'none';
      iframe.style.borderRadius = '4px';
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allowtransparency', 'true');
      
      containerRef.current.appendChild(iframe);
      
      // Then add the script
      const script = document.createElement('script');
      script.src = 'https://api.app.mookee.io/mookee-scripts-origin/mookeeIframe.js?id=mookeeSubscribeWidgetIframe1757710143919&t=https%3A%2F%2Fapp.mookee.io%2Ft%2Ffavourite-library%2FsubscribeWidget%2Fmain%3Ftheme%3Dlight';
      script.onload = () => {
        console.log('Mookee script loaded successfully');
        setIsLoaded(true);
      };
      script.onerror = (error) => {
        console.error('Failed to load Mookee script:', error);
      };
      
      document.body.appendChild(script);
    }, 500); // Give React time to settle
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={containerRef} className="mookee-widget-container">
      {!isLoaded && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
          Loading newsletter signup...
        </div>
      )}
    </div>
  );
};

export default MookeeWidget;