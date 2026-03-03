import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface DropdownItem {
  label: string;
  icon?: IconDefinition;
  action?: () => void;
  divider?: boolean;
  danger?: boolean;
  disabled?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ trigger, items, align = 'right', className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`absolute z-50 mt-2 w-56 rounded-xl bg-[#111118] border border-[#2A2A3A] shadow-xl overflow-hidden ${
              align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left'
            }`}
          >
            <div className="py-1" role="menu" aria-orientation="vertical">
              {items.map((item, index) => {
                if (item.divider) {
                  return <div key={index} className="h-px bg-[#2A2A3A] my-1" />;
                }

                return (
                  <button
                    key={index}
                    onClick={() => {
                      if (!item.disabled && item.action) {
                        item.action();
                        setIsOpen(false);
                      }
                    }}
                    disabled={item.disabled}
                    className={`
                      w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors
                      ${item.disabled ? 'opacity-50 cursor-not-allowed text-[#5C5C7A]' : 
                        item.danger ? 'text-[#FF4D6A] hover:bg-[#FF4D6A]/10' : 
                        'text-[#F0F0FF] hover:bg-[#1A1A24] hover:text-[#00D4FF]'
                      }
                    `}
                    role="menuitem"
                  >
                    {item.icon && (
                      <FontAwesomeIcon icon={item.icon} className={`w-4 ${item.danger ? 'text-[#FF4D6A]' : 'text-[#5C5C7A]'}`} />
                    )}
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
