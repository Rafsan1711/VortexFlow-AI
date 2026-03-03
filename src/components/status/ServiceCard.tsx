import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDatabase, faLock, faServer, faRobot, faGlobe, faSpinner, faCheckCircle, faExclamationTriangle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { ServiceStatus } from '../../hooks/useStatus';
import { UptimeBar } from './UptimeBar';

interface ServiceCardProps {
  service: ServiceStatus;
}

const getIcon = (id: string) => {
  switch (id) {
    case 'firebase-db': return faDatabase;
    case 'firebase-auth': return faLock;
    case 'vercel': return faServer;
    case 'gemini': return faRobot;
    case 'vortexflow': return faGlobe;
    default: return faServer;
  }
};

const getStatusColor = (status: ServiceStatus['status']) => {
  switch (status) {
    case 'operational': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    case 'degraded': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    case 'partial_outage': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
    case 'major_outage': return 'text-red-400 bg-red-400/10 border-red-400/20';
    default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
  }
};

const getStatusIcon = (status: ServiceStatus['status']) => {
  switch (status) {
    case 'operational': return faCheckCircle;
    case 'degraded': return faExclamationTriangle;
    case 'partial_outage': return faExclamationTriangle;
    case 'major_outage': return faTimesCircle;
    default: return faSpinner;
  }
};

const getStatusText = (status: ServiceStatus['status']) => {
  switch (status) {
    case 'operational': return 'Operational';
    case 'degraded': return 'Degraded Performance';
    case 'partial_outage': return 'Partial Outage';
    case 'major_outage': return 'Major Outage';
    default: return 'Checking...';
  }
};

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-lg bg-white/5 border border-white/10`}>
            <FontAwesomeIcon icon={getIcon(service.id)} className="text-xl text-gray-300" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-white">{service.name}</h3>
            <p className="text-sm text-gray-400">{service.description}</p>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(service.status)}`}>
          <FontAwesomeIcon 
            icon={getStatusIcon(service.status)} 
            className={`text-xs ${service.status === 'checking' ? 'animate-spin' : ''}`} 
          />
          <span className="text-xs font-medium">{getStatusText(service.status)}</span>
        </div>
      </div>

      {service.latency !== undefined && (
        <div className="mb-4 flex items-center gap-2 text-xs text-gray-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          Response Time: ~{service.latency}ms
        </div>
      )}

      <UptimeBar serviceId={service.id} />
    </motion.div>
  );
};
