// src/app/layout.tsx
import { ResourcePriorityProvider } from '@/context/ResourcePriorityContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Critical resource preloading */}
        <link rel="preload" href="/videos/logo-animation.mp4" as="video" type="video/mp4" />
        <link rel="preload" href="/images/gallery/image-1.jpg" as="image" />
        <link rel="preload" href="/images/gallery/image-2.jpg" as="image" />
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