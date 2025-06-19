// src/components/sections/Contact.tsx
'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Music, Send, ExternalLink } from 'lucide-react';

const Contact = () => {
  const handleNewsletterSignup = () => {
    const newsletterUrl = process.env.NEXT_PUBLIC_NEWSLETTER_URL || 'https://mookee.link/favourite-library';
    window.open(newsletterUrl, '_blank');
  };

  const handleArtistSubmission = () => {
    const submissionUrl = process.env.NEXT_PUBLIC_ARTIST_SUBMISSION_URL || 'https://forms.gle/XfzzmA2EmefqAHyA7';
    window.open(submissionUrl, '_blank');
  };

  return (
    <section id="contact" className="py-16 border-t border-surface-200 bg-background/30 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-title mb-4">Get in touch</h2>
          <p className="text-surface-600 max-w-2xl mx-auto">
            Connect with us through one of the options below.
          </p>
        </div>
        
        {/* Three-column layout */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Newsletter */}
          <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-surface-200">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="text-primary" size={24} />
            </div>
            <h3 className="font-medium mb-2">Stay Updated</h3>
            <p className="text-sm text-surface-600 mb-4">
              Get the latest on releases, shows, and label news.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleNewsletterSignup}
              aria-label="Join our newsletter - opens in new tab"
            >
              Join Newsletter
            </Button>
          </div>

          {/* Artist Submission */}
          <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-surface-200">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Music className="text-primary" size={24} />
            </div>
            <h3 className="font-medium mb-2">Play a Show</h3>
            <p className="text-sm text-surface-600 mb-4">
              Share your project to play at an upcoming show.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              rightIcon={<Send size={14} />}
              onClick={handleArtistSubmission}
              aria-label="Request to play a show - opens in new tab"
            >
              Play a Show
            </Button>
          </div>

          {/* Direct Contact */}
          <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-surface-200">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ExternalLink className="text-primary" size={24} />
            </div>
            <h3 className="font-medium mb-2">Direct Contact</h3>
            <p className="text-sm text-surface-600 mb-4">
              Reach out directly for partnerships or business inquiries.
            </p>
            <div className="space-y-2">
              <a 
                href="mailto:favouritelibrarylabel@gmail.com" 
                className="block text-xs hover:text-primary transition-colors"
              >
                favouritelibrarylabel@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Footer text */}
        <div className="text-center">
          <p className="text-xs text-surface-500">
            Based in Tiohtià:ke/Montreal, Canada
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;