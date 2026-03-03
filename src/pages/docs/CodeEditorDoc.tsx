import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faCloud } from '@fortawesome/free-solid-svg-icons';
import { faGithub as faGithubBrand } from '@fortawesome/free-brands-svg-icons';

export default function CodeEditorDoc() {
  return (
    <div className="space-y-12">
      <div className="space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00D4FF] to-[#7B61FF]">
          Code Editor & Persistence
        </h1>
        <p className="text-lg text-[#9898B8] leading-relaxed max-w-3xl">
          Learn how to use the VortexFlow Code Editor, manage your projects, and keep your code safe with cloud persistence and GitHub integration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 bg-[#1A1A24] rounded-xl border border-[#2A2A3A]">
          <div className="w-12 h-12 bg-[#00D4FF]/10 rounded-lg flex items-center justify-center mb-4">
            <FontAwesomeIcon icon={faCloud} className="text-[#00D4FF] text-xl" />
          </div>
          <h3 className="text-xl font-semibold text-[#F0F0FF] mb-2">Cloud Auto-Save</h3>
          <p className="text-[#9898B8] text-sm leading-relaxed">
            Your code is automatically saved to the cloud every few seconds. Never worry about losing your work due to browser crashes or accidental closures.
          </p>
        </div>
        <div className="p-6 bg-[#1A1A24] rounded-xl border border-[#2A2A3A]">
          <div className="w-12 h-12 bg-[#7B61FF]/10 rounded-lg flex items-center justify-center mb-4">
            <FontAwesomeIcon icon={faGithubBrand} className="text-[#7B61FF] text-xl" />
          </div>
          <h3 className="text-xl font-semibold text-[#F0F0FF] mb-2">GitHub Integration</h3>
          <p className="text-[#9898B8] text-sm leading-relaxed">
            Connect your GitHub account to import repositories, commit changes, and push your code directly from the editor.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#F0F0FF] flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-[#2A2A3A] flex items-center justify-center text-sm text-[#00D4FF]">01</span>
            Getting Started
          </h2>
          <div className="prose prose-invert max-w-none text-[#9898B8]">
            <p>
              The Code Editor is your primary workspace in VortexFlow. To access it, click on the <strong>Editor</strong> tab in the main navigation or use the <code>Cmd/Ctrl + E</code> shortcut.
            </p>
            <p>
              When you first open the editor, you'll be prompted to create a new project or open an existing one. You can also import a repository from GitHub.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#F0F0FF] flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-[#2A2A3A] flex items-center justify-center text-sm text-[#00D4FF]">02</span>
            GitHub Integration
          </h2>
          <div className="prose prose-invert max-w-none text-[#9898B8]">
            <p>
              VortexFlow offers seamless integration with GitHub. Here's how to set it up:
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Click the <strong>Connect GitHub</strong> button in the editor navbar.</li>
              <li>Authorize VortexFlow to access your repositories.</li>
              <li>Once connected, you can:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><strong>Import Repositories:</strong> Browse and clone your public and private repositories.</li>
                  <li><strong>Commit & Push:</strong> Stage your changes and push them back to GitHub directly from the editor.</li>
                  <li><strong>Create Repositories:</strong> Initialize new repositories for your VortexFlow projects.</li>
                </ul>
              </li>
            </ol>
            <div className="bg-[#2A2A3A] p-4 rounded-lg border-l-4 border-[#00D4FF] mt-4">
              <p className="text-sm text-[#F0F0FF] m-0">
                <strong>Note:</strong> Your GitHub token is stored securely and is only used to interact with the GitHub API on your behalf.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#F0F0FF] flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-[#2A2A3A] flex items-center justify-center text-sm text-[#00D4FF]">03</span>
            Project Management
          </h2>
          <div className="prose prose-invert max-w-none text-[#9898B8]">
            <p>
              You can manage multiple projects within VortexFlow. Click on the project name in the navbar to open the <strong>Projects</strong> modal.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Create New Project:</strong> Start from scratch with templates for JavaScript, Python, HTML/CSS, and more.</li>
              <li><strong>Switch Projects:</strong> Easily switch between your active projects without losing your state.</li>
              <li><strong>Delete Projects:</strong> Remove projects you no longer need (this action cannot be undone).</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#F0F0FF] flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-[#2A2A3A] flex items-center justify-center text-sm text-[#00D4FF]">04</span>
            Keyboard Shortcuts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-[#1A1A24] rounded-lg border border-[#2A2A3A]">
              <span className="text-sm text-[#9898B8]">Toggle File Explorer</span>
              <kbd className="px-2 py-1 bg-[#2A2A3A] rounded text-xs text-[#F0F0FF] font-mono">Ctrl + B</kbd>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#1A1A24] rounded-lg border border-[#2A2A3A]">
              <span className="text-sm text-[#9898B8]">Toggle Output Panel</span>
              <kbd className="px-2 py-1 bg-[#2A2A3A] rounded text-xs text-[#F0F0FF] font-mono">Ctrl + `</kbd>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#1A1A24] rounded-lg border border-[#2A2A3A]">
              <span className="text-sm text-[#9898B8]">Run Code</span>
              <kbd className="px-2 py-1 bg-[#2A2A3A] rounded text-xs text-[#F0F0FF] font-mono">Ctrl + Enter</kbd>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#1A1A24] rounded-lg border border-[#2A2A3A]">
              <span className="text-sm text-[#9898B8]">Save File</span>
              <kbd className="px-2 py-1 bg-[#2A2A3A] rounded text-xs text-[#F0F0FF] font-mono">Ctrl + S</kbd>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
