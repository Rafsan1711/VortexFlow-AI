import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faBolt, faBrain } from '@fortawesome/free-solid-svg-icons';
import Modal from '../ui/Modal';
import { useAppStore } from '../../store/useAppStore';

const ModelPickerModal = () => {
  const { openModal, closeModal, activeChatId, chatSettings, updateChatSettings, globalSettings, updateGlobalSettings } = useAppStore();
  const currentModel = activeChatId ? (chatSettings[activeChatId]?.model || globalSettings.defaultModel) : globalSettings.defaultModel;
  const [selectedModel, setSelectedModel] = useState(currentModel);
  const [applyToChat, setApplyToChat] = useState(true);
  const [setAsDefault, setSetAsDefault] = useState(false);

  const handleConfirm = () => {
    if (applyToChat && activeChatId) {
      updateChatSettings(activeChatId, { model: selectedModel });
    }
    if (setAsDefault) {
      updateGlobalSettings({ defaultModel: selectedModel });
    }
    closeModal();
  };

  return (
    <Modal
      isOpen={openModal === 'model-picker'}
      onClose={closeModal}
      title="Choose AI Model"
      size="md"
      footer={
        <div className="flex justify-end gap-3 w-full">
          <button 
            onClick={closeModal}
            className="px-6 py-2 bg-[#1A1A24] text-[#F0F0FF] font-semibold rounded-xl hover:bg-[#22222E] transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleConfirm}
            className="px-6 py-2 bg-gradient-to-r from-[#00D4FF] to-[#7B61FF] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            Confirm
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Model Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Flash */}
          <div 
            onClick={() => setSelectedModel('gemini-3-flash-preview')}
            className={`
              relative p-5 rounded-2xl border transition-all cursor-pointer overflow-hidden group
              ${selectedModel === 'gemini-3-flash-preview' 
                ? 'border-[#00D4FF] bg-[#00D4FF]/5 shadow-[0_0_20px_rgba(0,212,255,0.15)]' 
                : 'border-[#2A2A3A] bg-[#111118] hover:border-[#3D3D52]'
              }
            `}
          >
            {selectedModel === 'gemini-3-flash-preview' && (
              <div className="absolute top-3 right-3 text-[#00D4FF]">
                <FontAwesomeIcon icon={faCheck} />
              </div>
            )}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#1A1A24] flex items-center justify-center text-[#00D4FF] group-hover:scale-110 transition-transform">
                <FontAwesomeIcon icon={faBolt} size="lg" />
              </div>
              <div>
                <h3 className="font-bold text-[#F0F0FF]">Gemini 3.0 Flash</h3>
                <span className="inline-block px-2 py-0.5 rounded-full bg-[#00D4FF]/10 text-[#00D4FF] text-[10px] uppercase tracking-wider font-bold mt-1">Recommended</span>
              </div>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[#5C5C7A]">Speed</span>
                <div className="flex text-[#00D4FF] text-[10px] tracking-widest">
                  ████████░░
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#5C5C7A]">Quality</span>
                <div className="flex text-[#7B61FF] text-[10px] tracking-widest">
                  ███████░░░
                </div>
              </div>
              <div className="pt-3 border-t border-[#2A2A3A]">
                <span className="text-[#9898B8] text-xs leading-relaxed">Best for: Quick answers, coding, general use</span>
              </div>
            </div>
          </div>

          {/* Card 2: Pro */}
          <div 
            onClick={() => setSelectedModel('gemini-3.1-pro-preview')}
            className={`
              relative p-5 rounded-2xl border transition-all cursor-pointer overflow-hidden group
              ${selectedModel === 'gemini-3.1-pro-preview' 
                ? 'border-[#7B61FF] bg-[#7B61FF]/5 shadow-[0_0_20px_rgba(123,97,255,0.15)]' 
                : 'border-[#2A2A3A] bg-[#111118] hover:border-[#3D3D52]'
              }
            `}
          >
            {selectedModel === 'gemini-3.1-pro-preview' && (
              <div className="absolute top-3 right-3 text-[#7B61FF]">
                <FontAwesomeIcon icon={faCheck} />
              </div>
            )}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#1A1A24] flex items-center justify-center text-[#7B61FF] group-hover:scale-110 transition-transform">
                <FontAwesomeIcon icon={faBrain} size="lg" />
              </div>
              <div>
                <h3 className="font-bold text-[#F0F0FF]">Gemini 3.1 Pro</h3>
                <span className="inline-block px-2 py-0.5 rounded-full bg-[#7B61FF]/10 text-[#7B61FF] text-[10px] uppercase tracking-wider font-bold mt-1">Most Capable</span>
              </div>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[#5C5C7A]">Speed</span>
                <div className="flex text-[#00D4FF] text-[10px] tracking-widest">
                  ██████░░░░
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#5C5C7A]">Quality</span>
                <div className="flex text-[#7B61FF] text-[10px] tracking-widest">
                  ██████████
                </div>
              </div>
              <div className="pt-3 border-t border-[#2A2A3A]">
                <span className="text-[#9898B8] text-xs leading-relaxed">Best for: Complex reasoning, long documents, deep analysis</span>
              </div>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3 pt-4 border-t border-[#2A2A3A]">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${applyToChat ? 'bg-[#00D4FF] border-[#00D4FF]' : 'border-[#2A2A3A] group-hover:border-[#5C5C7A]'}`}>
              {applyToChat && <FontAwesomeIcon icon={faCheck} className="text-[#0A0A0F] text-xs" />}
            </div>
            <input 
              type="checkbox" 
              className="hidden" 
              checked={applyToChat} 
              onChange={(e) => setApplyToChat(e.target.checked)} 
              disabled={!activeChatId}
            />
            <span className={`text-sm ${!activeChatId ? 'text-[#5C5C7A]' : 'text-[#F0F0FF]'}`}>Apply to this chat</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${setAsDefault ? 'bg-[#00D4FF] border-[#00D4FF]' : 'border-[#2A2A3A] group-hover:border-[#5C5C7A]'}`}>
              {setAsDefault && <FontAwesomeIcon icon={faCheck} className="text-[#0A0A0F] text-xs" />}
            </div>
            <input 
              type="checkbox" 
              className="hidden" 
              checked={setAsDefault} 
              onChange={(e) => setSetAsDefault(e.target.checked)} 
            />
            <span className="text-sm text-[#F0F0FF]">Set as default for new chats</span>
          </label>
        </div>
      </div>
    </Modal>
  );
};

export default ModelPickerModal;
