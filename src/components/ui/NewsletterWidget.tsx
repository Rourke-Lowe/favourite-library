// src/components/ui/NewsletterWidget.tsx
'use client';
import { useEffect, useRef } from 'react';

// Track if script has been added globally
let globalScriptAdded = false;

const NewsletterWidget = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeAddedRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current || iframeAddedRef.current) return;
    
    // Create iframe element programmatically
    const iframe = document.createElement('iframe');
    iframe.id = 'mookeeSubscribeWidgetIframe1756389947482';
    iframe.style.display = 'none';
    iframe.style.borderRadius = '4px';
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowtransparency', 'true');
    
    // Add iframe to container
    containerRef.current.appendChild(iframe);
    iframeAddedRef.current = true;

    // Add script after iframe is in DOM
    setTimeout(() => {
      if (!globalScriptAdded) {
        const script = document.createElement('script');
        script.src = 'https://api.app.mookee.io/mookee-scripts-origin/mookeeIframe.js?id=mookeeSubscribeWidgetIframe1756389947482&t=https%3A%2F%2Fapp.mookee.io%2Ft%2Ffavourite-library%2FsubscribeWidget%2Fmain%3Ftheme%3Dlight';
        document.body.appendChild(script);
        globalScriptAdded = true;
      }
    }, 100); // Small delay to ensure iframe is fully rendered
    
    // No cleanup - let the script manage the iframe
  }, []);

  return <div ref={containerRef} className="mookee-widget-container" />;
};

export default NewsletterWidget;