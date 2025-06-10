// src/app/layout.tsx
import './globals.css';
import ParallaxBackground from '@/components/ParallaxBackground';
import { ModalProvider } from '@/context/ModalContext';


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
      <body className="antialiased">
        <div className="main-content min-h-screen">
          <ParallaxBackground />
            <ModalProvider>
              {children}
            </ModalProvider>
        </div>
      </body>
    </html>
  );
}