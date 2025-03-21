// src/components/ui/CardEnhanced.tsx
'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface CardEnhancedProps {
  title: string;
  subtitle?: string;
  image: string;
  imageAlt?: string;
  onClick?: () => void;
  aspectRatio?: 'square' | 'portrait' | 'landscape';
  badge?: string;
  className?: string;
}

const CardEnhanced: React.FC<CardEnhancedProps> = ({
  title,
  subtitle,
  image,
  imageAlt,
  onClick,
  aspectRatio = 'square',
  badge,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const aspectClasses = {
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
  };
  
  return (
    <div 
      className={cn(
        "bg-card rounded-lg overflow-hidden cursor-pointer relative group transform transition-all duration-300 hover:-translate-y-2 hover:shadow-lg border border-surface-200 hover:border-primary/20",
        className
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`${aspectClasses[aspectRatio]} bg-surface-100 relative overflow-hidden`}>
        {image && (
          <img 
            src={image} 
            alt={imageAlt || title} 
            className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-105' : 'scale-100'}`}
          />
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-900/60 via-surface-900/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Badge (if provided) */}
        {badge && (
          <div className="absolute top-3 right-3 bg-primary/90 text-primary-foreground text-xs py-1 px-2 rounded-full font-mono uppercase tracking-wider">
            {badge}
          </div>
        )}
      </div>
      
      {/* Text content */}
      <div className="p-4 relative transition-transform duration-300 transform group-hover:-translate-y-1">
        <h3 className="font-display text-base font-medium">{title}</h3>
        {subtitle && (
          <p className="text-surface-500 text-sm mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default CardEnhanced;