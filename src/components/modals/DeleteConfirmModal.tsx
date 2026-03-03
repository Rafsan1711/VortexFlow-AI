import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation, faSpinner } from '@fortawesome/free-solid-svg-icons';
import Modal from '../ui/Modal';
import { useAppStore } from '../../store/useAppStore';

const DeleteConfirmModal = () => {
  const { openModal, closeModal, modalProps } = useAppStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const type = modalProps?.type || 'item';
  const title = modalProps?.title || 'Confirm Deletion';
  const description = modalProps?.description || 'Are you sure you want to delete this item? This action cannot be undone.';
  const requireConfirm = modalProps?.requireConfirm || false;
  const confirmWord = modalProps?.confirmWord || 'DELETE';
  const onConfirm = modalProps?.onConfirm;

  const handleConfirm = async () => {
    if (requireConfirm && confirmText !== confirmWord) return;
    
    setIsDeleting(true);
    try {
      if (onConfirm) await onConfirm();
    } finally {
      setIsDeleting(false);
      closeModal();
    }
  };

  return (
    <Modal
      isOpen={openModal === 'delete-confirm'}
      onClose={closeModal}
      size="sm"
      hideCloseButton
    >
      <div className="flex flex-col items-center text-center space-y-6 pt-4">
        {/* Warning Icon */}
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="w-16 h-16 rounded-full bg-[#FF4D6A]/10 flex items-center justify-center text-[#FF4D6A] relative"
        >
          <motion.div
            animate={{ rotate: [-5, 5, -5, 5, 0] }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <FontAwesomeIcon icon={faTriangleExclamation} size="2x" />
          </motion.div>
          <div className="absolute inset-0 rounded-full border border-[#FF4D6A]/20 animate-ping" />
        </motion.div>

        {/* Text */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-[#F0F0FF]">{title}</h2>
          <p className="text-[#9898B8] text-sm leading-relaxed max-w-[280px] mx-auto">
            {description}
          </p>
        </div>

        {/* Optional Confirm Input */}
        {requireConfirm && (
          <div className="w-full space-y-2 text-left">
            <label className="text-xs text-[#5C5C7A] font-medium uppercase tracking-wider">
              Type <span className="text-[#FF4D6A] font-bold">{confirmWord}</span> to confirm
            </label>
            <input 
              type="text" 
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={confirmWord}
              className="w-full bg-[#1A1A24] border border-[#2A2A3A] rounded-lg px-4 py-3 text-[#F0F0FF] focus:outline-none focus:border-[#FF4D6A] transition-colors"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex w-full gap-3 pt-2">
          <button 
            onClick={closeModal}
            disabled={isDeleting}
            className="flex-1 py-3 bg-[#1A1A24] border border-[#2A2A3A] text-[#F0F0FF] rounded-xl hover:bg-[#22222E] transition-colors font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleConfirm}
            disabled={isDeleting || (requireConfirm && confirmText !== confirmWord)}
            className="flex-1 py-3 bg-[#FF4D6A] text-white rounded-xl hover:bg-[#FF4D6A]/90 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;
