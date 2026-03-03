import React, { useEffect, useState } from 'react';
import { EditorNavbar } from '../components/editor/EditorNavbar';
import { FileExplorer } from '../components/editor/FileExplorer';
import { MonacoEditorPanel } from '../components/editor/MonacoEditorPanel';
import { OutputPanel } from '../components/editor/OutputPanel';
import { AIPanelEditor } from '../components/editor/AIPanelEditor';
import { StatusBar } from '../components/editor/StatusBar';
import { CommandPalette } from '../components/editor/CommandPalette';
import { GitHubConnectBanner } from '../components/editor/GitHubConnectBanner';
import { useEditorStore } from '../store/useEditorStore';
import { useEditor } from '../hooks/useEditor';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderPlus } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { useGitHubAuth } from '../hooks/useGitHubAuth';

export default function EditorPage() {
  const { isExplorerOpen, isAIPanelOpen, isOutputOpen, toggleExplorer, toggleOutput, activeProjectId, projects } = useEditorStore();
  const { createNewFile, createNewProject } = useEditor();
  const { connectGitHub, isConnected } = useGitHubAuth();
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        toggleExplorer();
      } else if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        toggleOutput();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleExplorer, toggleOutput]);

  useEffect(() => {
    const handleNewFile = (e: CustomEvent) => {
      if (activeProjectId && e.detail) {
        createNewFile(activeProjectId, e.detail);
      }
    };

    window.addEventListener('editor:new-file', handleNewFile as EventListener);
    return () => window.removeEventListener('editor:new-file', handleNewFile as EventListener);
  }, [activeProjectId, createNewFile]);

  // If no projects exist (and we've loaded), show welcome screen
  // We can check if projects is empty. But wait, we might be loading.
  // For now, let's assume if projects is empty object, we show welcome.
  // But default project is usually there.
  // If the user deleted all projects, or it's a fresh load and we haven't synced yet...
  // The useEditor hook syncs projects.
  
  const hasProjects = Object.keys(projects).length > 0;

  if (!hasProjects) {
      return (
        <div className="h-screen w-full bg-[#0D0D14] flex flex-col items-center justify-center text-[#F0F0FF] p-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-[#1A1A24] border border-[#2A2A3A] rounded-xl p-8 text-center shadow-2xl"
            >
                <h1 className="text-2xl font-bold mb-2">Welcome to VortexFlow</h1>
                <p className="text-[#9898B8] mb-8">Create your first project to start coding.</p>
                
                <div className="space-y-3">
                    <button 
                        onClick={() => createNewProject('My First Project', 'Created with VortexFlow', 'javascript')}
                        className="w-full py-3 bg-[#00D4FF] hover:bg-[#00B8E6] text-[#0A0A0F] font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <FontAwesomeIcon icon={faFolderPlus} />
                        Start a New Project
                    </button>
                    
                    {!isConnected && (
                        <button 
                            onClick={() => connectGitHub()}
                            className="w-full py-3 bg-[#24292F] hover:bg-[#2c333a] text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <FontAwesomeIcon icon={faGithub} />
                            Import from GitHub
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
      );
  }

  return (
    <div className="h-screen w-full bg-[#0D0D14] flex flex-col overflow-hidden text-[#F0F0FF]">
      <EditorNavbar />
      <GitHubConnectBanner />
      
      <div className="flex-1 flex overflow-hidden relative">
        {isExplorerOpen && <FileExplorer />}
        
        <div className="flex-1 flex flex-col min-w-0">
          <MonacoEditorPanel />
          {isOutputOpen && <OutputPanel />}
        </div>
        
        {isAIPanelOpen && <AIPanelEditor />}
      </div>
      
      <StatusBar />
      <CommandPalette />
    </div>
  );
}
