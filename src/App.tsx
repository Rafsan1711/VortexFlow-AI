/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import ChatPage from './pages/ChatPage';
import ChangelogPage from './pages/ChangelogPage';
import ToastContainer from './components/ui/Toast';
import { useAuth } from './hooks/useAuth';
import { useAppStore } from './store/useAppStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faWifi } from '@fortawesome/free-solid-svg-icons';
import { useKeyboard } from './hooks/useKeyboard';
import { ref, onValue } from 'firebase/database';
import { db } from './lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy load EditorPage
const EditorPage = React.lazy(() => import('./pages/EditorPage'));

// Modals & Panels
import SettingsModal from './components/modals/SettingsModal';
import ProfileModal from './components/modals/ProfileModal';
import ModelPickerModal from './components/modals/ModelPickerModal';
import DeleteConfirmModal from './components/modals/DeleteConfirmModal';
import ChatRenameModal from './components/modals/ChatRenameModal';
import ShareChatModal from './components/modals/ShareChatModal';
import KeyboardShortcutsModal from './components/modals/KeyboardShortcutsModal';
import WelcomeTourModal from './components/modals/WelcomeTourModal';
import ExportChatModal from './components/modals/ExportChatModal';
import PluginStoreModal from './components/modals/PluginStoreModal';
import SearchPanel from './components/chat/SearchPanel';

import DocsLayout from './pages/DocsLayout';
import ChangelogDoc from './pages/docs/ChangelogDoc';
import PrivacyPolicyDoc from './pages/docs/PrivacyPolicyDoc';
import TermsOfServiceDoc from './pages/docs/TermsOfServiceDoc';
import AboutDoc from './pages/docs/AboutDoc';
import TerminalDoc from './pages/docs/TerminalDoc';
import CodeEditorDoc from './pages/docs/CodeEditorDoc';
import SharePage from './pages/SharePage';
import StatusPage from './pages/StatusPage';

export default function App() {
  const { user, authLoading, setConnectionState, addToast, openModal } = useAppStore();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  
  // Initialize auth listener
  useAuth();

  // Initialize global keyboard shortcuts
  useKeyboard();

  // Network connection listener
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      addToast({ message: 'Back online!', type: 'success' });
    };
    const handleOffline = () => {
      setIsOffline(true);
      addToast({ message: 'You are offline. Some features may be unavailable.', type: 'error' });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [addToast]);

  // Firebase connection state listener
  useEffect(() => {
    const connectedRef = ref(db, '.info/connected');
    const unsubscribe = onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        setConnectionState(true, false);
      } else {
        setConnectionState(false, false);
      }
    });

    return () => unsubscribe();
  }, [setConnectionState]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00D4FF] rounded-full blur-[150px] opacity-10 animate-pulse" />
        
        {/* Logo Animation */}
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#00D4FF] to-[#7B61FF] animate-spin-slow opacity-50 blur-lg" />
          <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-[#00D4FF] to-[#7B61FF] p-[2px] shadow-[0_0_30px_rgba(0,212,255,0.3)]">
            <div className="w-full h-full bg-[#0A0A0F] rounded-[14px] overflow-hidden flex items-center justify-center">
              <img src="/logo.png" alt="VortexFlow AI" className="w-16 h-16 object-cover scale-110 animate-pulse" />
            </div>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-[#F0F0FF] tracking-wide mb-2">VortexFlow AI</h1>
        <p className="text-[#5C5C7A] text-sm tracking-widest uppercase flex items-center gap-2">
          Initializing
          <span className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-bounce" style={{ animationDelay: '300ms' }} />
          </span>
        </p>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/status" element={<StatusPage />} />
        <Route 
          path="/auth" 
          element={user ? <Navigate to="/chat" replace /> : <AuthPage />} 
        />
        <Route 
          path="/chat" 
          element={user ? <ChatPage /> : <Navigate to="/auth" replace />} 
        />
        <Route 
          path="/chat/:chatId" 
          element={user ? <ChatPage /> : <Navigate to="/auth" replace />} 
        />
        <Route 
          path="/editor" 
          element={
            user ? (
              <Suspense fallback={<div className="h-screen w-full bg-[#0D0D14] flex items-center justify-center text-[#5C5C7A]">Loading Editor...</div>}>
                <EditorPage />
              </Suspense>
            ) : (
              <Navigate to="/auth" replace />
            )
          } 
        />
        <Route path="/changelog" element={<Navigate to="/docs/changelog" replace />} />
        <Route path="/docs" element={<DocsLayout />}>
          <Route index element={<Navigate to="/docs/about" replace />} />
          <Route path="about" element={<AboutDoc />} />
          <Route path="changelog" element={<ChangelogDoc />} />
          <Route path="editor" element={<CodeEditorDoc />} />
          <Route path="privacy" element={<PrivacyPolicyDoc />} />
          <Route path="terms" element={<TermsOfServiceDoc />} />
          <Route path="terminal" element={<TerminalDoc />} />
        </Route>
        <Route path="/share/:shareId" element={<SharePage />} />
      </Routes>
      <ToastContainer />
      
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-[100] bg-[#FF4D6A] text-white py-1.5 px-4 text-center text-xs font-medium flex items-center justify-center gap-2 shadow-lg"
          >
            <FontAwesomeIcon icon={faWifi} className="opacity-80" />
            You are currently offline. Changes will be saved locally and synced when you reconnect.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Modals & Panels */}
      <SearchPanel />
      <SettingsModal />
      <ProfileModal />
      <ModelPickerModal />
      <DeleteConfirmModal />
      <ChatRenameModal />
      <ShareChatModal />
      <KeyboardShortcutsModal />
      <WelcomeTourModal />
      <ExportChatModal />
      {openModal === 'plugins' && <PluginStoreModal />}
    </>
  );
}
