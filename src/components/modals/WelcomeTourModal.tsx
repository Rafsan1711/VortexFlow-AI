import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft, faCheck, faBolt, faBrain, faCog, faComments } from '@fortawesome/free-solid-svg-icons';
import Modal from '../ui/Modal';
import { useAppStore } from '../../store/useAppStore';

const WelcomeTourModal = () => {
  const { openModal, closeModal, user } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (currentStep === 4) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [currentStep]);

  const steps = [
    {
      title: "Welcome to VortexFlow AI",
      content: "Experience next-generation conversations powered by advanced AI models. Fast, intelligent, and beautifully designed for your workflow.",
      icon: (
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#00D4FF] to-[#7B61FF] p-[2px] shadow-[0_0_30px_rgba(0,212,255,0.3)]">
          <div className="w-full h-full bg-[#0A0A0F] rounded-[22px] overflow-hidden flex items-center justify-center">
            <img src="/logo.png" alt="VF" className="w-full h-full object-cover scale-110" />
          </div>
        </div>
      )
    },
    {
      title: "Start a Conversation",
      content: "Type your question in the input bar below, or choose from our curated suggestion cards to get started instantly.",
      icon: (
        <div className="w-20 h-20 rounded-2xl bg-[#1A1A24] border border-[#2A2A3A] flex items-center justify-center text-[#00D4FF] shadow-lg">
          <FontAwesomeIcon icon={faComments} size="2x" />
        </div>
      )
    },
    {
      title: "Choose Your Model",
      content: "Switch between models based on your needs. Use Flash for speed and everyday tasks, or Pro for complex reasoning and deep analysis.",
      icon: (
        <div className="flex gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#00D4FF]/10 border border-[#00D4FF]/30 flex items-center justify-center text-[#00D4FF]">
            <FontAwesomeIcon icon={faBolt} size="xl" />
          </div>
          <div className="w-16 h-16 rounded-2xl bg-[#7B61FF]/10 border border-[#7B61FF]/30 flex items-center justify-center text-[#7B61FF]">
            <FontAwesomeIcon icon={faBrain} size="xl" />
          </div>
        </div>
      )
    },
    {
      title: "Customize Everything",
      content: "Tailor the AI to your liking. Adjust creativity, set custom system prompts, and tweak the interface in Settings.",
      icon: (
        <div className="w-20 h-20 rounded-2xl bg-[#1A1A24] border border-[#2A2A3A] flex items-center justify-center text-[#9898B8] shadow-lg">
          <FontAwesomeIcon icon={faCog} size="2x" className="animate-spin-slow" />
        </div>
      )
    },
    {
      title: "You're All Set!",
      content: "Ready to explore the future of AI? Your intelligent assistant is waiting.",
      icon: (
        <div className="w-24 h-24 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400 shadow-[0_0_30px_rgba(74,222,128,0.2)]">
          <FontAwesomeIcon icon={faCheck} size="3x" />
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      closeModal();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Modal
      isOpen={openModal === 'welcome-tour'}
      onClose={closeModal}
      size="lg"
      hideCloseButton
    >
      <div className="flex flex-col items-center text-center py-8 px-4 relative overflow-hidden min-h-[400px]">
        {/* Confetti Effect (Simple CSS implementation) */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -50, x: 0, opacity: 1, rotate: 0 }}
                animate={{ 
                  y: 400, 
                  x: (Math.random() - 0.5) * 200, 
                  opacity: 0, 
                  rotate: Math.random() * 360 
                }}
                transition={{ duration: 2 + Math.random() * 2, ease: "easeOut" }}
                className={`absolute top-0 w-3 h-3 rounded-sm ${
                  ['bg-[#00D4FF]', 'bg-[#7B61FF]', 'bg-[#FFB830]', 'bg-[#FF4D6A]'][Math.floor(Math.random() * 4)]
                }`}
                style={{ left: `${50 + (Math.random() - 0.5) * 50}%` }}
              />
            ))}
          </div>
        )}

        {/* Progress Dots */}
        <div className="flex gap-2 mb-12">
          {steps.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentStep ? 'w-8 bg-[#00D4FF]' : 'w-2 bg-[#2A2A3A]'
              }`}
            />
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              <div className="mb-8">
                {steps[currentStep].icon}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#F0F0FF] mb-4">
                {steps[currentStep].title}
              </h2>
              <p className="text-[#9898B8] text-base leading-relaxed">
                {steps[currentStep].content}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between w-full mt-12 pt-6 border-t border-[#2A2A3A]">
          <button 
            onClick={closeModal}
            className="text-sm text-[#5C5C7A] hover:text-[#F0F0FF] font-medium transition-colors"
          >
            Skip Tour
          </button>
          
          <div className="flex gap-3">
            {currentStep > 0 && (
              <button 
                onClick={handlePrev}
                className="w-10 h-10 rounded-xl bg-[#1A1A24] border border-[#2A2A3A] text-[#F0F0FF] hover:bg-[#22222E] transition-colors flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
            )}
            <button 
              onClick={handleNext}
              className="px-6 py-2 bg-gradient-to-r from-[#00D4FF] to-[#7B61FF] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              {currentStep === steps.length - 1 ? 'Start Chatting' : 'Next'} 
              {currentStep !== steps.length - 1 && <FontAwesomeIcon icon={faArrowRight} />}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default WelcomeTourModal;
