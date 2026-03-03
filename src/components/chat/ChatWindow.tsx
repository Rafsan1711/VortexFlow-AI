import { useEffect, useRef, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import { useChat } from '../../hooks/useChat';
import { useAppStore } from '../../store/useAppStore';
import MessageBubble from './MessageBubble';
import InputBar from './InputBar';
import ChatHeader from './ChatHeader';
import { Message } from '../../types';
import { ref, onValue, query, orderByChild } from 'firebase/database';
import { db } from '../../lib/firebase';
import { motion } from 'framer-motion';
import ErrorBoundary from '../ErrorBoundary';

const ChatWindowContent = () => {
  const { chatId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, chats, globalSettings } = useAppStore();
  const { sendMessage, streaming } = useChat();
  const [messages, setMessages] = useState<Message[]>([]);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Listen for messages
  useEffect(() => {
    if (!user || !chatId) return;

    const messagesRef = query(ref(db, `messages/${user.uid}/${chatId}`), orderByChild('timestamp'));
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const msgList: Message[] = Object.values(data);
        msgList.sort((a, b) => a.timestamp - b.timestamp);
        setMessages(msgList);
      } else {
        setMessages([]);
      }
    });

    return () => unsubscribe();
  }, [user, chatId]);

  // Handle initial message from navigation (e.g. from WelcomeScreen)
  useEffect(() => {
    if (location.state?.initialMessage && chatId) {
      const msg = location.state.initialMessage;
      // Clear state immediately to prevent double send
      navigate(location.pathname, { replace: true, state: {} });
      sendMessage(chatId, msg);
    }
  }, [location.state, chatId, navigate, sendMessage]);

  // Auto-scroll logic
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (messages.length > 0 && globalSettings.autoScroll) {
      scrollToBottom();
    }
  }, [messages.length, streaming, globalSettings.autoScroll]);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
      
      // Smart auto-scroll: if user scrolls up, disable auto-scroll temporarily?
      // For now, just show the button.
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 relative bg-[#0A0A0F]">
      <ChatHeader />

      {/* Messages Area */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar scroll-smooth"
      >
        <div className="max-w-[768px] mx-auto flex flex-col pb-4">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] text-[#5C5C7A] text-sm">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00D4FF]/10 to-[#7B61FF]/10 flex items-center justify-center mb-4">
                <FontAwesomeIcon icon={faCommentDots} className="text-2xl text-[#00D4FF] opacity-80" />
              </div>
              <p className="text-[#F0F0FF] font-medium mb-1">Start a conversation</p>
              <p className="text-xs max-w-[250px] text-center">Type a message below to begin chatting with VortexFlow AI.</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <MessageBubble 
                  message={msg} 
                  isLast={index === messages.length - 1} 
                />
              </motion.div>
            ))
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Scroll to Bottom Button */}
      {showScrollButton && (
        <button
          onClick={() => scrollToBottom()}
          className="absolute bottom-24 right-8 w-10 h-10 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#7B61FF] text-white shadow-[0_0_15px_rgba(0,212,255,0.3)] flex items-center justify-center transition-all z-10 hover:scale-105"
        >
          <FontAwesomeIcon icon={faArrowDown} />
        </button>
      )}

      {/* Input Area */}
      <InputBar />
    </div>
  );
};

const ChatWindow = () => (
  <ErrorBoundary>
    <ChatWindowContent />
  </ErrorBoundary>
);

export default ChatWindow;
