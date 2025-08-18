// src/app/layout.tsx
import './globals.css';
import StaticBackground from '@/components/StaticBackground';
import { ModalProvider } from '@/context/ModalContext';
import { LanguageProvider } from '@/context/LanguageContext';


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
          <StaticBackground />
            <LanguageProvider>
              <ModalProvider>
                {children}
              </ModalProvider>
            </LanguageProvider>
        </div>
      </body>
    </html>
  );
}