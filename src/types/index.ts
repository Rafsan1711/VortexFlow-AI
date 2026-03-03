export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified?: boolean;
  metadata?: {
    creationTime?: string;
    lastSignInTime?: string;
  };
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  tokens?: number;
  edited?: boolean;
  imageUrl?: string | null;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  userId: string;
  model?: string;
  messageCount?: number;
  pinned?: boolean;
}

export interface ChatSettings {
  model: string;
  temperature: number;
  systemPrompt?: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export type ModalType = 'settings' | 'profile' | 'model-picker' | 'delete-confirm' | 'rename' | 'share' | 'shortcuts' | 'welcome-tour' | 'export' | 'plugins' | null;

export interface GlobalSettings {
  defaultModel: string;
  fontSize: 'Small' | 'Medium' | 'Large';
  showTokenCount: boolean;
  showTimestamps: boolean;
  autoScroll: boolean;
  language: string;
  responseLanguage: string;
  markdownEnabled: boolean;
  syntaxHighlighting: boolean;
  safetySetting: 'Default' | 'Strict' | 'Off';
  maxResponseLength: 'Short' | 'Medium' | 'Long' | 'Maximum';
}

export interface AppState {
  user: User | null;
  chats: Chat[];
  activeChatId: string | null;
  settings: ChatSettings; // Legacy/current chat settings
  globalSettings: GlobalSettings;
  chatSettings: Record<string, ChatSettings>; // per chatId settings
  isSidebarOpen: boolean;
  openModal: ModalType;
  modalProps: any;
  toasts: Toast[];
  authLoading: boolean;
  isSearchOpen: boolean;
  isOnline: boolean;
  isSyncing: boolean;
  
  setUser: (user: User | null) => void;
  setChats: (chats: Chat[]) => void;
  setActiveChatId: (id: string | null) => void;
  updateSettings: (settings: Partial<ChatSettings>) => void;
  updateGlobalSettings: (settings: Partial<GlobalSettings>) => void;
  updateChatSettings: (chatId: string, settings: Partial<ChatSettings>) => void;
  toggleSidebar: () => void;
  setOpenModal: (modal: ModalType, props?: any) => void;
  closeModal: () => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  setAuthLoading: (loading: boolean) => void;
  setSearchOpen: (isOpen: boolean) => void;
  setConnectionState: (isOnline: boolean, isSyncing?: boolean) => void;

  // Terminal & Plugins
  terminalOpen: boolean;
  isBootingTerminal: boolean;
  terminalLines: TerminalLine[];
  activePlugin: Plugin | null;
  pendingPlugin: Plugin | null;
  installedPlugins: string[];
  openTerminal: () => void;
  setBootingTerminal: (booting: boolean) => void;
  closeTerminal: () => void;
  setActivePlugin: (plugin: Plugin | null) => void;
  setPendingPlugin: (plugin: Plugin | null) => void;
  addTerminalLine: (line: Omit<TerminalLine, 'id' | 'timestamp'>) => void;
  clearTerminal: () => void;
  setInstalledPlugins: (pluginIds: string[]) => void;
}

export interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'success' | 'comment' | 'system';
  content: string;
  timestamp: number;
}

export interface Plugin {
  id: string;
  name: string;
  description: string;
  command: string;
  url: string;
  logoUrl?: string;       // external URL or FA icon name
  logoType: 'url' | 'emoji' | 'fa';
  logoValue: string;
  category: 'games' | 'tools' | 'education';
  author: string;
  authorUrl?: string;
  tags: string[];
  fullscreen: boolean;    // true = iframe fills full chat area, false = terminal area only
}
