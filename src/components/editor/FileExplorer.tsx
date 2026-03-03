import React, { useState } from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import { useEditor } from '../../hooks/useEditor';
import { Folder, FileText, FileCode, FileJson, FileType2, ChevronRight, ChevronDown, Plus, FolderPlus, MoreVertical, File } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const getFileIcon = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'js':
    case 'ts':
      return <FileCode className="w-4 h-4 text-yellow-400" />;
    case 'jsx':
    case 'tsx':
      return <FileType2 className="w-4 h-4 text-cyan-400" />;
    case 'html':
      return <FileCode className="w-4 h-4 text-orange-500" />;
    case 'css':
      return <FileText className="w-4 h-4 text-blue-400" />;
    case 'json':
      return <FileJson className="w-4 h-4 text-green-400" />;
    case 'md':
      return <FileText className="w-4 h-4 text-white" />;
    case 'py':
      return <FileCode className="w-4 h-4 text-blue-500" />;
    default:
      return <File className="w-4 h-4 text-gray-400" />;
  }
};

export function FileExplorer() {
  const { isExplorerOpen, activeProjectId, projects, openTab, activeTabId, tabs } = useEditorStore();
  const { createNewFile, deleteFile, renameFile } = useEditor();
  const [isExpanded, setIsExpanded] = useState(true);
  
  const activeProject = activeProjectId ? projects[activeProjectId] : null;
  const files = activeProject ? Object.values(activeProject.files) : [];
  
  const activeFileId = activeTabId ? tabs.find(t => t.id === activeTabId)?.fileId : null;

  if (!isExplorerOpen) return null;

  const handleNewFile = () => {
    if (activeProjectId) {
      const name = prompt('Enter file name:');
      if (name) {
        createNewFile(activeProjectId, name);
      }
    }
  };

  return (
    <div className="w-[180px] h-full bg-[#0D0D14] border-r border-white/5 flex flex-col select-none flex-shrink-0">
      <div className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-[#5C5C7A] tracking-wider uppercase">
        <span>Explorer</span>
        <div className="flex items-center gap-1">
          <button onClick={handleNewFile} className="p-0.5 hover:bg-white/10 rounded text-[#9898B8] hover:text-white transition-colors" title="New File">
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button className="p-0.5 hover:bg-white/10 rounded text-[#9898B8] hover:text-white transition-colors" title="New Folder">
            <FolderPlus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-1">
        {activeProject && (
          <div>
            <div 
              className="flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-white/5 text-[#F0F0FF] text-sm font-medium"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronDown className="w-4 h-4 text-[#5C5C7A]" /> : <ChevronRight className="w-4 h-4 text-[#5C5C7A]" />}
              <Folder className="w-4 h-4 text-[#00D4FF]" />
              <span className="truncate">{activeProject.name}</span>
            </div>
            
            <AnimatePresence>
              {isExpanded && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  {files.map(file => {
                    const isActive = file.id === activeFileId;
                    return (
                      <div 
                        key={file.id}
                        onClick={() => openTab(file.id)}
                        className={`flex items-center justify-between pl-8 pr-2 py-1 cursor-pointer text-sm group ${
                          isActive ? 'bg-[#00D4FF]/10 text-[#00D4FF]' : 'text-[#9898B8] hover:bg-white/5 hover:text-[#F0F0FF]'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {getFileIcon(file.name)}
                          <span className="truncate">{file.name}</span>
                        </div>
                        
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {file.isUnsaved && <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF]" />}
                          <button 
                            className="p-0.5 hover:bg-white/10 rounded text-[#5C5C7A] hover:text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Delete ${file.name}?`)) {
                                deleteFile(activeProjectId, file.id);
                              }
                            }}
                          >
                            <MoreVertical className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
