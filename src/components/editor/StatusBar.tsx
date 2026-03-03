import React, { useState, useEffect } from 'react';
import { GitBranch, AlertTriangle, XCircle, Check } from 'lucide-react';
import { useEditorStore } from '../../store/useEditorStore';
import { useEditor } from '../../hooks/useEditor';

export function StatusBar() {
  const { activeFile } = useEditor();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const handleSave = () => {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    };

    window.addEventListener('editor:saved', handleSave);
    return () => window.removeEventListener('editor:saved', handleSave);
  }, []);

  return (
    <div className="h-[22px] bg-[#0A0A14] border-t border-white/5 flex items-center justify-between px-3 select-none text-[11px] text-[#9898B8]">
      <div className="flex items-center gap-4 h-full">
        <div className="flex items-center gap-1.5 hover:bg-white/10 px-1.5 h-full cursor-pointer transition-colors">
          <GitBranch className="w-3 h-3" />
          <span>main</span>
        </div>
        
        <div className="flex items-center gap-3 hover:bg-white/10 px-1.5 h-full cursor-pointer transition-colors">
          <div className="flex items-center gap-1">
            <XCircle className="w-3 h-3 text-red-400" />
            <span>0</span>
          </div>
          <div className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            <span>0</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 h-full">
        {isSaved && (
          <div className="flex items-center gap-1 text-[#00E5A0]">
            <Check className="w-3 h-3" />
            <span>Saved</span>
          </div>
        )}
        
        {activeFile && (
          <>
            <div className="hover:bg-white/10 px-1.5 h-full flex items-center cursor-pointer transition-colors">
              Ln 1, Col 1
            </div>
            <div className="hover:bg-white/10 px-1.5 h-full flex items-center cursor-pointer transition-colors">
              Spaces: 2
            </div>
            <div className="hover:bg-white/10 px-1.5 h-full flex items-center cursor-pointer transition-colors">
              UTF-8
            </div>
            <div className="hover:bg-white/10 px-1.5 h-full flex items-center cursor-pointer transition-colors">
              LF
            </div>
            <div className="hover:bg-white/10 px-1.5 h-full flex items-center cursor-pointer transition-colors uppercase">
              {activeFile.language}
            </div>
          </>
        )}
        
        <div className="flex items-center gap-1.5 pl-2 border-l border-white/10 h-full">
          <span className="font-semibold bg-gradient-to-r from-[#00D4FF] to-[#00E5A0] bg-clip-text text-transparent">
            VortexFlow AI
          </span>
        </div>
      </div>
    </div>
  );
}
