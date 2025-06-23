// src/components/sections/About.tsx
'use client';
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useStaticContent } from '@/content/staticContent';
import SimpleImageCarousel from '@/components/ui/SimpleImageCarousel';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

const About = () => {
  const { locale } = useLanguage();
  const staticContent = useStaticContent();
  const content = staticContent.sections.about;
  const handleNewsletterSignup = () => {
    // Using the actual newsletter URL
    const newsletterUrl = process.env.NEXT_PUBLIC_NEWSLETTER_URL || 'https://mookee.link/favourite-library';
    window.open(newsletterUrl, '_blank');
  };

  return (
    <section id="about" className="py-16 md:py-20 relative">
      <div className="container mx-auto px-6">
        {/* Quote header */}
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-display font-light">
            "{content.quote}"
          </h2>
          <div className="mt-4 w-32 md:w-64 h-px bg-surface-200 mx-auto"></div>
        </div>
        
        {/* Description */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-base md:text-lg text-surface-600 max-w-3xl mx-auto mb-8">
            {content.description}
          </p>
          
          {/* Newsletter CTA - Naturally integrated */}
          <div className="max-w-md mx-auto p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-surface-200">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Mail size={20} className="text-primary" />
              <h3 className="font-medium">{content.newsletter.title}</h3>
            </div>
            <p className="text-sm text-surface-600 mb-4">
              {content.newsletter.description}
            </p>
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              onClick={handleNewsletterSignup}
              aria-label={`${content.newsletter.button} - opens in new tab`}
            >
              {content.newsletter.button}
            </Button>
          </div>
        </div>
        
        {/* Three statements - simplified without hover effects */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 mb-14">
          <div className="backdrop-blur-sm bg-background/10 p-6 rounded-md">
            <p className="text-lg font-light text-center">
              {content.statements[0]}
            </p>
          </div>
          
          <div className="backdrop-blur-sm bg-background/10 p-6 rounded-md">
            <p className="text-lg font-light text-center">
              {content.statements[1]}
            </p>
          </div>
          
          <div className="backdrop-blur-sm bg-background/10 p-6 rounded-md">
            <p className="text-lg font-light text-center">
              {content.statements[2]}
            </p>
          </div>
        </div>
        
        {/* Simplified carousel */}
        <SimpleImageCarousel />
      </div>
    </section>
  );
};

export default About;