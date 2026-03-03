import { create } from 'zustand';
import { EditorFile, EditorProject, EditorTab } from '../types/editor';

interface GitHubUser {
  login: string;
  name: string;
  avatarUrl: string;
  token: string;
}

interface EditorState {
  projects: Record<string, EditorProject>;
  activeProjectId: string | null;
  tabs: EditorTab[];
  activeTabId: string | null;
  
  githubUser: GitHubUser | null;
  saveStatus: 'saved' | 'saving' | 'error';
  
  isExplorerOpen: boolean;
  isAIPanelOpen: boolean;
  isOutputOpen: boolean;
  outputTab: 'output' | 'console' | 'problems';
  
  setProjects: (projects: Record<string, EditorProject>) => void;
  setActiveProject: (projectId: string) => void;
  addFile: (projectId: string, file: EditorFile) => void;
  updateFile: (projectId: string, fileId: string, content: string) => void;
  deleteFile: (projectId: string, fileId: string) => void;
  renameFile: (projectId: string, fileId: string, newName: string) => void;
  
  openTab: (fileId: string) => void;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  
  toggleExplorer: () => void;
  toggleAIPanel: () => void;
  toggleOutput: () => void;
  setOutputTab: (tab: 'output' | 'console' | 'problems') => void;
  
  markFileSaved: (projectId: string, fileId: string) => void;
  updateProjectMetadata: (projectId: string, metadata: Partial<EditorProject>) => void;
  setGithubUser: (user: GitHubUser | null) => void;
  setSaveStatus: (status: 'saved' | 'saving' | 'error') => void;
}

const defaultProject: EditorProject = {
  id: 'default',
  name: 'my-project',
  files: {
    'file_index_html': { id: 'file_index_html', name: 'index.html', content: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Document</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <h1>Hello VortexFlow</h1>\n  <script src="script.js"></script>\n</body>\n</html>', language: 'html' },
    'file_style_css': { id: 'file_style_css', name: 'style.css', content: 'body {\n  background: #0D0D14;\n  color: #F0F0FF;\n  font-family: sans-serif;\n}', language: 'css' },
    'file_script_js': { id: 'file_script_js', name: 'script.js', content: 'console.log("Hello from VortexFlow!");', language: 'javascript' },
    'file_readme_md': { id: 'file_readme_md', name: 'README.md', content: '# My Project\n\nWelcome to VortexFlow Editor.', language: 'markdown' }
  }
};

export const useEditorStore = create<EditorState>((set, get) => ({
  projects: { 'default': defaultProject },
  activeProjectId: 'default',
  tabs: [{ id: 'tab-initial', fileId: 'file_index_html' }],
  activeTabId: 'tab-initial',
  
  githubUser: null,
  saveStatus: 'saved',
  
  isExplorerOpen: true,
  isAIPanelOpen: false,
  isOutputOpen: false,
  outputTab: 'output',
  
  setProjects: (projects) => set({ projects }),
  setActiveProject: (projectId) => set({ activeProjectId: projectId }),
  
  addFile: (projectId, file) => set((state) => ({
    projects: {
      ...state.projects,
      [projectId]: {
        ...state.projects[projectId],
        files: {
          ...state.projects[projectId].files,
          [file.id]: file
        }
      }
    }
  })),
  
  updateFile: (projectId, fileId, content) => set((state) => {
    const project = state.projects[projectId];
    if (!project || !project.files[fileId]) return state;
    
    return {
      projects: {
        ...state.projects,
        [projectId]: {
          ...project,
          files: {
            ...project.files,
            [fileId]: {
              ...project.files[fileId],
              content,
              isUnsaved: true
            }
          }
        }
      }
    };
  }),
  
  deleteFile: (projectId, fileId) => set((state) => {
    const project = state.projects[projectId];
    if (!project) return state;
    
    const newFiles = { ...project.files };
    delete newFiles[fileId];
    
    // Close tab if open
    const newTabs = state.tabs.filter(t => t.fileId !== fileId);
    let newActiveTabId = state.activeTabId;
    if (state.activeTabId && state.tabs.find(t => t.id === state.activeTabId)?.fileId === fileId) {
      newActiveTabId = newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null;
    }
    
    return {
      projects: {
        ...state.projects,
        [projectId]: {
          ...project,
          files: newFiles
        }
      },
      tabs: newTabs,
      activeTabId: newActiveTabId
    };
  }),
  
  renameFile: (projectId, fileId, newName) => set((state) => {
    const project = state.projects[projectId];
    if (!project || !project.files[fileId]) return state;
    
    const ext = newName.split('.').pop() || '';
    const languageMap: Record<string, string> = {
      'js': 'javascript', 'ts': 'typescript', 'jsx': 'javascript', 'tsx': 'typescript',
      'html': 'html', 'css': 'css', 'json': 'json', 'md': 'markdown', 'py': 'python'
    };
    const language = languageMap[ext] || 'plaintext';
    
    return {
      projects: {
        ...state.projects,
        [projectId]: {
          ...project,
          files: {
            ...project.files,
            [fileId]: {
              ...project.files[fileId],
              name: newName,
              language
            }
          }
        }
      }
    };
  }),
  
  openTab: (fileId) => set((state) => {
    const existingTab = state.tabs.find(t => t.fileId === fileId);
    if (existingTab) {
      return { activeTabId: existingTab.id };
    }
    
    const newTabId = `tab-${Date.now()}`;
    return {
      tabs: [...state.tabs, { id: newTabId, fileId }],
      activeTabId: newTabId
    };
  }),
  
  closeTab: (tabId) => set((state) => {
    const newTabs = state.tabs.filter(t => t.id !== tabId);
    let newActiveTabId = state.activeTabId;
    
    if (state.activeTabId === tabId) {
      const index = state.tabs.findIndex(t => t.id === tabId);
      if (newTabs.length > 0) {
        newActiveTabId = newTabs[Math.max(0, index - 1)].id;
      } else {
        newActiveTabId = null;
      }
    }
    
    return {
      tabs: newTabs,
      activeTabId: newActiveTabId
    };
  }),
  
  setActiveTab: (tabId) => set({ activeTabId: tabId }),
  
  toggleExplorer: () => set(state => ({ isExplorerOpen: !state.isExplorerOpen })),
  toggleAIPanel: () => set(state => ({ isAIPanelOpen: !state.isAIPanelOpen })),
  toggleOutput: () => set(state => ({ isOutputOpen: !state.isOutputOpen })),
  setOutputTab: (tab) => set({ outputTab: tab }),
  
  markFileSaved: (projectId, fileId) => set((state) => {
    const project = state.projects[projectId];
    if (!project || !project.files[fileId]) return state;
    
    return {
      projects: {
        ...state.projects,
        [projectId]: {
          ...project,
          files: {
            ...project.files,
            [fileId]: {
              ...project.files[fileId],
              isUnsaved: false
            }
          }
        }
      }
    };
  }),
  
  updateProjectMetadata: (projectId, metadata) => set((state) => {
    const project = state.projects[projectId];
    if (!project) return state;
    
    return {
      projects: {
        ...state.projects,
        [projectId]: {
          ...project,
          ...metadata
        }
      }
    };
  }),
  
  setGithubUser: (user) => set({ githubUser: user }),
  setSaveStatus: (status) => set({ saveStatus: status }),
}));
