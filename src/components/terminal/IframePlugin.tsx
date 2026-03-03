import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faExternalLinkAlt, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

interface IframePluginProps {
  url: string;
  pluginName: string;
  onBack: () => void;
}

const IframePlugin = ({ url, pluginName, onBack }: IframePluginProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className="relative w-full h-full bg-[#0D0D0D] flex flex-col">
      {/* Floating Top Bar */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={onBack}
          className="px-4 py-2 bg-[#1A1A24]/80 backdrop-blur-md border border-[#2A2A3A] rounded-lg text-[#F0F0FF] text-sm font-medium hover:bg-[#2A2A3A]/80 hover:border-[#00D4FF] transition-all flex items-center gap-2 shadow-lg"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to Terminal
        </motion.button>
      </div>

      {/* Loading State */}
      {loading && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0D0D0D] z-40">
          <FontAwesomeIcon icon={faSpinner} className="text-[#00D4FF] text-4xl animate-spin mb-4" />
          <p className="text-[#9898B8] font-mono text-sm">Loading {pluginName}...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0D0D0D] z-40 p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-[#FF4D6A]/10 flex items-center justify-center mb-4">
            <FontAwesomeIcon icon={faExternalLinkAlt} className="text-[#FF4D6A] text-2xl" />
          </div>
          <h3 className="text-[#F0F0FF] font-bold text-lg mb-2">Connection Blocked</h3>
          <p className="text-[#9898B8] text-sm max-w-md mb-6">
            This plugin cannot be embedded directly due to security settings on the destination site.
          </p>
          <div className="flex gap-4">
            <button
              onClick={onBack}
              className="px-6 py-2 rounded-lg border border-[#2A2A3A] text-[#F0F0FF] hover:bg-[#1A1A24] transition-colors"
            >
              Go Back
            </button>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#00D4FF] to-[#7B61FF] text-white font-medium hover:shadow-[0_0_15px_rgba(0,212,255,0.4)] transition-all flex items-center gap-2"
            >
              Open in New Tab
              <FontAwesomeIcon icon={faExternalLinkAlt} size="sm" />
            </a>
          </div>
        </div>
      )}

      {/* Iframe */}
      <iframe
        src={url}
        title={pluginName}
        className="w-full h-full border-none"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
      />
    </div>
  );
};

export default IframePlugin;
