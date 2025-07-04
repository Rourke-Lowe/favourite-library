// src/app/page.tsx
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import NavigationWrapper from '@/components/layout/NavigationWrapper';
import Artists from '@/components/sections/Artists';
import Releases from '@/components/sections/Releases';
import Shows from '@/components/sections/Shows';
import Contact from '@/components/sections/Contact';

export default function Home() {
  return (
    <main>
      <Hero />
      <NavigationWrapper />
      <About />
      <Artists />
      <Shows />
      <Releases />
      <Contact /> 
    </main>
  );
}