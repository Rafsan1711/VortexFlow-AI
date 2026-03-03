import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { db } from '../lib/firebase';
import { Chat, Message } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faCalendarAlt, faMessage, faShareAlt, faArrowLeft, faRobot, faUser } from '@fortawesome/free-solid-svg-icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';

const SharePage = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const [chat, setChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSharedChat = async () => {
      if (!shareId) return;
      try {
        const sharedChatRef = ref(db, `shared_chats/${shareId}`);
        const snapshot = await get(sharedChatRef);
        if (snapshot.exists()) {
          setChat(snapshot.val());
        } else {
          setError('This shared conversation does not exist or has expired.');
        }
      } catch (err) {
        console.error('Error fetching shared chat:', err);
        setError('Failed to load the shared conversation. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSharedChat();
  }, [shareId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#00D4FF]/20 border-t-[#00D4FF] rounded-full animate-spin mb-4" />
        <p className="text-[#5C5C7A] font-medium animate-pulse">Retrieving shared conversation...</p>
      </div>
    );
  }

  if (error || !chat) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
          <FontAwesomeIcon icon={faShareAlt} className="text-red-500 text-3xl" />
        </div>
        <h1 className="text-2xl font-bold text-[#F0F0FF] mb-2">Link Expired or Invalid</h1>
        <p className="text-[#9898B8] max-w-md mb-8">{error || 'The link you followed is no longer active.'}</p>
        <Link to="/" className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[#F0F0FF] font-medium transition-all flex items-center gap-2">
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F0F0FF] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#0A0A0F]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D4FF] to-[#7B61FF] p-[1px]">
              <div className="w-full h-full bg-[#0A0A0F] rounded-[11px] flex items-center justify-center">
                <img src="/logo.png" alt="VortexFlow AI" className="w-6 h-6 object-contain" />
              </div>
            </div>
            <div>
              <h1 className="font-bold text-base tracking-tight truncate max-w-[200px] md:max-w-md">{chat.title}</h1>
              <div className="flex items-center gap-3 text-[10px] text-[#5C5C7A] font-bold uppercase tracking-widest mt-0.5">
                <span className="flex items-center gap-1">
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-[8px]" />
                  {new Date(chat.createdAt).toLocaleDateString()}
                </span>
                <span className="w-1 h-1 rounded-full bg-[#2A2A3A]" />
                <span className="flex items-center gap-1">
                  <FontAwesomeIcon icon={faMessage} className="text-[8px]" />
                  {chat.messages.length} Messages
                </span>
              </div>
            </div>
          </div>
          <Link to="/auth" className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-[#0A0A0F] text-xs font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(0,212,255,0.2)]">
            <FontAwesomeIcon icon={faBolt} />
            Try VortexFlow AI
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto py-12 px-6">
          <div className="space-y-12">
            {chat.messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex gap-4 md:gap-6 ${message.role === 'assistant' ? 'bg-white/[0.02] p-6 md:p-8 rounded-3xl border border-white/5' : ''}`}
              >
                <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${
                  message.role === 'assistant' 
                    ? 'bg-gradient-to-br from-[#00D4FF] to-[#7B61FF] text-white shadow-lg' 
                    : 'bg-[#1A1A24] text-[#5C5C7A] border border-[#2A2A3A]'
                }`}>
                  <FontAwesomeIcon icon={message.role === 'assistant' ? faRobot : faUser} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#5C5C7A]">
                      {message.role === 'assistant' ? 'VortexFlow AI' : 'User'}
                    </span>
                  </div>
                  <div className="markdown-body prose prose-invert prose-sm md:prose-base max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-24 p-12 rounded-[40px] bg-gradient-to-br from-[#00D4FF]/10 via-[#7B61FF]/10 to-transparent border border-white/5 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00D4FF] rounded-full blur-[100px] opacity-10 -translate-y-1/2 translate-x-1/2" />
            
            <h2 className="text-3xl font-bold text-[#F0F0FF] mb-4">Start your own conversation</h2>
            <p className="text-[#9898B8] mb-8 max-w-lg mx-auto">Join thousands of users who are already using VortexFlow AI to boost their productivity and creativity.</p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth" className="w-full sm:w-auto px-8 py-4 bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-[#0A0A0F] font-bold rounded-2xl transition-all shadow-[0_0_30px_rgba(0,212,255,0.3)] flex items-center justify-center gap-2">
                Get Started for Free
                <FontAwesomeIcon icon={faBolt} />
              </Link>
              <Link to="/" className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-[#F0F0FF] font-bold rounded-2xl transition-all border border-white/10">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center">
        <p className="text-sm text-[#5C5C7A]">Shared via VortexFlow AI • Next-Gen Conversational Platform</p>
      </footer>
    </div>
  );
};

export default SharePage;
