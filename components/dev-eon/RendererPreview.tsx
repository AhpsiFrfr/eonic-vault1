'use client'

import React, { useState } from 'react';
import { FaPlay, FaCode, FaEye, FaEyeSlash } from 'react-icons/fa';
import dynamic from 'next/dynamic';
import { extractCode, isCodeResponse } from '@/utils/parseCode';

// Dynamically import to avoid SSR issues
const LiveRenderer = dynamic(() => import('./preview/LiveRenderer'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-zinc-900 rounded-lg border border-zinc-600 flex items-center justify-center">
      <div className="flex items-center gap-2 text-zinc-400">
        <div className="animate-spin w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full" />
        <span className="text-sm">Loading preview...</span>
      </div>
    </div>
  )
});

interface RendererPreviewProps {
  code: string;
}

const RendererPreview: React.FC<RendererPreviewProps> = ({ code }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [isRendering, setIsRendering] = useState(false);

  const extractedCode = extractCode(code);
  const hasReactCode = isCodeResponse(code) && (
    code.includes('React') || 
    code.includes('jsx') || 
    code.includes('tsx') ||
    code.includes('export default') ||
    code.includes('function ') ||
    code.includes('const ') && code.includes('=>')
  );

  const handleTogglePreview = () => {
    if (!showPreview) {
      setIsRendering(true);
      setTimeout(() => setIsRendering(false), 1000);
    }
    setShowPreview(!showPreview);
  };

  if (!hasReactCode) {
    return null; // Don't show preview for non-React code
  }

  return (
    <div className="mt-6 border border-cyan-500/20 bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.1)]">
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-cyan-500/10 to-blue-600/10 px-4 py-3 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
            <FaPlay className="text-white text-xs" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-cyan-300">Live Component Preview</h3>
            <p className="text-xs text-zinc-400">Interactive React component rendering</p>
          </div>
        </div>

        <button
          onClick={handleTogglePreview}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 text-cyan-300 rounded-lg transition-all duration-200 hover:shadow-[0_0_10px_rgba(6,182,212,0.3)]"
        >
          {showPreview ? (
            <>
              <FaEyeSlash className="text-xs" />
              Hide Preview
            </>
          ) : (
            <>
              <FaEye className="text-xs" />
              {isRendering ? 'Rendering...' : 'Show Preview'}
            </>
          )}
        </button>
      </div>

      {/* Preview Area */}
      {showPreview && (
        <div className="p-4">
          <div className="relative">
            {isRendering && (
              <div className="absolute inset-0 bg-zinc-900/80 rounded-lg flex items-center justify-center z-10">
                <div className="flex items-center gap-3 text-cyan-300">
                  <div className="animate-spin w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full" />
                  <span className="text-sm font-medium">Rendering component...</span>
                </div>
              </div>
            )}
            <LiveRenderer code={extractedCode} />
          </div>

          {/* Code Info */}
          <div className="mt-4 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <FaCode className="text-cyan-400" />
              <span>Rendering {extractedCode.split('\n').length} lines of React code</span>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!showPreview && (
        <div className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-zinc-500 text-sm mb-2">
            <FaCode className="text-cyan-400" />
            <span>React component detected</span>
          </div>
          <p className="text-xs text-zinc-400">
            Click "Show Preview" to render this component in a live sandbox environment
          </p>
        </div>
      )}
    </div>
  );
};

export default RendererPreview; 