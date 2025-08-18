// src/app/page.tsx
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import NavigationWrapper from '@/components/layout/NavigationWrapper';
import Contact from '@/components/sections/Contact';
import ClientSections from '@/components/ClientSections';
import { loadSiteData } from '@/lib/dataLoader';

export default function Home() {
  // Load data server-side at build time
  const siteData = loadSiteData();

  return (
    <main>
      <Hero siteData={siteData} />
      <NavigationWrapper />
      <About />
      <ClientSections initialData={siteData} />
      <Contact /> 
    </main>
  );
}