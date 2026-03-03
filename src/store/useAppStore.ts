import { create } from 'zustand';
import { AppState, Chat, ChatSettings, User, Toast, GlobalSettings, ModalType, TerminalLine, Plugin } from '../types';

const defaultGlobalSettings: GlobalSettings = {
  defaultModel: 'gemini-3.1-pro-preview',
  fontSize: 'Medium',
  showTokenCount: true,
  showTimestamps: true,
  autoScroll: true,
  language: 'English',
  responseLanguage: 'Auto',
  markdownEnabled: true,
  syntaxHighlighting: true,
  safetySetting: 'Default',
  maxResponseLength: 'Medium',
};

export const useAppStore = create<AppState>((set) => ({
  user: null,
  chats: [],
  activeChatId: null,
  settings: {
    model: 'gemini-3.1-pro-preview',
    temperature: 0.7,
  },
  globalSettings: defaultGlobalSettings,
  chatSettings: {},
  isSidebarOpen: false,
  openModal: null,
  modalProps: null,
  toasts: [],
  authLoading: true,
  isSearchOpen: false,
  isOnline: true,
  isSyncing: false,

  // Terminal & Plugins initial state
  terminalOpen: false,
  isBootingTerminal: false,
  terminalLines: [],
  activePlugin: null,
  pendingPlugin: null,
  installedPlugins: [],

  setUser: (user: User | null) => set({ user }),
  setChats: (chats: Chat[]) => set({ chats }),
  setActiveChatId: (id: string | null) => set({ activeChatId: id }),
  updateSettings: (newSettings: Partial<ChatSettings>) =>
    set((state) => ({ settings: { ...state.settings, ...newSettings } })),
  updateGlobalSettings: (newSettings: Partial<GlobalSettings>) =>
    set((state) => ({ globalSettings: { ...state.globalSettings, ...newSettings } })),
  updateChatSettings: (chatId: string, newSettings: Partial<ChatSettings>) =>
    set((state) => ({
      chatSettings: {
        ...state.chatSettings,
        [chatId]: { ...(state.chatSettings[chatId] || state.settings), ...newSettings },
      },
    })),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setOpenModal: (modal: ModalType, props?: any) => set({ openModal: modal, modalProps: props || null }),
  closeModal: () => set({ openModal: null, modalProps: null }),
  
  addToast: (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    if (toast.duration !== 0) {
      setTimeout(() => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
      }, toast.duration || 5000);
    }
  },
  removeToast: (id: string) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  setAuthLoading: (loading: boolean) => set({ authLoading: loading }),
  setSearchOpen: (isOpen: boolean) => set({ isSearchOpen: isOpen }),
  setConnectionState: (isOnline: boolean, isSyncing?: boolean) => set((state) => ({ isOnline, isSyncing: isSyncing !== undefined ? isSyncing : state.isSyncing })),

  // Terminal & Plugins actions
  openTerminal: () => set({ terminalOpen: true, isBootingTerminal: false }),
  setBootingTerminal: (booting) => set({ isBootingTerminal: booting }),
  closeTerminal: () => set({ terminalOpen: false, activePlugin: null, pendingPlugin: null }),
  setActivePlugin: (plugin) => set({ activePlugin: plugin }),
  setPendingPlugin: (plugin) => set({ pendingPlugin: plugin }),
  addTerminalLine: (line) => set((state) => ({
    terminalLines: [...state.terminalLines, { ...line, id: Math.random().toString(36).substring(2, 9), timestamp: Date.now() }]
  })),
  clearTerminal: () => set({ terminalLines: [] }),
  setInstalledPlugins: (pluginIds) => set({ installedPlugins: pluginIds }),
}));
