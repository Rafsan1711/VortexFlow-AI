import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faCopy, faCheck, faFileAlt, faFileCode, faFileLines } from '@fortawesome/free-solid-svg-icons';
import Modal from '../ui/Modal';
import { useAppStore } from '../../store/useAppStore';
import { ref, get } from 'firebase/database';
import { db } from '../../lib/firebase';
import { Message } from '../../types';

const ExportChatModal = () => {
  const { openModal, closeModal, activeChatId, chats, user } = useAppStore();
  const [format, setFormat] = useState<'markdown' | 'text' | 'json'>('markdown');
  const [copied, setCopied] = useState(false);
  const [preview, setPreview] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const activeChat = chats.find(c => c.id === activeChatId);

  useEffect(() => {
    if (!activeChatId || !user) return;
    const messagesRef = ref(db, `messages/${user.uid}/${activeChatId}`);
    get(messagesRef).then((snapshot) => {
      const data = snapshot.val();
      if (data) {
        const msgList: Message[] = Object.values(data);
        msgList.sort((a, b) => a.timestamp - b.timestamp);
        setMessages(msgList);
      } else {
        setMessages([]);
      }
    });
  }, [activeChatId, user]);

  useEffect(() => {
    if (!activeChat) return;

    let content = '';
    if (format === 'markdown') {
      content = `# ${activeChat.title}\n\n`;
      messages.forEach(msg => {
        content += `**${msg.role === 'user' ? 'You' : 'AI'}**:\n${msg.content}\n\n---\n\n`;
      });
    } else if (format === 'text') {
      content = `Title: ${activeChat.title}\n\n`;
      messages.forEach(msg => {
        content += `[${msg.role.toUpperCase()}]\n${msg.content}\n\n`;
      });
    } else if (format === 'json') {
      content = JSON.stringify({ ...activeChat, messages }, null, 2);
    }

    setPreview(content);
  }, [format, activeChat, messages]);

  const handleDownload = () => {
    if (!activeChat) return;
    
    const blob = new Blob([preview], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeChat.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_export.${format === 'markdown' ? 'md' : format === 'json' ? 'json' : 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    closeModal();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(preview);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Modal
      isOpen={openModal === 'export'}
      onClose={closeModal}
      title="Export Conversation"
      size="lg"
      footer={
        <div className="flex justify-between w-full">
          <button 
            onClick={handleCopy}
            className={`
              px-6 py-2 rounded-xl font-medium flex items-center gap-2 transition-all
              ${copied 
                ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                : 'bg-[#1A1A24] border border-[#2A2A3A] text-[#F0F0FF] hover:bg-[#22222E]'
              }
            `}
          >
            <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </button>
          
          <div className="flex gap-3">
            <button 
              onClick={closeModal}
              className="px-6 py-2 bg-[#1A1A24] text-[#F0F0FF] font-semibold rounded-xl hover:bg-[#22222E] transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleDownload}
              className="px-6 py-2 bg-gradient-to-r from-[#00D4FF] to-[#7B61FF] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faDownload} /> Download
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-6 pt-2">
        {/* Format Selection */}
        <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={() => setFormat('markdown')}
            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all ${format === 'markdown' ? 'bg-[#00D4FF]/10 border-[#00D4FF] text-[#00D4FF]' : 'bg-[#1A1A24] border-[#2A2A3A] text-[#9898B8] hover:border-[#3D3D52]'}`}
          >
            <FontAwesomeIcon icon={faFileAlt} size="lg" />
            <span className="text-sm font-bold">Markdown</span>
          </button>
          <button 
            onClick={() => setFormat('text')}
            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all ${format === 'text' ? 'bg-[#00D4FF]/10 border-[#00D4FF] text-[#00D4FF]' : 'bg-[#1A1A24] border-[#2A2A3A] text-[#9898B8] hover:border-[#3D3D52]'}`}
          >
            <FontAwesomeIcon icon={faFileLines} size="lg" />
            <span className="text-sm font-bold">Plain Text</span>
          </button>
          <button 
            onClick={() => setFormat('json')}
            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all ${format === 'json' ? 'bg-[#00D4FF]/10 border-[#00D4FF] text-[#00D4FF]' : 'bg-[#1A1A24] border-[#2A2A3A] text-[#9898B8] hover:border-[#3D3D52]'}`}
          >
            <FontAwesomeIcon icon={faFileCode} size="lg" />
            <span className="text-sm font-bold">JSON</span>
          </button>
        </div>

        {/* Preview Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-[#F0F0FF] uppercase tracking-wider">Preview</label>
            <span className="text-xs text-[#5C5C7A] font-mono">{preview.length} chars</span>
          </div>
          <div className="w-full h-64 bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl p-4 overflow-y-auto custom-scrollbar">
            <pre className="text-xs text-[#9898B8] font-mono whitespace-pre-wrap break-words">
              {preview || 'No content to preview.'}
            </pre>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ExportChatModal;
