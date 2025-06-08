// src/app/page.tsx
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Navbar from '@/components/layout/Navbar';
import Artists from '@/components/sections/Artists';
import Releases from '@/components/sections/Releases';
import Shows from '@/components/sections/Shows';
import Merch from '@/components/sections/Merch';
import Contact from '@/components/sections/Contact';
import AudioPlayer from '@/components/player/AudioPlayer';

export default function Home() {
  return (
    <main>
      <Hero />
      <Navbar />
      <About />
      <Artists />
      <Shows />
      <Releases />
      <Contact /> 
    </main>
  );
}