import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faChevronLeft, 
  faChevronRight, 
  faSearch, 
  faPencilAlt, 
  faTrash, 
  faCog, 
  faSignOutAlt,
  faEllipsisH,
  faThumbtack,
  faCopy,
  faCommentDots,
  faPuzzlePiece,
  faCode,
  faTerminal
} from '@fortawesome/free-solid-svg-icons';
import { useAppStore } from '../../store/useAppStore';
import { useAuth } from '../../hooks/useAuth';
import { useChat } from '../../hooks/useChat';
import { format, isToday, isYesterday, subDays, isAfter } from 'date-fns';
import Dropdown from '../ui/Dropdown';
import ErrorBoundary from '../ErrorBoundary';

const SidebarContent = () => {
  const navigate = useNavigate();
  const { chatId } = useParams();
  const { user, chats, isSidebarOpen, toggleSidebar, setOpenModal } = useAppStore();
  const { signOut } = useAuth();
  const { createNewChat, deleteChat, updateChatTitle, pinChat, duplicateChat } = useChat();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = useMemo(() => {
    if (!searchQuery) return chats;
    return chats.filter(chat => chat.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [chats, searchQuery]);

  const groupedChats = useMemo(() => {
    const groups: { [key: string]: typeof chats } = {
      'Pinned': [],
      'Today': [],
      'Yesterday': [],
      'Previous 7 Days': [],
      'Older': []
    };

    filteredChats.forEach(chat => {
      if (chat.pinned) {
        groups['Pinned'].push(chat);
        return; // Skip date grouping if pinned
      }

      const date = new Date(chat.updatedAt);
      if (isToday(date)) {
        groups['Today'].push(chat);
      } else if (isYesterday(date)) {
        groups['Yesterday'].push(chat);
      } else if (isAfter(date, subDays(new Date(), 7))) {
        groups['Previous 7 Days'].push(chat);
      } else {
        groups['Older'].push(chat);
      }
    });

    return groups;
  }, [filteredChats]);

  const handleCreateChat = async () => {
    const newChatId = await createNewChat();
    if (newChatId) {
      navigate(`/chat/${newChatId}`);
    }
  };

  const handleDeleteChat = async (id: string) => {
    setOpenModal('delete-confirm', {
      title: 'Delete Chat',
      description: 'Are you sure you want to delete this chat? This action cannot be undone.',
      onConfirm: async () => {
        await deleteChat(id);
        if (chatId === id) {
          navigate('/chat');
        }
      }
    });
  };

  const handleDuplicateChat = async (id: string) => {
    const newChatId = await duplicateChat(id);
    if (newChatId) {
      navigate(`/chat/${newChatId}`);
    }
  };

  return (
    <>
      {/* Collapsed Sidebar (Desktop Only) */}
      <div className={`hidden md:flex flex-col items-center bg-[#0D0D14] border-r border-[#2A2A3A] py-4 transition-all duration-300 ease-in-out overflow-hidden ${isSidebarOpen ? 'w-0 opacity-0 border-none' : 'w-[60px] opacity-100'}`}>
        <button 
          onClick={toggleSidebar}
          className="w-10 h-10 rounded-xl hover:bg-[#1A1A24] text-[#9898B8] hover:text-white transition-colors flex items-center justify-center mb-4 whitespace-nowrap"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
        <button 
          onClick={handleCreateChat}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D4FF] to-[#7B61FF] text-white flex items-center justify-center shadow-[0_0_20px_rgba(0,212,255,0.25)] hover:scale-105 transition-all whitespace-nowrap mb-4"
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>

        <div className="flex flex-col gap-2">
          <button 
            onClick={() => navigate('/editor')}
            className="w-10 h-10 rounded-xl hover:bg-[#1A1A24] text-[#9898B8] hover:text-[#00D4FF] transition-colors flex items-center justify-center"
            title="Code Editor"
          >
            <FontAwesomeIcon icon={faCode} />
          </button>
          <button 
            onClick={() => {
              useAppStore.getState().setBootingTerminal(true);
              setTimeout(() => {
                useAppStore.getState().openTerminal();
              }, 2500);
            }}
            className="w-10 h-10 rounded-xl hover:bg-[#1A1A24] text-[#9898B8] hover:text-[#22c55e] transition-colors flex items-center justify-center"
            title="Terminal"
          >
            <FontAwesomeIcon icon={faTerminal} />
          </button>
        </div>
      </div>

      {/* Expanded Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 bg-[#0D0D14] border-r border-[#2A2A3A] flex flex-col transition-all duration-300 ease-in-out overflow-hidden
        ${isSidebarOpen ? 'translate-x-0 w-[260px] opacity-100' : '-translate-x-full w-0 opacity-0 md:w-0 md:translate-x-0'}
        md:relative
      `}>
        <div className="w-[260px] flex flex-col h-full">
          {/* Top Section */}
          <div className="p-4 border-b border-[#2A2A3A]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D4FF] to-[#7B61FF] p-[1.5px] shadow-[0_0_12px_rgba(0,212,255,0.3)]">
                  <div className="w-full h-full bg-[#0A0A0F] rounded-[6.5px] overflow-hidden flex items-center justify-center">
                    <img src="/logo.png" alt="VortexFlow AI" className="w-full h-full object-cover scale-110" />
                  </div>
                </div>
                <span className="font-bold text-[#F0F0FF]">VortexFlow AI</span>
              </div>
              <button 
                onClick={toggleSidebar}
                className="text-[#5C5C7A] hover:text-white transition-colors"
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
            </div>

            <button 
              onClick={handleCreateChat}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#7B61FF] text-white font-medium flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,212,255,0.25)] hover:scale-[1.02] transition-all"
            >
              <FontAwesomeIcon icon={faPlus} />
              New Chat
            </button>
          </div>

          {/* Middle Section - Chat List */}
          <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
            <div className="px-2 mb-4">
              <div className="relative">
                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5C5C7A] text-xs" />
                <input 
                  type="text" 
                  placeholder="Search chats..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1A1A24] text-[#F0F0FF] text-sm rounded-lg py-2 pl-9 pr-3 border border-[#2A2A3A] focus:outline-none focus:border-[#00D4FF] placeholder-[#5C5C7A]"
                />
              </div>
            </div>

            {chats.length === 0 ? (
              <div className="text-center py-12 px-4 flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00D4FF]/10 to-[#7B61FF]/10 flex items-center justify-center mb-4">
                  <FontAwesomeIcon icon={faCommentDots} className="text-2xl text-[#00D4FF] opacity-80" />
                </div>
                <h3 className="text-[#F0F0FF] font-medium mb-1">No chats yet</h3>
                <p className="text-[#5C5C7A] text-xs mb-6 max-w-[180px]">
                  Start a new conversation to explore the power of VortexFlow AI.
                </p>
                <button 
                  onClick={handleCreateChat}
                  className="py-2 px-4 rounded-lg bg-[#1A1A24] text-[#00D4FF] hover:bg-[#2A2A3A] transition-colors text-xs font-medium flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  Create First Chat
                </button>
              </div>
            ) : (
              Object.entries(groupedChats).map(([group, groupChats]) => (
                groupChats.length > 0 && (
                  <div key={group} className="mb-6">
                    <h3 className="px-4 text-[11px] font-medium text-[#5C5C7A] uppercase tracking-[0.08em] mb-2 flex items-center gap-2">
                      {group === 'Pinned' && <FontAwesomeIcon icon={faThumbtack} className="text-[#00D4FF]" />}
                      {group}
                    </h3>
                    <div className="space-y-1">
                      {groupChats.map(chat => (
                        <div 
                          key={chat.id}
                          onClick={() => navigate(`/chat/${chat.id}`)}
                          className={`
                            group relative px-3 py-2.5 rounded-lg cursor-pointer transition-all flex items-center justify-between mx-2
                            ${chatId === chat.id 
                              ? 'bg-[#1A1A24] text-[#F0F0FF] border-l-2 border-[#00D4FF]' 
                              : 'text-[#9898B8] hover:bg-[#1A1A24] hover:text-[#F0F0FF]'
                            }
                          `}
                        >
                          <div className="flex items-center gap-2 overflow-hidden w-full">
                            {chat.pinned && group !== 'Pinned' && (
                              <FontAwesomeIcon icon={faThumbtack} className="text-[#00D4FF] text-[10px] shrink-0" />
                            )}
                            <span className="truncate text-sm flex-1">{chat.title || 'New Chat'}</span>
                          </div>
                          
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center shrink-0" onClick={e => e.stopPropagation()}>
                              <Dropdown
                                trigger={
                                  <button className="p-1 text-[#5C5C7A] hover:text-[#F0F0FF] transition-colors rounded hover:bg-[#2A2A3A]">
                                    <FontAwesomeIcon icon={faEllipsisH} size="xs" />
                                  </button>
                                }
                                items={[
                                  { 
                                    label: chat.pinned ? 'Unpin Chat' : 'Pin Chat', 
                                    icon: faThumbtack,
                                    action: () => pinChat(chat.id, !chat.pinned) 
                                  },
                                  { 
                                    label: 'Rename', 
                                    icon: faPencilAlt,
                                    action: () => {
                                      setOpenModal('rename', {
                                        currentTitle: chat.title,
                                        onSave: async (newTitle: string) => {
                                          await updateChatTitle(chat.id, newTitle);
                                        }
                                      });
                                    } 
                                  },
                                  { 
                                    label: 'Duplicate', 
                                    icon: faCopy,
                                    action: () => handleDuplicateChat(chat.id) 
                                  },
                                  { label: '', divider: true },
                                  { 
                                    label: 'Delete', 
                                    icon: faTrash,
                                    action: () => handleDeleteChat(chat.id), 
                                    danger: true 
                                  },
                                ]}
                                align="right"
                              />
                              </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))
            )}
          </div>

          {/* Bottom Section */}
          <div className="p-4 border-t border-[#2A2A3A] bg-[#0D0D14]">
            <div className="flex items-center gap-3 mb-4">
              {user?.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} className="w-10 h-10 rounded-full" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#7B61FF] flex items-center justify-center text-white font-bold">
                  {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-[#F0F0FF] text-sm truncate">{user?.displayName || 'User'}</div>
                <div className="text-xs text-[#5C5C7A] truncate">{user?.email}</div>
              </div>
              <div className="px-1.5 py-0.5 rounded border border-[#FFB830] text-[#FFB830] text-[10px] font-medium uppercase bg-transparent">
                Free
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => navigate('/editor')}
                className="py-2 px-3 rounded-lg text-[#9898B8] hover:text-[#00D4FF] hover:bg-[#1A1A24] transition-colors text-xs"
                title="Code Editor"
              >
                <FontAwesomeIcon icon={faCode} />
              </button>
              <button 
                onClick={() => {
                  useAppStore.getState().setBootingTerminal(true);
                  setTimeout(() => {
                    useAppStore.getState().openTerminal();
                  }, 2500);
                }}
                className="py-2 px-3 rounded-lg text-[#9898B8] hover:text-[#22c55e] hover:bg-[#1A1A24] transition-colors text-xs"
                title="Terminal"
              >
                <FontAwesomeIcon icon={faTerminal} />
              </button>
              <button 
                onClick={() => setOpenModal('plugins')}
                className="py-2 px-3 rounded-lg text-[#9898B8] hover:text-[#F0F0FF] hover:bg-[#1A1A24] transition-colors text-xs"
                title="Plugin Store"
              >
                <FontAwesomeIcon icon={faPuzzlePiece} />
              </button>
              <button 
                onClick={() => setOpenModal('settings')}
                className="flex-1 py-2 px-3 rounded-lg text-[#9898B8] hover:text-[#F0F0FF] hover:bg-[#1A1A24] transition-colors text-xs font-medium flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faCog} />
                Settings
              </button>
              <button 
                onClick={signOut}
                className="py-2 px-3 rounded-lg text-[#9898B8] hover:text-[#FF4D6A] hover:bg-[#1A1A24] transition-colors text-xs"
                title="Sign Out"
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Sidebar = () => (
  <ErrorBoundary>
    <SidebarContent />
  </ErrorBoundary>
);

export default Sidebar;
