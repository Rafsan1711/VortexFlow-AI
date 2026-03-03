import { useState, useEffect, ReactNode } from 'react';
import Sidebar from './Sidebar';
import { useAppStore } from '../../store/useAppStore';

interface ChatLayoutProps {
  children: ReactNode;
}

const ChatLayout = ({ children }: ChatLayoutProps) => {
  const { isSidebarOpen, toggleSidebar } = useAppStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="flex h-[100dvh] bg-[#0A0A0F] overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative transition-all duration-300 h-full">
        {children}
      </div>
    </div>
  );
};

export default ChatLayout;
