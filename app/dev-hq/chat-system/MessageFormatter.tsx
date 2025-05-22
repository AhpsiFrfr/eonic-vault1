'use client';

import React, { useState, useRef } from 'react';
import { marked } from 'marked';

// @dev-vault-component
export default function MessageFormatter({ content, onSave, onCancel }) {
  const [text, setText] = useState(content || '');
  const [preview, setPreview] = useState(false);
  const textareaRef = useRef(null);
  
  const formatOptions = [
    { id: 'bold', label: 'B', format: '**', description: 'Bold' },
    { id: 'italic', label: 'I', format: '_', description: 'Italic' },
    { id: 'code', label: '`', format: '`', description: 'Code' },
    { id: 'codeblock', label: '```', format: '```\n', endFormat: '\n```', description: 'Code Block' },
    { id: 'quote', label: '>', format: '> ', description: 'Quote' },
    { id: 'link', label: '🔗', format: '[', endFormat: '](url)', description: 'Link' },
    { id: 'list', label: '•', format: '- ', description: 'List' }
  ];
  
  const applyFormat = (format, endFormat = format) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);
    
    let newText;
    if (selectedText) {
      // If text is selected, wrap it with format
      newText = text.substring(0, start) + format + selectedText + endFormat + text.substring(end);
      setText(newText);
    } else {
      // If no text is selected, just insert format
      newText = text.substring(0, start) + format + endFormat + text.substring(end);
      setText(newText);
      // Place cursor between format tags
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = start + format.length;
        textarea.selectionEnd = start + format.length;
      }, 0);
    }
  };
  
  const handleFormatClick = (option) => {
    applyFormat(option.format, option.endFormat || option.format);
  };
  
  const handleSave = () => {
    onSave(text);
  };
  
  const renderMarkdown = () => {
    try {
      return { __html: marked(text) };
    } catch (error) {
      return { __html: '<p>Error rendering markdown</p>' };
    }
  };
  
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-md shadow-lg p-2 w-full">
      {/* Toolbar */}
      <div className="flex items-center mb-2 pb-2 border-b border-zinc-700">
        <div className="flex space-x-1 flex-1">
          {formatOptions.map(option => (
            <button
              key={option.id}
              className="px-2 py-1 text-sm bg-zinc-700 hover:bg-zinc-600 rounded text-zinc-300"
              onClick={() => handleFormatClick(option)}
              title={option.description}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="flex space-x-2">
          <button
            className={`px-2 py-1 text-xs rounded ${preview ? 'bg-blue-600 text-white' : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'}`}
            onClick={() => setPreview(!preview)}
          >
            {preview ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>
      
      {/* Editor / Preview */}
      {preview ? (
        <div 
          className="min-h-[100px] max-h-[300px] overflow-y-auto p-2 bg-zinc-900 rounded text-white markdown-preview"
          dangerouslySetInnerHTML={renderMarkdown()}
        />
      ) : (
        <textarea
          ref={textareaRef}
          className="w-full min-h-[100px] max-h-[300px] bg-zinc-900 text-white rounded-md px-3 py-2 resize-y focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message here. Use markdown for formatting..."
        />
      )}
      
      {/* Actions */}
      <div className="flex justify-end mt-2 pt-2 border-t border-zinc-700">
        <button
          className="px-3 py-1 mr-2 text-sm bg-zinc-700 hover:bg-zinc-600 rounded text-zinc-300"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 rounded text-white"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
}
