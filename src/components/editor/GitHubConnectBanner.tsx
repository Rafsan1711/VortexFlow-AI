import React from 'react';
import { useGitHubAuth } from '../../hooks/useGitHubAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

export function GitHubConnectBanner() {
  const { isConnected, isConnecting, connectGitHub, error } = useGitHubAuth();
  const [isVisible, setIsVisible] = React.useState(true);

  // Don't show if already connected or dismissed
  if (isConnected || !isVisible) return null;

  // Check session storage to see if user dismissed it this session
  if (sessionStorage.getItem('github_banner_dismissed') === 'true') return null;

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('github_banner_dismissed', 'true');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="bg-[#1A1A24] border-b border-[#2A2A3A] overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-[#24292F] rounded-lg text-white mt-1 md:mt-0">
              <FontAwesomeIcon icon={faGithub} size="lg" />
            </div>
            <div>
              <h3 className="text-[#F0F0FF] font-medium text-sm mb-1">
                Connect GitHub to save your code and import repositories
              </h3>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#9898B8]">
                <span className="flex items-center gap-1">
                  <span className="text-[#00E5A0]">✓</span> Auto-save to Cloud
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-[#00E5A0]">✓</span> Import existing repos
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-[#00E5A0]">✓</span> Push changes directly
                </span>
              </div>
              {error && (
                <p className="text-[#FF4D6A] text-xs mt-2 flex items-center gap-1">
                  <FontAwesomeIcon icon={faTimes} /> {error}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto pl-14 md:pl-0">
            <button
              onClick={handleDismiss}
              className="px-3 py-1.5 rounded text-[#5C5C7A] hover:text-[#F0F0FF] text-xs font-medium transition-colors"
            >
              Continue without GitHub
            </button>
            <button
              onClick={() => connectGitHub()}
              disabled={isConnecting}
              className="px-4 py-1.5 rounded bg-[#24292F] hover:bg-[#2c333a] text-white text-xs font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isConnecting ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />
                  Connecting...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faGithub} />
                  Connect GitHub
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
