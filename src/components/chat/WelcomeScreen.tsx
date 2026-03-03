import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLightbulb, 
  faCode, 
  faPen, 
  faSearch,
  faBars
} from '@fortawesome/free-solid-svg-icons';
import { useChat } from '../../hooks/useChat';
import { useAppStore } from '../../store/useAppStore';
import InputBar from './InputBar';
import { motion } from 'framer-motion';

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const { createNewChat, sendMessage } = useChat();
  const { toggleSidebar } = useAppStore();

  const handleSuggestion = async (text: string) => {
    const chatId = await createNewChat(text.slice(0, 30) + '...');
    if (chatId) {
      navigate(`/chat/${chatId}`);
      await sendMessage(chatId, text);
    }
  };

  const suggestions = [
    {
      icon: faLightbulb,
      title: "Explain a concept",
      desc: "Make any topic easy to understand",
      prompt: "Explain quantum computing simply"
    },
    {
      icon: faCode,
      title: "Write some code",
      desc: "Debug, explain, or build something new",
      prompt: "Write a Python web scraper"
    },
    {
      icon: faPen,
      title: "Help me write",
      desc: "Emails, essays, or creative content",
      prompt: "Help me write a professional email"
    },
    {
      icon: faSearch,
      title: "Analyze & summarize",
      desc: "Break down complex information",
      prompt: "Summarize the history of the internet"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 relative bg-[#0A0A0F]">
      {/* Mobile Menu Button */}
      <div className="absolute top-0 left-0 w-full p-4 flex items-center z-10 md:hidden pointer-events-none">
        <button 
          onClick={toggleSidebar}
          className="p-2 text-[#9898B8] hover:text-[#F0F0FF] transition-colors pointer-events-auto"
        >
          <FontAwesomeIcon icon={faBars} size="lg" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col items-center px-4 pt-16 md:pt-4 pb-8 custom-scrollbar w-full">
        <div className="flex-1 min-h-[1rem] md:min-h-[2rem]" />
        <motion.div 
          className="max-w-[600px] w-full text-center flex flex-col items-center shrink-0"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto rounded-3xl bg-gradient-to-br from-[#00D4FF] to-[#7B61FF] p-[2px] shadow-[0_0_25px_rgba(0,212,255,0.4)] hover:shadow-[0_0_35px_rgba(123,97,255,0.6)] transition-shadow duration-500 group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00D4FF] to-[#7B61FF] rounded-3xl opacity-50 group-hover:opacity-100 blur-md transition-opacity duration-500 animate-pulse" />
              <div className="relative w-full h-full bg-[#0A0A0F] rounded-[22px] overflow-hidden flex items-center justify-center z-10">
                <img 
                  src="/logo.png?v=2" 
                  alt="VortexFlow AI" 
                  className="w-full h-full object-contain p-1" 
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://placehold.co/128x128/00D4FF/FFFFFF?text=VF';
                  }}
                />
              </div>
            </div>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-[28px] font-bold text-[#F0F0FF] mb-2">
            How can I help you today?
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-[#5C5C7A] mb-10">
            Ask me anything — I'm powered by Google Gemini
          </motion.p>

          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                variants={itemVariants}
                onClick={() => handleSuggestion(suggestion.prompt)}
                className="p-4 rounded-xl bg-[#111118] border border-[#2A2A3A] hover:border-[#00D4FF] hover:bg-[#1A1A24] hover:shadow-[0_0_16px_rgba(0,212,255,0.1)] transition-all group text-left flex flex-col gap-2"
              >
                <div className="flex items-center gap-3 mb-1">
                  <FontAwesomeIcon icon={suggestion.icon} className="text-[#00D4FF]" />
                  <span className="text-[#F0F0FF] font-bold text-sm">
                    {suggestion.title}
                  </span>
                </div>
                <span className="text-[#5C5C7A] text-xs group-hover:text-[#9898B8] transition-colors">
                  {suggestion.desc}
                </span>
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
        <div className="flex-[2] min-h-[1rem] md:min-h-[2rem]" />
      </div>

      <div className="w-full shrink-0">
        <InputBar />
      </div>
    </div>
  );
};

export default WelcomeScreen;
