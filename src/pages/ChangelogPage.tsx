import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import changelogPath from '../assets/CHANGELOG.md?url';

const ChangelogPage: React.FC = () => {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    fetch(changelogPath)
      .then((response) => response.text())
      .then((text) => setMarkdown(text));
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F0F0FF] font-sans selection:bg-[#00D4FF] selection:text-[#0A0A0F] p-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-[#9898B8] hover:text-white mb-8 transition-colors">
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to Home
        </Link>
        
        <div className="prose prose-invert prose-lg max-w-none">
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ChangelogPage;
