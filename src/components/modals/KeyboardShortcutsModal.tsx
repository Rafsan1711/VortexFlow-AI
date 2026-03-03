import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKeyboard } from '@fortawesome/free-solid-svg-icons';
import Modal from '../ui/Modal';
import { useAppStore } from '../../store/useAppStore';

const KeyboardShortcutsModal = () => {
  const { openModal, closeModal } = useAppStore();

  const shortcuts = [
    {
      category: 'Navigation',
      items: [
        { label: 'New Chat', keys: ['Ctrl', 'K'] },
        { label: 'Toggle Sidebar', keys: ['Ctrl', 'B'] },
        { label: 'Open Settings', keys: ['Ctrl', ','] },
      ]
    },
    {
      category: 'Chat',
      items: [
        { label: 'Send Message', keys: ['Enter'] },
        { label: 'New Line', keys: ['Shift', 'Enter'] },
      ]
    },
    {
      category: 'Interface',
      items: [
        { label: 'Close Modal', keys: ['Esc'] },
      ]
    }
  ];

  return (
    <Modal
      isOpen={openModal === 'shortcuts'}
      onClose={closeModal}
      title="Keyboard Shortcuts"
      size="md"
    >
      <div className="space-y-8 pt-2">
        {shortcuts.map((group, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="text-sm font-bold text-[#00D4FF] uppercase tracking-wider flex items-center gap-2">
              {group.category}
            </h3>
            <div className="bg-[#1A1A24] border border-[#2A2A3A] rounded-xl overflow-hidden">
              <table className="w-full text-sm text-left">
                <tbody>
                  {group.items.map((item, itemIdx) => (
                    <tr key={itemIdx} className={itemIdx !== group.items.length - 1 ? "border-b border-[#2A2A3A]" : ""}>
                      <td className="py-3 px-4 text-[#9898B8] font-medium">{item.label}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {item.keys.map((key, keyIdx) => (
                            <React.Fragment key={keyIdx}>
                              <kbd className="px-2 py-1 bg-[#0A0A0F] border border-[#3D3D52] rounded text-xs font-mono text-[#F0F0FF] shadow-sm">
                                {key}
                              </kbd>
                              {keyIdx !== item.keys.length - 1 && <span className="text-[#5C5C7A] text-xs">+</span>}
                            </React.Fragment>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default KeyboardShortcutsModal;
