// src/app/layout.tsx
import './globals.css';
import ParallaxBackground from '@/components/ParallaxBackground';
import { AudioProvider } from '@/context/AudioContext';
import { ModalProvider } from '@/context/ModalContext';
import Head from 'next/head';

export const metadata = {
  title: 'Favorite Library',
  description: 'Independent music label',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Critical resource preloading */}
        <link 
          rel="preload" 
          href="/videos/logo-animation.mp4" 
          as="video" 
          type="video/mp4" 
          fetchpriority="high"
        />
        <link 
          rel="preload" 
          href="/images/gallery/image-1.jpg" 
          as="image" 
          fetchpriority="high"
        />
        <link 
          rel="preload" 
          href="/images/gallery/image-2.jpg" 
          as="image" 
          fetchpriority="high"
        />
        
        {/* Add low-priority preloads for other critical assets */}
        <link 
          rel="prefetch" 
          href="/images/parallax/layer1.png" 
          as="image"
        />
      </head>
      <body className="antialiased">
        <div className="main-content min-h-screen">
          <ParallaxBackground />
          <AudioProvider>
            <ModalProvider>
              {children}
            </ModalProvider>
          </AudioProvider>
        </div>
      </body>
    </html>
  );
}