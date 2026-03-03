import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useEditorStore } from '../../store/useEditorStore';
import { useEditor } from '../../hooks/useEditor';

export function MonacoEditorPanel() {
  const { activeFile, updateFile, activeProjectId } = useEditor();
  const { markFileSaved } = useEditorStore();
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    
    // Define theme
    monaco.editor.defineTheme('vortexflow-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '5C5C7A', fontStyle: 'italic' },
        { token: 'keyword', foreground: '00D4FF' },
        { token: 'string', foreground: '00E5A0' },
        { token: 'number', foreground: 'FFB830' },
        { token: 'type', foreground: '7B61FF' },
        { token: 'function', foreground: 'F0F0FF' },
      ],
      colors: {
        'editor.background': '#0D0D14',
        'editor.foreground': '#F0F0FF',
        'editor.lineHighlightBackground': '#1A1A24',
        'editor.selectionBackground': '#00D4FF22',
        'editorCursor.foreground': '#00D4FF',
        'editorLineNumber.foreground': '#5C5C7A',
        'editorLineNumber.activeForeground': '#9898B8',
        'editor.findMatchBackground': '#FFB83044',
        'editorGutter.background': '#0D0D14',
        'scrollbarSlider.background': '#2A2A3A',
        'scrollbarSlider.hoverBackground': '#3D3D52',
      }
    });
    monaco.editor.setTheme('vortexflow-dark');

    // Add custom keybindings
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      if (activeFile && activeProjectId) {
        markFileSaved(activeProjectId, activeFile.id);
        // Trigger save event for status bar
        window.dispatchEvent(new CustomEvent('editor:saved'));
      }
    });
  };

  const handleChange = (value: string | undefined) => {
    if (activeFile && activeProjectId && value !== undefined) {
      updateFile(activeProjectId, activeFile.id, value);
    }
  };

  if (!activeFile) {
    return (
      <div className="flex-1 bg-[#0D0D14] flex items-center justify-center text-[#5C5C7A]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 opacity-20">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <p className="text-lg font-medium">VortexFlow Editor</p>
          <p className="text-sm mt-2">Select a file or press Ctrl+N to create one</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#0D0D14] relative">
      <Editor
        height="100%"
        theme="vortexflow-dark"
        language={activeFile.language}
        value={activeFile.content}
        onChange={handleChange}
        onMount={handleEditorDidMount}
        options={{
          fontSize: 14,
          fontFamily: 'JetBrains Mono, monospace',
          fontLigatures: true,
          minimap: { enabled: true },
          lineNumbers: 'on',
          wordWrap: 'off',
          tabSize: 2,
          autoIndent: 'advanced',
          formatOnPaste: true,
          formatOnType: true,
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          bracketPairColorization: { enabled: true },
          padding: { top: 16, bottom: 16 },
          renderLineHighlight: 'all',
        }}
      />
    </div>
  );
}
