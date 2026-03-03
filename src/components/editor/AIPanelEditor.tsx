import React, { useState } from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import { useEditor } from '../../hooks/useEditor';
import { Sparkles, X, Send, Code, Bug, Zap, MessageSquare, FileType, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateChatResponse } from '../../lib/gemini';
import { useAppStore } from '../../store/useAppStore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export function AIPanelEditor() {
  const { isAIPanelOpen, toggleAIPanel } = useEditorStore();
  const { activeFile } = useEditor();
  const { user } = useAppStore();
  const [prompt, setPrompt] = useState('');
  const [includeContext, setIncludeContext] = useState(true);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  if (!isAIPanelOpen) return null;

  const handleSubmit = async (e?: React.FormEvent, customPrompt?: string) => {
    e?.preventDefault();
    const textToSubmit = customPrompt || prompt;
    if (!textToSubmit.trim() || isLoading) return;

    const newMessages = [...messages, { role: 'user' as const, content: textToSubmit }];
    setMessages(newMessages);
    setPrompt('');
    setIsLoading(true);

    try {
      let fullPrompt = textToSubmit;
      if (includeContext && activeFile) {
        fullPrompt = `Context: File "${activeFile.name}" (${activeFile.language}):\n\`\`\`${activeFile.language}\n${activeFile.content}\n\`\`\`\n\nUser Question: ${textToSubmit}`;
      }

      const response = await generateChatResponse(newMessages.map(m => ({ role: m.role, content: m.content })), fullPrompt);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error processing your request.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { label: 'Explain', icon: MessageSquare, prompt: 'Explain this code in detail.' },
    { label: 'Find Bugs', icon: Bug, prompt: 'Find any bugs or potential issues in this code.' },
    { label: 'Optimize', icon: Zap, prompt: 'Suggest optimizations for this code.' },
    { label: 'Add Comments', icon: Code, prompt: 'Add clear, descriptive comments to this code.' },
    { label: 'To TypeScript', icon: FileType, prompt: 'Convert this code to TypeScript.' },
    { label: 'Write Tests', icon: CheckCircle, prompt: 'Write unit tests for this code.' },
  ];

  return (
    <div className="w-[320px] h-full bg-[#0D0D14] border-l border-white/5 flex flex-col select-none flex-shrink-0">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2 text-[#00D4FF]">
          <Sparkles className="w-4 h-4" />
          <span className="font-semibold text-sm tracking-wide">AI Assist</span>
        </div>
        <button 
          onClick={toggleAIPanel}
          className="p-1 rounded text-[#5C5C7A] hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.length === 0 ? (
          <div className="text-center text-[#5C5C7A] text-sm mt-4">
            <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50 text-[#00D4FF]" />
            <p>Ask AI about your code, or use a quick action below.</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`text-xs font-medium ${msg.role === 'user' ? 'text-[#00D4FF]' : 'text-[#00E5A0]'}`}>
                {msg.role === 'user' ? 'You' : 'VortexFlow AI'}
              </div>
              <div className={`p-3 rounded-lg text-sm max-w-[90%] ${
                msg.role === 'user' ? 'bg-[#00D4FF]/10 text-[#F0F0FF]' : 'bg-[#1A1A24] text-[#F0F0FF]'
              }`}>
                {msg.role === 'user' ? (
                  msg.content
                ) : (
                  <div className="markdown-body prose prose-invert max-w-none text-sm">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({ node, inline, className, children, ...props }: any) {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline && match ? (
                            <div className="relative mt-2 mb-2 group">
                              <div className="absolute right-2 top-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={() => navigator.clipboard.writeText(String(children).replace(/\n$/, ''))}
                                  className="px-2 py-1 text-xs bg-[#2A2A3A] hover:bg-[#3D3D52] rounded text-white"
                                >
                                  Copy
                                </button>
                                <button 
                                  onClick={() => {
                                    // Dispatch event to insert at cursor
                                    window.dispatchEvent(new CustomEvent('editor:insert', { detail: String(children).replace(/\n$/, '') }));
                                  }}
                                  className="px-2 py-1 text-xs bg-[#00D4FF]/20 hover:bg-[#00D4FF]/40 text-[#00D4FF] rounded"
                                >
                                  Insert
                                </button>
                              </div>
                              <SyntaxHighlighter
                                style={vscDarkPlus as any}
                                language={match[1]}
                                PreTag="div"
                                className="rounded-md !bg-[#0A0A14] !m-0 !p-4 text-xs"
                                {...props}
                              >
                                {String(children).replace(/\n$/, '')}
                              </SyntaxHighlighter>
                            </div>
                          ) : (
                            <code className="bg-white/10 px-1 py-0.5 rounded text-[#00D4FF]" {...props}>
                              {children}
                            </code>
                          );
                        }
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex gap-1 items-center text-[#00E5A0] text-xs font-medium">
            <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }}>●</motion.div>
            <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}>●</motion.div>
            <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}>●</motion.div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-white/5 bg-[#0A0A14]">
        <div className="flex flex-wrap gap-2 mb-3">
          {quickActions.map((action, i) => (
            <button
              key={i}
              onClick={() => handleSubmit(undefined, action.prompt)}
              className="flex items-center gap-1 px-2 py-1 rounded bg-[#1A1A24] hover:bg-white/10 text-xs text-[#9898B8] hover:text-white transition-colors"
            >
              <action.icon className="w-3 h-3" />
              {action.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Ask AI about your code..."
            className="w-full bg-[#1A1A24] border border-white/10 rounded-lg pl-3 pr-10 py-2 text-sm text-[#F0F0FF] placeholder-[#5C5C7A] focus:outline-none focus:border-[#00D4FF]/50 focus:ring-1 focus:ring-[#00D4FF]/50 resize-none h-[80px]"
          />
          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className="absolute right-2 bottom-2 p-1.5 rounded-md bg-[#00D4FF] text-[#0D0D14] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#00E5A0] transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <label className="flex items-center gap-2 mt-3 cursor-pointer group">
          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
            includeContext ? 'bg-[#00D4FF] border-[#00D4FF]' : 'border-[#5C5C7A] group-hover:border-[#9898B8]'
          }`}>
            {includeContext && <CheckCircle className="w-3 h-3 text-[#0D0D14]" />}
          </div>
          <span className="text-xs text-[#9898B8] group-hover:text-white transition-colors">
            Include current file in context
          </span>
          <input 
            type="checkbox" 
            className="hidden" 
            checked={includeContext} 
            onChange={(e) => setIncludeContext(e.target.checked)} 
          />
        </label>
      </div>
    </div>
  );
}
