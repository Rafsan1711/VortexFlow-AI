import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSignOutAlt, faStar } from '@fortawesome/free-solid-svg-icons';
import Modal from '../ui/Modal';
import { useAppStore } from '../../store/useAppStore';
import { useAuth } from '../../hooks/useAuth';

const ProfileModal = () => {
  const { openModal, closeModal, user, chats, setOpenModal } = useAppStore();
  const { signOut } = useAuth();

  const totalMessages = chats.reduce((acc, chat) => acc + (chat.messageCount || 0), 0);
  const daysActive = Math.max(1, Math.floor((Date.now() - (user?.metadata?.creationTime ? new Date(user.metadata.creationTime).getTime() : Date.now())) / (1000 * 60 * 60 * 24)));

  const handleEditProfile = () => {
    setOpenModal('settings', { tab: 'account' });
  };

  const handleSignOut = async () => {
    closeModal();
    await signOut();
  };

  return (
    <Modal
      isOpen={openModal === 'profile'}
      onClose={closeModal}
      size="md"
      hideCloseButton
    >
      <div className="flex flex-col items-center text-center space-y-6">
        {/* Avatar */}
        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#7B61FF] p-[3px] shadow-[0_0_20px_rgba(0,212,255,0.3)]">
          <div className="w-full h-full bg-[#0A0A0F] rounded-full overflow-hidden flex items-center justify-center">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-white">
                {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </span>
            )}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-[#0A0A0F] rounded-full p-1">
            <div className="w-6 h-6 rounded-full bg-[#FFB830] flex items-center justify-center shadow-[0_0_10px_rgba(255,184,48,0.5)]">
              <FontAwesomeIcon icon={faStar} className="text-[#0A0A0F] text-[10px]" />
            </div>
          </div>
        </div>

        {/* Info */}
        <div>
          <h2 className="text-2xl font-bold text-[#F0F0FF] mb-1">{user?.displayName || 'User'}</h2>
          <p className="text-[#9898B8] text-sm">{user?.email}</p>
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFB830]/10 border border-[#FFB830]/20 text-[#FFB830] text-xs font-bold uppercase tracking-wider">
            Free Plan
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 w-full pt-6 border-t border-[#2A2A3A]">
          <div className="flex flex-col items-center p-4 rounded-2xl bg-[#1A1A24] border border-[#2A2A3A]">
            <span className="text-2xl font-bold text-[#F0F0FF] mb-1">{chats.length}</span>
            <span className="text-[10px] text-[#5C5C7A] uppercase tracking-wider font-semibold">Chats</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-2xl bg-[#1A1A24] border border-[#2A2A3A]">
            <span className="text-2xl font-bold text-[#F0F0FF] mb-1">{totalMessages}</span>
            <span className="text-[10px] text-[#5C5C7A] uppercase tracking-wider font-semibold">Messages</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-2xl bg-[#1A1A24] border border-[#2A2A3A]">
            <span className="text-2xl font-bold text-[#F0F0FF] mb-1">{daysActive}</span>
            <span className="text-[10px] text-[#5C5C7A] uppercase tracking-wider font-semibold">Days Active</span>
          </div>
        </div>

        {/* Activity Graph (Simple CSS Bars) */}
        <div className="w-full pt-6 border-t border-[#2A2A3A] space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-[#F0F0FF]">Activity (Last 7 Days)</h3>
          </div>
          <div className="flex items-end justify-between h-24 gap-2">
            {[40, 70, 30, 90, 50, 20, 80].map((height, i) => (
              <div key={i} className="w-full bg-[#1A1A24] rounded-t-md relative group">
                <div 
                  className="absolute bottom-0 w-full bg-gradient-to-t from-[#00D4FF] to-[#7B61FF] rounded-t-md transition-all duration-500 group-hover:opacity-80"
                  style={{ height: `${height}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-[#5C5C7A] uppercase tracking-wider font-mono">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex w-full gap-3 pt-6 border-t border-[#2A2A3A]">
          <button 
            onClick={handleEditProfile}
            className="flex-1 py-3 bg-[#1A1A24] border border-[#2A2A3A] text-[#F0F0FF] rounded-xl hover:bg-[#22222E] transition-colors font-medium flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faEdit} /> Edit Profile
          </button>
          <button 
            onClick={handleSignOut}
            className="flex-1 py-3 bg-[#FF4D6A]/10 border border-[#FF4D6A]/20 text-[#FF4D6A] rounded-xl hover:bg-[#FF4D6A]/20 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faSignOutAlt} /> Sign Out
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ProfileModal;
