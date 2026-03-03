import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const TerminalBootSequence = ({ onComplete }: { onComplete: () => void }) => {
  const [lines, setLines] = useState<string[]>([]);
  
  const sequence = [
    "INITIALIZING VORTEX PROTOCOL...",
    "BYPASSING MAINFRAME SECURITY...",
    "ESTABLISHING SECURE CONNECTION...",
    "ACCESS GRANTED."
  ];

  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < sequence.length) {
        setLines(prev => [...prev, sequence[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 600);
      }
    }, 500);
    
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="flex-1 bg-[#0D0D0D] p-6 font-mono text-sm flex flex-col justify-center items-center h-full w-full">
      <div className="w-full max-w-md">
        {lines.map((line, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`mb-3 text-lg ${i === sequence.length - 1 ? 'text-[#00E5A0] font-bold' : 'text-[#00D4FF]'}`}
          >
            {'>'} {line}
          </motion.div>
        ))}
        <motion.div 
          animate={{ opacity: [1, 0] }} 
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="w-3 h-5 bg-[#00E5A0] mt-2 inline-block"
        />
      </div>
    </div>
  );
};

export default TerminalBootSequence;
