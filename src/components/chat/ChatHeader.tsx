import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faEllipsisH, faShareNodes, faDownload, faBolt, faBrain, faWifi, faCloud, faSync, faTerminal } from '@fortawesome/free-solid-svg-icons';
import { useAppStore } from '../../store/useAppStore';
import { useChat } from '../../hooks/useChat';
import Dropdown from '../ui/Dropdown';
import Tooltip from '../ui/Tooltip';
import { useNavigate } from 'react-router-dom';

const ChatHeader = () => {
  const { activeChatId, chats, toggleSidebar, setOpenModal, settings, chatSettings, isOnline, isSyncing, openTerminal } = useAppStore();
  const { updateChatTitle, deleteChat } = useChat();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitleValue, setEditTitleValue] = useState('');
  const navigate = useNavigate();

  const activeChat = chats.find(c => c.id === activeChatId);
  const currentSettings = activeChatId ? (chatSettings[activeChatId] || settings) : settings;

  if (!activeChat) {
    return (
      <header className="h-14 border-b border-[#2A2A3A] bg-[#0A0A0F]/80 backdrop-blur-md flex items-center px-4 md:px-6 sticky top-0 z-10">
        <button 
          onClick={toggleSidebar}
          className="md:hidden w-10 h-10 rounded-lg hover:bg-[#1A1A24] flex items-center justify-center text-[#9898B8] transition-colors mr-3"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </header>
    );
  }

  const handleTitleDoubleClick = () => {
    setEditTitleValue(activeChat.title);
    setIsEditingTitle(true);
  };

  const handleTitleSave = () => {
    if (editTitleValue.trim() && editTitleValue !== activeChat.title) {
      updateChatTitle(activeChat.id, editTitleValue.trim());
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleTitleSave();
    if (e.key === 'Escape') setIsEditingTitle(false);
  };

  const isPro = currentSettings.model === 'gemini-3.1-pro-preview';

  return (
    <header className="h-14 border-b border-[#2A2A3A] bg-[#0A0A0F]/80 backdrop-blur-md flex items-center justify-between px-4 md:px-6 sticky top-0 z-10">
      <div className="flex items-center gap-3 overflow-hidden">
        <button 
          onClick={toggleSidebar}
          className="md:hidden w-10 h-10 rounded-lg hover:bg-[#1A1A24] flex items-center justify-center text-[#9898B8] transition-colors shrink-0"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
        
        <div className="flex flex-col overflow-hidden">
          {isEditingTitle ? (
            <input
              autoFocus
              type="text"
              value={editTitleValue}
              onChange={(e) => setEditTitleValue(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={handleTitleKeyDown}
              className="bg-[#1A1A24] text-[#F0F0FF] text-sm font-bold px-2 py-0.5 rounded outline-none border border-[#00D4FF]"
            />
          ) : (
            <h1 
              onDoubleClick={handleTitleDoubleClick}
              className="text-[#F0F0FF] font-bold text-sm md:text-base truncate cursor-text"
              title="Double click to rename"
            >
              {activeChat.title}
            </h1>
          )}
          <div className="flex items-center gap-2 text-[10px] md:text-xs text-[#5C5C7A]">
            <span>{activeChat.messageCount || 0} messages</span>
            <span>•</span>
            <button 
              onClick={() => setOpenModal('model-picker')}
              className="hover:text-[#00D4FF] transition-colors flex items-center gap-1"
            >
              <FontAwesomeIcon icon={isPro ? faBrain : faBolt} className={isPro ? 'text-[#7B61FF]' : 'text-[#00D4FF]'} />
              {isPro ? 'Gemini 3.1 Pro' : 'Gemini 3.0 Flash'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 md:gap-2 shrink-0">
        {/* Sync Indicator */}
        <Tooltip content={!isOnline ? "Offline" : isSyncing ? "Syncing..." : "Synced to cloud"}>
          <div className="hidden sm:flex items-center justify-center w-8 h-8 mr-2">
            {!isOnline ? (
              <FontAwesomeIcon icon={faWifi} className="text-[#FF4D6A] opacity-70" />
            ) : isSyncing ? (
              <FontAwesomeIcon icon={faSync} className="text-[#00D4FF] animate-spin opacity-70" />
            ) : (
              <FontAwesomeIcon icon={faCloud} className="text-[#00E5A0] opacity-70" />
            )}
          </div>
        </Tooltip>

        <button 
          onClick={() => setOpenModal('export')}
          className="hidden sm:flex w-9 h-9 rounded-lg hover:bg-[#1A1A24] items-center justify-center text-[#9898B8] hover:text-[#F0F0FF] transition-colors"
          title="Export Chat"
        >
          <FontAwesomeIcon icon={faDownload} />
        </button>
        <button 
          onClick={() => setOpenModal('share')}
          className="hidden sm:flex w-9 h-9 rounded-lg hover:bg-[#1A1A24] items-center justify-center text-[#9898B8] hover:text-[#F0F0FF] transition-colors"
          title="Share Chat"
        >
          <FontAwesomeIcon icon={faShareNodes} />
        </button>
        
        <Dropdown
          trigger={
            <button className="w-9 h-9 rounded-lg hover:bg-[#1A1A24] flex items-center justify-center text-[#9898B8] hover:text-[#F0F0FF] transition-colors">
              <FontAwesomeIcon icon={faEllipsisH} />
            </button>
          }
          items={[
            { 
              label: 'Rename', 
              action: () => setOpenModal('rename', {
                currentTitle: activeChat.title,
                onSave: async (newTitle: string) => {
                  await updateChatTitle(activeChat.id, newTitle);
                }
              }) 
            },
            { label: 'Share', action: () => setOpenModal('share') },
            { label: 'Export', action: () => setOpenModal('export') },
            { label: '', divider: true },
            { 
              label: 'Delete Chat', 
              action: () => setOpenModal('delete-confirm', {
                title: 'Delete Chat',
                description: 'Are you sure you want to delete this chat? This action cannot be undone.',
                onConfirm: async () => {
                  await deleteChat(activeChat.id);
                  navigate('/chat');
                }
              }), 
              danger: true 
            },
          ]}
          align="right"
        />
      </div>
    </header>
  );
};

export default ChatHeader;
