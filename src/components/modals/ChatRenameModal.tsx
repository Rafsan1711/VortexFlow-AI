import React, { useState, useEffect, useRef } from 'react';
import Modal from '../ui/Modal';
import { useAppStore } from '../../store/useAppStore';

const ChatRenameModal = () => {
  const { openModal, closeModal, modalProps } = useAppStore();
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (openModal === 'rename' && modalProps?.currentTitle) {
      setTitle(modalProps.currentTitle);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 100);
    }
  }, [openModal, modalProps]);

  const handleSave = () => {
    if (title.trim() && modalProps?.onSave) {
      modalProps.onSave(title.trim());
    }
    closeModal();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <Modal
      isOpen={openModal === 'rename'}
      onClose={closeModal}
      title="Rename Chat"
      size="sm"
      footer={
        <div className="flex justify-end gap-3 w-full">
          <button 
            onClick={closeModal}
            className="px-6 py-2 bg-[#1A1A24] text-[#F0F0FF] font-semibold rounded-xl hover:bg-[#22222E] transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={!title.trim()}
            className="px-6 py-2 bg-gradient-to-r from-[#00D4FF] to-[#7B61FF] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      }
    >
      <div className="space-y-4 pt-2">
        <label className="text-sm text-[#9898B8] font-medium">Chat Title</label>
        <input 
          ref={inputRef}
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter a new title..."
          className="w-full bg-[#1A1A24] border border-[#2A2A3A] rounded-xl px-4 py-3 text-[#F0F0FF] focus:outline-none focus:border-[#00D4FF] transition-colors"
        />
      </div>
    </Modal>
  );
};

export default ChatRenameModal;
