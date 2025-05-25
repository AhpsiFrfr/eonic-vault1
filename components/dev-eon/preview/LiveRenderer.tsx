'use client'

import React, { useEffect, useRef, useState } from 'react';

interface LiveRendererProps {
  code: string;
}

const LiveRenderer: React.FC<LiveRendererProps> = ({ code }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return;

      // Clear any previous error
      setError(null);

      // Enhanced HTML template with better React setup
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          <style>
            body {
              margin: 0;
              padding: 1rem;
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
              background: #18181b;
              color: #fafafa;
              min-height: 100vh;
            }
            .error {
              background: #ef4444;
              color: white;
              padding: 1rem;
              border-radius: 0.5rem;
              margin: 1rem;
            }
            .preview-container {
              padding: 1rem;
              border: 1px solid #27272a;
              border-radius: 0.5rem;
              background: #0a0a0a;
            }
          </style>
        </head>
        <body>
          <div id="root" class="preview-container"></div>
          <script type="text/babel">
            try {
              const { useState, useEffect, useRef } = React;
              
              // Component code injection
              ${code}
              
              // Try to render the component
              const container = document.getElementById('root');
              if (container) {
                // Look for default export or any React component
                const ComponentToRender = typeof exports !== 'undefined' && exports.default 
                  ? exports.default 
                  : window.Component || (() => React.createElement('div', null, 'Component rendered successfully!'));
                
                ReactDOM.render(React.createElement(ComponentToRender), container);
              }
            } catch (error) {
              console.error('Preview error:', error);
              const container = document.getElementById('root');
              if (container) {
                container.innerHTML = '<div class="error">Error: ' + error.message + '</div>';
              }
              window.parent.postMessage({ type: 'error', message: error.message }, '*');
            }
          </script>
        </body>
        </html>
      `;

      doc.open();
      doc.write(htmlContent);
      doc.close();

    } catch (err) {
      console.error('Iframe setup error:', err);
      setError(err instanceof Error ? err.message : 'Failed to setup preview');
    }
  }, [code]);

  // Listen for errors from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'error') {
        setError(event.data.message);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (!code || code.trim().length === 0) {
    return (
      <div className="w-full h-48 bg-zinc-900 rounded-lg border border-zinc-700 flex items-center justify-center text-zinc-500">
        <p className="text-sm">No code to preview</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
          <strong>Preview Error:</strong> {error}
        </div>
      )}
      <iframe
        ref={iframeRef}
        className="w-full h-64 bg-zinc-900 rounded-lg border border-zinc-600 shadow-lg"
        sandbox="allow-scripts"
        title="Component Preview"
      />
    </div>
  );
};

export default LiveRenderer; 