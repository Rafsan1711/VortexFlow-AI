import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes, faChevronRight, faSearchMinus } from '@fortawesome/free-solid-svg-icons';
import { useAppStore } from '../../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { db } from '../../lib/firebase';
import { Message } from '../../types';

const SearchPanel = () => {
  const { isSearchOpen, setSearchOpen, chats, setActiveChatId, user } = useAppStore();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [allMessages, setAllMessages] = useState<Record<string, Message[]>>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      
      // Fetch all messages when search opens
      if (user) {
        const messagesRef = ref(db, `messages/${user.uid}`);
        get(messagesRef).then((snapshot) => {
          const data = snapshot.val();
          if (data) {
            const msgs: Record<string, Message[]> = {};
            Object.entries(data).forEach(([chatId, chatMsgs]: [string, any]) => {
              const msgList: Message[] = Object.values(chatMsgs);
              msgList.sort((a, b) => a.timestamp - b.timestamp);
              msgs[chatId] = msgList;
            });
            setAllMessages(msgs);
          }
        });
      }
    } else {
      setQuery('');
      setDebouncedQuery('');
    }
  }, [isSearchOpen, user]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Handle Ctrl+F
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setSearchOpen]);

  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    
    const lowerQuery = debouncedQuery.toLowerCase();
    const matchedChats = chats.map(chat => {
      const titleMatch = chat.title.toLowerCase().includes(lowerQuery);
      const chatMessages = allMessages[chat.id] || [];
      const matchedMessages = chatMessages.filter(msg => 
        msg.content?.toLowerCase().includes(lowerQuery)
      );

      if (titleMatch || matchedMessages.length > 0) {
        return {
          ...chat,
          matchedMessages
        };
      }
      return null;
    }).filter(Boolean) as any[];

    return matchedChats;
  }, [debouncedQuery, chats, allMessages]);

  const totalResults = results.reduce((acc, chat) => acc + (chat.matchedMessages.length || 1), 0);

  const handleResultClick = (chatId: string, msgId?: string) => {
    setActiveChatId(chatId);
    navigate(`/chat/${chatId}${msgId ? `?msg=${msgId}` : ''}`);
    setSearchOpen(false);
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ y: '-100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute top-0 left-0 right-0 z-40 bg-[#111118]/95 backdrop-blur-xl border-b border-[#2A2A3A] shadow-2xl flex flex-col max-h-[60vh]"
        >
          <div className="flex items-center gap-3 p-4 border-b border-[#2A2A3A]">
            <FontAwesomeIcon icon={faSearch} className="text-[#5C5C7A]" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search across all chats..."
              className="flex-1 bg-transparent border-none outline-none text-[#F0F0FF] placeholder-[#5C5C7A] text-lg"
            />
            <button 
              onClick={() => setSearchOpen(false)}
              className="w-8 h-8 rounded-lg hover:bg-[#2A2A3A] flex items-center justify-center text-[#9898B8] transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
            {!debouncedQuery ? (
              <div className="text-center text-[#5C5C7A] py-12 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#1A1A24] flex items-center justify-center mb-4">
                  <FontAwesomeIcon icon={faSearch} className="text-2xl text-[#3D3D52]" />
                </div>
                <h3 className="text-[#F0F0FF] font-medium mb-1">Search Messages</h3>
                <p className="text-xs max-w-[200px]">Type to search across all your chats and messages.</p>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center text-[#5C5C7A] py-12 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF4D6A]/10 to-[#FF8A00]/10 flex items-center justify-center mb-4">
                  <FontAwesomeIcon icon={faSearchMinus} className="text-2xl text-[#FF4D6A] opacity-80" />
                </div>
                <h3 className="text-[#F0F0FF] font-medium mb-1">No results found</h3>
                <p className="text-xs max-w-[200px]">We couldn't find any messages matching "{debouncedQuery}".</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-xs font-bold text-[#00D4FF] uppercase tracking-wider px-2">
                  {totalResults} results across {results.length} chats
                </div>
                
                {results.map(chat => (
                  <div key={chat.id} className="space-y-2">
                    <button 
                      onClick={() => handleResultClick(chat.id)}
                      className="w-full flex items-center gap-2 px-2 py-1 text-left group"
                    >
                      <FontAwesomeIcon icon={faChevronRight} className="text-[#5C5C7A] text-xs group-hover:text-[#00D4FF] transition-colors" />
                      <span className="font-bold text-[#F0F0FF] group-hover:text-[#00D4FF] transition-colors">{chat.title}</span>
                    </button>
                    
                    <div className="pl-6 space-y-2">
                      {chat.matchedMessages.slice(0, 3).map((msg: any) => (
                        <button
                          key={msg.id}
                          onClick={() => handleResultClick(chat.id, msg.id)}
                          className="w-full text-left p-3 rounded-xl bg-[#1A1A24] hover:bg-[#22222E] border border-[#2A2A3A] hover:border-[#3D3D52] transition-all group"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${msg.role === 'user' ? 'bg-[#00D4FF]/10 text-[#00D4FF]' : 'bg-[#7B61FF]/10 text-[#7B61FF]'}`}>
                              {msg.role}
                            </span>
                            <span className="text-xs text-[#5C5C7A]">
                              {new Date(msg.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-[#9898B8] line-clamp-2">
                            {/* Simple highlight */}
                            {msg.content.split(new RegExp(`(${debouncedQuery})`, 'gi')).map((part: string, i: number) => 
                              part.toLowerCase() === debouncedQuery.toLowerCase() ? 
                                <span key={i} className="bg-[#00D4FF]/20 text-[#00D4FF]">{part}</span> : part
                            )}
                          </p>
                        </button>
                      ))}
                      {chat.matchedMessages.length > 3 && (
                        <div className="text-xs text-[#5C5C7A] pl-3">
                          + {chat.matchedMessages.length - 3} more messages in this chat
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchPanel;
