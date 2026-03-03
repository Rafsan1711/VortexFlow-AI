import React, { useState } from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import { Code, Play, Sparkles, Settings, X, MessageSquare, ChevronDown, Cloud, CloudOff, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faCodeBranch, faCloudUploadAlt, faLink, faUnlink, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { useGitHubAuth } from '../../hooks/useGitHubAuth';
import { RepoPickerModal } from './RepoPickerModal';
import { CommitModal } from './CommitModal';
import { ProjectsModal } from './ProjectsModal';
import { useEditor } from '../../hooks/useEditor';
import { getFileContent } from '../../lib/github';

export function EditorNavbar() {
  const { 
    tabs, activeTabId, closeTab, setActiveTab, toggleAIPanel, toggleOutput, setOutputTab, 
    projects, activeProjectId, saveStatus, githubUser, updateProjectMetadata 
  } = useEditorStore();
  const { connectGitHub, disconnectGitHub } = useGitHubAuth();
  const { createNewFile, activeFile } = useEditor();
  const navigate = useNavigate();

  const [showRepoPicker, setShowRepoPicker] = useState(false);
  const [showCommitModal, setShowCommitModal] = useState(false);
  const [showProjectsModal, setShowProjectsModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const activeProject = activeProjectId ? projects[activeProjectId] : null;

  const handleRun = () => {
    toggleOutput();
    setOutputTab('output');
    window.dispatchEvent(new CustomEvent('editor:run'));
  };

  const handleSendToChat = () => {
    if (activeFile) {
      navigate('/', { state: { codeToChat: activeFile.content, language: activeFile.language } });
    }
  };

  const handleImportRepo = async (repo: any, files: string[]) => {
    if (!githubUser?.token || !activeProjectId) return;
    
    setIsImporting(true);
    try {
      // Update project metadata to link the repo
      updateProjectMetadata(activeProjectId, {
        githubRepo: repo.full_name,
        githubBranch: repo.default_branch
      });

      // Import files
      for (const path of files) {
        try {
          const content = await getFileContent(githubUser.token, repo.owner.login, repo.name, path);
          const name = path.split('/').pop() || path;
          createNewFile(activeProjectId, name, content, undefined, path);
        } catch (error) {
          console.error(`Failed to import ${path}:`, error);
        }
      }
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <>
      <div className="h-11 bg-[#0D0D14] border-b border-white/10 flex items-center justify-between px-4 select-none z-20 relative">
        <div className="flex items-center gap-4">
          <div 
            className="flex items-center gap-2 text-[#F0F0FF] cursor-pointer hover:text-white transition-colors relative"
            onClick={() => setShowProjectsModal(true)}
          >
            <Code className="w-5 h-5 text-[#00D4FF]" />
            <span className="font-semibold text-sm tracking-wide">
              {activeProject ? activeProject.name : 'Code Editor'}
            </span>
            <ChevronDown className="w-3 h-3 opacity-50" />
          </div>
          
          <div className="flex items-center h-full overflow-x-auto no-scrollbar max-w-[400px]">
            {tabs.map(tab => {
              const file = activeProject?.files[tab.fileId];
              if (!file) return null;
              const isActive = tab.id === activeTabId;
              
              return (
                <div 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 h-11 border-r border-white/5 cursor-pointer transition-colors min-w-fit ${
                    isActive ? 'bg-[#1A1A24] text-[#F0F0FF]' : 'bg-transparent text-[#5C5C7A] hover:bg-white/5'
                  }`}
                >
                  <span className="text-xs">{file.name}</span>
                  {file.isUnsaved && <span className="w-2 h-2 rounded-full bg-[#00D4FF]" />}
                  <button 
                    onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}
                    className="p-0.5 rounded hover:bg-white/10 text-[#5C5C7A] hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Save Status */}
          <div className="flex items-center gap-1.5 text-xs mr-2">
            {isImporting && (
              <>
                <RefreshCw className="w-3 h-3 animate-spin text-[#00D4FF]" />
                <span className="text-[#00D4FF]">Importing...</span>
              </>
            )}
            {!isImporting && saveStatus === 'saving' && (
              <>
                <RefreshCw className="w-3 h-3 animate-spin text-amber-500" />
                <span className="text-amber-500">Saving...</span>
              </>
            )}
            {!isImporting && saveStatus === 'saved' && (
              <>
                <Cloud className="w-3 h-3 text-[#00E5A0]" />
                <span className="text-[#00E5A0] opacity-80">Saved</span>
              </>
            )}
            {!isImporting && saveStatus === 'error' && (
              <>
                <CloudOff className="w-3 h-3 text-red-500" />
                <span className="text-red-500">Save Failed</span>
              </>
            )}
          </div>

          {/* GitHub Section */}
          <div className="h-4 w-px bg-white/10 mx-1" />
          
          {!githubUser ? (
            <button 
              onClick={() => connectGitHub()}
              className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/10 text-[#5C5C7A] hover:text-white transition-colors text-xs"
            >
              <FontAwesomeIcon icon={faGithub} />
              <span>Connect GitHub</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 relative">
              {activeProject?.githubRepo ? (
                <button 
                  onClick={() => setShowCommitModal(true)}
                  className="flex items-center gap-1.5 px-2 py-1 rounded bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition-colors text-xs font-medium"
                >
                  <FontAwesomeIcon icon={faCloudUploadAlt} />
                  Push
                </button>
              ) : (
                <button 
                  onClick={() => setShowRepoPicker(true)}
                  className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/10 text-[#5C5C7A] hover:text-white transition-colors text-xs"
                >
                  <FontAwesomeIcon icon={faLink} />
                  Link Repo
                </button>
              )}

              <div 
                className="relative"
                onMouseEnter={() => setShowUserMenu(true)}
                onMouseLeave={() => setShowUserMenu(false)}
              >
                <img 
                  src={githubUser.avatarUrl} 
                  alt={githubUser.login} 
                  className="w-6 h-6 rounded-full border border-white/10 cursor-pointer"
                />
                
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-[#1A1A24] border border-[#2A2A3A] rounded-lg shadow-xl py-1 z-50">
                    <div className="px-3 py-2 border-b border-[#2A2A3A]">
                      <p className="text-xs text-[#9898B8]">Connected as</p>
                      <p className="text-sm font-medium text-[#F0F0FF] truncate">@{githubUser.login}</p>
                    </div>
                    <button 
                      onClick={() => { setShowRepoPicker(true); setShowUserMenu(false); }}
                      className="w-full text-left px-3 py-2 text-xs text-[#F0F0FF] hover:bg-white/5 flex items-center gap-2"
                    >
                      <FontAwesomeIcon icon={faCodeBranch} className="text-[#5C5C7A]" />
                      Change Repository
                    </button>
                    <button 
                      onClick={() => { disconnectGitHub(); setShowUserMenu(false); }}
                      className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-white/5 flex items-center gap-2"
                    >
                      <FontAwesomeIcon icon={faUnlink} />
                      Disconnect GitHub
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="h-4 w-px bg-white/10 mx-1" />

          {activeFile && (
            <div className="flex items-center gap-1 px-2 py-1 rounded bg-[#1A1A24] text-xs text-[#9898B8] cursor-pointer hover:bg-white/10">
              {activeFile.language}
              <ChevronDown className="w-3 h-3" />
            </div>
          )}
          
          <button 
            onClick={handleRun}
            className="flex items-center gap-1 px-3 py-1.5 rounded bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition-colors text-xs font-medium"
          >
            <Play className="w-3.5 h-3.5" />
            Run
          </button>
          
          <button 
            onClick={toggleAIPanel}
            className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#00D4FF]/10 text-[#00D4FF] hover:bg-[#00D4FF]/20 transition-colors text-xs font-medium"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Assist
          </button>

          <div className="w-px h-4 bg-white/10 mx-1" />

          <button 
            onClick={handleSendToChat}
            className="p-1.5 rounded text-[#5C5C7A] hover:text-white hover:bg-white/10 transition-colors"
            title="Send to Chat"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          <button className="p-1.5 rounded text-[#5C5C7A] hover:text-white hover:bg-white/10 transition-colors">
            <Settings className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => navigate('/')}
            className="p-1.5 rounded text-[#5C5C7A] hover:text-white hover:bg-white/10 transition-colors"
            title="Close Editor"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <RepoPickerModal 
        isOpen={showRepoPicker} 
        onClose={() => setShowRepoPicker(false)}
        onImport={handleImportRepo}
        onCreate={(repo) => {
          if (activeProjectId) {
            updateProjectMetadata(activeProjectId, {
              githubRepo: repo.full_name,
              githubBranch: repo.default_branch
            });
          }
        }}
      />
      
      <CommitModal 
        isOpen={showCommitModal} 
        onClose={() => setShowCommitModal(false)} 
      />

      <ProjectsModal
        isOpen={showProjectsModal}
        onClose={() => setShowProjectsModal(false)}
      />
    </>
  );
}
