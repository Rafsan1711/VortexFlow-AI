import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChatLayout from '../components/layout/ChatLayout';
import ChatWindow from '../components/chat/ChatWindow';
import WelcomeScreen from '../components/chat/WelcomeScreen';
import Terminal from '../components/terminal/Terminal';
import TerminalBootSequence from '../components/terminal/TerminalBootSequence';
import { useAppStore } from '../store/useAppStore';

const ChatPage = () => {
  const { chatId } = useParams();
  const { setActiveChatId, chats, terminalOpen, isBootingTerminal, openTerminal } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (chatId) {
      setActiveChatId(chatId);
    } else {
      setActiveChatId(null);
    }
  }, [chatId, setActiveChatId]);

  return (
    <ChatLayout>
      {isBootingTerminal ? (
        <TerminalBootSequence onComplete={openTerminal} />
      ) : terminalOpen ? (
        <Terminal />
      ) : chatId ? (
        <ChatWindow />
      ) : (
        <WelcomeScreen />
      )}
    </ChatLayout>
  );
};

export default ChatPage;
