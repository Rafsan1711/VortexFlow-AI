import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import ErrorBoundary from '../ErrorBoundary';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  size?: ModalSize;
  children: React.ReactNode;
  footer?: React.ReactNode;
  hideCloseButton?: boolean;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-[400px]',
  md: 'max-w-[560px]',
  lg: 'max-w-[720px]',
  xl: 'max-w-[900px]',
  full: 'max-w-full m-4 h-[calc(100vh-2rem)]',
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  size = 'md',
  children,
  footer,
  hideCloseButton = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Container */}
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, type: 'spring', damping: 25, stiffness: 300 }}
          className={`relative w-full ${sizeClasses[size]} bg-[#111118]/90 backdrop-blur-xl border border-[#2A2A3A] rounded-2xl shadow-2xl flex flex-col overflow-hidden`}
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          {(title || !hideCloseButton) && (
            <div className="flex items-start justify-between p-6 border-b border-[#2A2A3A] shrink-0">
              <div>
                {title && <h2 className="text-xl font-bold text-[#F0F0FF]">{title}</h2>}
                {subtitle && <p className="text-sm text-[#9898B8] mt-1">{subtitle}</p>}
              </div>
              {!hideCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 -mr-2 -mt-2 text-[#5C5C7A] hover:text-[#F0F0FF] hover:bg-[#1A1A24] rounded-lg transition-colors"
                  aria-label="Close modal"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </div>

          {/* Footer */}
          {footer && (
            <div className="p-6 border-t border-[#2A2A3A] bg-[#0A0A0F]/50 shrink-0 flex items-center justify-end gap-3">
              {footer}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

export default Modal;
