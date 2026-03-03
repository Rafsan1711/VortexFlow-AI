import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCopy, 
  faCheck, 
  faPencilAlt, 
  faThumbsUp, 
  faThumbsDown, 
  faRedo,
  faTimes,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { Message } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { useChat } from '../../hooks/useChat';
import TypingIndicator from '../ui/TypingIndicator';
import Tooltip from '../ui/Tooltip';
import { faExternalLinkAlt, faCode } from '@fortawesome/free-solid-svg-icons';

interface MessageBubbleProps {
  message: Message;
  isLast: boolean;
}

const MessageBubble = ({ message, isLast }: MessageBubbleProps) => {
  const { user, activeChatId, globalSettings } = useAppStore();
  const { editMessage, regenerateMessage, submitFeedback } = useChat();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(null);
  const [showFeedbackAnimation, setShowFeedbackAnimation] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isUser = message.role === 'user';

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      textareaRef.current.focus();
    }
  }, [isEditing, editContent]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveEdit = () => {
    if (editContent.trim() && editContent !== message.content && activeChatId) {
      editMessage(activeChatId, message.id, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(message.content);
    setIsEditing(false);
  };

  const handleFeedback = (type: 'like' | 'dislike') => {
    if (activeChatId) {
      setFeedback(type);
      submitFeedback(activeChatId, message.id, type);
      if (type === 'like') {
        setShowFeedbackAnimation(true);
        setTimeout(() => setShowFeedbackAnimation(false), 1000);
      }
    }
  };

  const formatRelativeTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const fullDateTime = new Date(message.timestamp).toLocaleString();

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex w-full gap-4 ${isUser ? 'flex-row justify-end' : 'flex-row'}`}>
        {/* Avatar (Only for AI) */}
        {!isUser && (
          <div className="flex-shrink-0 mt-1">
            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-[#00D4FF] to-[#7B61FF] p-[1.5px] shadow-[0_0_10px_rgba(0,212,255,0.25)]">
              <div className="w-full h-full bg-[#0A0A0F] rounded-[10.5px] overflow-hidden flex items-center justify-center">
                <img 
                  src="/logo.png?v=2" 
                  alt="AI" 
                  className="w-full h-full object-contain p-1" 
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://placehold.co/128x128/00D4FF/FFFFFF?text=VF';
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className={`flex flex-col min-w-0 ${isUser ? 'items-end max-w-[85%] md:max-w-[75%]' : 'items-start w-full'}`}>
          <div className={`
            relative group text-sm leading-[1.7]
            ${isUser 
              ? 'bg-[#1A1A24] text-[#F0F0FF] border border-[#2A2A3A] px-3 py-2 md:px-4 md:py-3 rounded-[18px] rounded-br-[4px]' 
              : 'text-[#F0F0FF] w-full'
            }
          `}>
            {isUser && message.imageUrl && (
              <div className="mb-3 rounded-lg overflow-hidden border border-[#2A2A3A] max-w-sm">
                <img src={message.imageUrl} alt="Uploaded" className="w-full h-auto object-cover" />
              </div>
            )}

            {isEditing ? (
              <div className="flex flex-col gap-2 w-full min-w-[250px]">
                <textarea
                  ref={textareaRef}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full bg-[#0A0A0F] text-[#F0F0FF] border border-[#00D4FF] rounded-lg p-3 outline-none resize-none custom-scrollbar"
                  rows={1}
                />
                <div className="flex justify-end gap-2">
                  <button onClick={handleCancelEdit} className="px-3 py-1.5 rounded-lg bg-[#2A2A3A] text-xs font-bold hover:bg-[#3D3D52] transition-colors">Cancel</button>
                  <button onClick={handleSaveEdit} className="px-3 py-1.5 rounded-lg bg-[#00D4FF] text-[#0A0A0F] text-xs font-bold hover:bg-[#00B8E6] transition-colors">Save & Submit</button>
                </div>
              </div>
            ) : isUser ? (
              <div className="whitespace-pre-wrap">{message.content}</div>
            ) : message.content === '' ? (
              <div className="py-2">
                <TypingIndicator />
              </div>
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <div className="rounded-lg overflow-hidden my-4 border border-[#2A2A3A] bg-[#111118]">
                        <div className="flex items-center justify-between px-4 py-2 border-b border-[#2A2A3A]">
                          <span className="text-xs text-[#5C5C7A] font-mono">{match[1]}</span>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => {
                                const code = String(children).replace(/\n$/, '');
                                localStorage.setItem('vortex_editor_import', JSON.stringify({
                                  content: code,
                                  language: match[1],
                                  name: `imported_${Date.now()}.${match[1] === 'javascript' ? 'js' : match[1] === 'typescript' ? 'ts' : match[1]}`
                                }));
                                navigate('/editor');
                              }}
                              className="text-[#5C5C7A] hover:text-[#00D4FF] transition-colors text-xs flex items-center gap-1"
                            >
                              <FontAwesomeIcon icon={faExternalLinkAlt} className="text-[10px]" />
                              Open in Editor
                            </button>
                            <button
                              onClick={() => handleCopy(String(children).replace(/\n$/, ''))}
                              className="text-[#5C5C7A] hover:text-[#F0F0FF] transition-colors text-xs flex items-center gap-1"
                            >
                              <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
                              {copied ? 'Copied' : 'Copy'}
                            </button>
                          </div>
                        </div>
                        <SyntaxHighlighter
                          style={dracula}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{ margin: 0, borderRadius: 0, background: 'transparent', fontFamily: '"JetBrains Mono", monospace', fontSize: '13px' }}
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className="bg-[#1A1A24] text-[#00D4FF] px-1.5 py-0.5 rounded font-mono text-xs" {...props}>
                        {children}
                      </code>
                    );
                  },
                  p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-4 mb-4 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-4 mb-4 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="mb-1">{children}</li>,
                  h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 mt-6 text-[#F0F0FF]">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl font-bold mb-3 mt-5 text-[#F0F0FF]">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-lg font-bold mb-2 mt-4 text-[#F0F0FF]">{children}</h3>,
                  blockquote: ({ children }) => <blockquote className="border-l-[3px] border-[#00D4FF] pl-4 italic text-[#9898B8] my-4 bg-[#111118] py-2 rounded-r-lg">{children}</blockquote>,
                  table: ({ children }) => <div className="overflow-x-auto my-4"><table className="min-w-full border-collapse border border-[#2A2A3A] text-left">{children}</table></div>,
                  th: ({ children }) => <th className="border border-[#2A2A3A] px-4 py-2 bg-[#1A1A24] font-semibold text-[#F0F0FF]">{children}</th>,
                  td: ({ children }) => <td className="border border-[#2A2A3A] px-4 py-2 text-[#9898B8]">{children}</td>,
                  a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#00D4FF] hover:underline">{children}</a>,
                }}
              >
                {message.content}
              </ReactMarkdown>
            )}

            {/* Action Bar (Hover) */}
            {!isEditing && (
              <div className={`
                absolute -bottom-8 ${isUser ? 'right-0' : 'left-0'} 
                flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200
                bg-[#0A0A0F] px-1 py-1 rounded-lg border border-[#2A2A3A] shadow-lg z-10
              `}>
                <Tooltip content={copied ? "Copied!" : "Copy"}>
                  <button 
                    onClick={() => handleCopy(message.content)}
                    className="p-1.5 text-[#5C5C7A] hover:text-[#F0F0FF] transition-colors rounded hover:bg-[#1A1A24]"
                  >
                    <FontAwesomeIcon icon={copied ? faCheck : faCopy} size="xs" />
                  </button>
                </Tooltip>
                
                {isUser ? (
                  <Tooltip content="Edit message">
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="p-1.5 text-[#5C5C7A] hover:text-[#F0F0FF] transition-colors rounded hover:bg-[#1A1A24]"
                    >
                      <FontAwesomeIcon icon={faPencilAlt} size="xs" />
                    </button>
                  </Tooltip>
                ) : (
                  <>
                    {isLast && activeChatId && (
                      <Tooltip content="Regenerate response">
                        <button 
                          onClick={() => regenerateMessage(activeChatId)}
                          className="p-1.5 text-[#5C5C7A] hover:text-[#F0F0FF] transition-colors rounded hover:bg-[#1A1A24]"
                        >
                          <FontAwesomeIcon icon={faRedo} size="xs" />
                        </button>
                      </Tooltip>
                    )}
                    <div className="w-px h-3 bg-[#2A2A3A] mx-1" />
                    <Tooltip content="Good response">
                      <button 
                        onClick={() => handleFeedback('like')}
                        className={`p-1.5 transition-colors rounded hover:bg-[#1A1A24] relative ${feedback === 'like' ? 'text-[#00E5A0]' : 'text-[#5C5C7A] hover:text-[#F0F0FF]'}`}
                      >
                        <FontAwesomeIcon icon={faThumbsUp} size="xs" />
                        {showFeedbackAnimation && (
                          <span className="absolute inset-0 flex items-center justify-center animate-ping text-[#00E5A0]">
                            <FontAwesomeIcon icon={faCheckCircle} size="xs" />
                          </span>
                        )}
                      </button>
                    </Tooltip>
                    <Tooltip content="Bad response">
                      <button 
                        onClick={() => handleFeedback('dislike')}
                        className={`p-1.5 transition-colors rounded hover:bg-[#1A1A24] ${feedback === 'dislike' ? 'text-[#FF4D6A]' : 'text-[#5C5C7A] hover:text-[#F0F0FF]'}`}
                      >
                        <FontAwesomeIcon icon={faThumbsDown} size="xs" />
                      </button>
                    </Tooltip>
                  </>
                )}
              </div>
            )}
          </div>
          
          {/* Metadata: Tokens & Timestamps */}
          <div className={`flex items-center gap-2 mt-2 text-[10px] text-[#5C5C7A] px-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {globalSettings.showTimestamps && (
              <Tooltip content={fullDateTime} placement={isUser ? 'left' : 'right'}>
                <span className="cursor-default">{formatRelativeTime(message.timestamp)}</span>
              </Tooltip>
            )}
            
            {message.edited && (
              <span>• Edited</span>
            )}

            {!isUser && message.tokens !== undefined && message.tokens > 0 && globalSettings.showTokenCount && (
              <>
                <span>•</span>
                <span className="font-mono">~{message.tokens} tokens</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
