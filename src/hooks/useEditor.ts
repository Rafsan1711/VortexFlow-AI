import { useEffect, useCallback, useMemo } from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { useAppStore } from '../store/useAppStore';
import { ref, onValue, set, get, remove } from 'firebase/database';
import { rtdb } from '../lib/firebase';
import { EditorProject, EditorFile } from '../types/editor';

// Firebase doesn't allow certain characters in keys
const sanitizeKey = (key: string) => key.replace(/[.#$/[\]]/g, '_');

const sanitizeProjects = (projects: Record<string, EditorProject>) => {
  const sanitized: Record<string, EditorProject> = {};
  for (const [projectId, project] of Object.entries(projects)) {
    if (!project) continue;
    const sanitizedFiles: Record<string, EditorFile> = {};
    for (const [fileId, file] of Object.entries(project.files || {})) {
      const safeId = sanitizeKey(fileId);
      sanitizedFiles[safeId] = { ...file, id: safeId };
    }
    sanitized[projectId] = { ...project, files: sanitizedFiles };
  }
  return sanitized;
};

// Debounce function
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function useEditor() {
  const { user } = useAppStore();
  const { 
    projects, activeProjectId, tabs, activeTabId, 
    setProjects, setActiveProject, addFile, updateFile: storeUpdateFile, deleteFile: storeDeleteFile, renameFile: storeRenameFile,
    openTab, closeTab, setActiveTab, markFileSaved, setSaveStatus
  } = useEditorStore();

  // Load projects from RTDB on mount
  useEffect(() => {
    if (!user) return;
    
    const projectsRef = ref(rtdb, `editorProjects/${user.uid}`);
    const unsubscribe = onValue(projectsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const sanitizedData = sanitizeProjects(data);
        
        // Merge with local state to avoid overwriting unsaved changes if we were doing optimistic updates
        // But for simplicity, we'll just sync from server for now. 
        // Ideally we'd handle conflicts, but last-write-wins is the strategy.
        setProjects(sanitizedData);
        
        // Check for imported code from chat
        const importedData = localStorage.getItem('vortex_editor_import');
        if (importedData) {
          try {
            const { content, language, name } = JSON.parse(importedData);
            const projectId = activeProjectId || Object.keys(sanitizedData)[0] || 'default';
            const fileId = `file-imported-${Date.now()}`;
            const newFile = {
              id: fileId,
              name,
              content,
              language,
              isUnsaved: true,
              updatedAt: Date.now()
            };
            addFile(projectId, newFile);
            openTab(fileId);
            localStorage.removeItem('vortex_editor_import');
            
            // Save the imported file immediately
            const fileRef = ref(rtdb, `editorProjects/${user.uid}/${projectId}/files/${fileId}`);
            set(fileRef, newFile);
          } catch (e) {
            console.error('Failed to parse imported code:', e);
          }
        }

        // If no active project, set the last one or default
        if (!activeProjectId && Object.keys(sanitizedData).length > 0) {
             // Try to load last active project from user prefs if we had them, 
             // otherwise just pick the first one.
             const firstProject = Object.keys(sanitizedData)[0];
             setActiveProject(firstProject);
        }
      } else {
        // Initialize default project in RTDB if none exists
        const defaultProject = projects['default'];
        if (defaultProject) {
            const sanitizedDefault = sanitizeProjects({ 'default': defaultProject });
            set(projectsRef, sanitizedDefault);
        }
      }
    });

    return () => unsubscribe();
  }, [user]); // Removed activeProjectId dependency to avoid re-subscribing

  // Debounced save function
  const debouncedSave = useMemo(
    () => debounce(async (uid: string, projectId: string, file: EditorFile) => {
      if (!uid || !projectId || !file) return;
      
      try {
        setSaveStatus('saving');
        const safeFileId = sanitizeKey(file.id);
        const fileRef = ref(rtdb, `editorProjects/${uid}/${projectId}/files/${safeFileId}`);
        
        await set(fileRef, {
          name: file.name,
          content: file.content,
          language: file.language,
          updatedAt: Date.now(),
          githubPath: file.githubPath || null,
          githubSha: file.githubSha || null,
          id: safeFileId
        });
        
        markFileSaved(projectId, file.id);
        setSaveStatus('saved');
      } catch (err) {
        console.error('Auto-save failed:', err);
        setSaveStatus('error');
      }
    }, 3000),
    [markFileSaved, setSaveStatus]
  );

  const updateFile = useCallback((projectId: string, fileId: string, content: string) => {
    storeUpdateFile(projectId, fileId, content);
    
    if (user) {
      const project = projects[projectId];
      const file = project?.files[fileId];
      if (file) {
        // We need the updated content, which is passed as arg
        const updatedFile = { ...file, content, isUnsaved: true };
        debouncedSave(user.uid, projectId, updatedFile);
      }
    }
  }, [user, projects, storeUpdateFile, debouncedSave]);

  const saveFileToCloud = async (projectId: string, fileId: string) => {
    if (!user) return;
    const project = projects[projectId];
    if (!project || !project.files[fileId]) return;
    
    setSaveStatus('saving');
    try {
        const safeFileId = sanitizeKey(fileId);
        const fileRef = ref(rtdb, `editorProjects/${user.uid}/${projectId}/files/${safeFileId}`);
        await set(fileRef, { ...project.files[fileId], id: safeFileId, updatedAt: Date.now() });
        markFileSaved(projectId, fileId);
        setSaveStatus('saved');
    } catch (err) {
        console.error('Manual save failed:', err);
        setSaveStatus('error');
    }
  };

  const createNewFile = (projectId: string, name: string, content: string = '', language?: string, githubPath?: string) => {
    const ext = name.split('.').pop() || '';
    const languageMap: Record<string, string> = {
      'js': 'javascript', 'ts': 'typescript', 'jsx': 'javascript', 'tsx': 'typescript',
      'html': 'html', 'css': 'css', 'json': 'json', 'md': 'markdown', 'py': 'python'
    };
    const finalLanguage = language || languageMap[ext] || 'plaintext';
    
    // Use a safe ID from the start, add random suffix for batch imports
    const fileId = `file-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newFile: EditorFile = {
      id: fileId,
      name,
      content,
      language: finalLanguage,
      isUnsaved: true,
      updatedAt: Date.now(),
      githubPath
    };
    
    addFile(projectId, newFile);
    openTab(newFile.id);
    
    if (user) {
      const safeFileId = sanitizeKey(fileId);
      const fileRef = ref(rtdb, `editorProjects/${user.uid}/${projectId}/files/${safeFileId}`);
      set(fileRef, newFile);
    }
  };

  const createNewProject = async (name: string, description: string, type: string) => {
      if (!user) return;
      
      const projectId = `project-${Date.now()}`;
      const newProject: EditorProject = {
          id: projectId,
          name,
          description,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          language: type,
          files: {}
      };

      // Create default files based on type
      const files: Record<string, EditorFile> = {};
      
      if (type === 'javascript') {
          files['index_js'] = { id: 'index_js', name: 'index.js', content: '// Start coding...', language: 'javascript', updatedAt: Date.now() };
          files['readme_md'] = { id: 'readme_md', name: 'README.md', content: `# ${name}\n\n${description}`, language: 'markdown', updatedAt: Date.now() };
      } else if (type === 'html') {
          files['index_html'] = { id: 'index_html', name: 'index.html', content: '<!DOCTYPE html>\n<html>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>', language: 'html', updatedAt: Date.now() };
          files['style_css'] = { id: 'style_css', name: 'style.css', content: 'body { font-family: sans-serif; }', language: 'css', updatedAt: Date.now() };
          files['script_js'] = { id: 'script_js', name: 'script.js', content: 'console.log("Hello");', language: 'javascript', updatedAt: Date.now() };
      } else if (type === 'python') {
          files['main_py'] = { id: 'main_py', name: 'main.py', content: 'print("Hello World")', language: 'python', updatedAt: Date.now() };
      } else {
          files['readme_md'] = { id: 'readme_md', name: 'README.md', content: `# ${name}`, language: 'markdown', updatedAt: Date.now() };
      }

      newProject.files = files;
      
      // Save to RTDB
      await set(ref(rtdb, `editorProjects/${user.uid}/${projectId}`), newProject);
      
      // Update local state
      setProjects({ ...projects, [projectId]: newProject });
      setActiveProject(projectId);
  };

  const deleteProject = async (projectId: string) => {
      if (!user) return;
      
      await remove(ref(rtdb, `editorProjects/${user.uid}/${projectId}`));
      
      const newProjects = { ...projects };
      delete newProjects[projectId];
      setProjects(newProjects);
      
      if (activeProjectId === projectId) {
          const first = Object.keys(newProjects)[0];
          setActiveProject(first || null);
      }
  };

  return {
    projects,
    activeProjectId,
    tabs,
    activeTabId,
    activeProject: activeProjectId ? projects[activeProjectId] : null,
    activeFile: activeProjectId && activeTabId 
      ? projects[activeProjectId]?.files[tabs.find(t => t.id === activeTabId)?.fileId || ''] 
      : null,
    saveFileToCloud,
    createNewFile,
    createNewProject,
    deleteProject,
    updateFile,
    deleteFile: storeDeleteFile,
    renameFile: storeRenameFile,
    openTab,
    closeTab,
    setActiveTab
  };
}
