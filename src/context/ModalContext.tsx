// src/context/ModalContext.tsx
'use client';
import React, { createContext, useState, useContext, useEffect } from 'react';
import { createPortal } from 'react-dom';

// Close icon component
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// Modal backdrop opacity setting - adjust this value to change the darkness
const BACKDROP_OPACITY = 0.3; // 0 = completely transparent, 1 = completely opaque

type ModalContextType = {
  openModal: (title: string, content: React.ReactNode) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    content: React.ReactNode;
  }>({
    isOpen: false,
    title: '',
    content: null,
  });
  
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  
  // Add event listener for escape key
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modalState.isOpen) {
        closeModal();
      }
    };

    if (modalState.isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscapeKey);
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [modalState.isOpen]);
  
  const openModal = (title: string, content: React.ReactNode) => {
    setModalState({
      isOpen: true,
      title,
      content,
    });
  };
  
  const closeModal = () => {
    setModalState(prev => ({
      ...prev,
      isOpen: false,
    }));
  };
  
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };
  
  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      
      {/* Modal Portal - mounted to document.body */}
      {isMounted && modalState.isOpen && createPortal(
        <div 
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-[9999]"
          style={{ 
            position: 'fixed',
            backgroundColor: `rgba(0, 0, 0, ${BACKDROP_OPACITY})` 
          }}
          onClick={handleBackdropClick}
        >
          <div 
            className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl relative"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 flex justify-between items-center p-6 border-b bg-white z-10">
              <h2 className="text-xl font-medium">{modalState.title}</h2>
              <button 
                onClick={closeModal}
                className="p-1 rounded-full hover:bg-gray-100"
                aria-label="Close modal"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="p-6">
              {modalState.content}
            </div>
          </div>
        </div>,
        document.body
      )}
    </ModalContext.Provider>
  );
};

// Custom hook to use the modal context
export const useModal = () => {
  const context = useContext(ModalContext);
  
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  
  return context;
};