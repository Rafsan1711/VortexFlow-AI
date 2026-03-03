import React, { useState, useEffect, useRef } from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import { useEditor } from '../../hooks/useEditor';
import { X, Trash2, Play, Terminal, AlertCircle } from 'lucide-react';

export function OutputPanel() {
  const { isOutputOpen, outputTab, setOutputTab, toggleOutput } = useEditorStore();
  const { activeProject } = useEditor();
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleRun = () => {
      if (!activeProject) return;
      
      const htmlFile = Object.values(activeProject.files).find(f => f.language === 'html');
      const cssFile = Object.values(activeProject.files).find(f => f.language === 'css');
      const jsFile = Object.values(activeProject.files).find(f => f.language === 'javascript');
      
      let htmlContent = htmlFile?.content || '';
      let cssContent = cssFile?.content || '';
      let jsContent = jsFile?.content || '';
      
      // Inject CSS and JS into HTML
      if (htmlContent && (cssContent || jsContent)) {
        const styleTag = `<style>${cssContent}</style>`;
        const scriptTag = `<script>
          // Intercept console.log
          const originalLog = console.log;
          console.log = function(...args) {
            window.parent.postMessage({ type: 'CONSOLE_LOG', payload: args.join(' ') }, '*');
            originalLog.apply(console, args);
          };
          
          try {
            ${jsContent}
          } catch (e) {
            console.error(e);
            window.parent.postMessage({ type: 'CONSOLE_ERROR', payload: e.toString() }, '*');
          }
        </script>`;
        
        htmlContent = htmlContent.replace('</head>', `${styleTag}</head>`);
        htmlContent = htmlContent.replace('</body>', `${scriptTag}</body>`);
      } else if (jsContent && !htmlContent) {
        // Just run JS
        htmlContent = `<!DOCTYPE html><html><body><script>
          const originalLog = console.log;
          console.log = function(...args) {
            window.parent.postMessage({ type: 'CONSOLE_LOG', payload: args.join(' ') }, '*');
            originalLog.apply(console, args);
          };
          try {
            ${jsContent}
          } catch (e) {
            console.error(e);
            window.parent.postMessage({ type: 'CONSOLE_ERROR', payload: e.toString() }, '*');
          }
        </script></body></html>`;
      }
      
      if (iframeRef.current) {
        iframeRef.current.srcdoc = htmlContent;
      }
    };

    window.addEventListener('editor:run', handleRun);
    return () => window.removeEventListener('editor:run', handleRun);
  }, [activeProject]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'CONSOLE_LOG') {
        setConsoleLogs(prev => [...prev, `> ${event.data.payload}`]);
      } else if (event.data?.type === 'CONSOLE_ERROR') {
        setConsoleLogs(prev => [...prev, `[Error] ${event.data.payload}`]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (!isOutputOpen) return null;

  return (
    <div className="h-[200px] bg-[#0D0D14] border-t border-white/10 flex flex-col select-none">
      <div className="flex items-center justify-between px-4 h-9 border-b border-white/5">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setOutputTab('output')}
            className={`text-xs font-medium tracking-wide uppercase transition-colors ${
              outputTab === 'output' ? 'text-[#00D4FF]' : 'text-[#5C5C7A] hover:text-[#9898B8]'
            }`}
          >
            Output
          </button>
          <button 
            onClick={() => setOutputTab('console')}
            className={`text-xs font-medium tracking-wide uppercase transition-colors ${
              outputTab === 'console' ? 'text-[#00D4FF]' : 'text-[#5C5C7A] hover:text-[#9898B8]'
            }`}
          >
            Console
          </button>
          <button 
            onClick={() => setOutputTab('problems')}
            className={`text-xs font-medium tracking-wide uppercase transition-colors ${
              outputTab === 'problems' ? 'text-[#00D4FF]' : 'text-[#5C5C7A] hover:text-[#9898B8]'
            }`}
          >
            Problems
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setConsoleLogs([])}
            className="p-1 rounded text-[#5C5C7A] hover:text-white hover:bg-white/10 transition-colors"
            title="Clear"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={toggleOutput}
            className="p-1 rounded text-[#5C5C7A] hover:text-white hover:bg-white/10 transition-colors"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-[#0A0A14] text-[#F0F0FF] font-mono text-xs p-2">
        {outputTab === 'output' && (
          <iframe 
            ref={iframeRef} 
            className="w-full h-full border-none bg-white" 
            title="Output Sandbox"
            sandbox="allow-scripts allow-same-origin"
          />
        )}
        
        {outputTab === 'console' && (
          <div className="flex flex-col gap-1">
            {consoleLogs.length === 0 ? (
              <span className="text-[#5C5C7A] italic">No console output</span>
            ) : (
              consoleLogs.map((log, i) => (
                <div key={i} className={`${log.startsWith('[Error]') ? 'text-red-400' : 'text-[#00E5A0]'}`}>
                  {log}
                </div>
              ))
            )}
          </div>
        )}
        
        {outputTab === 'problems' && (
          <div className="flex flex-col gap-1 text-[#5C5C7A] italic">
            No problems detected in workspace.
          </div>
        )}
      </div>
    </div>
  );
}
