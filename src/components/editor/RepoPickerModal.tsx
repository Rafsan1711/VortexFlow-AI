import React, { useState, useEffect } from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import { useGitHubAuth } from '../../hooks/useGitHubAuth';
import { getUserRepos, getRepoTree, createRepo } from '../../lib/github';
import { GitHubRepo, GitHubTreeItem } from '../../types/editor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faSearch, faCodeBranch, faLock, faGlobe, faCheck, faTimes, faSpinner, faFolder, faFile } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

interface RepoPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (repo: GitHubRepo, files: string[]) => void;
  onCreate: (repo: GitHubRepo) => void;
}

export function RepoPickerModal({ isOpen, onClose, onImport, onCreate }: RepoPickerModalProps) {
  const { githubUser } = useEditorStore();
  const [activeTab, setActiveTab] = useState<'import' | 'create'>('import');
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  const [repoFiles, setRepoFiles] = useState<GitHubTreeItem[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create Repo State
  const [newRepoName, setNewRepoName] = useState('');
  const [newRepoDesc, setNewRepoDesc] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (isOpen && githubUser && activeTab === 'import') {
      loadRepos();
    }
  }, [isOpen, githubUser, activeTab]);

  const loadRepos = async () => {
    if (!githubUser?.token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getUserRepos(githubUser.token);
      setRepos(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load repositories');
    } finally {
      setLoading(false);
    }
  };

  const handleRepoSelect = async (repo: GitHubRepo) => {
    if (!githubUser?.token) return;
    setSelectedRepo(repo);
    setLoadingFiles(true);
    setError(null);
    try {
      const tree = await getRepoTree(githubUser.token, repo.owner.login, repo.name);
      // Filter out directories for selection, but keep structure if needed
      // For simplicity, we just show files
      const files = tree.filter(item => item.type === 'blob');
      setRepoFiles(files);
      // Select all by default if < 10 files
      if (files.length < 10) {
        setSelectedFiles(new Set(files.map(f => f.path)));
      } else {
        setSelectedFiles(new Set());
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load repository files');
      // If it fails (e.g. empty repo), just show empty list
      setRepoFiles([]);
    } finally {
      setLoadingFiles(false);
    }
  };

  const toggleFileSelection = (path: string) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(path)) {
      newSelected.delete(path);
    } else {
      newSelected.add(path);
    }
    setSelectedFiles(newSelected);
  };

  const handleImport = () => {
    if (selectedRepo && selectedFiles.size > 0) {
      onImport(selectedRepo, Array.from(selectedFiles));
      onClose();
    }
  };

  const handleCreate = async () => {
    if (!githubUser?.token || !newRepoName.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const repo = await createRepo(githubUser.token, newRepoName, newRepoDesc, isPrivate);
      onCreate(repo);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create repository');
    } finally {
      setCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#1A1A24] border border-[#2A2A3A] rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A2A3A]">
          <h2 className="text-lg font-semibold text-[#F0F0FF] flex items-center gap-2">
            <FontAwesomeIcon icon={faGithub} />
            GitHub Repository
          </h2>
          <button onClick={onClose} className="text-[#5C5C7A] hover:text-[#F0F0FF] transition-colors">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#2A2A3A]">
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'import' ? 'text-[#00D4FF]' : 'text-[#5C5C7A] hover:text-[#F0F0FF]'
            }`}
          >
            Import Existing Repo
            {activeTab === 'import' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00D4FF]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'create' ? 'text-[#00D4FF]' : 'text-[#5C5C7A] hover:text-[#F0F0FF]'
            }`}
          >
            Create New Repo
            {activeTab === 'create' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00D4FF]" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2">
              <FontAwesomeIcon icon={faTimes} />
              {error}
            </div>
          )}

          {activeTab === 'import' ? (
            <div className="space-y-6">
              {/* Repo Search & List */}
              <div className="space-y-4">
                <div className="relative">
                  <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5C5C7A]" />
                  <input
                    type="text"
                    placeholder="Filter repositories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#0A0A0F] border border-[#2A2A3A] rounded-lg pl-10 pr-4 py-2 text-[#F0F0FF] text-sm focus:outline-none focus:border-[#00D4FF]"
                  />
                </div>

                <div className="h-[200px] overflow-y-auto border border-[#2A2A3A] rounded-lg bg-[#0A0A0F] custom-scrollbar">
                  {loading ? (
                    <div className="flex items-center justify-center h-full text-[#5C5C7A]">
                      <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                      Loading repositories...
                    </div>
                  ) : repos.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-[#5C5C7A]">
                      No repositories found.
                    </div>
                  ) : (
                    <div className="divide-y divide-[#2A2A3A]">
                      {repos
                        .filter(repo => repo.name.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map(repo => (
                          <div
                            key={repo.id}
                            onClick={() => handleRepoSelect(repo)}
                            className={`p-3 cursor-pointer transition-colors hover:bg-[#1A1A24] ${
                              selectedRepo?.id === repo.id ? 'bg-[#1A1A24] border-l-2 border-[#00D4FF]' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-[#F0F0FF] text-sm">{repo.name}</span>
                              <div className="flex items-center gap-2">
                                {repo.private && <FontAwesomeIcon icon={faLock} className="text-[#5C5C7A] text-xs" />}
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2A2A3A] text-[#9898B8]">
                                  {repo.language || 'Text'}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-[#5C5C7A] truncate">{repo.description || 'No description'}</p>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              {/* File Selection */}
              {selectedRepo && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-[#F0F0FF]">Select Files to Import</h3>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setSelectedFiles(new Set(repoFiles.map(f => f.path)))}
                        className="text-xs text-[#00D4FF] hover:underline"
                      >
                        Select All
                      </button>
                      <button 
                        onClick={() => setSelectedFiles(new Set())}
                        className="text-xs text-[#5C5C7A] hover:text-[#F0F0FF] hover:underline"
                      >
                        Deselect All
                      </button>
                    </div>
                  </div>

                  <div className="h-[200px] overflow-y-auto border border-[#2A2A3A] rounded-lg bg-[#0A0A0F] custom-scrollbar p-2">
                    {loadingFiles ? (
                      <div className="flex items-center justify-center h-full text-[#5C5C7A]">
                        <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                        Loading files...
                      </div>
                    ) : repoFiles.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-[#5C5C7A]">
                        No files found in this repository.
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {repoFiles.map(file => (
                          <div 
                            key={file.path}
                            onClick={() => toggleFileSelection(file.path)}
                            className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${
                              selectedFiles.has(file.path) ? 'bg-[#1A1A24] text-[#F0F0FF]' : 'text-[#9898B8] hover:bg-[#1A1A24] hover:text-[#F0F0FF]'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                              selectedFiles.has(file.path) ? 'bg-[#00D4FF] border-[#00D4FF]' : 'border-[#5C5C7A]'
                            }`}>
                              {selectedFiles.has(file.path) && <FontAwesomeIcon icon={faCheck} className="text-[#0A0A0F] text-[10px]" />}
                            </div>
                            <FontAwesomeIcon icon={faFile} className="text-[#5C5C7A]" />
                            <span className="text-sm truncate">{file.path}</span>
                            <span className="ml-auto text-[10px] text-[#5C5C7A]">
                              {file.size ? `${(file.size / 1024).toFixed(1)} KB` : ''}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleImport}
                    disabled={selectedFiles.size === 0}
                    className="w-full py-2 bg-[#00D4FF] hover:bg-[#00B8E6] text-[#0A0A0F] font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Import {selectedFiles.size} Files
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#9898B8] mb-1">Repository Name</label>
                  <input
                    type="text"
                    value={newRepoName}
                    onChange={(e) => setNewRepoName(e.target.value)}
                    placeholder="my-awesome-project"
                    className="w-full bg-[#0A0A0F] border border-[#2A2A3A] rounded-lg px-4 py-2 text-[#F0F0FF] text-sm focus:outline-none focus:border-[#00D4FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#9898B8] mb-1">Description (Optional)</label>
                  <textarea
                    value={newRepoDesc}
                    onChange={(e) => setNewRepoDesc(e.target.value)}
                    placeholder="A brief description of your project..."
                    className="w-full bg-[#0A0A0F] border border-[#2A2A3A] rounded-lg px-4 py-2 text-[#F0F0FF] text-sm focus:outline-none focus:border-[#00D4FF] resize-none h-24"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={!isPrivate}
                      onChange={() => setIsPrivate(false)}
                      className="hidden"
                    />
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      !isPrivate ? 'border-[#00D4FF]' : 'border-[#5C5C7A]'
                    }`}>
                      {!isPrivate && <div className="w-2 h-2 rounded-full bg-[#00D4FF]" />}
                    </div>
                    <span className={`text-sm ${!isPrivate ? 'text-[#F0F0FF]' : 'text-[#9898B8]'}`}>Public</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={isPrivate}
                      onChange={() => setIsPrivate(true)}
                      className="hidden"
                    />
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isPrivate ? 'border-[#00D4FF]' : 'border-[#5C5C7A]'
                    }`}>
                      {isPrivate && <div className="w-2 h-2 rounded-full bg-[#00D4FF]" />}
                    </div>
                    <span className={`text-sm ${isPrivate ? 'text-[#F0F0FF]' : 'text-[#9898B8]'}`}>Private</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-[#2A2A3A]">
                <button
                  onClick={handleCreate}
                  disabled={!newRepoName.trim() || creating}
                  className="w-full py-2 bg-[#00D4FF] hover:bg-[#00B8E6] text-[#0A0A0F] font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {creating ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin />
                      Creating Repository...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faCodeBranch} />
                      Create Repository
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
