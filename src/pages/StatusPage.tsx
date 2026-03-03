import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faGlobe, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { useStatus } from '../hooks/useStatus';
import { OverallBanner } from '../components/status/OverallBanner';
import { ServiceCard } from '../components/status/ServiceCard';
import { IncidentCard } from '../components/status/IncidentCard';
import { LatencyChart } from '../components/status/LatencyChart';

export default function StatusPage() {
  const { services, overallStatus, incidents, isLoading, lastUpdated } = useStatus();
  const [timeAgo, setTimeAgo] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(Math.floor((Date.now() - lastUpdated) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white font-sans">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-gray-400 hover:text-white transition-colors">
              <FontAwesomeIcon icon={faArrowLeft} />
            </Link>
            <div className="h-6 w-px bg-white/10"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <FontAwesomeIcon icon={faGlobe} className="text-white text-sm" />
              </div>
              <span className="font-bold text-lg tracking-tight">System Status</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-xs text-gray-400 font-mono">
            <div className="relative w-3 h-3">
              <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 animate-[spin_60s_linear_infinite]"></div>
              <div className="absolute inset-0 rounded-full border-t-2 border-cyan-500 animate-[spin_1s_linear_infinite]"></div>
            </div>
            Updated {timeAgo}s ago
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <OverallBanner status={overallStatus} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Services Grid */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-cyan-500 rounded-full"></span>
              Core Services
            </h2>
            {services.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          {/* Right Column: Incidents & Metrics */}
          <div className="space-y-12">
            {/* Active Incidents */}
            <div>
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-red-500 rounded-full"></span>
                Active Incidents
              </h2>
              {incidents.length === 0 ? (
                <div className="p-6 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 flex items-center gap-3">
                  <FontAwesomeIcon icon={faCheckCircle} />
                  <span>No active incidents reported.</span>
                </div>
              ) : (
                incidents.map(incident => (
                  <IncidentCard key={incident.id} incident={incident} />
                ))
              )}
            </div>

            {/* Latency Chart */}
            <div>
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                System Latency
              </h2>
              <div className="h-64 w-full">
                <LatencyChart />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="border-t border-white/10 pt-8 mt-12 flex flex-wrap gap-6 justify-center text-sm text-gray-500">
          <a href="https://status.firebase.google.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">Firebase Status</a>
          <a href="https://status.cloud.google.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">Google Cloud Status</a>
          <a href="https://www.vercel-status.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">Vercel Status</a>
        </div>
      </main>
    </div>
  );
}
