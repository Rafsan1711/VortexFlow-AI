import { useState, useRef, useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPaperPlane, 
  faPaperclip, 
  faMicrophone, 
  faSquare,
  faTimes,
  faImage
} from '@fortawesome/free-solid-svg-icons';
import { useChat } from '../../hooks/useChat';
import { useParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';

const InputBar = () => {
  const { chatId } = useParams();
  const location = useLocation();
  const { sendMessage, streaming } = useChat();
  const { setBootingTerminal } = useAppStore();
  const [input, setInput] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (location.state?.codeToChat) {
      const { codeToChat, language } = location.state;
      setInput(`Here is my code in ${language}:\n\n\`\`\`${language}\n${codeToChat}\n\`\`\``);
      // Clear state so it doesn't trigger again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const placeholders = [
    "Message VortexFlow AI...",
    "Type /terminal+++ to open terminal",
    "Use /terminal+++ to launch plugins"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = async () => {
    if ((!input.trim() && !imageUrl) || streaming) return;

    const content = input.trim();
    
    if (content.toLowerCase() === '/terminal+++') {
      setInput('');
      setBootingTerminal(true);
      return;
    }

    const currentImageUrl = imageUrl;
    
    setInput('');
    setImageUrl(null);
    
    if (chatId) {
      await sendMessage(chatId, content, currentImageUrl || undefined);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-[#0D0D14] border-t border-[#2A2A3A] sticky bottom-0 z-20">
      <div className="max-w-[768px] mx-auto px-4 py-3 relative">
        <div className="relative flex flex-col bg-[#111118] border border-[#2A2A3A] rounded-xl p-2 shadow-lg focus-within:border-[#00D4FF] focus-within:shadow-[0_0_0_3px_rgba(0,212,255,0.1)] transition-all">
          
          {/* Image Preview Area */}
          <AnimatePresence>
            {imageUrl && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-2 pt-2 pb-1"
              >
                <div className="relative inline-block">
                  <img src={imageUrl} alt="Upload preview" className="h-20 rounded-lg border border-[#2A2A3A] object-cover" />
                  <button 
                    onClick={() => setImageUrl(null)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-[#1A1A24] border border-[#2A2A3A] rounded-full flex items-center justify-center text-[#9898B8] hover:text-[#F0F0FF] hover:bg-[#FF4D6A] transition-colors"
                  >
                    <FontAwesomeIcon icon={faTimes} size="xs" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-end gap-2">
            {/* Left Icons */}
            <div className="flex pb-1.5 pl-1 gap-1">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-[#9898B8] hover:text-[#00D4FF] hover:bg-[#1A1A24] p-2 rounded-lg transition-colors"
                title="Attach image"
              >
                <FontAwesomeIcon icon={faImage} />
              </button>
            </div>

            {/* Textarea */}
            <TextareaAutosize
              ref={textareaRef}
              minRows={1}
              maxRows={5}
              placeholder={placeholders[placeholderIndex]}
              className="flex-1 bg-transparent placeholder-[#5C5C7A] resize-none focus:outline-none py-2 px-2 text-[15px] leading-relaxed custom-scrollbar font-sans transition-all duration-500"
              style={{ color: input.trim().toLowerCase() === '/terminal+++' ? '#22c55e' : '#F0F0FF' }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            {/* Right Actions */}
            <div className="flex flex-col items-end pb-1.5 pr-1 gap-2">
              {input.length > 100 && (
                <span className="text-[10px] text-[#5C5C7A] font-mono">
                  {input.length} chars
                </span>
              )}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                disabled={(!input.trim() && !imageUrl) || streaming}
                className={`
                  w-8 h-8 rounded-lg flex items-center justify-center transition-all
                  ${(input.trim() || imageUrl) && !streaming
                    ? 'bg-gradient-to-br from-[#00D4FF] to-[#7B61FF] text-white shadow-[0_0_10px_rgba(0,212,255,0.3)] hover:shadow-[0_0_15px_rgba(0,212,255,0.5)]' 
                    : 'bg-[#1A1A24] text-[#3D3D52] cursor-not-allowed'
                  }
                `}
              >
                {streaming ? (
                  <FontAwesomeIcon icon={faSquare} className="animate-pulse text-xs" />
                ) : (
                  <FontAwesomeIcon icon={faPaperPlane} size="sm" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex justify-center items-center mt-3 px-1">
          <p className="text-xs text-[#3D3D52] text-center">
            VortexFlow AI can make mistakes. Always verify important information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InputBar;
