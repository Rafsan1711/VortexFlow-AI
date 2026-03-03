import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationTriangle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

interface OverallBannerProps {
  status: 'operational' | 'degraded' | 'outage';
}

export const OverallBanner: React.FC<OverallBannerProps> = ({ status }) => {
  const getBannerContent = () => {
    switch (status) {
      case 'operational':
        return {
          bg: 'bg-gradient-to-r from-emerald-900/50 to-emerald-800/30',
          border: 'border-emerald-500/50',
          icon: faCheckCircle,
          color: 'text-emerald-400',
          title: 'All Systems Operational',
          desc: 'All services are running smoothly.'
        };
      case 'degraded':
        return {
          bg: 'bg-gradient-to-r from-amber-900/50 to-amber-800/30',
          border: 'border-amber-500/50',
          icon: faExclamationTriangle,
          color: 'text-amber-400',
          title: 'Partial Service Disruption',
          desc: 'Some services are experiencing degraded performance.'
        };
      case 'outage':
        return {
          bg: 'bg-gradient-to-r from-red-900/50 to-red-800/30',
          border: 'border-red-500/50',
          icon: faTimesCircle,
          color: 'text-red-400',
          title: 'Service Outage Detected',
          desc: 'Major service disruption affecting core functionality.'
        };
    }
  };

  const content = getBannerContent();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-xl border ${content.border} ${content.bg} p-8 mb-12`}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-2 ${content.color.replace('text', 'bg')} animate-pulse`}></div>
      <div className="flex items-center gap-6 relative z-10">
        <div className={`p-4 rounded-full bg-black/20 backdrop-blur-sm border border-white/10 ${content.color}`}>
          <FontAwesomeIcon icon={content.icon} className="text-3xl" />
        </div>
        <div>
          <h2 className={`text-2xl font-bold mb-2 ${content.color}`}>{content.title}</h2>
          <p className="text-gray-300 text-lg">{content.desc}</p>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-white/5 to-transparent pointer-events-none"></div>
    </motion.div>
  );
};
