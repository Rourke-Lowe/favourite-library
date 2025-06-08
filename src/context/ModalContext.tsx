// Optimized modal context with proper cleanup and memory management
'use client';
import React, { createContext, useState, useContext, useEffect, useCallback, useMemo, useRef } from 'react'; // Added useRef
import { createPortal } from 'react-dom';

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const BACKDROP_OPACITY = 0.4;

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
  
  const [mounted, setMounted] = useState(false);
  const previousActiveElement = useRef<Element | null>(null);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  // Optimized event handlers with proper cleanup
  useEffect(() => {
    if (!mounted) return;
    
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modalState.isOpen) {
        closeModal();
      }
    };

    if (modalState.isOpen) {
      // Store current active element for restoration
      previousActiveElement.current = document.activeElement;
      
      // Lock body scroll
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      
      // Add escape listener
      document.addEventListener('keydown', handleEscapeKey);
      
      // Cleanup function
      return () => {
        document.body.style.overflow = originalOverflow;
        document.removeEventListener('keydown', handleEscapeKey);
        
        // Restore focus
        if (previousActiveElement.current instanceof HTMLElement) {
          previousActiveElement.current.focus();
        }
      };
    }
  }, [modalState.isOpen, mounted]);
  
  // Memoized handlers to prevent unnecessary re-renders
  const openModal = useCallback((title: string, content: React.ReactNode) => {
    setModalState({
      isOpen: true,
      title,
      content,
    });
  }, []);
  
  const closeModal = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      isOpen: false,
    }));
  }, []);
  
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  }, [closeModal]);
  
  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    openModal,
    closeModal
  }), [openModal, closeModal]);
  
  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      
      {mounted && modalState.isOpen ? 
        createPortal(
          <div 
            style={{ 
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: `rgba(0, 0, 0, ${BACKDROP_OPACITY})`,
              backdropFilter: 'blur(3px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
            }}
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div 
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                width: '90%',
                maxWidth: '600px',
                maxHeight: '90vh',
                overflow: 'auto',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                position: 'relative',
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{
                position: 'sticky',
                top: 0,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px',
                backgroundColor: 'white',
                zIndex: 1,
                borderBottom: '1px solid #e5e7eb'
              }}>
                <h2 
                  id="modal-title"
                  style={{ 
                    fontSize: '20px', 
                    fontWeight: '500',
                    margin: 0,
                    color: '#333'
                  }}
                >
                  {modalState.title}
                </h2>
                <button 
                  onClick={closeModal}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    color: '#666',
                  }}
                  onMouseOver={e => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                  onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  aria-label="Close modal"
                  autoFocus
                >
                  <CloseIcon />
                </button>
              </div>
              <div style={{ padding: '0 24px 24px 24px' }}>
                {modalState.content}
              </div>
            </div>
          </div>,
          document.body
        ) 
        : null
      }
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  
  return context;
};