import React, { useState } from 'react';
import { FaCopy, FaCheck, FaCode, FaEye, FaSave, FaDownload } from 'react-icons/fa';
import { extractCode, extractAllCodeBlocks, isCodeResponse } from '@/utils/parseCode';
import RendererPreview from './RendererPreview';

interface CodePreviewProps {
  output: string;
  timestamp?: number;
  onSaveFile?: (filename: string, content: string) => Promise<void>;
}

const CodePreview: React.FC<CodePreviewProps> = ({ output, timestamp, onSaveFile }) => {
  const [copied, setCopied] = useState(false);
  const [showRaw, setShowRaw] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [filename, setFilename] = useState('');
  const [showSaveInput, setShowSaveInput] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSaveFile = async () => {
    if (!onSaveFile || !filename.trim()) return;
    
    setSaving(true);
    try {
      const codeToSave = hasCode && !showRaw ? mainCode : output;
      await onSaveFile(filename.trim(), codeToSave);
      setSaveSuccess(true);
      setShowSaveInput(false);
      setFilename('');
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const codeBlocks = extractAllCodeBlocks(output);
  const hasCode = isCodeResponse(output);
  const mainCode = hasCode ? extractCode(output) : output;

  // Suggest filename based on code content
  const suggestedFilename = React.useMemo(() => {
    if (hasCode) {
      if (output.includes('React') || output.includes('jsx')) return 'Component.tsx';
      if (output.includes('function ') || output.includes('const ')) return 'utility.ts';
      if (output.includes('export ')) return 'module.ts';
      return 'code.txt';
    }
    return 'response.txt';
  }, [output, hasCode]);

  return (
    <div className="space-y-4">
      <div className="bg-zinc-800 border border-zinc-600 rounded-lg overflow-hidden shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-zinc-700 to-zinc-600 px-4 py-3 border-b border-zinc-500">
          <div className="flex items-center gap-2">
            <FaCode className="text-cyan-400 text-sm" />
            <span className="text-sm font-medium text-zinc-200">
              {hasCode ? 'Code Generated' : 'Response'}
            </span>
            {timestamp && (
              <span className="text-xs text-zinc-400">
                {new Date(timestamp).toLocaleTimeString()}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasCode && (
              <button
                onClick={() => setShowRaw(!showRaw)}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-zinc-600 hover:bg-zinc-500 text-zinc-200 rounded transition-colors"
              >
                <FaEye className="text-xs" />
                {showRaw ? 'Code' : 'Raw'}
              </button>
            )}
            <button
              onClick={() => copyToClipboard(hasCode && !showRaw ? mainCode : output)}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-cyan-600 hover:bg-cyan-700 text-white rounded transition-colors"
            >
              {copied ? <FaCheck className="text-xs" /> : <FaCopy className="text-xs" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            {onSaveFile && (
              <button
                onClick={() => setShowSaveInput(true)}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
              >
                <FaSave className="text-xs" />
                Save
              </button>
            )}
          </div>
        </div>

        {/* Save Input */}
        {showSaveInput && (
          <div className="bg-zinc-700 px-4 py-3 border-b border-zinc-600">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder={suggestedFilename}
                className="flex-1 px-3 py-1.5 text-sm bg-zinc-600 border border-zinc-500 rounded text-white placeholder-zinc-400 focus:border-cyan-400 focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveFile();
                  if (e.key === 'Escape') setShowSaveInput(false);
                }}
                autoFocus
              />
              <button
                onClick={handleSaveFile}
                disabled={saving || !filename.trim()}
                className="px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 disabled:bg-zinc-600 text-white rounded transition-colors flex items-center gap-1"
              >
                {saving ? (
                  <>
                    <div className="animate-spin w-3 h-3 border border-white border-t-transparent rounded-full" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaDownload className="text-xs" />
                    Save File
                  </>
                )}
              </button>
              <button
                onClick={() => setShowSaveInput(false)}
                className="px-2 py-1.5 text-sm bg-zinc-600 hover:bg-zinc-500 text-zinc-300 rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Success Message */}
        {saveSuccess && (
          <div className="bg-green-900/20 border-b border-green-500/50 px-4 py-2">
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <FaCheck className="text-xs" />
              <span>File saved successfully to /dev-eon-exports/</span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-4">
          {hasCode && !showRaw ? (
            <div className="space-y-4">
              {codeBlocks.length > 1 ? (
                // Multiple code blocks
                codeBlocks.map((block, index) => (
                  <div key={index} className="relative">
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => copyToClipboard(block)}
                        className="px-2 py-1 text-xs bg-zinc-600 hover:bg-zinc-500 text-zinc-200 rounded opacity-75 hover:opacity-100 transition-opacity"
                      >
                        Copy Block
                      </button>
                    </div>
                    <pre className="bg-zinc-900 p-4 rounded border border-zinc-600 overflow-x-auto text-sm text-zinc-100 whitespace-pre-wrap">
                      {block}
                    </pre>
                  </div>
                ))
              ) : (
                // Single code block or extracted code
                <pre className="bg-zinc-900 p-4 rounded border border-zinc-600 overflow-x-auto text-sm text-zinc-100 whitespace-pre-wrap">
                  {mainCode || '// Awaiting output...'}
                </pre>
              )}
            </div>
          ) : (
            // Raw output or non-code response
            <div className="prose prose-invert max-w-none">
              <pre className="bg-zinc-900 p-4 rounded border border-zinc-600 overflow-x-auto text-sm text-zinc-100 whitespace-pre-wrap">
                {output || '// Awaiting output...'}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Live Preview */}
      {hasCode && !showRaw && (
        <RendererPreview code={mainCode} />
      )}
    </div>
  );
};

export default CodePreview; 