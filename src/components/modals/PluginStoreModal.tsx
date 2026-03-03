import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faPuzzlePiece, 
  faSearch, 
  faExternalLinkAlt, 
  faCheck, 
  faSpinner, 
  faTrash,
  faTerminal,
  faCopy
} from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { PLUGINS } from '../../lib/plugins';
import { Plugin } from '../../types';
import { ref, set, get } from 'firebase/database';
import { db } from '../../lib/firebase';

const PluginStoreModal = () => {
  const { closeModal, user, installedPlugins, setInstalledPlugins, openTerminal, addTerminalLine, setPendingPlugin } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'games' | 'tools' | 'education'>('all');
  const [installing, setInstalling] = useState<string | null>(null);
  const [revealedCommand, setRevealedCommand] = useState<string | null>(null);

  // Load installed plugins on mount
  useEffect(() => {
    if (user) {
      const pluginsRef = ref(db, `users/${user.uid}/installedPlugins`);
      get(pluginsRef).then((snapshot) => {
        if (snapshot.exists()) {
          setInstalledPlugins(snapshot.val() || []);
        }
      });
    }
  }, [user, setInstalledPlugins]);

  const filteredPlugins = PLUGINS.filter(plugin => {
    const matchesSearch = plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          plugin.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTab = activeTab === 'all' || plugin.category === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleInstall = async (plugin: Plugin) => {
    if (!user) return;
    
    setInstalling(plugin.id);
    
    // Simulate network delay for animation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newInstalled = [...installedPlugins, plugin.id];
    
    try {
      await set(ref(db, `users/${user.uid}/installedPlugins`), newInstalled);
      setInstalledPlugins(newInstalled);
      setRevealedCommand(plugin.id);
    } catch (error) {
      console.error("Failed to install plugin", error);
    } finally {
      setInstalling(null);
    }
  };

  const handleUninstall = async (pluginId: string) => {
    if (!user) return;
    
    const newInstalled = installedPlugins.filter(id => id !== pluginId);
    
    try {
      await set(ref(db, `users/${user.uid}/installedPlugins`), newInstalled);
      setInstalledPlugins(newInstalled);
      if (revealedCommand === pluginId) {
        setRevealedCommand(null);
      }
    } catch (error) {
      console.error("Failed to uninstall plugin", error);
    }
  };

  const handleLaunch = (plugin: Plugin) => {
    closeModal();
    openTerminal();
    setTimeout(() => {
      setPendingPlugin(plugin);
    }, 300);
  };

  const copyCommand = (command: string) => {
    navigator.clipboard.writeText(command);
  };

  const renderLogo = (plugin: Plugin) => {
    if (plugin.logoType === 'emoji') {
      return <div className="w-12 h-12 rounded-lg bg-[#1A1A24] border border-[#2A2A3A] flex items-center justify-center text-2xl">{plugin.logoValue}</div>;
    } else if (plugin.logoType === 'fa') {
      // We'd need to map string to actual FA icon, but for simplicity let's just use a generic icon
      // or we can import specific ones. Since we have a limited set, let's use a generic puzzle piece for now
      // if we don't have a dynamic map.
      return (
        <div className="w-12 h-12 rounded-lg bg-[#1A1A24] border border-[#2A2A3A] flex items-center justify-center text-[#00D4FF]">
          <FontAwesomeIcon icon={faPuzzlePiece} size="lg" />
        </div>
      );
    } else {
      return <img src={plugin.logoValue} alt={plugin.name} className="w-12 h-12 rounded-lg object-cover border border-[#2A2A3A]" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={closeModal}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0A0A0F] border border-[#2A2A3A] rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-[#2A2A3A] flex flex-col gap-4 shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-[#F0F0FF] flex items-center gap-3">
                <FontAwesomeIcon icon={faPuzzlePiece} className="text-[#00D4FF]" />
                Plugin Store
              </h2>
              <p className="text-[#9898B8] mt-1">Extend VortexFlow with games and tools</p>
            </div>
            <button
              onClick={closeModal}
              className="w-8 h-8 rounded-full bg-[#1A1A24] flex items-center justify-center text-[#9898B8] hover:text-[#F0F0FF] hover:bg-[#2A2A3A] transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-64">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5C5C7A]" />
              <input
                type="text"
                placeholder="Search plugins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#111118] border border-[#2A2A3A] rounded-lg py-2 pl-9 pr-4 text-[#F0F0FF] placeholder-[#5C5C7A] focus:outline-none focus:border-[#00D4FF] transition-colors"
              />
            </div>

            <div className="flex gap-2 w-full md:w-auto overflow-x-auto custom-scrollbar pb-1 md:pb-0">
              {(['all', 'games', 'tools', 'education'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-colors ${
                    activeTab === tab 
                      ? 'bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/30' 
                      : 'bg-[#111118] text-[#9898B8] border border-[#2A2A3A] hover:bg-[#1A1A24]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[#0D0D14]">
          {filteredPlugins.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-[#5C5C7A]">
              <FontAwesomeIcon icon={faPuzzlePiece} className="text-4xl mb-4 opacity-50" />
              <p>No plugins found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPlugins.map((plugin) => {
                const isInstalled = installedPlugins.includes(plugin.id);
                const isInstalling = installing === plugin.id;
                const isRevealed = revealedCommand === plugin.id;

                return (
                  <div key={plugin.id} className="flex flex-col">
                    <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-5 hover:border-[#00D4FF]/50 hover:shadow-[0_0_20px_rgba(0,212,255,0.05)] transition-all group flex flex-col h-full">
                      <div className="flex gap-4 mb-3">
                        {renderLogo(plugin)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-bold text-[#F0F0FF] truncate">{plugin.name}</h3>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                              plugin.category === 'games' ? 'bg-[#00D4FF]/10 text-[#00D4FF]' :
                              plugin.category === 'tools' ? 'bg-[#FFBD2E]/10 text-[#FFBD2E]' :
                              'bg-[#7B61FF]/10 text-[#7B61FF]'
                            }`}>
                              {plugin.category}
                            </span>
                          </div>
                          <p className="text-xs text-[#5C5C7A] mt-1 flex items-center gap-1">
                            by {plugin.author}
                            {plugin.authorUrl && (
                              <a href={plugin.authorUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#00D4FF] transition-colors" onClick={(e) => e.stopPropagation()}>
                                <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />
                              </a>
                            )}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-[#9898B8] mb-4 line-clamp-2 flex-1">
                        {plugin.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {plugin.tags.map(tag => (
                          <span key={tag} className="text-[10px] bg-[#1A1A24] text-[#9898B8] px-2 py-0.5 rounded-md border border-[#2A2A3A]">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 mt-auto pt-4 border-t border-[#2A2A3A]">
                        {isInstalled ? (
                          <>
                            <button
                              onClick={() => handleLaunch(plugin)}
                              className="flex-1 bg-[#27C93F]/10 text-[#27C93F] border border-[#27C93F]/30 hover:bg-[#27C93F]/20 py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                            >
                              Launch <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />
                            </button>
                            <button
                              onClick={() => handleUninstall(plugin.id)}
                              className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#2A2A3A] text-[#5C5C7A] hover:text-[#FF4D6A] hover:bg-[#FF4D6A]/10 hover:border-[#FF4D6A]/30 transition-colors"
                              title="Uninstall"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleInstall(plugin)}
                            disabled={isInstalling}
                            className="w-full bg-gradient-to-r from-[#00D4FF] to-[#7B61FF] text-white py-2 rounded-lg font-medium text-sm hover:shadow-[0_0_15px_rgba(0,212,255,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                          >
                            {isInstalling ? (
                              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                            ) : (
                              'Install'
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Command Reveal (Inline) */}
                    <AnimatePresence>
                      {isRevealed && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          className="bg-[#1A1A24] border border-[#00D4FF]/30 rounded-xl p-3 overflow-hidden"
                        >
                          <p className="text-xs text-[#00E5A0] mb-2 font-medium">✓ Plugin installed successfully!</p>
                          <p className="text-xs text-[#9898B8] mb-2">Launch command:</p>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 bg-[#0D0D14] border border-[#2A2A3A] text-[#00D4FF] px-3 py-1.5 rounded-lg text-sm font-mono">
                              {plugin.command}
                            </code>
                            <button 
                              onClick={() => copyCommand(plugin.command)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#2A2A3A] text-[#F0F0FF] hover:bg-[#3D3D52] transition-colors"
                              title="Copy command"
                            >
                              <FontAwesomeIcon icon={faCopy} size="sm" />
                            </button>
                          </div>
                          <button
                            onClick={() => {
                              closeModal();
                              openTerminal();
                            }}
                            className="w-full mt-3 bg-[#2A2A3A] hover:bg-[#3D3D52] text-[#F0F0FF] py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2"
                          >
                            <FontAwesomeIcon icon={faTerminal} size="sm" />
                            Open Terminal
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PluginStoreModal;
