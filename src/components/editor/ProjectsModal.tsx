import React, { useState, useEffect } from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import { useEditor } from '../../hooks/useEditor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faPlus, faTrash, faTimes, faSpinner, faCode } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectsModal({ isOpen, onClose }: ProjectsModalProps) {
  const { projects, activeProjectId, setActiveProject } = useEditorStore();
  const { createNewProject, deleteProject } = useEditor();
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [newProjectLang, setNewProjectLang] = useState('javascript');
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!newProjectName.trim()) return;
    setCreating(true);
    
    try {
      await createNewProject(newProjectName, newProjectDesc, newProjectLang);
      onClose();
    } catch (err) {
      console.error('Failed to create project:', err);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = (projectId: string) => {
    if (confirm('Are you sure you want to delete this project? This cannot be undone.')) {
      deleteProject(projectId);
    }
  };

  const handleOpen = (projectId: string) => {
    setActiveProject(projectId);
    onClose();
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
            <FontAwesomeIcon icon={faFolder} />
            Projects
          </h2>
          <button onClick={onClose} className="text-[#5C5C7A] hover:text-[#F0F0FF] transition-colors">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#2A2A3A]">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'list' ? 'text-[#00D4FF]' : 'text-[#5C5C7A] hover:text-[#F0F0FF]'
            }`}
          >
            My Projects
            {activeTab === 'list' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00D4FF]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'create' ? 'text-[#00D4FF]' : 'text-[#5C5C7A] hover:text-[#F0F0FF]'
            }`}
          >
            New Project
            {activeTab === 'create' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00D4FF]" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {activeTab === 'list' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.values(projects).map(project => (
                <div 
                  key={project.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    activeProjectId === project.id 
                      ? 'bg-[#1A1A24] border-[#00D4FF]' 
                      : 'bg-[#0A0A0F] border-[#2A2A3A] hover:border-[#5C5C7A]'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-[#F0F0FF] truncate pr-2">{project.name}</h3>
                    {project.githubRepo && (
                      <FontAwesomeIcon icon={faGithub} className="text-[#5C5C7A]" title={project.githubRepo} />
                    )}
                  </div>
                  <p className="text-xs text-[#5C5C7A] mb-4 line-clamp-2 h-8">
                    {project.description || 'No description'}
                  </p>
                  <div className="flex items-center justify-between text-xs text-[#5C5C7A]">
                    <span>{Object.keys(project.files).length} files</span>
                    <span className="bg-[#2A2A3A] px-2 py-0.5 rounded text-[#9898B8]">{project.language || 'Unknown'}</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button 
                      onClick={() => handleOpen(project.id)}
                      className="flex-1 py-1.5 bg-[#2A2A3A] hover:bg-[#3D3D52] text-[#F0F0FF] rounded text-xs font-medium transition-colors"
                    >
                      Open
                    </button>
                    <button 
                      onClick={() => handleDelete(project.id)}
                      className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded text-xs transition-colors"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              ))}
              
              {Object.keys(projects).length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-[#5C5C7A]">
                  <FontAwesomeIcon icon={faFolder} size="3x" className="mb-4 opacity-20" />
                  <p>No projects found.</p>
                  <button 
                    onClick={() => setActiveTab('create')}
                    className="mt-4 text-[#00D4FF] hover:underline text-sm"
                  >
                    Create your first project
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6 max-w-md mx-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#9898B8] mb-1">Project Name</label>
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="my-awesome-app"
                    className="w-full bg-[#0A0A0F] border border-[#2A2A3A] rounded-lg px-4 py-2 text-[#F0F0FF] text-sm focus:outline-none focus:border-[#00D4FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#9898B8] mb-1">Description (Optional)</label>
                  <textarea
                    value={newProjectDesc}
                    onChange={(e) => setNewProjectDesc(e.target.value)}
                    placeholder="What are you building?"
                    className="w-full bg-[#0A0A0F] border border-[#2A2A3A] rounded-lg px-4 py-2 text-[#F0F0FF] text-sm focus:outline-none focus:border-[#00D4FF] resize-none h-24"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#9898B8] mb-1">Template</label>
                  <select
                    value={newProjectLang}
                    onChange={(e) => setNewProjectLang(e.target.value)}
                    className="w-full bg-[#0A0A0F] border border-[#2A2A3A] rounded-lg px-4 py-2 text-[#F0F0FF] text-sm focus:outline-none focus:border-[#00D4FF]"
                  >
                    <option value="javascript">JavaScript (Node.js)</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="html">HTML + CSS + JS</option>
                    <option value="react">React (Vite)</option>
                    <option value="other">Empty Project</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-[#2A2A3A]">
                <button
                  onClick={handleCreate}
                  disabled={!newProjectName.trim() || creating}
                  className="w-full py-2 bg-[#00D4FF] hover:bg-[#00B8E6] text-[#0A0A0F] font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {creating ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin />
                      Creating Project...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faPlus} />
                      Create Project
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
