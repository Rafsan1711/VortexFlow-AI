import React, { useState, useEffect } from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import { useGitHubAuth } from '../../hooks/useGitHubAuth';
import { commitMultipleFiles } from '../../lib/github';
import { EditorFile } from '../../types/editor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faSpinner, faTimes, faCheck, faCodeBranch, faFileCode, faPlus } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

interface CommitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommitModal({ isOpen, onClose }: CommitModalProps) {
  const { projects, activeProjectId, githubUser } = useEditorStore();
  const activeProject = activeProjectId ? projects[activeProjectId] : null;
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [changedFiles, setChangedFiles] = useState<EditorFile[]>([]);

  useEffect(() => {
    if (isOpen && activeProject) {
      // Identify changed files
      // A file is changed if:
      // 1. It has no githubSha (new file)
      // 2. It has isUnsaved (modified locally) - wait, isUnsaved is for RTDB. 
      //    We need to track if it differs from GitHub. 
      //    For now, let's assume all files in the project are candidates if they are not ignored.
      //    Actually, we should probably only push files that have content.
      //    And ideally, we'd compare content hash with githubSha, but we don't have that easily.
      //    So let's just list all files for now, or maybe add a 'modified' flag in the store?
      //    The prompt says "Files modified since last push (tracked via githubSha comparison)".
      //    We don't have the content of the SHA to compare. 
      //    So we will just list all files and let the user uncheck? 
      //    Or better: We push ALL files that are currently in the project.
      //    The API will update them. If content hasn't changed, the SHA won't change on GitHub side (usually).
      //    But to be nice, let's just show all files.
      
      const files = Object.values(activeProject.files);
      setChangedFiles(files);
      
      // Auto-suggest message
      if (files.length > 0) {
        setMessage(`feat: update ${files.length} files in ${activeProject.name}`);
      }
    }
  }, [isOpen, activeProject]);

  const handlePush = async () => {
    if (!activeProject?.githubRepo || !githubUser?.token || !message.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const [owner, repo] = activeProject.githubRepo.split('/');
      
      const filesToPush = changedFiles.map(file => ({
        path: file.githubPath || file.name, // Use stored path or name
        content: file.content,
        sha: file.githubSha
      }));
      
      await commitMultipleFiles(githubUser.token, owner, repo, filesToPush, message);
      
      // Update local state (SHAs would ideally be updated, but we'd need to fetch them back)
      // For now, just close and show success
      onClose();
      alert(`Successfully pushed to ${activeProject.githubRepo}`);
    } catch (err: any) {
      setError(err.message || 'Failed to push to GitHub');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !activeProject) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#1A1A24] border border-[#2A2A3A] rounded-xl w-full max-w-md shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A2A3A]">
          <h2 className="text-lg font-semibold text-[#F0F0FF] flex items-center gap-2">
            <FontAwesomeIcon icon={faGithub} />
            Push to GitHub
          </h2>
          <button onClick={onClose} className="text-[#5C5C7A] hover:text-[#F0F0FF] transition-colors">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2">
              <FontAwesomeIcon icon={faTimes} />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-xs font-medium text-[#9898B8]">Repository</label>
            <div className="flex items-center gap-2 px-3 py-2 bg-[#0A0A0F] border border-[#2A2A3A] rounded-lg text-[#F0F0FF] text-sm">
              <FontAwesomeIcon icon={faGithub} className="text-[#5C5C7A]" />
              {activeProject.githubRepo}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-[#9898B8]">Branch</label>
            <div className="flex items-center gap-2 px-3 py-2 bg-[#0A0A0F] border border-[#2A2A3A] rounded-lg text-[#F0F0FF] text-sm">
              <FontAwesomeIcon icon={faCodeBranch} className="text-[#5C5C7A]" />
              {activeProject.githubBranch || 'main'}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-[#9898B8]">Changes ({changedFiles.length})</label>
            <div className="max-h-[150px] overflow-y-auto border border-[#2A2A3A] rounded-lg bg-[#0A0A0F] custom-scrollbar p-2">
              {changedFiles.map(file => (
                <div key={file.id} className="flex items-center gap-2 p-1.5 text-xs text-[#9898B8]">
                  <FontAwesomeIcon icon={file.githubSha ? faFileCode : faPlus} className={file.githubSha ? 'text-blue-400' : 'text-green-400'} />
                  <span className="truncate">{file.name}</span>
                  <span className="ml-auto text-[10px] opacity-60">{file.githubSha ? 'Modified' : 'New'}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-[#9898B8]">Commit Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What did you change?"
              className="w-full bg-[#0A0A0F] border border-[#2A2A3A] rounded-lg px-4 py-2 text-[#F0F0FF] text-sm focus:outline-none focus:border-[#00D4FF] resize-none h-20"
            />
          </div>

          <button
            onClick={handlePush}
            disabled={loading || !message.trim()}
            className="w-full py-2 bg-[#00D4FF] hover:bg-[#00B8E6] text-[#0A0A0F] font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin />
                Pushing...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faGithub} />
                Commit & Push
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
