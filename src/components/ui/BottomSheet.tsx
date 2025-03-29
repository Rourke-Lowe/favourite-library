// src/components/ui/BottomSheet.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  // Handle clicks outside of the bottom sheet
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  if (!isMounted) return null;
  
  return createPortal(
    <div 
      className={cn(
        "fixed inset-0 z-50 bg-black/50 transition-opacity duration-300",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      onClick={handleBackdropClick}
    >
      <div 
        className={cn(
          "fixed bottom-0 left-0 right-0 max-h-[85vh] bg-background rounded-t-xl overflow-hidden transition-transform duration-300 shadow-xl",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        {/* Handle for dragging */}
        <div className="w-full flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 bg-surface-300 rounded-full"></div>
        </div>
        
        {/* Header */}
        <div className="sticky top-0 flex justify-between items-center px-4 py-3 border-b bg-background z-10">
          <h2 className="font-display text-lg">{title}</h2>
          <button
            className="p-2 rounded-full hover:bg-surface-100 text-surface-500"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        
        {/* Content with internal scrolling */}
        <div className="p-4 overflow-auto max-h-[calc(85vh-3.5rem)]">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default BottomSheet;