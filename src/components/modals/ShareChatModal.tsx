import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faCheck, faLink, faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import Modal from '../ui/Modal';
import { useAppStore } from '../../store/useAppStore';
import { ref, set } from 'firebase/database';
import { db } from '../../lib/firebase';

const ShareChatModal = () => {
  const { openModal, closeModal, activeChatId, chats } = useAppStore();
  const [copied, setCopied] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const generateShareLink = async () => {
      if (openModal === 'share' && activeChatId) {
        setIsGenerating(true);
        try {
          const chatToShare = chats.find(c => c.id === activeChatId);
          if (chatToShare) {
            // Use a short ID for sharing
            const shareId = Math.random().toString(36).substring(2, 10);
            const sharedChatRef = ref(db, `shared_chats/${shareId}`);
            
            // Save to public shared_chats node
            await set(sharedChatRef, {
              ...chatToShare,
              sharedAt: Date.now(),
              // We don't want to share the userId in the public link for privacy
              userId: 'public'
            });

            setShareLink(`${window.location.origin}/share/${shareId}`);
          }
        } catch (err) {
          console.error('Error sharing chat:', err);
        } finally {
          setIsGenerating(false);
        }
      }
    };

    generateShareLink();
  }, [openModal, activeChatId, chats]);

  const handleCopy = async () => {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Modal
      isOpen={openModal === 'share'}
      onClose={closeModal}
      title="Share Conversation"
      subtitle="Create a public link to share this chat."
      size="md"
    >
      <div className="space-y-6 pt-2">
        {/* Link Generation Area */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#F0F0FF]">Public Link</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-[#1A1A24] border border-[#2A2A3A] rounded-xl px-4 py-3 text-[#9898B8] font-mono text-sm overflow-hidden text-ellipsis whitespace-nowrap flex items-center gap-3">
              <FontAwesomeIcon icon={faLink} className="text-[#5C5C7A]" />
              {isGenerating ? (
                <span className="animate-pulse">Generating link...</span>
              ) : (
                shareLink || 'No link generated.'
              )}
            </div>
            <button 
              onClick={handleCopy}
              disabled={isGenerating || !shareLink}
              className={`
                px-4 py-3 rounded-xl font-medium flex items-center gap-2 transition-all min-w-[100px] justify-center
                ${copied 
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                  : 'bg-gradient-to-r from-[#00D4FF] to-[#7B61FF] text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed'
                }
              `}
            >
              <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className="text-xs text-[#5C5C7A] mt-2">
            Anyone with the link can view this conversation (read-only). Link valid for 7 days.
          </p>
        </div>

        <div className="h-px bg-[#2A2A3A] w-full" />

        {/* Share Options */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-[#F0F0FF]">Share via</label>
          <div className="grid grid-cols-3 gap-3">
            <button 
              onClick={() => window.open(`https://twitter.com/intent/tweet?text=Check out this conversation on VortexFlow AI!&url=${encodeURIComponent(shareLink)}`, '_blank')}
              disabled={isGenerating || !shareLink}
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-[#1A1A24] border border-[#2A2A3A] hover:border-[#00D4FF] hover:text-[#00D4FF] transition-colors text-[#9898B8] disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <FontAwesomeIcon icon={faTwitter} size="lg" className="group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium">Twitter / X</span>
            </button>
            <button 
              onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Check out this conversation on VortexFlow AI: ${shareLink}`)}`, '_blank')}
              disabled={isGenerating || !shareLink}
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-[#1A1A24] border border-[#2A2A3A] hover:border-[#00E5A0] hover:text-[#00E5A0] transition-colors text-[#9898B8] disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <FontAwesomeIcon icon={faWhatsapp} size="lg" className="group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium">WhatsApp</span>
            </button>
            <button 
              onClick={handleCopy}
              disabled={isGenerating || !shareLink}
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-[#1A1A24] border border-[#2A2A3A] hover:border-[#F0F0FF] hover:text-[#F0F0FF] transition-colors text-[#9898B8] disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <FontAwesomeIcon icon={faShareAlt} size="lg" className="group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium">Other</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ShareChatModal;
