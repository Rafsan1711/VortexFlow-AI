import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCog, 
  faRobot, 
  faUser, 
  faQuestionCircle, 
  faCheck, 
  faExclamationTriangle,
  faKeyboard,
  faExternalLinkAlt,
  faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Modal from '../ui/Modal';
import { useAppStore } from '../../store/useAppStore';
import { useAuth } from '../../hooks/useAuth';

const SettingsModal = () => {
  const { openModal, closeModal, globalSettings, updateGlobalSettings, user, setOpenModal } = useAppStore();
  const { signOut, updateUserProfile, updateUserEmail, updateUserPassword, sendEmailVerification, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'general' | 'ai' | 'account' | 'help'>('general');

  // Account state
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [newEmail, setNewEmail] = useState(user?.email || '');
  const [newPassword, setNewPassword] = useState('');

  // Update local state when user changes (e.g. after profile update)
  React.useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setNewEmail(user.email || '');
    }
  }, [user]);

  const handleUpdateProfile = async (name: string) => {
    if (name && name !== user?.displayName) {
      await updateUserProfile({ displayName: name });
    }
  };

  const handleUpdateEmail = async () => {
    if (newEmail && newEmail !== user?.email) {
      await updateUserEmail(newEmail);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword && newPassword.length >= 6) {
      await updateUserPassword(newPassword);
      setNewPassword('');
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: faCog },
    { id: 'ai', label: 'AI Behaviour', icon: faRobot },
    { id: 'account', label: 'Account', icon: faUser },
    { id: 'help', label: 'About & Help', icon: faQuestionCircle },
  ] as const;

  const handleSave = () => {
    closeModal();
  };

  return (
    <Modal
      isOpen={openModal === 'settings'}
      onClose={closeModal}
      title="Settings"
      size="lg"
      footer={
        <div className="flex justify-end w-full">
          <button 
            onClick={handleSave}
            className="px-6 py-2 bg-gradient-to-r from-[#00D4FF] to-[#7B61FF] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faCheck} /> Save Changes
          </button>
        </div>
      }
    >
      <div className="flex flex-col md:flex-row gap-6 -mx-2">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-48 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible shrink-0 pb-2 md:pb-0 border-b md:border-b-0 md:border-r border-[#2A2A3A] pr-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap
                ${activeTab === tab.id 
                  ? 'bg-[#1A1A24] text-[#00D4FF] border border-[#2A2A3A]' 
                  : 'text-[#9898B8] hover:text-[#F0F0FF] hover:bg-[#1A1A24]/50 border border-transparent'
                }
              `}
            >
              <FontAwesomeIcon icon={tab.icon} className={activeTab === tab.id ? 'text-[#00D4FF]' : 'text-[#5C5C7A]'} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-[#F0F0FF] uppercase tracking-wider">Interface</h3>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[#F0F0FF] font-medium">Language</div>
                        <div className="text-[#5C5C7A] text-sm">Interface language (English only for now)</div>
                      </div>
                      <select 
                        value={globalSettings.language}
                        onChange={(e) => updateGlobalSettings({ language: e.target.value })}
                        className="bg-[#1A1A24] border border-[#2A2A3A] text-[#F0F0FF] text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#00D4FF]"
                      >
                        <option value="English">English</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[#F0F0FF] font-medium">Default AI Model</div>
                        <div className="text-[#5C5C7A] text-sm">Model used for new chats</div>
                      </div>
                      <select 
                        value={globalSettings.defaultModel}
                        onChange={(e) => updateGlobalSettings({ defaultModel: e.target.value })}
                        className="bg-[#1A1A24] border border-[#2A2A3A] text-[#F0F0FF] text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#00D4FF]"
                      >
                        <option value="gemini-3-flash-preview">⚡ Gemini 3.0 Flash</option>
                        <option value="gemini-3.1-pro-preview">🧠 Gemini 3.1 Pro</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[#F0F0FF] font-medium">Chat Font Size</div>
                        <div className="text-[#5C5C7A] text-sm">Adjust text size in messages</div>
                      </div>
                      <select 
                        value={globalSettings.fontSize}
                        onChange={(e) => updateGlobalSettings({ fontSize: e.target.value as any })}
                        className="bg-[#1A1A24] border border-[#2A2A3A] text-[#F0F0FF] text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#00D4FF]"
                      >
                        <option value="Small">Small</option>
                        <option value="Medium">Medium</option>
                        <option value="Large">Large</option>
                      </select>
                    </div>
                  </div>

                  <div className="h-px bg-[#2A2A3A] w-full" />

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-[#F0F0FF] uppercase tracking-wider">Preferences</h3>
                    
                    <label className="flex items-center justify-between cursor-pointer group">
                      <div>
                        <div className="text-[#F0F0FF] font-medium group-hover:text-[#00D4FF] transition-colors">Show Token Count</div>
                        <div className="text-[#5C5C7A] text-sm">Display token usage below AI messages</div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={globalSettings.showTokenCount}
                        onChange={(e) => updateGlobalSettings({ showTokenCount: e.target.checked })}
                        className="w-5 h-5 rounded border-[#2A2A3A] bg-[#1A1A24] text-[#00D4FF] focus:ring-[#00D4FF] focus:ring-offset-[#0A0A0F]"
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer group">
                      <div>
                        <div className="text-[#F0F0FF] font-medium group-hover:text-[#00D4FF] transition-colors">Show Timestamps</div>
                        <div className="text-[#5C5C7A] text-sm">Display time on messages</div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={globalSettings.showTimestamps}
                        onChange={(e) => updateGlobalSettings({ showTimestamps: e.target.checked })}
                        className="w-5 h-5 rounded border-[#2A2A3A] bg-[#1A1A24] text-[#00D4FF] focus:ring-[#00D4FF] focus:ring-offset-[#0A0A0F]"
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer group">
                      <div>
                        <div className="text-[#F0F0FF] font-medium group-hover:text-[#00D4FF] transition-colors">Auto-scroll to bottom</div>
                        <div className="text-[#5C5C7A] text-sm">Automatically scroll when new messages arrive</div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={globalSettings.autoScroll}
                        onChange={(e) => updateGlobalSettings({ autoScroll: e.target.checked })}
                        className="w-5 h-5 rounded border-[#2A2A3A] bg-[#1A1A24] text-[#00D4FF] focus:ring-[#00D4FF] focus:ring-offset-[#0A0A0F]"
                      />
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'ai' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[#F0F0FF] font-medium">System Prompt</label>
                      <button className="text-xs text-[#00D4FF] hover:underline">Reset to default</button>
                    </div>
                    <textarea 
                      placeholder="You are a helpful assistant..."
                      className="w-full h-32 bg-[#1A1A24] border border-[#2A2A3A] rounded-xl p-3 text-sm text-[#F0F0FF] placeholder-[#5C5C7A] focus:outline-none focus:border-[#00D4FF] resize-none custom-scrollbar"
                      maxLength={2000}
                    />
                    <div className="text-right text-xs text-[#5C5C7A]">0 / 2000</div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[#F0F0FF] font-medium">Creativity (Temperature)</label>
                      <span className="text-sm font-mono text-[#00D4FF]">0.7</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" max="2" step="0.1" 
                      defaultValue="0.7"
                      className="w-full accent-[#00D4FF] bg-[#2A2A3A] h-1.5 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-[#5C5C7A]">
                      <span>Precise</span>
                      <span>Creative</span>
                    </div>
                  </div>

                  <div className="h-px bg-[#2A2A3A] w-full" />

                  <div className="space-y-4">
                    <label className="flex items-center justify-between cursor-pointer group">
                      <div>
                        <div className="text-[#F0F0FF] font-medium group-hover:text-[#00D4FF] transition-colors">Enable Markdown</div>
                        <div className="text-[#5C5C7A] text-sm">Render bold, italics, tables, etc.</div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={globalSettings.markdownEnabled}
                        onChange={(e) => updateGlobalSettings({ markdownEnabled: e.target.checked })}
                        className="w-5 h-5 rounded border-[#2A2A3A] bg-[#1A1A24] text-[#00D4FF] focus:ring-[#00D4FF] focus:ring-offset-[#0A0A0F]"
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer group">
                      <div>
                        <div className="text-[#F0F0FF] font-medium group-hover:text-[#00D4FF] transition-colors">Syntax Highlighting</div>
                        <div className="text-[#5C5C7A] text-sm">Colorize code blocks</div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={globalSettings.syntaxHighlighting}
                        onChange={(e) => updateGlobalSettings({ syntaxHighlighting: e.target.checked })}
                        className="w-5 h-5 rounded border-[#2A2A3A] bg-[#1A1A24] text-[#00D4FF] focus:ring-[#00D4FF] focus:ring-offset-[#0A0A0F]"
                      />
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'account' && (
                <div className="space-y-8">
                  <div className="flex items-center gap-6">
                    <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#7B61FF] p-[2px]">
                      <div className="w-full h-full bg-[#0A0A0F] rounded-full overflow-hidden flex items-center justify-center">
                        {user?.photoURL ? (
                          <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl font-bold text-white">
                            {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="Display Name"
                          className="flex-1 bg-[#1A1A24] border border-[#2A2A3A] rounded-lg px-3 py-2 text-[#F0F0FF] focus:outline-none focus:border-[#00D4FF]"
                        />
                        <button 
                          onClick={() => handleUpdateProfile(displayName)}
                          disabled={loading || displayName === user?.displayName}
                          className="px-4 py-2 bg-[#1A1A24] border border-[#2A2A3A] rounded-lg text-sm text-[#F0F0FF] hover:bg-[#22222E] disabled:opacity-50 transition-colors"
                        >
                          Save
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[#9898B8]">{user?.email}</span>
                        {user?.emailVerified ? (
                          <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-[10px] font-bold uppercase tracking-wider border border-green-500/20">Verified</span>
                        ) : (
                          <button 
                            onClick={sendEmailVerification}
                            className="px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 text-[10px] font-bold uppercase tracking-wider border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors"
                          >
                            Verify Email
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-[#2A2A3A] w-full" />

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-[#F0F0FF] uppercase tracking-wider">Account Security</h3>
                    
                    {/* Email Update Section */}
                    <div className="space-y-2">
                      <label className="text-sm text-[#9898B8]">Email Address</label>
                      <div className="flex gap-2">
                        <input 
                          type="email" 
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          placeholder="New Email Address"
                          className="flex-1 bg-[#1A1A24] border border-[#2A2A3A] rounded-lg px-3 py-2 text-[#F0F0FF] focus:outline-none focus:border-[#00D4FF]"
                        />
                        <button 
                          onClick={handleUpdateEmail}
                          disabled={loading || !newEmail || newEmail === user?.email}
                          className="px-4 py-2 bg-[#1A1A24] border border-[#2A2A3A] rounded-lg text-sm text-[#F0F0FF] hover:bg-[#22222E] disabled:opacity-50 transition-colors"
                        >
                          Update
                        </button>
                      </div>
                    </div>

                    {/* Password Update Section */}
                    <div className="space-y-2">
                      <label className="text-sm text-[#9898B8]">New Password</label>
                      <div className="flex gap-2">
                        <input 
                          type="password" 
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          className="flex-1 bg-[#1A1A24] border border-[#2A2A3A] rounded-lg px-3 py-2 text-[#F0F0FF] focus:outline-none focus:border-[#00D4FF]"
                        />
                        <button 
                          onClick={handleUpdatePassword}
                          disabled={loading || !newPassword || newPassword.length < 6}
                          className="px-4 py-2 bg-[#1A1A24] border border-[#2A2A3A] rounded-lg text-sm text-[#F0F0FF] hover:bg-[#22222E] disabled:opacity-50 transition-colors"
                        >
                          Update
                        </button>
                      </div>
                      <p className="text-xs text-[#5C5C7A]">Password must be at least 6 characters long.</p>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl border border-[#FF4D6A]/30 bg-[#FF4D6A]/5 space-y-4">
                    <h3 className="text-sm font-bold text-[#FF4D6A] uppercase tracking-wider flex items-center gap-2">
                      <FontAwesomeIcon icon={faExclamationTriangle} /> Danger Zone
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button 
                        onClick={() => setOpenModal('delete-confirm', { type: 'history' })}
                        className="flex-1 px-4 py-2 bg-[#1A1A24] border border-[#FF4D6A]/30 text-[#FF4D6A] rounded-lg hover:bg-[#FF4D6A]/10 transition-colors text-sm font-medium"
                      >
                        Delete All Chat History
                      </button>
                      <button 
                        onClick={() => setOpenModal('delete-confirm', { type: 'account' })}
                        className="flex-1 px-4 py-2 bg-[#FF4D6A] text-white rounded-lg hover:bg-[#FF4D6A]/90 transition-colors text-sm font-medium"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'help' && (
                <div className="space-y-8">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#00D4FF] to-[#7B61FF] p-[1.5px] shadow-lg">
                      <div className="w-full h-full bg-[#0A0A0F] rounded-[14.5px] overflow-hidden flex items-center justify-center">
                        <img src="/logo.png" alt="VF" className="w-full h-full object-cover scale-110" />
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-[#F0F0FF]">VortexFlow AI</h2>
                    <p className="text-sm text-[#5C5C7A]">Version 1.0.0-beta</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Link to="/docs" className="flex items-center justify-between p-3 rounded-xl bg-[#1A1A24] border border-[#2A2A3A] hover:border-[#00D4FF] transition-colors group">
                      <span className="text-sm font-medium text-[#F0F0FF]">Documentation</span>
                      <FontAwesomeIcon icon={faExternalLinkAlt} className="text-[#5C5C7A] group-hover:text-[#00D4FF] text-xs" />
                    </Link>
                    <Link to="/docs" className="flex items-center justify-between p-3 rounded-xl bg-[#1A1A24] border border-[#2A2A3A] hover:border-[#00D4FF] transition-colors group">
                      <span className="text-sm font-medium text-[#F0F0FF]">Help Center</span>
                      <FontAwesomeIcon icon={faExternalLinkAlt} className="text-[#5C5C7A] group-hover:text-[#00D4FF] text-xs" />
                    </Link>
                    <Link to="/docs/privacy" className="flex items-center justify-between p-3 rounded-xl bg-[#1A1A24] border border-[#2A2A3A] hover:border-[#00D4FF] transition-colors group">
                      <span className="text-sm font-medium text-[#F0F0FF]">Privacy Policy</span>
                      <FontAwesomeIcon icon={faExternalLinkAlt} className="text-[#5C5C7A] group-hover:text-[#00D4FF] text-xs" />
                    </Link>
                    <Link to="/docs/terms" className="flex items-center justify-between p-3 rounded-xl bg-[#1A1A24] border border-[#2A2A3A] hover:border-[#00D4FF] transition-colors group">
                      <span className="text-sm font-medium text-[#F0F0FF]">Terms of Service</span>
                      <FontAwesomeIcon icon={faExternalLinkAlt} className="text-[#5C5C7A] group-hover:text-[#00D4FF] text-xs" />
                    </Link>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-[#F0F0FF] uppercase tracking-wider flex items-center gap-2">
                      <FontAwesomeIcon icon={faKeyboard} /> Keyboard Shortcuts
                    </h3>
                    <div className="bg-[#1A1A24] border border-[#2A2A3A] rounded-xl overflow-hidden">
                      <table className="w-full text-sm text-left">
                        <tbody>
                          <tr className="border-b border-[#2A2A3A]">
                            <td className="py-2 px-4 text-[#9898B8]">New Chat</td>
                            <td className="py-2 px-4 text-right"><kbd className="px-2 py-1 bg-[#0A0A0F] border border-[#2A2A3A] rounded text-xs font-mono text-[#F0F0FF]">Ctrl+K</kbd></td>
                          </tr>
                          <tr className="border-b border-[#2A2A3A]">
                            <td className="py-2 px-4 text-[#9898B8]">Toggle Sidebar</td>
                            <td className="py-2 px-4 text-right"><kbd className="px-2 py-1 bg-[#0A0A0F] border border-[#2A2A3A] rounded text-xs font-mono text-[#F0F0FF]">Ctrl+B</kbd></td>
                          </tr>
                          <tr className="border-b border-[#2A2A3A]">
                            <td className="py-2 px-4 text-[#9898B8]">Open Settings</td>
                            <td className="py-2 px-4 text-right"><kbd className="px-2 py-1 bg-[#0A0A0F] border border-[#2A2A3A] rounded text-xs font-mono text-[#F0F0FF]">Ctrl+,</kbd></td>
                          </tr>
                          <tr className="border-b border-[#2A2A3A]">
                            <td className="py-2 px-4 text-[#9898B8]">Close Modal</td>
                            <td className="py-2 px-4 text-right"><kbd className="px-2 py-1 bg-[#0A0A0F] border border-[#2A2A3A] rounded text-xs font-mono text-[#F0F0FF]">Esc</kbd></td>
                          </tr>
                          <tr>
                            <td className="py-2 px-4 text-[#9898B8]">Send Message</td>
                            <td className="py-2 px-4 text-right"><kbd className="px-2 py-1 bg-[#0A0A0F] border border-[#2A2A3A] rounded text-xs font-mono text-[#F0F0FF]">Enter</kbd></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="text-center text-xs text-[#5C5C7A]">
                    Built with ♥ using React + Firebase + Gemini
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Modal>
  );
};

export default SettingsModal;
