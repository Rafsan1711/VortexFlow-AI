import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useChat } from './useChat';
import { useNavigate } from 'react-router-dom';

export const useKeyboard = () => {
  const { toggleSidebar, setOpenModal, openModal, closeModal } = useAppStore();
  const { createNewChat } = useChat();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      // Check if we are inside an input or textarea
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      // Ctrl+K: New Chat
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const chatId = await createNewChat();
        if (chatId) navigate(`/chat/${chatId}`);
      }

      // Ctrl+B: Toggle Sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        toggleSidebar();
      }

      // Ctrl+E: Toggle Editor
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        if (window.location.pathname === '/editor') {
          navigate('/chat');
        } else {
          navigate('/editor');
        }
      }

      // Ctrl+,: Open Settings
      if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        setOpenModal('settings');
      }

      // ESC: Close Modal
      if (e.key === 'Escape' && openModal) {
        e.preventDefault();
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar, setOpenModal, openModal, closeModal, createNewChat, navigate]);
};
