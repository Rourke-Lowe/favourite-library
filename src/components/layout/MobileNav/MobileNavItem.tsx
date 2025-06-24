// src/components/layout/MobileNav/MobileNavItem.tsx
import React from 'react';

interface MobileNavItemProps {
  href: string;
  label: string;
  isActive: boolean;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export default function MobileNavItem({ 
  href, 
  label, 
  isActive, 
  onClick 
}: MobileNavItemProps) {
  return (
    <li>
      <a
        href={href}
        onClick={onClick}
        className={`
          block py-4 px-6 text-lg font-mono uppercase tracking-wider
          transition-colors duration-200
          ${isActive 
            ? 'text-primary bg-primary/10 border-l-4 border-primary' 
            : 'text-foreground hover:text-primary hover:bg-surface-50'
          }
        `}
      >
        {label}
      </a>
    </li>
  );
}