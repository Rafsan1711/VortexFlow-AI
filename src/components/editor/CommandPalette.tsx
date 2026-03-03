import React, { useState, useEffect, useRef } from 'react';
import { Search, FileText, Save, Play, Sparkles, MessageSquare, Settings, X } from 'lucide-react';
import { useEditorStore } from '../../store/useEditorStore';
import { useEditor } from '../../hooks/useEditor';
import { useNavigate } from 'react-router-dom';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toggleAIPanel, toggleOutput, setOutputTab } = useEditorStore();
  const { activeProjectId, activeFile } = useEditor();
  const navigate = useNavigate();

  const commands = [
    { id: 'new-file', title: 'New File', icon: FileText, action: () => {
      if (activeProjectId) {
        const name = prompt('Enter file name:');
        if (name) {
          // Trigger new file creation via custom event
          window.dispatchEvent(new CustomEvent('editor:new-file', { detail: name }));
        }
      }
    }},
    { id: 'save', title: 'Save', icon: Save, action: () => {
      if (activeFile && activeProjectId) {
        window.dispatchEvent(new CustomEvent('editor:saved'));
      }
    }},
    { id: 'run', title: 'Run Code', icon: Play, action: () => {
      toggleOutput();
      setOutputTab('output');
      window.dispatchEvent(new CustomEvent('editor:run'));
    }},
    { id: 'ai-panel', title: 'Toggle AI Panel', icon: Sparkles, action: toggleAIPanel },
    { id: 'chat', title: 'Return to Chat', icon: MessageSquare, action: () => navigate('/') },
    { id: 'settings', title: 'Open Settings', icon: Settings, action: () => alert('Settings not implemented yet') },
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.title.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setIsOpen(true);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
        setIsOpen(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm">
      <div 
        className="w-full max-w-lg bg-[#1A1A24] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 border-b border-white/5">
          <Search className="w-5 h-5 text-[#5C5C7A]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent border-none outline-none px-3 text-[#F0F0FF] placeholder-[#5C5C7A]"
          />
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 rounded text-[#5C5C7A] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[300px] overflow-y-auto py-2">
          {filteredCommands.length === 0 ? (
            <div className="px-4 py-3 text-sm text-[#5C5C7A] text-center">
              No commands found
            </div>
          ) : (
            filteredCommands.map((cmd, index) => (
              <div
                key={cmd.id}
                onClick={() => {
                  cmd.action();
                  setIsOpen(false);
                }}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`flex items-center gap-3 px-4 py-2 cursor-pointer text-sm transition-colors ${
                  index === selectedIndex 
                    ? 'bg-[#00D4FF]/10 text-[#00D4FF]' 
                    : 'text-[#9898B8] hover:bg-white/5 hover:text-white'
                }`}
              >
                <cmd.icon className="w-4 h-4" />
                <span>{cmd.title}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
