// src/app/page.tsx
import Hero from '@/components/sections/Hero';
import Navbar from '@/components/layout/Navbar';
import Artists from '@/components/sections/Artists';
import Releases from '@/components/sections/Releases';
import Moodboard from '@/components/sections/Moodboard';
import Shows from '@/components/sections/Shows';
import Merch from '@/components/sections/Merch';
import AudioPlayer from '@/components/player/AudioPlayer';

export default function Home() {
  return (
    <main>
      <Hero />
      <Navbar />
      <Releases />
      <Shows />
      <Artists />
      <Moodboard />
      <Merch />
      <AudioPlayer />
    </main>
  );
}