import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useAppStore } from '../../store/useAppStore';
import { PLUGINS } from '../../lib/plugins';
import IframePlugin from './IframePlugin';
import { generateCowsay, ASCII_ANIMATIONS } from '../../lib/asciiAnimations';

const Terminal = () => {
  const { 
    terminalLines, 
    addTerminalLine, 
    clearTerminal, 
    closeTerminal, 
    user,
    setOpenModal,
    activePlugin,
    setActivePlugin,
    pendingPlugin,
    setPendingPlugin
  } = useAppStore();

  const [input, setInput] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [loadingPlugin, setLoadingPlugin] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  // Animation state
  const [activeAnim, setActiveAnim] = useState<string | null>(null);
  const [animFrame, setAnimFrame] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pendingPlugin) {
      launchPlugin(pendingPlugin);
      setPendingPlugin(null);
    }
  }, [pendingPlugin, setPendingPlugin]);

  const initialized = useRef(false);

  // Initial welcome message
  useEffect(() => {
    if (terminalLines.length === 0 && !initialized.current) {
      initialized.current = true;
      const welcomeLines = [
        "# Welcome to VortexFlow Terminal",
        "# Type 'help' to see all available commands.",
        "# Launch plugins with game/tool commands.",
        "# Visit /docs/terminal for the full command reference.",
        "# ",
        "# Quick start:",
        "#   help          — list all commands",
        "#   clear         — clear terminal output",
        "#   plugins       — open Plugin Store",
        "#   exit          — close terminal"
      ];
      
      welcomeLines.forEach(content => {
        addTerminalLine({ type: 'comment', content });
      });
    }
  }, [terminalLines.length, addTerminalLine]);

  // Auto-scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLines, activeAnim, animFrame]);

  // Keep focus on input
  useEffect(() => {
    if (!activePlugin && !activeAnim) {
      inputRef.current?.focus();
    }
  }, [activePlugin, activeAnim]);

  // Handle ASCII Animations
  useEffect(() => {
    if (!activeAnim) return;
    const frames = ASCII_ANIMATIONS[activeAnim];
    if (!frames) return;

    let frameIdx = 0;
    let loops = 0;
    const maxLoops = activeAnim === 'loading' ? 3 : 10; // Shorter for loading

    const interval = setInterval(() => {
      frameIdx = (frameIdx + 1) % frames.length;
      setAnimFrame(frameIdx);
      if (frameIdx === 0) loops++;
      
      if (loops >= maxLoops) {
        clearInterval(interval);
        setActiveAnim(null);
        addTerminalLine({ type: 'system', content: `> Animation '${activeAnim}' finished.` });
      }
    }, 200);

    return () => clearInterval(interval);
  }, [activeAnim, addTerminalLine]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    // Add to history
    addTerminalLine({ type: 'input', content: trimmed });
    
    const newHistory = [trimmed, ...commandHistory].slice(0, 50);
    setCommandHistory(newHistory);
    setHistoryIndex(-1);

    const args = trimmed.split(' ');
    const baseCmd = args[0].toLowerCase();

    // Check for ASCII animation command ($%name%)
    if (trimmed.startsWith('$%') && trimmed.endsWith('%')) {
      const animName = trimmed.slice(2, -1).toLowerCase();
      if (ASCII_ANIMATIONS[animName]) {
        setActiveAnim(animName);
        setAnimFrame(0);
      } else {
        addTerminalLine({ type: 'error', content: `Animation '${animName}' not found. Try: $%dance%, $%nyan%, $%wave%, $%loading%, $%helicopter%` });
      }
      return;
    }

    // Check for plugin commands
    const plugin = PLUGINS.find(p => p.command === baseCmd);
    if (plugin) {
      launchPlugin(plugin);
      return;
    }

    // Built-in commands
    switch (baseCmd) {
      case 'help':
        addTerminalLine({ type: 'output', content: 'Available commands:' });
        addTerminalLine({ type: 'output', content: '  help          - Print all commands with descriptions' });
        addTerminalLine({ type: 'output', content: '  clear         - Clear terminal output' });
        addTerminalLine({ type: 'output', content: '  exit          - Close terminal, return to chat' });
        addTerminalLine({ type: 'output', content: '  plugins       - Open Plugin Store' });
        addTerminalLine({ type: 'output', content: '  version       - Print "VortexFlow AI v1.0.0"' });
        addTerminalLine({ type: 'output', content: '  whoami        - Print logged-in user info' });
        addTerminalLine({ type: 'output', content: '  date          - Print current date/time' });
        addTerminalLine({ type: 'output', content: '  echo <text>   - Print back the text' });
        addTerminalLine({ type: 'output', content: '  cowsay <text> - A talking cow says your text' });
        addTerminalLine({ type: 'output', content: '  $%name%       - Play ASCII animation (e.g. $%dance%, $%nyan%)' });
        addTerminalLine({ type: 'output', content: '  history       - Show last 20 typed commands' });
        break;
      case 'clear':
        clearTerminal();
        break;
      case 'exit':
        closeTerminal();
        break;
      case 'plugins':
        setOpenModal('plugins');
        break;
      case 'version':
        addTerminalLine({ type: 'output', content: 'VortexFlow AI v1.0.0' });
        break;
      case 'whoami':
        addTerminalLine({ type: 'output', content: user ? `${user.displayName || 'User'} (${user.email || 'No email'})` : 'guest' });
        break;
      case 'date':
        addTerminalLine({ type: 'output', content: new Date().toString() });
        break;
      case 'echo':
        addTerminalLine({ type: 'output', content: args.slice(1).join(' ') });
        break;
      case 'cowsay':
        const text = args.slice(1).join(' ') || 'Moo!';
        addTerminalLine({ type: 'output', content: generateCowsay(text) });
        break;
      case 'history':
        const histToShow = commandHistory.slice(0, 20).reverse();
        histToShow.forEach((h, i) => {
          addTerminalLine({ type: 'output', content: `  ${i + 1}  ${h}` });
        });
        break;
      default:
        addTerminalLine({ type: 'error', content: `bash: ${baseCmd}: command not found` });
    }
  };

  const launchPlugin = (plugin: typeof PLUGINS[0]) => {
    setLoadingPlugin(true);
    setLoadingProgress(0);
    addTerminalLine({ type: 'system', content: `> Launching ${plugin.name}...` });
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setLoadingProgress(progress);
      
      const filled = Math.floor(progress / 10);
      const empty = 10 - filled;
      const bar = '█'.repeat(filled) + '░'.repeat(empty);
      
      // We don't want to spam lines, so we just update progress state
      // and show the final message when done
      
      if (progress >= 100) {
        clearInterval(interval);
        addTerminalLine({ type: 'system', content: `> Loading plugin... [${bar}] 100%` });
        addTerminalLine({ type: 'system', content: `> Plugin ready. Press [ESC] or type 'back' to return to terminal.` });
        setLoadingPlugin(false);
        setActivePlugin(plugin);
      }
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const nextIndex = historyIndex + 1;
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const prevIndex = historyIndex - 1;
        setHistoryIndex(prevIndex);
        setInput(commandHistory[prevIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Simple autocomplete
      const commands = ['help', 'clear', 'exit', 'plugins', 'version', 'whoami', 'date', 'echo', 'history', ...PLUGINS.map(p => p.command)];
      const match = commands.find(c => c.startsWith(input.toLowerCase()));
      if (match) {
        setInput(match);
      }
    }
  };

  // Global ESC handler for plugin
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activePlugin) {
        setActivePlugin(null);
        addTerminalLine({ type: 'system', content: '> Plugin closed. Welcome back.' });
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [activePlugin, setActivePlugin, addTerminalLine]);

  if (activePlugin) {
    return (
      <div className={`w-full h-full bg-[#0D0D0D] ${activePlugin.fullscreen ? 'fixed inset-0 z-[100]' : 'relative'}`}>
        <IframePlugin 
          url={activePlugin.url} 
          pluginName={activePlugin.name} 
          onBack={() => {
            setActivePlugin(null);
            addTerminalLine({ type: 'system', content: '> Plugin closed. Welcome back.' });
          }} 
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full bg-[#0D0D0D] font-mono text-sm overflow-hidden z-40 relative">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#111118] border-b border-[#2A2A3A] shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56] cursor-pointer hover:bg-[#FF4D6A] transition-colors" onClick={closeTerminal} />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
          <span className="ml-4 text-[#9898B8] text-xs font-sans font-medium">VortexFlow Terminal v1.0</span>
        </div>
        <button 
          onClick={closeTerminal}
          className="text-[#9898B8] hover:text-[#F0F0FF] text-xs font-sans flex items-center gap-2 transition-colors"
        >
          <FontAwesomeIcon icon={faTimes} />
          Exit Terminal
        </button>
      </div>

      {/* Output Area */}
      <div 
        className="flex-1 overflow-y-auto p-4 custom-scrollbar"
        onClick={() => inputRef.current?.focus()}
      >
        {terminalLines.map((line) => (
          <div key={line.id} className="mb-1 break-words">
            {line.type === 'input' && (
              <div className="flex">
                <span className="text-[#00D4FF] mr-2 shrink-0">vortex@flow:~$</span>
                <span className="text-[#F0F0FF]">{line.content}</span>
              </div>
            )}
            {line.type === 'output' && <div className="text-[#00E5A0] whitespace-pre-wrap">{line.content}</div>}
            {line.type === 'error' && <div className="text-[#FF4D6A]">{line.content}</div>}
            {line.type === 'success' && <div className="text-[#00E5A0]">{line.content}</div>}
            {line.type === 'comment' && <div className="text-[#5C5C7A]">{line.content}</div>}
            {line.type === 'system' && <div className="text-[#9898B8] italic">{line.content}</div>}
          </div>
        ))}
        
        {loadingPlugin && (
          <div className="text-[#9898B8] italic mb-1">
            {`> Loading plugin... [${'█'.repeat(Math.floor(loadingProgress / 10))}${'░'.repeat(10 - Math.floor(loadingProgress / 10))}] ${loadingProgress}%`}
          </div>
        )}

        {activeAnim && ASCII_ANIMATIONS[activeAnim] && (
          <div className="text-[#00E5A0] whitespace-pre-wrap mb-1">
            {ASCII_ANIMATIONS[activeAnim][animFrame]}
          </div>
        )}
        
        <div ref={endRef} />
      </div>

      {/* Input Area */}
      <div className="flex items-center px-4 pb-4 pt-2 shrink-0">
        <span className="text-[#00D4FF] mr-2 shrink-0">vortex@flow:~$</span>
        <div className="relative flex-1 flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!!activeAnim}
            className="w-full bg-transparent text-[#F0F0FF] outline-none border-none font-mono disabled:opacity-50"
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
          {/* Blinking cursor effect is handled natively by the input, but we can style it if needed */}
        </div>
      </div>
    </div>
  );
};

export default Terminal;
