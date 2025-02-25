// src/app/layout.tsx
import './globals.css';
import BackgroundController from '@/components/BackgroundController';
import { AudioProvider } from '@/context/AudioContext';

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
    <html lang="en">
      <body>
        <BackgroundController />
        <AudioProvider>
          {children}
        </AudioProvider>
      </body>
    </html>
  );
}