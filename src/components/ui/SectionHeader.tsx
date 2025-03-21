// src/components/ui/SectionHeader.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  align = 'left',
  className,
  titleClassName,
  subtitleClassName
}) => {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto',
  };
  
  const decorationAlignment = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
  };
  
  return (
    <div className={cn("mb-12", alignmentClasses[align], className)}>
      <h2 className={cn("font-display text-title mb-2", titleClassName)}>
        {title}
      </h2>
      
      <div className={cn("w-16 h-px bg-primary/70 mb-4", decorationAlignment[align])}></div>
      
      {subtitle && (
        <p className={cn("text-surface-600 max-w-2xl", 
          align === 'center' && 'mx-auto',
          align === 'right' && 'ml-auto',
          subtitleClassName
        )}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;