// src/app/layout.tsx
import './globals.css';
import ParallaxBackground from '@/components/ParallaxBackground';
import { AudioProvider } from '@/context/AudioContext';
import { ModalProvider } from '@/context/ModalContext';
import { useEffect } from 'react';

export const metadata = {
  title: 'Favorite Library',
  description: 'Independent music label',
};

// Critical resources that should be preloaded
const criticalResources = [
  { path: '/videos/logo-animation.mp4', type: 'video/mp4', as: 'video' },
  { path: '/images/parallax/layer1.png', type: 'image/png', as: 'image' },
  { path: '/images/parallax/layer2.png', type: 'image/png', as: 'image' },
  { path: '/images/parallax/layer3.png', type: 'image/png', as: 'image' }
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Add preload links for critical resources */}
        {criticalResources.map((resource, index) => (
          <link 
            key={`preload-${index}`}
            rel="preload" 
            href={resource.path} 
            as={resource.as} 
            type={resource.type}
          />
        ))}
      </head>
      <body className="antialiased">
        <ResourcePriorityProvider>
          <div className="main-content min-h-screen">
            <ParallaxBackground />
            <AudioProvider>
              <ModalProvider>
                {children}
              </ModalProvider>
            </AudioProvider>
          </div>
        </ResourcePriorityProvider>
      </body>
    </html>
  );
}