import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faClock, faLink } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { Incident } from '../../hooks/useStatus';
import { format } from 'date-fns';

interface IncidentCardProps {
  incident: Incident;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({ incident }) => {
  const getSeverityColor = (severity: Incident['severity']) => {
    switch (severity) {
      case 'critical': return 'border-red-500/50 bg-red-900/20';
      case 'major': return 'border-orange-500/50 bg-orange-900/20';
      case 'minor': return 'border-amber-500/50 bg-amber-900/20';
      default: return 'border-gray-500/50 bg-gray-900/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border rounded-lg p-6 mb-4 ${getSeverityColor(incident.severity)} backdrop-blur-sm`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-amber-400" />
          <h3 className="font-semibold text-lg text-white">{incident.title}</h3>
        </div>
        <span className="px-3 py-1 rounded-full bg-black/30 text-xs font-mono text-gray-300 border border-white/10">
          {incident.status.toUpperCase()}
        </span>
      </div>
      
      <p className="text-gray-300 mb-4 text-sm leading-relaxed">
        {incident.description}
      </p>

      <div className="flex items-center justify-between text-xs text-gray-400 font-mono border-t border-white/5 pt-4">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <FontAwesomeIcon icon={faClock} />
            Started: {format(new Date(incident.createdAt), 'MMM d, HH:mm')}
          </span>
          {incident.updatedAt && (
            <span>Updated: {format(new Date(incident.updatedAt), 'MMM d, HH:mm')}</span>
          )}
        </div>
        
        {incident.url && (
          <a 
            href={incident.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            View Details <FontAwesomeIcon icon={faLink} />
          </a>
        )}
      </div>
    </motion.div>
  );
};
