// src/components/sections/Contact.tsx
'use client';
import React from 'react';

const Contact = () => {
  return (
    <section id="contact" className="py-6 border-t border-surface-200 bg-background/30 backdrop-blur-sm">
      <div className="container mx-auto px-6 text-center">
        <div className="text-sm text-surface-500 space-y-2">
          <p className="text-xs uppercase tracking-wider font-mono">Contact</p>
          <p>General — <a href="mailto:favouritelibrarylabel@gmail.com" className="hover:text-primary transition-colors">favouritelibrarylabel@gmail.com</a></p>
          <p>Rourke Lowe — <a href="mailto:rourke@favoritelibrary.com" className="hover:text-primary transition-colors">rourke@favoritelibrary.com</a></p>
        </div>
      </div>
    </section>
  );
};

export default Contact;